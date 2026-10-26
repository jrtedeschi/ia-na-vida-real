---
layout: "visual"
visual: "tropecos"
title: "Onde o RAG tropeça"
notes: |
  Só que o RAG não é mágica. Vamos seguir a mesma pergunta, "posso fazer obra no sábado?", pelas quatro etapas, e ver onde a resposta certa se perde. [clique] O corte: o regulamento é picado em pedaços, que em inglês chama chunks. O título "Obras" ficou num pedaço e o horário "aos sábados, só das 9h às 12h" no outro. O pedaço do horário não fala de obra. [clique] A busca por sentido, os embeddings: para ela, "barulho no fim de semana", da regra do silêncio, parece muito mais com "obra no sábado" do que o horário, que nem tem a palavra obra. Parecido não é certo. [clique] Só os k pedaços mais parecidos entram na janela, o tal top-k. Com três, o horário, que ficou em quinto, não entra. [clique] E se a gente aumenta o k? Aí ele entra, mas cai no meio de sete pedaços, e o modelo presta menos atenção no meio. A resposta sai "pode, até as 22h", que é a regra do silêncio, não a de obra.

  A boa notícia: dá para desviar de quase tudo no pedido. É o que a gente vai ver agora na demonstração.

  **Bastidor:** a animação anda em 4 cliques, uma etapa por clique. Para quem perguntar como as ferramentas resolvem: busca híbrida (sentido + palavra exata), reranking e contextual retrieval; no teste da Anthropic, isso cortou as falhas da busca em até 67%.

  **Fontes:** corte e palavra exata: Anthropic, Contextual Retrieval, 2024 (https://www.anthropic.com/news/contextual-retrieval). Top-k: Barnett et al., 2024, FP2 e FP3 (https://arxiv.org/abs/2401.05856). Perdido no meio: Liu et al., TACL 2023 (https://arxiv.org/abs/2307.03172).
---
