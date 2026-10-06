# Research 09: animações explicativas (estilo 3Blue1Brown) nos conceitos e nos slides

Data: 2026-10-06. Versões conferidas no PyPI/npm nesta data; capacidades nas docs oficiais (links no fim).
Ticket: [09-animacoes-conceitos](../issues/09-animacoes-conceitos.md).

## TL;DR

- **Recomendação: animação web nativa.** Cada animação é um custom element (SVG/HTML + Web Animations API), empacotado num componente `.astro`. É o mesmo arquivo na página de conceito (Starlight) e no slide (reveal.js 6). Não tem runtime de framework nem vídeo. O traço "à mão" vem de um módulo pequeno (`ink.js`) que gera círculos, setas e sublinhados rabiscados em SVG.
- Por que não vídeo (Manim ou Motion Canvas) como padrão: o vídeo congela **uma** cor, **um** tema e **uma** largura. O site tem tema claro e escuro, vai de 320 a 1920 px e precisa de texto real (leitor de tela, tradução, zoom). Na PoC, a versão web pesa **~8 KB gzip** (JS+CSS, sem minificar). O mesmo trecho em Manim dá **458 KB** em 720p30 e **932 KB** em 1080p60 (176 KB recomprimindo em VP9 CRF 38), e ainda precisa de uma versão por tema.
- **Manim fica como saída de emergência**, para o caso raro de uma animação matemática (morph de fórmula, gráfico contínuo) que não valha a pena fazer em SVG. Ela já roda localmente (`animations/.venv`, Manim CE 0.21.0) com as fontes da marca. Nos conceitos listados no ticket 03 eu não vi nenhum caso que precise dela.
- **Motion Canvas e Revideo** ficam descartados: dão saída em vídeo com os mesmos problemas e um editor/toolchain a mais. O Motion Canvas não publica versão nova no npm desde 3.17.2 (dez/2024). **GSAP** (3.15, 100% grátis desde 2025) é um upgrade opcional, caso a linha do tempo fique complexa demais. Na PoC, a WAAPI nativa bastou.
- **A PoC está pronta** em `animations/token-split/`: a frase "Organize minha semana com 3 prioridades" se quebra em 9 tokens, com círculo laranja rabiscado e anotação em Kalam. Dura ~7,6 s. Tem tema claro e escuro, reduced-motion, pausa, transcrição e poster para o PDF, e funciona no reveal.js 6 (inclusive `?print-pdf`).

---

## 1. Opções e estado atual (out/2026)

| Ferramenta | Versão / data | O que é | Saída |
|---|---|---|---|
| **Manim Community** | 0.21.0 (2026-08-10), Python ≥ 3.11 [pypi][m-pypi] | Biblioteca Python da comunidade, derivada do Manim do 3Blue1Brown. A 0.21 trouxe `Typst`/`MathTypst` (fórmulas sem LaTeX), um renderer Cairo 2,2× mais rápido e encoding paralelo [changelog][m-cl] | mp4/webm/gif/png, renderizados offline |
| **Motion Canvas** | `@motion-canvas/core` e `/player` 3.17.2 (2024-12-14); repo ativo (push 2026-07) [npm][mc-npm], [gh][mc-gh] | Biblioteca TS com geradores, mais um editor com preview, focada em sincronizar com narração [docs][mc-docs] | Sequência de imagens (PNG/JPEG/WebP), que depois passa por ffmpeg [rendering][mc-render] |
| **Revideo** | `@revideo/core`/`player` 0.11.0 (2026-07-10) [gh][rv-gh] | Fork do Motion Canvas, voltado a gerar vídeo por API | Vídeo; tem player React |
| **Remotion** | — | Vídeo com React. Licença própria: grátis para pessoa física e times de até 3 pessoas; acima disso, Company License [licença][rem] | Vídeo, Player React |
| **Web nativo (SVG + WAAPI/CSS)** | Plataforma | Elementos reais no DOM, animados com `element.animate()` | A própria página |
| **GSAP** | 3.15.0, licença "no charge"; todos os plugins grátis (SplitText, DrawSVG, MorphSVG...) [pricing][gsap-p], [npm][gsap-npm] | Biblioteca de linha do tempo JS | A própria página |
| reveal.js nativo | 6.0.2 | Auto-Animate (morph entre slides por `data-id`) [auto-animate][rv-aa]; fragments com eventos `fragmentshown`/`fragmenthidden` [fragments][rv-fr] | A própria página (só nos slides) |

