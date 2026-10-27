---
layout: "visual"
visual: "skill"
title: "Como o chat acha a skill certa"
notes: |
  Por dentro, uma skill é uma pasta. Olha à esquerda. Por fora, a etiqueta: o nome e uma descrição de quando usar. Dentro, o arquivo de instruções, que se chama SKILL.md, e uns arquivos extras: um modelo, uma lista de cores, um roteiro.

  E como o chat acha a skill certa? Ele não abre todas. Olha a janela: ela já começa com as etiquetas de todas, e só isso, que é bem leve. [clique] Chega o pedido, "faz o cartaz da promoção", e ele combina com a etiqueta do cartaz. [clique] Só agora ele abre essa pasta e lê as instruções. [clique] E dos arquivos extras, ele pega só o que precisa: o modelo do cartaz. A lista de cores e as outras pastas nem entram.

  Por isso a descrição importa tanto: é ela que faz o chat achar a sua skill. Escreve o que ela faz e quando usar, tipo "revisa mensagens para clientes antes de eu enviar".

  **Bastidor:** a animação anda em 3 cliques: (1) o pedido e a etiqueta que combina, (2) a pasta abre e o SKILL.md entra na janela, (3) só o modelo do cartaz entra, e vem a resposta.

  **Fontes:** Anthropic, Agent Skills: a skill é uma pasta com SKILL.md (nome e descrição no topo, instruções no corpo) e arquivos opcionais; o nome e a descrição de cada skill ficam sempre no contexto (cerca de 100 tokens cada), o SKILL.md só entra quando o pedido combina com a descrição, e os arquivos extras só quando são usados (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview). No Gemini, a skill também pode ser chamada com "/" e o nome; pela cobertura da imprensa, ele também detecta sozinho quando uma skill serve, mas o critério não está documentado (https://9to5google.com/2026/09/27/gemini-gems-skills/). VERIFICAR no Gemini, na tela.
---
