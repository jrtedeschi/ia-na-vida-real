---
layout: "visual"
visual: "rag"
title: "RAG: primeiro busca, depois responde"
notes: |
  Como ela acha a resposta num documento de 200 páginas? Quando o material é grande, ela não lê tudo a cada pergunta. Ela pica o documento em pedaços e transforma cada pedaço em números que guardam o sentido, como o token virando número na semana passada. Quando você pergunta, ela busca os pedaços mais parecidos e põe só esses na janela. Isso tem nome: RAG, geração aumentada por recuperação. É tipo uma bibliotecária: você pergunta, ela vai na estante, traz as páginas certas e lê só elas para te responder. Quando o material é pequeno, ela põe tudo na janela e nem precisa buscar.

  **Bastidor:** a animação anda em 3 cliques: (1) a pergunta acende os trechos parecidos, (2) só eles entram na janela, (3) a resposta, com a página. Termo em inglês só se perguntarem: embeddings.

  **Fontes:** Claude: com material pequeno, o Projeto põe tudo na janela; perto do limite, passa a buscar trechos, nos planos pagos (https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects). O termo RAG: Lewis et al., 2020 (https://arxiv.org/abs/2005.11401).
---
