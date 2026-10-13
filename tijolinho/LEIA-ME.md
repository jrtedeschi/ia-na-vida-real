# Tijolinho (fonte única)

Micro app de gastos do Encontro 4, "Sua rotina com IA". Esta pasta é a única fonte:

- `AGENTS.md`, `passos/*.md`, `erros.md`, `glossario.md`, `codigo/*` são servidos como texto em
  `/consulta/micro-apps-na-planilha/<arquivo>` por `src/pages/consulta/micro-apps-na-planilha/[...arquivo].ts`.
- As páginas `src/content/docs/consulta/micro-apps-na-planilha/passo-NN.mdx` importam o `.md` do passo
  (texto) e o frontmatter (`verificacao`, no máximo 3 itens, conferido por `src/components/Passo.astro`;
  mais de 3 quebra o build). O passo 02 importa `codigo/*?raw` para os blocos de copiar.
- Frontmatter em YAML: textos entre aspas simples (há dois-pontos e aspas dentro).
- Testes: `node --test tijolinho/testes/` (arquivo `.cjs` porque o repositório é ESM).
- O site separado da v2 (`gen.py`, `template.html`) foi descartado.
- `LEIA-ME.md` também fica acessível pelo link; não tem nada sensível.
