---
layout: demo
kicker: Exercício · em aula · 7 minutos
title: O contrato da maquininha
caveat: "Depois pergunte: qual é a taxa do Pix? E cole no chat a multa para sair depois de 5 mensalidades pagas."
prompt:
  contexto: "Este é [o contrato da maquininha de cartão do meu mercadinho]. Eu sou [a contratante]."
  objetivo: "Saber o que eu fico obrigada a fazer, o que me custa dinheiro e o que acontece se eu quiser sair."
  referencias: "Só o documento. [Cole o texto ou anexe o PDF]"
  restricoes: "Não resuma. Cada item com o número da cláusula. Se o contrato não falar de um assunto, escreva \"o contrato não diz\"."
  formato: "Tabela: cláusula, o que diz em português simples, prazo ou valor, risco para mim."
tools:
  - name: Claude
    logo: /img/logos/claude.svg
    href: https://claude.ai/
  - name: Gemini
    logo: /img/logos/googlegemini.svg
    href: https://gemini.google.com/
  - name: ChatGPT
    logo: /img/logos/openai.svg
    href: https://chatgpt.com/
visual: timer
visualProps:
  minutos: 7
  sozinho: false
  compacto: true
  fim: Tempo!
notes: |
  Sete minutos. Na página dos arquivos, "O contrato da maquininha". Copia o texto ou baixa o PDF. Conversa nova, cola o pedido e o contrato.

  Quando a tabela chegar, faz duas perguntas na mesma conversa. A primeira: qual é a taxa do Pix? A segunda: se eu cancelar depois de pagar cinco mensalidades, quanto é a multa?

  [quando a turma terminar] O que veio no Pix? [ler o chat] O contrato não fala de Pix em lugar nenhum. Quem recebeu "o contrato não diz", a restrição funcionou. Quem recebeu um número, ela inventou, ou foi buscar fora do documento.

  E a multa? [ler] São sete mensalidades que faltam, de R$ 59,90, vezes duas maquininhas, e metade disso: R$ 419,30. Quem recebeu R$ 209,65, ela esqueceu que são duas maquininhas. A cláusula diz "de todas as maquininhas".

  **Bastidor:** arquivo em `public/assets/contrato/`. Cronômetro: clicar quando a turma abrir a IA. Gabarito. Pix: o contrato não diz. Multa (cláusula 7.1): 7 x R$ 59,90 x 2 x 50% = R$ 419,30. O que a tabela precisa trazer: renovação automática por mais 12 meses se não avisar por escrito 60 dias antes (2.2); mensalidade de R$ 59,90 por maquininha, isenta acima de R$ 8.000 no mês (3); antecipação automática ligada, com 2,9% ao mês, e que só desliga pelo aplicativo (5.3 e 5.4); taxas que podem mudar com aviso de 30 dias (6.2); devolução em 10 dias, R$ 15 por dia de atraso e R$ 480 por perda ou dano (8); comprovantes guardados por 18 meses e defeito avisado em 48 horas (9); venda contestada, 7 dias para mandar o comprovante (10). Outra coisa que o contrato não diz: se tem maquininha reserva durante os 5 dias úteis da troca. Plano B: se o upload falhar, colar o texto.
---
