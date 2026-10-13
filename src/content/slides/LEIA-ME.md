# Como editar os slides

Cada slide é um arquivo `.md` em `encontro-N/`. O número no começo do nome dá a ordem.

- **Mudar texto:** abra o arquivo e troque as palavras.
- **Reordenar:** troque o número do arquivo. Para pôr um slide entre o 03 e o 04, use `03a-...md`.
- **Esconder sem apagar:** `hidden: true`.
- **Imagens:** ponha o arquivo em `encontro-N/img/` e use `image: ./img/nome.jpg` + `alt:` (descrição da imagem).
- **Notas do apresentador** (tecla S): campo `notes:`.

## Formato

```md
---
layout: big
title: Título do slide
notes: O que falar neste slide.
---
Texto abaixo do título. Aceita **negrito**, *itálico* e vários parágrafos.
```

Texto com `:` ou que começa com `[` ou `"` vai entre aspas: `title: "Pergunta: e agora?"`.

**Links** em títulos, itens e textos curtos: `[Gemini](https://gemini.google.com/)` abre em outra aba;
`[Janela de contexto](/consulta/conceitos/janela-de-contexto/)` aponta para uma página do site (o `/ia-na-vida-real` entra sozinho).
Notas longas: `notes: |` e o texto na linha de baixo, com dois espaços na frente.

## Layouts

| `layout:` | Para quê | Campos |
| --- | --- | --- |
| `title` | Abertura | `circle: "01"` (número circulado), texto abaixo |
| `bio` | Apresentação pessoal | texto à direita |
| `big` | Uma ideia, título grande (padrão) | texto abaixo |
| `thesis` | Frase de efeito com barra laranja | `cite:` (autor), texto abaixo |
| `section` | Abertura de bloco, lista numerada | `items:` |
| `list` | Lista com traços | `items:` |
| `flow` | Passos com setas → | `items:` |
| `cards` | 2, 3 ou 4 cartões | `items:` com `title` e `text` |
| `five` | Linhas com barra laranja (pedido em 5 partes) | `items:` com `title` e `text` |
| `arc` | Etapas com descrição (os 4 encontros) | `items:` com `title` e `text` |
| `numbers` | Números grandes (1 a 3) | `items:` com `title` (o número) e `text` (legenda) |
| `photo` | Foto à esquerda, passos à direita | `image:`, `alt:`, `items:` |
| `gallery` | Processo em fotos: 2 a 4 fotos lado a lado, com setas e legenda numerada | `items:` com `title` (legenda), `image` e `alt` |
| `visual` | Animação ou diagrama | `visual:` (nome), `visualProps:` (opcional) |
| `demo` | Demonstração com pedido copiável | `kicker:`, `prompt:` (contexto, objetivo, referencias, restricoes, formato) |
| `end` | Encerramento | `title: "{site}"` mostra o endereço do site |
| `roteiro` | O fio da aula: lista os capítulos | `items:` com `title` (nome do capítulo) e `text` |
| `ponte` | Abre um capítulo, com o mapa no topo | `chapter:` (número), título = a pergunta do capítulo, texto = "Até aqui / Agora" |

Campos que servem em qualquer layout: `kicker:` (linha pequena acima do título), `caveat:` (observação no fim),
`citeLogo:` (logo ao lado do `cite:`, arquivo em `public/`, pintado na cor do texto), `citePhoto:` (foto redonda de quem disse),
`fragments: true` (itens aparecem um por vez), `image:` (imagem abaixo do texto), `class:` (classe CSS extra).

## Espinha dorsal

O slide `roteiro` define os capítulos da aula. Cada `ponte` abre um capítulo (`chapter: 3`) e mostra o mapa,
com o capítulo atual circulado. Os slides seguintes ganham o nome do capítulo no canto, sozinhos.
Para mudar o nome de um capítulo, mude só o `roteiro`.

## Exemplos

Números grandes:

```md
---
layout: numbers
title: Bancários no Brasil
items:
  - title: 730 mil
    text: em 1990
  - title: 393 mil
    text: em 2001 (DIEESE)
---
```

Itens que aparecem um por vez:

```md
---
layout: flow
title: Como eu fiz
fragments: true
items:
  - Descrevi o problema
  - A IA sugeriu um caminho
  - Conferi e ajustei
---
```

## Animações

Nomes disponíveis em `visual:` (lista em `src/components/slides/visuals.ts`):
`fragmentos`, `proxima-palavra`, `alucinacao`, `janela-de-contexto`, `quem-e-quem`, `provedores`, `modelos`,
`feita-com-um-pedido`, `evolucao`, `por-dentro-do-modelo`, `mundo-novo` (abre no clique, cobrindo o slide), `pipeline-etl`, `vida-melhor`, `tarefas-fundamentos`, `submarino` (saída do slide).

Para trocar o texto de uma animação só neste slide, use `visualProps:`:

```md
---
layout: visual
title: Ela aposta na próxima palavra
visual: proxima-palavra
visualProps:
  prompt: O melhor time do Brasil é o
  steps: [[["Flamengo", 40], ["Corinthians", 30], ["Palmeiras", 20], ["São Paulo", 10]]]
---
```

Animação nova: peça ao Claude ("crie uma animação de X para o slide 12"). Ele cria o componente em
`src/components/anim/`, registra o nome em `visuals.ts` e põe `visual: <nome>` no slide.
