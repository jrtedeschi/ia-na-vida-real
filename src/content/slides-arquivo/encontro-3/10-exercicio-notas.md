---
layout: "demo"
kicker: "Exercício · em aula · 7 minutos"
title: "Três notas fiscais viram uma tabela"
caveat: "As notas estão no site, em Encontro 3 · Exercícios. Cole no chat o que veio no número da nota da Serra Azul."
prompt:
  contexto: "Anexei [3 notas fiscais em PDF] de fornecedores do meu comércio."
  objetivo: "Uma tabela para lançar no controle do mês."
  referencias: "Use só o que está escrito nas notas."
  restricoes: "Campo ilegível, escreva \"não achei\". Não invente."
  formato: "Tabela: fornecedor, data, número da nota, valor. Na última linha, o total."
tools:
  - name: "Claude"
    logo: "/img/logos/claude.svg"
    href: "https://claude.ai/"
  - name: "Gemini"
    logo: "/img/logos/googlegemini.svg"
    href: "https://gemini.google.com/"
visual: timer
visualProps:
  minutos: 7
  sozinho: false
  compacto: true
  fim: Tempo!
notes: |
  Agora a gente faz junto. As três notas estão no site, na página de exercícios do Encontro 3: baixa as três e anexa numa conversa nova, no Claude ou no Gemini. São notas inventadas, de um mercadinho de mentira, então pode mandar à vontade.

  Repara na restrição: "campo ilegível, escreva não achei". Na minha tela eu vou fazer diferente: o mesmo pedido, sem essa linha. Depois a gente compara.

  [quando a turma terminar] Cola no chat: o que veio no número da nota da Serra Azul? [ler duas ou três respostas] Se para uns veio "não achei" e para outros veio um número, olha que coisa: o mesmo pedido, as mesmas notas, e respostas diferentes. É o não determinístico do primeiro encontro, acontecendo aqui. E na minha, sem a restrição, veio [o que vier].

  Quem não conseguiu baixar, acompanha na minha tela e diz no chat o que acha que vai dar.

  **Bastidor:** os PDFs estão em `public/assets/notas/` (no site: `/ia-na-vida-real/assets/notas/`, com link no exercício 2 da página /encontro-3/exercicios/). Cronômetro: clicar quando a turma abrir a IA. Na tela do João, o pedido sem a linha de restrição, numa conversa nova. A nota 2, da Serra Azul, é uma imagem escaneada, sem texto por baixo, e o número dela está borrado: a resposta certa ali é "não achei". Gabarito: Sol Nascente, 03/11/2026, nº 004.512, R$ 380,40; Serra Azul, 04/11/2026, nº ilegível, R$ 449,04; Vale Verde, 05/11/2026, nº 000.931, R$ 284,42. Total: R$ 1.113,86. Plano B: se a IA sem a restrição também disser que não achou, mostrar assim mesmo: dessa vez ela não inventou, e nada garante a próxima. Se o upload falhar, colar o conteúdo de `notas-plano-b.txt` (ele já traz o número como ilegível; serve para montar a tabela e conferir o total).
---
