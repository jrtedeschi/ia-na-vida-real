---
layout: demo
kicker: Exercício · em aula · 7 minutos
title: Três notas viram uma tabela
caveat: "No chat: o que veio no número da nota da Serra Azul? E qual foi o total?"
prompt:
  contexto: "Anexei [3 notas fiscais em PDF] de fornecedores do meu comércio."
  objetivo: "Uma tabela para lançar no controle do mês."
  referencias: "Use só o que está escrito nas notas."
  restricoes: "Campo ilegível, escreva \"não achei\". Não invente."
  formato: "Tabela: fornecedor, data, número da nota, valor. Na última linha, o total."
tools:
  - name: Gemini
    logo: /img/logos/googlegemini.svg
    href: https://gemini.google.com/
  - name: Claude
    logo: /img/logos/claude.svg
    href: https://claude.ai/
visual: timer
visualProps:
  minutos: 7
  sozinho: false
  compacto: true
  fim: Tempo!
notes: |
  Sete minutos. Na página dos arquivos, "Três notas fiscais". Tem um botão "As três notas num PDF só": baixa esse, é um arquivo em vez de três. Conversa nova, de preferência no Gemini, porque o próximo passo é lá. Anexa o PDF e cola o pedido. São notas inventadas, pode mandar à vontade.

  Repara na restrição: "campo ilegível, escreva não achei". Na minha tela eu vou fazer diferente: o mesmo pedido, sem essa linha. Depois a gente compara.

  [quando a turma terminar] Cola no chat: o que veio no número da nota da Serra Azul? [ler duas ou três] Se para uns veio "não achei" e para outros veio um número, olha que coisa: o mesmo pedido, as mesmas notas, e respostas diferentes. É o não determinístico do primeiro encontro, acontecendo aqui. E na minha, sem a restrição, veio [o que vier].

  E o total? [ler] R$ 1.113,86.

  Quem não conseguiu baixar, acompanha na minha tela e diz no chat o que acha que vai dar.

  **Bastidor:** os PDFs estão em `public/assets/notas/`; `notas-3-em-1.pdf` junta as três. Cronômetro: clicar quando a turma abrir a IA. Na tela do João, o pedido sem a linha de restrição, numa conversa nova. A nota 2, da Serra Azul, é uma imagem escaneada, sem texto por baixo, e o número dela está borrado: a resposta certa ali é "não achei". Gabarito: Sol Nascente, 03/11/2026, nº 004.512, R$ 380,40; Serra Azul, 04/11/2026, nº ilegível, R$ 449,04; Vale Verde, 05/11/2026, nº 000.931, R$ 284,42. Total: R$ 1.113,86. Plano B: se a IA sem a restrição também disser que não achou, mostrar assim mesmo: dessa vez ela não inventou, e nada garante a próxima. Se o upload falhar, copiar o texto do plano B na mesma página (ele já traz o número como ilegível; serve para montar a tabela e conferir o total).
---
