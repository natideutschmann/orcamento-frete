const UA = 'Mozilla/5.0 (compatible)';

function coordsNaUrl(url) {
  const u = decodeURIComponent(url).replace(/\+(-\d)/g, '$1');
  const padroes = [
    /[?&]q=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
    /search\/(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
  ];
  for (const p of padroes) {
    const m = u.match(p);
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  }
  return null;
}

// O Google passou a redirecionar links curtos para "maps?q=<endereço em texto>",
// sem coordenadas. Nesse caso, busca o texto no Maps para obter lat/lng.
async function buscarCoordsPorTexto(texto) {
  const busca = `https://www.google.com/search?tbm=map&hl=pt-BR&gl=br&q=${encodeURIComponent(texto)}`;
  const resp = await fetch(busca, { headers: { 'User-Agent': UA } });
  const corpo = await resp.text();
  const m = corpo.match(/\[null,null,(-?\d+\.\d+),(-?\d+\.\d+)\]/);
  return m ? { lat: parseFloat(m[1]), lng: parseFloat(m[2]) } : null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL não informada' });

  let host;
  try { host = new URL(url).hostname; } catch { return res.status(400).json({ error: 'URL inválida' }); }
  if (!/(^|\.)(goo\.gl|google\.[a-z.]+)$/.test(host)) {
    return res.status(400).json({ error: 'Apenas links do Google Maps' });
  }

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': UA },
    });
    const finalUrl = response.url;

    let coords = coordsNaUrl(finalUrl);
    if (!coords) {
      const q = new URL(finalUrl).searchParams.get('q');
      if (q) coords = await buscarCoordsPorTexto(q);
    }

    res.json({ url: finalUrl, ...(coords || {}) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