## 2. Comparação pelos critérios do ticket

| Critério | Manim CE (vídeo) | Motion Canvas (vídeo) | **Web nativo (SVG + WAAPI)** | GSAP (web) |
|---|---|---|---|---|
| Fidelidade ao "estilo 3B1B" | **A melhor** para matemática: `Transform` entre glifos, `Create`, gráficos. Na PoC, o split letra a letra saiu em ~10 linhas | Boa (tweens com geradores, sinais) | Boa para diagramas, texto, setas e contagens (é o que os conceitos do curso pedem). Morph de fórmula é trabalhoso | Igual ao web, com MorphSVG para morph de formas |
| Fontes e cores da marca | Funciona: `register_font()` com TTF locais (OFL, baixados do google/fonts). Cores fixas no render | Funciona (fontes web). Cores fixas no render | **Total**: herda `tokens.css` (`--ivr-*`), muda com o tema na hora | Total |
| Tema claro/escuro | Um vídeo por tema (2× renders, 2× peso, troca por `<source media>` ou JS) | Idem | **Automático** (variáveis CSS) | Automático |
| Responsivo 320–1920 | Não: o quadro é fixo em 16:9 e o texto encolhe no celular (no 320 px, a frase da PoC fica com ~8 px) | Idem | **Reflow real**: os tokens quebram de linha e o círculo e as setas são recalculados no layout | Idem |
| Peso no GH Pages | 450–950 KB por animação de ~9 s (720p/1080p, encoder padrão). ~180 KB recomprimindo. ×2 por tema | Parecido | **~8 KB gz** para o componente (JS+CSS), reutilizado em todas as animações. Cada animação nova custa poucos KB | +~25–30 KB gz do core (só nas páginas que usam) |
| Acessibilidade | Precisa de legenda/transcrição e poster à parte. O texto do vídeo não é selecionável nem lido | Idem | Texto real no DOM. `role="img"` + `aria-label` + transcrição no `<figcaption>`. `prefers-reduced-motion` → estado final. Pausar/repetir por botão (WCAG 2.2.2) | Igual ao web (`gsap.matchMedia()` para reduced motion) |
| Poster para PDF (reveal `?print-pdf`, Kit) | Extrair um frame com ffmpeg (`-sseof`), mais um `<video poster>` | Último frame da sequência | **O próprio estado final** (sem animação = poster). A PoC detecta `?print-pdf` e `beforeprint` | Idem |
| Dentro do reveal.js | `<video data-autoplay>`, ou como background de slide. Funciona | Idem | **Funciona**: `Reveal.on('slidechanged')` chama `.play()`. A PoC compensa a escala que o reveal aplica ao slide | Funciona |
| Render: CI vs. local | Local (venv + ffmpeg; LaTeX opcional). No CI: apt `libpango1.0-dev ffmpeg` + `pip`, ~1-2 min por cena. Recomendo commitar o vídeo em vez de renderizar no CI | Local (editor no navegador) ou headless com Playwright | **Nenhum render**: o build do Astro já basta | Nenhum |
| Esforço por animação | Médio: layout feito à mão em unidades de cena e sem reflow (na PoC, o 1º render estourou a largura e precisou de ajuste) | Médio, mais o editor | Médio na 1ª (o componente base). Depois, **baixo**: outra frase = só trocar atributos; um conceito novo = 1 componente de ~150 linhas reusando `ink.js` | Médio |
| Risco | Baixo (projeto maduro, ativo) | Médio (sem release no npm há ~22 meses) | Baixo (só a plataforma) | Baixo (licença própria, grátis) |

## 3. Pipeline recomendado

```
src/
  components/anim/
    ink.js                 # traços à mão (elipse, seta, sublinhado): determinísticos por semente
    TokenSplit.astro       # renderiza o markup FINAL no servidor + <script> que registra <ivr-token-split>
    token-split.css        # consome --ivr-* (tokens.css), sem layer → ganha do Starlight
  content/docs/consulta/token.mdx   →  <TokenSplit tokens="Organ|ize| minha|..." circle="0,1" note="1 palavra, 2 tokens" />
  pages/aulas/[slug]/slides.astro   →  mesmo componente dentro de <section>, com trigger="manual"
```

