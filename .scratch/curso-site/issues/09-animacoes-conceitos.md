# Animações estilo 3Blue1Brown nos conceitos: como produzir e embutir?
Type: research
Status: resolved
Blocked by: 03

## Question

Como ter animações explicativas no estilo 3Blue1Brown (Manim) nas páginas de conceito e nos slides, com a identidade E-grafite (concreto/tinta/laranja/grafite, Schibsted/Kalam)? Comparar: Manim Community (Python → vídeo webm/mp4 embutido), Motion Canvas (TS), alternativas web nativas (SVG/Canvas + JS, GSAP), e outras. Critérios: fidelidade ao estilo, uso das fontes e cores da marca, peso no GitHub Pages (orçamento de performance), acessibilidade (prefers-reduced-motion, legenda/transcrição, poster estático para o PDF), funcionar dentro do reveal.js, render no CI vs. local, esforço por animação. Recomendar pipeline e fazer prova de conceito: uma animação curta de "token" (frase quebrando em pedaços).

## Comments

Research: research/09-animacoes-conceitos.md

## Answer

Detalhe em research/09-animacoes-conceitos.md. **Animação web nativa**, não vídeo: cada animação é um custom element (SVG/HTML + Web Animations API, sem framework) dentro de um componente .astro. Roda igual na página de conceito e no slide reveal.js (`.play()` no `slidechanged`). O módulo `ink.js` faz círculos, setas e sublinhados "à mão". Peso de ~8 KB gzip, contra 458–932 KB por vídeo Manim (e um vídeo por tema). Herda os tokens e o tema claro/escuro, e o texto continua legível para leitor de tela. O estado final serve de poster (reduced-motion, impressão, ?print-pdf). Tem botões Pausar/Ver de novo e transcrição.
- Manim 0.21 fica como saída de emergência para transições matemáticas; Motion Canvas descartado.
- PoC: animations/token-split/ · versão de 1 arquivo: https://claude.ai/code/artifact/cf3ba6fb-88b8-4d37-b7b5-6da0e45705f4
- Pendências para a construção: conferir a divisão em tokens com um tokenizer real; gerar o estado final como HTML no build (sem JS); testar Safari/Firefox.
- Correção: a frase tem 6 palavras, não 5 (protótipos corrigidos).
