---
layout: "demo"
kicker: "Exercício · em aula · 15 minutos"
title: "Faça o RAG tropeçar, e desvie"
caveat: "Deu certo se a resposta citou a página 12, o trecho existe no PDF (procure com Ctrl+F) e, na pergunta da churrasqueira, ela disse que não sabe."
prompt:
  contexto: "Enviei [o regulamento do Condomínio Edifício Jacarandá]."
  objetivo: "Saber se [posso fazer obra no sábado] e em que horário."
  referencias: "Procure na parte de [Obras, página 12]."
  restricoes: "Use só o documento. Se não estiver lá, diga que não sabe."
  formato: "Responda em 2 frases, com o trecho exato e a página. Depois diga se há outro trecho sobre isso."
visual: timer
visualProps:
  minutos: 15
  sozinho: false
  compacto: true
  fim: Tempo!
tools:
  - name: "Projetos no Claude"
    logo: "/img/logos/claude.svg"
    href: "https://claude.ai/projects"
  - name: "Gemini Notebook"
    logo: "/img/logos/notebooklm.svg"
    href: "https://notebooklm.google.com/"
notes: |
  Agora é com vocês. O regulamento de exemplo está no site, é de um condomínio inventado, então pode usar sem medo. Sobe num Projeto do Claude ou no Gemini Notebook e faz três perguntas. Primeiro uma vaga: "e no fim de semana, o que pode?". Depois o pedido da tela, que aponta a página. E por último uma que o regulamento não responde: "posso pôr uma churrasqueira na varanda?". O que eu quero que vocês vejam é a diferença entre as três. E confere o trecho no PDF, com Ctrl+F. Vou soltar o cronômetro.

  **Bastidor:** clicar no número do cronômetro quando a turma começar. Respostas esperadas no regulamento de exemplo (public/assets/regulamento-exemplo.pdf): obras de segunda a sexta, das 8h às 17h, e aos sábados só das 9h às 12h (página 12); mudanças de segunda a sábado, das 8h às 17h (página 10). Churrasqueira não aparece no documento. Se a pergunta vaga acertar de primeira, tudo bem: com documento pequeno, às vezes vai tudo para a janela; aí a lição é conferir o trecho.
---