Regras do pipeline:
1. **Estado final é o estado de repouso.** O HTML (idealmente SSR no `.astro`) mostra o diagrama pronto. O JS só anima "a partir do começo". Assim, sem JS, com reduced-motion, impressão ou PDF, o resultado é sempre o diagrama completo. Na PoC o DOM ainda é montado em JS. Ao portar para `.astro`, gerar o markup no servidor.
2. **Medir, depois animar (FLIP).** O layout real (com quebra de linha) é medido, e os tokens começam com `transform` na posição da frase junta. Só `transform`, `opacity` e `stroke-dashoffset` são animados (compositor-friendly).
3. **Disparo**: na página, `IntersectionObserver` (40% visível, uma vez). No slide, `trigger="manual"` e o deck chama `.play()` em `slidechanged`. Fragments podem chamar `seek`/etapas no futuro.
4. **A11y fixa no componente**: `role="img"` + `aria-label` curto, transcrição no `<figcaption>` (com `hide-caption`, ela fica só para leitor de tela no slide, porque as notas do apresentador já a têm), botão Pausar durante a animação e "Ver de novo" depois.
5. **Vídeo só como derivado**, para WhatsApp/Instagram ou para quem pedir: `animations/render.mjs` grava o componente com Playwright e o ffmpeg gera webm/mp4 + PNG. Sem segunda fonte de verdade.
6. **Manim, se um dia precisar**: cena em `animations/<nome>/scene.py`, render local na venv, commitar `webm` + `mp4` + poster em `public/anim/`, um par por tema, e embutir com `<video muted playsinline preload="none" poster>`, `<track kind="captions">` e transcrição. Não renderizar no CI do Pages.

## 4. Prova de conceito

**Arquivos** (`/Users/joaotedeschi/new_projects/ia_na_vida_real/animations/`):

| Arquivo | O que é |
|---|---|
| `token-split/token-split.js` | Custom element `<ivr-token-split>`: FLIP, linha do tempo WAAPI, reduced-motion, impressão, pausa, resize e reconexão no DOM (o reveal move slides no `?print-pdf`) |
| `token-split/ink.js` | Elipse, seta e sublinhado rabiscados em coordenadas de pixel (espessura constante; Catmull-Rom → Bézier; PRNG com semente) |
| `token-split/token-split.css` | Estilo E-grafite, com os tokens `--ivr-*` e fallbacks do tema claro |
| `token-split/index.html` | Demo de página de conceito (tema claro/escuro, botão "estado final") |
| `token-split/slides.html` | Demo num deck **reveal.js 6.0.2** (CDN só na demo) |
| `render.mjs` | Playwright + ffmpeg: posters, responsivo, reduced-motion, slide, PDF e vídeo |
| `out/` | Saídas renderizadas (lista abaixo) |
| `_comparativo-manim/token_split.py` | A mesma cena em Manim, para comparar. Saída em `out/manim/` |

