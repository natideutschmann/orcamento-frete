# App para Orçamentos de Frete

## Propósito
App web para calcular orçamentos de frete de caminhões, substituindo o uso manual de planilha Excel. Funciona no celular via navegador, sem instalação.

## Links do app
- **Principal (usar este):** https://orcamento-frete.vercel.app
- **Backup:** https://natideutschmann.github.io/orcamento-frete/orcamento-frete.html

## Repositório GitHub
- https://github.com/natideutschmann/orcamento-frete
- Usuário: @natideutschmann
- E-mail: natideutschmann@gmail.com

## Arquivos do projeto
```
App para orcamentos/
├── orcamento-frete.html   ← app completo (frontend)
├── vercel.json            ← configuração do Vercel
├── api/
│   └── resolve.js         ← função serverless que resolve links curtos
├── Orcamentos.xlsx        ← planilha original de referência
└── CLAUDE.md              ← este arquivo
```

## Como funciona o app
1. Usuário seleciona a jazida de origem
2. Cola o link do Google Maps recebido no WhatsApp (curto ou longo)
3. A função `api/resolve.js` no Vercel resolve links curtos (maps.app.goo.gl) → extrai coordenadas
4. OSRM (API gratuita) calcula até 3 rotas alternativas
5. Usuário escolhe a rota
6. App mostra os orçamentos calculados (conforme o tipo selecionado: Caminhão, Prancha ou Bitrem)

## Como atualizar o app
1. Fazer alteração no `orcamento-frete.html` (ou outros arquivos)
2. Subir no GitHub: Adicionar arquivo → Enviar arquivos → Confirmar alterações
3. Vercel redeploy automático em ~1 minuto

## Jazidas cadastradas
**Nossas Jazidas:**
- Saibreira Palmeira: -29.828008, -50.597901
- Pátio - Palmeira: -29.832036, -50.595188 (pátio de onde a Prancha normalmente sai)
- Saibreira Solo: -29.797370, -50.581143
- Saibreira Serraria: -29.776167, -50.596813
- Pedreira 474: -29.746594, -50.577166

**Materiais de Terceiros:**
- Cascalheira do Clésio: -29.735916, -50.501877
- Cascalheira Gallon: -29.928121, -50.510653
- Rost Martins: -29.922899, -50.461886
- Jazida Eckert: -29.948550, -50.494830
- São Joaquim: -29.837626, -50.556412

## Os 3 tipos de orçamento (fórmulas atuais)

### Aplicação de NF e Comissão (todos os tipos)
```
TotalFinal = Subtotal * (1 + NF%/100) * (1 + Comissão%/100)
```

### Regra geral (Tipos 1 e 5 — todos exceto Prancha)
Diesel e Pedágio são custo FIXO da viagem — não escalam com a quantidade transportada.
Só o Material escala pela quantidade (m³) informada pelo usuário em cada card (campo "Quantidade a transportar").
```
Frete50%      = (CustoDiesel * 100/50)         ← total da viagem, não dividido por m³
MaterialTotal = materialPorM3 * quantidade
Subtotal      = Frete50% + pedágio + MaterialTotal
TotalFinal    = Subtotal * (1 + NF%) * (1 + Comissão%)
PreçoPorM3    = TotalFinal / quantidade
ValorKmRodado = (TotalFinal - MaterialTotal) / (dist*2)   ← R$/km exibido
```

### Tipo 1 — Caminhão 2,5 km/L
```
CustoDiesel = (dist*2 / 2.5) * diesel
```
Campo "Quantidade a transportar (m³)" no card, padrão 12 m³.

### Tipo 2 — Prancha (1,25 km/L)
```
CustoDiesel  = (dist*2 / 1.25) * diesel
Frete50%     = (CustoDiesel * 100/50)
Subtotal     = Frete50% + arrancadaPrancha + pedágio
TotalFinal   = Subtotal * (1 + NF%) * (1 + Comissão%)
```
Não tem campo de quantidade (m³) — carga de equipamento, não de material a granel. Não cobra Material (campo fica oculto nos Parâmetros quando "Prancha" está selecionada — ver Histórico de decisões). Pedágio aqui é valor total da viagem (não R$/m³). Quando o seletor "Prancha" está ativo, o campo já vem preenchido com R$ 33,00. O valor digitado é multiplicado por 2 internamente (ida+volta) — a praça de pedágio é cobrada nas duas passagens

