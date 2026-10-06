# Stack: Astro + Starlight no GitHub Pages, e slides com o mesmo design system
Type: research
Status: resolved
Blocked by: —

## Question

1. Setup atual (out/2026) do Astro + Starlight para deploy no GitHub Pages em subpath (`/ia-na-vida-real`): workflow oficial, `base`, `site`, pegadinhas.
2. Como customizar profundamente o tema Starlight (tokens, fontes, light/dark) sem brigar com ele?
3. Slides dentro do mesmo site: opções (layout Astro próprio com navegação por teclado; reveal.js embutido; Slidev separado; outro), comparadas em compartilhamento de tokens, navegação, modo apresentador, PDF/print e esforço. Recomende uma.
4. Componentes interativos (checklist de progresso em localStorage, botão "copiar prompt") em MDX: islands, peso de JS.

## Comments

Research: research/01-stack-astro-slides.md

## Answer

Detalhe em research/01-stack-astro-slides.md.
- Astro 7.3 + Starlight ~0.42 (fixar), Node ≥22.12. Deploy com withastro/action@v6 + deploy-pages; `site` + `base: '/ia-na-vida-real'`; Pages source = GitHub Actions.
- Pegadinha: links em MDX não recebem o base → helper `withBase()` (o plugin starlight-base-path não foi confirmado no Astro 7).
- Rebrand: um `tokens.css` mapeado para `--sl-*` via customCss; overrides de componentes; fontes pela Fonts API do Astro.
- Slides: reveal.js 6 em página Astro própria (`/aulas/[slug]/slides`), fora do layout do Starlight, com os mesmos tokens mapeados para `--r-*`. Vem com modo apresentador e PDF.
- Interatividade: componentes .astro com custom elements em `<script>` puro, sem framework; localStorage dentro de try/catch.