**Linha do tempo (~7,6 s, depois fica parada):** 0–0,5 s a frase aparece ("você escreve:") → 1,5 s o rótulo vira "a IA lê assim:" → 1,9–3,2 s os tokens se separam, com caixas tracejadas grafite em cascata → 4,0–5,1 s o círculo laranja é desenhado em volta de "Organ"+"ize" → 4,7–5,3 s seta e nota "1 palavra, 2 tokens" (Kalam, #C23A08) → 6,0–7,6 s "6 palavras → 9 tokens", com sublinhado laranja rabiscado.

**Verificado (Playwright, Chromium):**
- Tema claro e escuro: `out/token-split-poster-light.png`, `out/token-split-poster-dark.png`.
- 320 px e 768 px sem overflow horizontal: `out/token-split-320.png`, `-768.png`. No 320, a frase quebra em 2 linhas e a anotação cabe no espaço entre elas.
- `prefers-reduced-motion: reduce` → 0 animações ativas, estado final direto: `out/token-split-reduced-motion.png`.
- reveal.js 6: meio da animação e final em `out/token-split-slide-{mid,final}.png`. `?print-pdf` → 0 animações, estado final e geometria correta: `out/token-split-slides-print.pdf`.
- Vídeo derivado (960×540, 9 s): `out/token-split.webm` (117 KB) e `.mp4` (113 KB).
- Comparativo Manim: `out/manim/token-split-manim-{720p30,1080p60}.webm` (458 KB e 932 KB) e `token-split-manim-final.png`. Render de 24 s nesta máquina. O 1º render estourou a largura do quadro (sem reflow) e a linha de base ficou desalinhada entre tokens com e sem descendente. Para o comparativo, deixei como está.

**Como ver:**
```bash
cd /Users/joaotedeschi/new_projects/ia_na_vida_real
python3 -m http.server 8000      # módulos ES não rodam via file://
# http://localhost:8000/animations/token-split/            (página de conceito; role até a figura)
# http://localhost:8000/animations/token-split/slides.html (→ para o slide 2)
# http://localhost:8000/animations/token-split/slides.html?print-pdf  (Chrome → Imprimir → PDF)
open animations/out/token-split.mp4    # vídeo derivado
```
Para regerar `out/`: `CHROMIUM_PATH=<chrome-headless-shell> NODE_PATH=<node_modules com playwright> node animations/render.mjs`. Precisa de ffmpeg no PATH. Usei o Playwright 1.61 do cache do npx e o Chromium 1243 do cache do ms-playwright, sem instalar nada no projeto.

**Dependências de sistema:** ffmpeg (já instalado, Homebrew), LaTeX (MacTeX presente, mas desnecessário: `Text` usa Pango, e a 0.21 tem Typst para fórmulas), cairo/pkg-config (presentes). Nada foi instalado globalmente. A venv `animations/.venv` (Python 3.13, `manim==0.21.0`) fica no `.gitignore`, junto com `animations/media/` e as fontes baixadas para o Manim (`animations/_comparativo-manim/fonts/`).

## 5. Pontos em aberto

- **"5 palavras, 9 tokens" no protótipo** (slide do ticket 02): a frase tem **6** palavras (contando o "3"). A PoC calcula sozinha e mostra "6 palavras → 9 tokens". Corrigir o slide e o texto do E1.
- **A divisão em tokens é ilustrativa.** Cada modelo tem o próprio tokenizer. Antes de publicar, conferir num tokenizer real (ou manter a legenda "a divisão é ilustrativa", como na demo) e alinhar com o ticket 06 (fatos).
- Portar para `src/components/anim/` com markup SSR (ticket de construção do E1). Com isso, o `<figcaption>` e o estado final funcionam sem JS.
- Etapas por fragment no reveal (ex.: 1º clique separa, 2º circula): dá para fazer expondo `seek(ms)`/marcadores. Não entrou na PoC.
- QA cross-browser (Safari/Firefox). `Element.animate` com `strokeDashoffset` e `composite` padrão é suportado nos três, mas só testei Chromium.
- Se surgir uma animação que precise de morph matemático: decidir entre GSAP MorphSVG (web) e Manim (vídeo), caso a caso.

## Fontes

[m-pypi]: https://pypi.org/project/manim/
[m-cl]: https://docs.manim.community/en/stable/changelog/0.21.0-changelog.html
[m-text]: https://docs.manim.community/en/stable/reference/manim.mobject.text.text_mobject.Text.html
[m-uv]: https://docs.manim.community/en/stable/installation/uv.html
[mc-docs]: https://motioncanvas.io/docs/
[mc-render]: https://motioncanvas.io/docs/rendering
[mc-npm]: https://www.npmjs.com/package/@motion-canvas/core
[mc-gh]: https://github.com/motion-canvas/motion-canvas
[rv-gh]: https://github.com/redotvideo/revideo
[rem]: https://www.remotion.dev/docs/license/faq
[gsap-p]: https://gsap.com/pricing/
[gsap-npm]: https://www.npmjs.com/package/gsap
[gsap-draw]: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/
[rv-aa]: https://revealjs.com/auto-animate/
[rv-fr]: https://revealjs.com/fragments/
[rv-pdf]: https://revealjs.com/pdf-export/

- Manim CE 0.21.0: [PyPI][m-pypi] · [changelog 0.21.0][m-cl] · [Text/Pango, `register_font`][m-text] · [instalação via uv (cairo, pkg-config; LaTeX opcional)][m-uv]
- Motion Canvas: [docs][mc-docs] · [rendering (sequência de imagens + ffmpeg)][mc-render] · [npm][mc-npm] · [GitHub][mc-gh]
- Revideo: [GitHub][rv-gh] · Remotion: [License FAQ][rem]
- GSAP: [pricing: 100% grátis, com plugins][gsap-p] · [npm 3.15.0][gsap-npm] · [DrawSVG][gsap-draw]
- reveal.js 6.0.2: [Auto-Animate][rv-aa] · [Fragments/eventos][rv-fr] · [PDF export / `pdfSeparateFragments`][rv-pdf]
