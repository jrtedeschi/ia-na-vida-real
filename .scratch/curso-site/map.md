# Mapa: Site do curso "IA na Vida Real"

Label: wayfinder:map

## Destination

Site do curso publicado no GitHub Pages (Astro + Starlight, repo público `jrtedeschi/ia-na-vida-real`), com identidade visual nova ("tech mas palatável"). Cada um dos 4 encontros tem página de estudo, material de consulta, exercícios práticos (progresso salvo no navegador) e deck de slides com o mesmo design system. Encontro 1 publicado antes de 20/10/2026; E2–E4 uma semana antes de cada aula (27/10, 03/11, 10/11).

## Notes

- **Override de "plan, don't do"**: a execução (construir e publicar) faz parte deste mapa.
- Domínio: conteúdo educacional pt-BR para leigos. Público não técnico, sem programação.
- Fontes: landing (artefato https://claude.ai/artifact/Fta87vm3mPG9r9dqr13kkE), que traz os 4 encontros, o método C-O-R-R-F, o Kit e o FAQ; e `~/Downloads/Designing Agent Skills — Research Notes.md`, que alimenta o Encontro 4 (processos → rotinas = skills explicadas para leigos) e o método de produção (critério "deu certo se…" verificável, progressive disclosure, anti-slop).
- Conteúdo: Claude redige a partir da landing; João revisa por encontro.
- Exercícios: caminho gratuito obrigatório + caminho "plano pago" opcional.
- A landing atual NÃO é rebrandada nem migrada (é só ela; o site do curso é separado).
- Skills: /grilling, /domain-modeling, /prototype, /frontend-design, /ui-ux-pro-max:slides, /research.

## Decisions so far

- Destino = spec + site construído e publicado (execução no mapa).
- Site = material de apoio dos alunos (Kit virando site), conteúdo público.
- Research Notes → fonte do Encontro 4 + método de produção; trilha "agentes avançados" fora.
- Slides fazem parte: um deck por encontro, dentro do site.
- Rebranding completo do site do curso; nome "IA na Vida Real" mantido.
- Stack Astro + Starlight; URL github.io por enquanto.
- Exercícios com estado local (localStorage), sem backend.
- [Fatos atuais das ferramentas](issues/06-fatos-ferramentas.md) — Claude grátis sem deep research nem imagem; caminho grátis via Gemini/ChatGPT; nome atual "Gemini Notebook"; OKF existe, mas é "especificação aberta".

- [Stack: Astro + Starlight no Pages e slides](issues/01-stack-astro-slides.md) — Astro 7 + Starlight ~0.42, withBase() para links, tokens.css → --sl-*; slides com reveal.js 6 em página Astro própria.
- [Rebranding: direção visual](issues/02-rebranding-direcoes.md) — E · Rascunho técnico: concreto + tinta + laranja sinal, cor de apoio grafite; Schibsted Grotesk / Instrument Sans / Kalam / Plex Mono.
- [Voz da marca](issues/08-voz.md) — Especialista que simplifica: fato primeiro, um número por ideia, anotações curtas com consequência nova, sem exagero.
- [Arquitetura de informação](issues/03-arquitetura-informacao.md) — por encontro + Consulta; conceitos como núcleo, com anatomia fixa; sem biblioteca de prompts (índice automático); PDF de slides + Kit após E4.

## Not yet specified

- Conteúdo detalhado de E2, E3 e E4 (depende da arquitetura de informação e do formato de exercício).
- Página de conceito: componente e template (anatomia definida em 03), incluindo onde entram as animações (09).
- Gerar PDF do Kit a partir das páginas.
- Template de deck de slides (depende da marca e da pesquisa de stack).
- Como o Encontro 4 traduz "skills" para leigos (rotina = instrução + quando usar + referências); base de conhecimento no Obsidian / Open Knowledge Format.
- Construção do E1 (scaffold, páginas, exercícios, deck) e QA: a11y, responsivo 320–1920, ambos os temas.
- Domínio próprio (decisão posterior).
- Ligação landing → site (onde o aluno recebe o link).

## Out of scope

- Rebranding/migração da landing (decisão Q8: fica como está).
- Trilha avançada de agentes para técnicos.
- Correção de exercícios por IA / qualquer backend.
