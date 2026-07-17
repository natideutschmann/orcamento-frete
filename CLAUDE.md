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
6. App mostra os 4 orçamentos calculados

## Como atualizar o app
1. Fazer alteração no `orcamento-frete.html` (ou outros arquivos)
2. Subir no GitHub: Adicionar arquivo → Enviar arquivos → Confirmar alterações
3. Vercel redeploy automático em ~1 minuto

## Jazidas cadastradas
**Nossas Jazidas:**
- Saibreira Palmeira: -29.828008, -50.597901
- Saibreira Solo: -29.797370, -50.581143
- Saibreira Serraria: -29.776167, -50.596813
- Pedreira 474: -29.746594, -50.577166

**Materiais de Terceiros:**
- Cascalheira do Clésio: -29.735916, -50.501877
- Cascalheira Gallon: -29.928121, -50.510653
- Rost Martins: -29.922899, -50.461886
- Jazida Eckert: -29.948550, -50.494830
- São Joaquim: -29.837626, -50.556412

## Os 5 tipos de orçamento (fórmulas atuais)

### Aplicação de NF e Comissão (todos os tipos)
```
TotalFinal = Subtotal * (1 + NF%/100) * (1 + Comissão%/100)
```

### Regra geral (Tipos 1, 3, 4 e 5 — todos exceto Prancha)
Diesel e Pedágio são custo FIXO da viagem — não escalam com a quantidade transportada.
Só o Material escala pela quantidade (m³) informada pelo usuário em cada card (campo "Quantidade a transportar").
```
Frete50%      = (CustoDiesel * 100/50)         ← total da viagem, não dividido por m³
MaterialTotal = materialPorM3 * quantidade
Subtotal      = Frete50% + pedágio (se houver) + MaterialTotal
TotalFinal    = Subtotal * (1 + NF%) * (1 + Comissão%)
PreçoPorM3    = TotalFinal / quantidade
ValorKmRodado = (TotalFinal - MaterialTotal) / (dist*2)   ← R$/km, só nos Tipos 1, 4 e 5
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
Subtotal     = Frete50% + arrancadaPrancha + pedágio + material
TotalFinal   = Subtotal * (1 + NF%) * (1 + Comissão%)
```
Não tem campo de quantidade (m³) — carga de equipamento, não de material a granel. Pedágio aqui é valor total da viagem (não R$/m³). Quando o seletor "Prancha" está ativo, o campo já vem preenchido com R$ 33,00 (ver Histórico de decisões). O valor digitado é multiplicado por 2 internamente (ida+volta) — a praça de pedágio é cobrada nas duas passagens

### Tipo 3 — Trechos > 50km (3 km/L)
```
CustoDiesel = (dist*2 / 3) * diesel
```
Sem pedágio. Campo "Quantidade a transportar (m³)" no card, padrão 12 m³.

### Tipo 4 — Caminhão 3 km/L
```
CustoDiesel = (dist*2 / 3) * diesel
```
Campo "Quantidade a transportar (m³)" no card, padrão 12 m³.

### Tipo 5 — Bitrem (2 km/L)
```
CustoDiesel = (dist*2 / 2) * diesel
```
Campo "Quantidade a transportar (m³)" no card, padrão 30 m³ (faixa normal de uso: 20 a 40 m³, editável).