### Tipo 5 — Bitrem (2 km/L)
```
CustoDiesel = (dist*2 / 2) * diesel
```
Campo "Quantidade a transportar (m³)" no card, padrão 30 m³ (faixa normal de uso: 20 a 40 m³, editável).

## Parâmetros configuráveis no app (valores padrão)
| Parâmetro | Padrão | Onde aparece |
|-----------|--------|--------------|
| Preço Diesel (R$) | R$ 6,00 | Todos os tipos |
| Pedágio (R$ - viagem, valor fixo) | R$ 34,50 (Caminhão) / R$ 33,00 (Prancha) / R$ 82,80 (Bitrem 7 eixos completo) ou R$ 62,10 (Bitrem 5 eixos, 1 caçamba) — **checkbox**, desmarcado por padrão | Todos os tipos quando ativado |
| Material (R$/m³) | R$ 26,70 | Tipos 1 e 5 (multiplicado pela quantidade). Campo oculto e não cobrado na Prancha |
| Arrancada Prancha (R$) | R$ 700,00 | Tipo 2 (Prancha) apenas |
| NF (%) | 12% | Todos os tipos — aplicado sobre o subtotal |
| Comissão de Vendas (%) | 0% | Todos os tipos — aplicado após NF |
| Quantidade a transportar (m³) | 12 (Tipo 1) / 30 (Tipo 5) | Campo individual em cada card — recalcula ao vivo (sem precisar clicar em Calcular de novo) |

## Arquivos do projeto (atualizado)
```
App para orcamentos/
├── orcamento-frete.html   ← app completo (frontend)
├── vercel.json            ← configuração do Vercel
├── manifest.json          ← PWA: ícone e nome do app no celular
├── icon.png               ← logo MC Terraplenagem (subir no GitHub)
├── api/
│   └── resolve.js         ← função serverless que resolve links curtos
├── Orcamentos.xlsx        ← planilha original de referência
└── CLAUDE.md              ← este arquivo
```

