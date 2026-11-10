---
layout: visual
visual: ficha-agente
kicker: Agente 3
title: Ele lê os PDFs, você confere a soma
visualProps:
  n: 3
  nome: Clareza
  cena: a pilha de papel
  pecas: [Pedido, Contexto, Conector]
  trabalho: Passar o que está nos PDFs para uma tabela só.
  ferramenta: Os PDFs anexados e, pelo conector, o seu Drive.
  saida: Uma linha por documento, o total e a planilha pronta.
  limite: Campo ilegível vira "não achei". Não inventa.
notes: |
  A ficha do terceiro. O trabalho: passar o que está nos PDFs para uma tabela só. Serve para nota fiscal, extrato de banco, boleto, recibo. A ferramenta: os PDFs anexados e, na hora de virar planilha, o conector com o Drive. A saída: uma linha por documento, o total e a planilha pronta.

  E o limite: campo que ele não conseguiu ler vira "não achei". Sem isso, a IA preenche o buraco com um número que parece certo.

  Esse agente usa três peças: o pedido, o contexto, que são os PDFs, e o conector. Vamos fazer em dois passos: primeiro a tabela, depois a planilha.

  **Fontes:** os três apps aceitam PDF no plano grátis. ChatGPT grátis: até 3 arquivos por dia (help.openai.com, "Uploading files"). Gemini grátis: até 100 MB por arquivo, com limite de uso (support.google.com/gemini, resposta 14903178). Claude grátis: lê arquivos e roda código (claude.com/pricing). Conferido em 03/11/2026.
---
