export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL não informada' });
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
    });
    res.json({ url: response.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