## Histórico de decisões
- **Link curto do WhatsApp**: resolvido via função serverless no Vercel (api/resolve.js) — proxies públicos (allorigins.win) foram testados mas o Google bloqueava
- **Seleção de rota**: OSRM retorna até 3 alternativas, usuário escolhe qual usar (pedido do usuário — a primeira rota sugerida pode não ser a melhor)
- **Km manual**: campo sempre visível abaixo das rotas — se preenchido, tem prioridade sobre a rota selecionada pelo OSRM
- **Hospedagem**: GitHub Pages (backup) + Vercel (principal, necessário para a função de resolver links curtos)
- **Distância**: apenas de ida (o app multiplica por 2 internamente nas fórmulas)
- **"Pinhal"** na planilha original era o nome do cliente/local do último orçamento feito, não uma jazida
- **"Valor Km" renomeado para "Material"**: o R$ 25,20 da planilha original é o custo do material, não um custo por km. O "Valor Km rodado" é um resultado calculado exibido nos Tipos 1 e 4 (Tipo 4 removido depois, ver abaixo)
- **Arrancada Prancha**: valor fixo cobrado para tirar a prancha do galpão (padrão R$ 700). Entra apenas no Tipo 2
- **NF**: virou percentual (padrão 12%) aplicado em cascata sobre o subtotal
- **Comissão de Vendas**: percentual do vendedor (padrão 0%), aplicado após NF
- **Ícone PWA**: logo MC Terraplenagem (fundo azul escuro #1a2744, letras MC brancas). App aparece como "MC Frete" na tela inicial do celular
- **Preço do Material (saibro)**: atualizado de R$ 25,20 para R$ 26,70 (2026-07-17)
- **Botão Compartilhar por card**: cada card de orçamento tem botão próprio que monta um resumo (origem, distância, cliente, detalhamento e total daquele tipo) e abre o WhatsApp — independente do botão de Fechamento
- **Seletor Caminhão / Prancha / Bitrem**: toggle de 3 opções antes da seção Destino. Cada opção mostra só os cards relevantes e ajusta o valor de Pedágio automaticamente. Ao selecionar "Prancha", também exibe o campo Arrancada Prancha (oculto nos outros dois). Objetivo: não poluir a tela com cards que não estão em uso
- **Valor do pedágio da Prancha (R$ 33,00)**: baseado nos CRLVs dos veículos (cavalo VW 18.310 Titan = 2 eixos, semirreboque prancha = 3 eixos fixos → conjunto de 5 eixos) × tarifa básica R$ 6,60 da CCR ViaSul/RS (vigente desde 26/06/2026, categoria eixo simples/conjunto). É só um valor de referência por praça — se a rota tiver mais de uma praça de pedágio, o usuário deve ajustar manualmente
- **Pedágio ida+volta**: no Tipo 2 (Prancha), o valor digitado no campo Pedágio é multiplicado por 2 internamente (a praça é paga na ida e na volta). Nos demais tipos (Caminhão e Bitrem), o valor padrão já representa o total ida+volta, então NÃO é multiplicado
- **Pedágio Caminhão atualizado**: de R$ 2,75 para R$ 3,30 (2026-07-17), depois para R$ 34,50 com valores reais de praça (2026-08-24, ver decisão acima)
- **Bitrem adicionado (2026-07-17)**: novo Tipo 5, consumo ~2 km/L (Mercedes-Benz Actros 2651 LS 6x4). Cavalo 3 eixos (confirmado por ATPVe, configuração "6x4"). Assume-se, como nos caminhões, que o valor de pedágio já representa ida+volta — ajustar se o usuário informar o contrário
- **Sub-seletor de configuração do Bitrem (2026-07-17)**: quando "Bitrem" está selecionado, aparece um segundo toggle — "7 eixos (completo)" ou "5 eixos (1 caçamba)" — porque o conjunto roda com as duas caçambas (7 eixos carregado: 3 do cavalo + 4 dos reboques) ou só com a caçamba de trás (5 eixos carregado: 3 do cavalo + 2 do reboque). Cada opção ajusta o campo Pedágio automaticamente. O app lembra a última configuração escolhida ao alternar entre os tipos de orçamento. Rótulo e valores corrigidos em 2026-08-25 (era "6 eixos", ver decisão "Reajuste dos pedágios com valores reais de praça" abaixo)
- **Quantidade variável (m³) por card (2026-07-17)**: antes, todos os caminhões assumiam carga fixa de 12 m³ (multiplicava tudo — diesel, pedágio e material — por 12). Isso estava incorreto: diesel e pedágio são custo da viagem, não mudam com a quantidade transportada. Motivo da mudança: usuário às vezes carrega 8 m³ em vez de 12, ou o Bitrem pode levar de 20 a 40 m³, e só o custo do material deveria variar nesses casos. Agora cada card (Tipos 1 e 5) tem um campo próprio "Quantidade a transportar (m³)" que recalcula ao vivo (oninput), e a fórmula foi reestruturada: Frete a 50% e Pedágio são valores fixos da viagem, só o Material é multiplicado pela quantidade. A Prancha (Tipo 2) não tem esse campo — não usa o conceito de m³, é cobrança por arrancada + pedágio + material fixo
- **Tipos 3 e 4 removidos (2026-07-17)**: "Trechos > 50km (3 km/L)" e "Caminhão 3 km/L" foram retirados da opção "Caminhão" a pedido do usuário — não eram mais usados. Restou só o Tipo 1 (Caminhão 2,5 km/L) nessa opção
- **Pátio - Palmeira adicionado como origem (2026-07-17)**: é de onde a Prancha normalmente sai (coordenadas resolvidas a partir de um link do Google Maps enviado pelo usuário)
- **Material removido da Prancha (2026-07-17)**: a Prancha transporta equipamento, não material a granel — o campo Material some do painel de Parâmetros quando "Prancha" está selecionada e deixa de entrar no cálculo/card desse tipo (evita confusão, já que não fazia sentido cobrar material numa carga que não é medida em m³)
- **Reajuste dos pedágios com valores reais de praça (2026-08-24)**: os valores anteriores (R$ 3,30 Caminhão / R$ 46,20 e R$ 39,60 Bitrem) eram estimativas via eixos do CRLV × tarifa básica R$ 6,60. O usuário informou os valores reais pagos na praça da freeway (ida+volta), e a tarifa básica também subiu para R$ 6,90/eixo:
  - **Caminhão**: R$ 34,50 total (ida vazio/truck erguido = 2 eixos × R$ 6,90 = R$ 13,80 + volta carregado/truck no chão = 3 eixos × R$ 6,90 = R$ 20,70). O truck perde 1 eixo (levanta) quando está vazio.
  - **Bitrem 5 eixos (só último vagão)**: R$ 62,10 total, valor real informado pelo usuário (carregado = R$ 34,50 / vazio = R$ 27,60) — bate com 5 eixos carregado e 4 eixos vazio × R$ 6,90 (3 do cavalo + 2 do reboque carregado, 1 desses 2 levanta quando vazio).
  - **Bitrem 7 eixos (completo, 2 caçambas)**: R$ 82,80 total — estimado (não há recibo real ainda) com 7 eixos carregado × R$ 6,90 = R$ 48,30 (ida) + 5 eixos vazio × R$ 6,90 = R$ 34,50 (volta), já que 2 eixos levantam quando o conjunto completo está vazio.
  - O campo Pedágio no app continua mostrando só o valor total (checkbox "Incluir pedágio"), sem separar ida/volta na interface — a assimetria entre ida e volta só é usada para calcular o total padrão de cada configuração.
  - **Correção 2026-08-25**: o rótulo do botão "1 caçamba" dizia "6 eixos" — corrigido para "5 eixos" (o valor de R$ 62,10 já estava certo desde 2026-08-24, só o texto do botão estava desatualizado).
  - Pendência: confirmar o valor real de praça do Bitrem 7 eixos completo quando houver um recibo, para substituir a estimativa.

## Funcionalidades
- Campo Nome do Cliente no topo
- Após calcular, aparece seção de Fechamento: valor que o irmão fechou com o cliente + botão WhatsApp que envia resumo (data, cliente, origem, distância, valor)
- Totais exibidos sem "/mês" — valor por carga
- Pedágio como checkbox: mostra o valor padrão do tipo selecionado como lembrete, usuário marca apenas quando há pedágio na rota. Valor editável.
- Preço por M³ exibido nos Tipos 1 e 5 (Total ÷ quantidade informada). Não aparece na Prancha.
- Campo "Quantidade a transportar (m³)" em cada card (Tipos 1 e 5) — recalcula ao vivo sem precisar clicar em Calcular de novo.

## Estado atual
- ✅ App funcionando no Vercel com link curto automático
- ✅ Campo de distância (km de ida) sempre visível — link do Maps é opcional
- ✅ Seleção de até 3 rotas alternativas quando link do Maps é colado
- ✅ 3 tipos de orçamento (Caminhão 2,5 km/L, Prancha, Bitrem) com NF% e Comissão% em cascata
- ✅ Parâmetros editáveis pelo usuário
- ✅ Pedágio com checkbox (desmarcado por padrão, valor visível como lembrete conforme o tipo selecionado)
- ✅ Preço por M³ calculado automaticamente (Tipos 1 e 5), com quantidade editável por card
- ✅ Campo Nome do Cliente + Fechamento com envio por WhatsApp
- ✅ Ícone PWA configurado (manifest.json + apple-touch-icon) — requer upload do icon.png no GitHub
- ✅ Botão "Compartilhar" em cada card de orçamento (envia resumo daquele tipo específico pelo WhatsApp)
- ✅ Seletor Caminhão / Prancha / Bitrem — mostra só os cards relevantes e ajusta pedágio/Arrancada Prancha automaticamente
- ✅ Sub-seletor do Bitrem (7 eixos completo / 5 eixos 1 caçamba) ajustando o pedágio automaticamente
- ✅ Material removido do cálculo e do painel de Parâmetros quando "Prancha" está selecionada
- ✅ Todas as alterações desta sessão já commitadas, enviadas ao GitHub (branch `main`) e confirmadas ao vivo em produção (Vercel) — nenhum push pendente no momento

## Pendências conhecidas (não resolvidas nesta sessão)
- Ícone PWA (manifest.json + apple-touch-icon): configurado no código, mas requer confirmar se o `icon.png` já foi de fato enviado ao GitHub (ver se aparece corretamente ao instalar o app no celular)
- Valor do pedágio da Prancha (R$ 33,00) e do Bitrem 7 eixos completo (R$ 82,80, estimado) são referência de 1 praça — se a rota tiver mais de uma praça de pedágio, o usuário precisa ajustar manualmente o valor antes de calcular. O app não sinaliza automaticamente quantas praças existem na rota (decisão do usuário em 2026-08-24: não implementar essa detecção por enquanto)
- Confirmar valor real de praça do Bitrem 7 eixos completo (hoje é estimativa via eixos × R$ 6,90) quando houver recibo

## Como fazer git push
```
git push https://TOKEN@github.com/natideutschmann/orcamento-frete.git master:main
```
Token em: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
