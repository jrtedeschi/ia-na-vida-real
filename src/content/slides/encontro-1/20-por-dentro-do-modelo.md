---
layout: visual
title: Do pedido ao próximo token
visual: por-dentro-do-modelo
caveat: As palavras que mais importam para a próxima ganham mais peso.
notes: |
  Ao vivo, 2 minutos. O pedido vira pedaços, sai a chance do próximo, o escolhido volta para a fila. Comparar com o corretor do celular. Sem atenção, Transformer e camadas, a não ser que perguntem (o nome do peso é atenção). Em seguida a turma testa.
  Se perguntarem, a visão geral: 1) O pedido vira tokens. 2) Cada token vira uma lista de números. 3) Cada palavra anterior recebe um peso, conforme a relevância dela para o que vem a seguir: em "O café da manhã ideal tem", "café", "ideal" e "manhã" pesam mais do que "O" e "da". O modelo refaz essa conta em dezenas de camadas. Em inglês, esse mecanismo se chama atenção (attention), a peça central do Transformer, a arquitetura por trás de Claude, GPT e Gemini. 4) No fim sai uma lista com a chance de cada token vir em seguida, aprendida no treino; o modelo escolhe um dos mais prováveis. O escolhido volta para a fila e tudo recomeça. Comparação para leigos: é o corretor do celular, treinado com uma quantidade enorme de texto; e como cada resposta é uma sequência de escolhas pela chance, a mesma pergunta pode dar respostas diferentes. Evitar a palavra "aposta": não é sorte nem jogo, é uma conta de probabilidade. Tokens também são o que se paga: entrada e saída.
---