## Parâmetros configuráveis no app (valores padrão)
| Parâmetro | Padrão | Onde aparece |
|-----------|--------|--------------|
| Preço Diesel (R$) | R$ 6,00 | Todos os tipos |
| Pedágio (R$ - viagem, valor fixo) | R$ 3,30 (Caminhão) / R$ 33,00 (Prancha) / R$ 46,20 (Bitrem) — **checkbox**, desmarcado por padrão | Tipos 1, 2, 4, 5 quando ativado |
| Material (R$/m³) | R$ 26,70 | Todos os tipos — multiplicado pela quantidade nos Tipos 1, 2*, 3, 4, 5 (*Prancha usa valor fixo, sem quantidade) |
| Arrancada Prancha (R$) | R$ 700,00 | Tipo 2 (Prancha) apenas |
| NF (%) | 12% | Todos os tipos — aplicado sobre o subtotal |
| Comissão de Vendas (%) | 0% | Todos os tipos — aplicado após NF |
| Quantidade a transportar (m³) | 12 (Tipos 1,3,4) / 30 (Tipo 5) | Campo individual em cada card — recalcula ao vivo (sem precisar clicar em Calcular de novo) |

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
- **"Valor Km" renomeado para "Material"**: o R$ 25,20 da planilha original é o custo do material, não um custo por km. O "Valor Km rodado" é um resultado calculado exibido nos Tipos 1 e 4
- **Arrancada Prancha**: valor fixo cobrado para tirar a prancha do galpão (padrão R$ 700). Entra apenas no Tipo 2
- **NF**: virou percentual (padrão 12%) aplicado em cascata sobre o subtotal
- **Comissão de Vendas**: percentual do vendedor (padrão 0%), aplicado após NF
- **Ícone PWA**: logo MC Terraplenagem (fundo azul escuro #1a2744, letras MC brancas). App aparece como "MC Frete" na tela inicial do celular
- **Preço do Material (saibro)**: atualizado de R$ 25,20 para R$ 26,70 (2026-07-17)
- **Botão Compartilhar por card**: cada um dos 4 cards de orçamento tem botão próprio que monta um resumo (origem, distância, cliente, detalhamento e total daquele tipo) e abre o WhatsApp — independente do botão de Fechamento
- **Seletor Caminhão / Prancha / Bitrem**: toggle de 3 opções antes da seção Destino. Cada opção mostra só os cards relevantes e ajusta o valor de Pedágio automaticamente. Ao selecionar "Prancha", também exibe o campo Arrancada Prancha (oculto nos outros dois). Objetivo: não poluir a tela com cards que não estão em uso
- **Valor do pedágio da Prancha (R$ 33,00)**: baseado nos CRLVs dos veículos (cavalo VW 18.310 Titan = 2 eixos, semirreboque prancha = 3 eixos fixos → conjunto de 5 eixos) × tarifa básica R$ 6,60 da CCR ViaSul/RS (vigente desde 26/06/2026, categoria eixo simples/conjunto). É só um valor de referência por praça — se a rota tiver mais de uma praça de pedágio, o usuário deve ajustar manualmente
- **Pedágio ida+volta**: no Tipo 2 (Prancha), o valor digitado no campo Pedágio é multiplicado por 2 internamente (a praça é paga na ida e na volta). Nos demais tipos (Caminhão e Bitrem), o valor padrão já representa o total ida+volta, então NÃO é multiplicado
- **Pedágio Caminhão atualizado**: de R$ 2,75 para R$ 3,30 (2026-07-17)
- **Bitrem adicionado (2026-07-17)**: novo Tipo 5, consumo ~2 km/L (Mercedes-Benz Actros 2651 LS 6x4). Cavalo 3 eixos (confirmado por ATPVe, configuração "6x4"). Assume-se, como nos caminhões, que o valor de pedágio já representa ida+volta — ajustar se o usuário informar o contrário
- **Sub-seletor de configuração do Bitrem (2026-07-17)**: quando "Bitrem" está selecionado, aparece um segundo toggle — "7 eixos (completo)" ou "6 eixos (1 caçamba)" — porque o conjunto roda com as duas caçambas (7 eixos: 3 do cavalo + 4 dos reboques) ou só com a caçamba de trás (6 eixos: 3 do cavalo + 3 do reboque), perdendo um eixo. Cada opção ajusta o campo Pedágio automaticamente: R$ 46,20 (7 eixos) ou R$ 39,60 (6 eixos), sempre eixos × R$ 6,60 (tarifa básica CCR ViaSul/RS). O app lembra a última configuração escolhida ao alternar entre os tipos de orçamento
- **Quantidade variável (m³) por card (2026-07-17)**: antes, todos os caminhões assumiam carga fixa de 12 m³ (multiplicava tudo — diesel, pedágio e material — por 12). Isso estava incorreto: diesel e pedágio são custo da viagem, não mudam com a quantidade transportada. Motivo da mudança: usuário às vezes carrega 8 m³ em vez de 12, ou o Bitrem pode levar de 20 a 40 m³, e só o custo do material deveria variar nesses casos. Agora cada card (Tipos 1, 3, 4 e 5) tem um campo próprio "Quantidade a transportar (m³)" que recalcula ao vivo (oninput), e a fórmula foi reestruturada: Frete a 50% e Pedágio são valores fixos da viagem, só o Material é multiplicado pela quantidade. A Prancha (Tipo 2) não tem esse campo — não usa o conceito de m³, é cobrança por arrancada + pedágio + material fixo

## Funcionalidades
- Campo Nome do Cliente no topo
- Após calcular, aparece seção de Fechamento: valor que o irmão fechou com o cliente + botão WhatsApp que envia resumo (data, cliente, origem, distância, valor)
- Totais exibidos sem "/mês" — valor por carga
- Pedágio como checkbox: mostra o valor padrão do tipo selecionado como lembrete, usuário marca apenas quando há pedágio na rota. Valor editável.
- Preço por M³ exibido nos Tipos 1, 3, 4 e 5 (Total ÷ quantidade informada). Não aparece na Prancha.
- Campo "Quantidade a transportar (m³)" em cada card (Tipos 1, 3, 4, 5) — recalcula ao vivo sem precisar clicar em Calcular de novo.

## Estado atual
- ✅ App funcionando no Vercel com link curto automático
- ✅ Campo de distância (km de ida) sempre visível — link do Maps é opcional
- ✅ Seleção de até 3 rotas alternativas quando link do Maps é colado
- ✅ 5 tipos de orçamento com NF% e Comissão% em cascata
- ✅ Parâmetros editáveis pelo usuário
- ✅ Pedágio com checkbox (desmarcado por padrão, valor visível como lembrete conforme o tipo selecionado)
- ✅ Preço por M³ calculado automaticamente (Tipos 1, 3, 4 e 5), com quantidade editável por card
- ✅ Campo Nome do Cliente + Fechamento com envio por WhatsApp
- ✅ Ícone PWA configurado (manifest.json + apple-touch-icon) — requer upload do icon.png no GitHub
- ✅ Botão "Compartilhar" em cada card de orçamento (envia resumo daquele tipo específico pelo WhatsApp)
- ✅ Seletor Caminhão / Prancha / Bitrem — mostra só os cards relevantes e ajusta pedágio/Arrancada Prancha automaticamente
- ⏳ Pendente: subir alterações para o GitHub (Bitrem, quantidade variável por card, pedágio caminhão R$ 3,30) para redeploy no Vercel

## Como fazer git push
```
git push https://TOKEN@github.com/natideutschmann/orcamento-frete.git master:main
```
Token em: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
