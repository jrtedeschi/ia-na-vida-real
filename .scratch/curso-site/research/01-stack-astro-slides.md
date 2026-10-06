# Research 01: Astro + Starlight no GitHub Pages, e slides com o mesmo design system

Data: 2026-10-06. Fontes primárias (docs oficiais, código-fonte, registro npm). Versões conferidas com `npm view` nesta data.

## TL;DR

- **Stack**: Astro **7.3.x** + `@astrojs/starlight` **0.42.x** (peer `astro ^7.2.10`), Node **>= 22.12**. Deploy pelo workflow oficial `withastro/action@v6` + `actions/deploy-pages@v5`, com `site: 'https://jrtedeschi.github.io'` e `base: '/ia-na-vida-real'`.
- **Pegadinha principal**: o `base` **não** é adicionado a links escritos em Markdown/MDX. Use o plugin comunitário `starlight-base-path` ou um helper `withBase()`.
- **Rebrand**: sobrescreva as variáveis `--sl-*` em CSS **sem layer** via `customCss`. Os estilos do Starlight ficam em `@layer starlight.*`, então CSS sem layer sempre ganha. O tema escuro é o padrão em `:root`, e o claro fica em `:root[data-theme='light']`. Para mudanças estruturais, use `components` overrides.
- **Slides (recomendação)**: **reveal.js 6 dentro de uma página Astro própria** (`src/pages/aulas/[slug]/slides.astro`), fora do layout do Starlight, importando os mesmos tokens CSS. Assim você ganha modo apresentador, PDF, fragments e teclado prontos, num só build e num só deploy. Slidev fica descartado: é um segundo build Vue com UnoCSS, tem tokens duplicados e o routing de SPA complica num subpath. O layout Astro feito à mão fica como plano B se você quiser zero dependência.
- **Interatividade**: use componentes `.astro` com `<script>` nativo (custom elements) em vez de islands de framework. Isso dá cerca de 1-2 KB de JS por componente e nenhum runtime. O `<Code>` e os blocos de código do Starlight já têm botão de copiar (Expressive Code).

---

## 1. Setup Astro + Starlight no GitHub Pages em subpath

### Versões atuais (npm, 2026-10-06)
| pacote | versão | nota |
|---|---|---|
| `astro` | 7.3.6 | Astro 7.0 saiu em 2026-06-22: compilador em Rust, Vite 8/Rolldown, pipeline MD/MDX em Rust (Sätteri) [blog][a7] |
| `@astrojs/starlight` | 0.42.5 | peer `astro ^7.2.10` |
| `@astrojs/mdx` | 8.0.3 | o Starlight já inclui MDX |
| `@astrojs/starlight-tailwind` | 5.0.0 | opcional |
| Node | >= 22.12.0 | `engines` do astro |

Para criar o projeto: `npm create astro@latest -- --template starlight`.

### Config
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://jrtedeschi.github.io',
  base: '/ia-na-vida-real',
  trailingSlash: 'always', // opcional, mas torna BASE_URL previsível ("/ia-na-vida-real/")
  integrations: [starlight({
    title: 'IA na Vida Real',
    defaultLocale: 'root',
    locales: { root: { label: 'Português', lang: 'pt-BR' } },
    customCss: ['./src/styles/tokens.css', './src/styles/starlight-theme.css'],
  })],
});
```
- O `site` e o `base` são exigidos para repositórios de projeto (que não sejam `<user>.github.io`) [Astro GH Pages][gh].
- `base`: "all of your static asset imports and URLs should add the base as a prefix. You can access this value via `import.meta.env.BASE_URL`". A barra final em `BASE_URL` depende de `trailingSlash`, não do valor de `base` [config ref][cfg].

### Workflow oficial (`.github/workflows/deploy.yml`) [fonte: withastro/docs, github.mdx][ghsrc]
```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [ main ] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6   # node-version padrão 24; detecta o package manager pelo lockfile
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.deployment.outputs.page_url }}' }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```
Depois, em Settings → Pages → Source, escolha **GitHub Actions** [gh].

### Pegadinhas
1. **Links no conteúdo não recebem o `base`.** O Starlight só prefixa o que ele controla (sidebar etc.). O mantenedor confirma que isso é intencional, porque há sites que linkam para fora do base [discussão #3660][d3660], [#966][d966]. Opções:
   - plugin comunitário **`starlight-base-path`** (listado na página de plugins do Starlight): reescreve links root-relative no MD/MDX e no frontmatter (`hero.actions`) [repo][sbp], [plugins][plugins];
   - helper `withBase(path)` em componentes `.astro`;
   - escrever links relativos (`../aula-02/`), que funcionam mas são frágeis.
2. **Assets em `public/`** referenciados à mão (por exemplo, `<img src="/og.png">`) também precisam do prefixo. Prefira `import` de `src/assets` (o Astro resolve) ou `${import.meta.env.BASE_URL}og.png`.
3. **Commite o lockfile**: a action depende dele para detectar o package manager [gh].
4. **O Astro 7 é mais estrito com HTML inválido** e mudou o padrão de `compressHTML` para `'jsx'` [upgrade v7][up7]. Isso importa se você copiar snippets antigos.
5. **Domínio próprio no futuro**: adicione `public/CNAME`, troque `site` e **remova `base`** [gh]. Com `starlight-base-path` ou `withBase`, isso vira uma mudança de uma linha só.

## 2. Customização profunda do tema Starlight sem brigar com ele

Como funciona por dentro: `props.css` declara todas as variáveis dentro de `@layer starlight.base`. O tema **escuro é o padrão** em `:root`, e o **claro** sobrescreve em `:root[data-theme='light']` [props.css][props]. A doc confirma: "unlayered CSS will override the default Starlight styles" [CSS guide][css].

Estratégia em 3 camadas:
1. **Tokens da marca** (`src/styles/tokens.css`): variáveis próprias (`--brand-*`, `--font-display`, `--space-*`), sem nada de Starlight. **Este arquivo é a fonte única de verdade, compartilhada com os slides.**
2. **Mapeamento para o Starlight** (`starlight-theme.css`, sem layer):
   ```css
   :root {            /* escuro (padrão do Starlight) */
     --sl-font: var(--font-body);
     --sl-font-mono: var(--font-mono);
     --sl-color-accent-low: var(--brand-accent-900);
     --sl-color-accent: var(--brand-accent-500);
     --sl-color-accent-high: var(--brand-accent-200);
     --sl-color-white: ...; --sl-color-gray-1..6: ...; --sl-color-black: ...;
   }
   :root[data-theme='light'] { /* versão clara */ }
   ```
   O [editor de cores interativo][css] da página de CSS exporta esse bloco já pronto, com checagem de contraste WCAG.
3. **Overrides de componentes** para as mudanças estruturais (header, footer, `PageTitle`, `Hero`...), via a opção `components` [overrides][ovr]. O componente recebe `Astro.locals.starlightRoute` e pode reutilizar o componente original por import. Use `class="not-content"` para que a tipografia do Starlight não afete os seus componentes [components][comp].

Fontes: use Fontsource no `customCss` mais `--sl-font` [customization][cust], ou a **Fonts API nativa** do Astro (desde a 6.0, com self-hosting, fallbacks e preload) [Astro 6][a6]. A Fonts API é a melhor opção para ter as mesmas fontes no site e nos slides.

Blocos de código: Expressive Code. A opção `expressiveCode.themes` com `useStarlightDarkModeSwitch` sincroniza com o light/dark [config][slcfg].

Tailwind é opcional (`@astrojs/starlight-tailwind` 5). Ele mapeia `--color-accent-*` e `--color-gray-*` para o Starlight [CSS guide][css]. Para este projeto, CSS puro com tokens basta e evita uma dependência a mais.

A landing pode usar `template: splash` no frontmatter (largura total, sem sidebar) [cust], ou ser uma página `.astro` totalmente própria.

## 3. Slides dentro do mesmo site: comparação

Ponto-chave: páginas em `src/pages/` convivem com o Starlight e podem ter **um layout completamente próprio**, ou reaproveitar o chrome via `<StarlightPage>` [pages][pages]. Isso permite ter `/ia-na-vida-real/aulas/01/slides/` fullscreen no mesmo build.

| Critério | A) Layout Astro próprio (scroll-snap/teclado, feito à mão) | **B) reveal.js 6 em página Astro** | C) Slidev separado | D) `@revealjs/react` |
|---|---|---|---|---|
| Compartilha tokens | Total (mesmo CSS) | Total: importa `tokens.css` e define um tema reveal via variáveis `--r-*` | Fraco: build Vue/UnoCSS próprio, tokens copiados ou empacotados | Total, mas exige React island |
| Mesmo build/deploy | Sim | Sim | Não: segundo `slidev build --base /ia-na-vida-real/slides/aula-01/` por deck, com merge no `dist` [hosting][slh] | Sim |
| Navegação teclado/touch | Você implementa | Pronta (setas, espaço, swipe, overview `Esc`, fragments) | Pronta | Pronta |
| Modo apresentador | Você implementa (BroadcastChannel) | Pronto: tecla `S`, notas `<aside class="notes">`, próximo slide, timer; precisa ser servido por HTTP (o GH Pages serve) [speaker][spk] | O melhor (presenter, desenho, gravação) | Pronto |
| PDF/print | `@media print` próprio (simples, sob controle) | `?print-pdf` + imprimir no Chrome; notas em página separada opcional; só oficial no Chrome/Chromium [pdf][pdf]. Tem também *scroll view* para leitura no celular | CLI com playwright-chromium, PDF/PPTX/PNG [export][sle] | Igual a B |
| Conteúdo em MDX | Sim (content collection) | Sim: `<section>` por slide num componente `.astro`, ou MDX com um componente `<Slide>` | Markdown próprio do Slidev | JSX |
| Peso de JS | ~2-5 KB | reveal.js core (algumas dezenas de KB gz), **só nas páginas de slides** | SPA Vue inteira | React + reveal |
| Esforço | Alto para chegar ao nível do B (presenter, fragments, PDF) | **Baixo/médio** | Médio, com fricção contínua de duas toolchains | Médio, e React sem outro uso no site |
| Risco | Baixo | Baixo: projeto maduro; v6 (6.0.2, 2026-09-10) com tipos TS embutidos, build Vite, ESM `.mjs`; Node >= 22.12 | Médio (subpath + SPA no GH Pages; major versions frequentes, v53) | Pacote novo |

Fontes: [reveal install][rvi], [reveal releases][rvr], npm.

### Recomendação: **B, reveal.js 6 numa página Astro sem o layout do Starlight**

Esqueleto:
```
src/
  styles/tokens.css               # fonte única
  styles/reveal-theme.css         # mapeia tokens -> --r-background-color, --r-main-font, --r-heading-font, --r-link-color...
  content/slides/aula-01.mdx      # ou .astro com <section>s
  pages/aulas/[slug]/slides.astro # layout fullscreen; <script> importa reveal.js + RevealNotes
```
```astro
<script>
  import Reveal from 'reveal.js';
  import Notes from 'reveal.js/plugin/notes';
  import 'reveal.js/reveal.css';
  new Reveal({ hash: true, plugins: [Notes] }).initialize();
</script>
```
(No v6 os paths de CSS/plugins mudaram, sem `dist/` no CSS via npm. Confira os imports exatos no [installation][rvi] na hora de implementar.)

Por que B:
- Os tokens vêm da mesma fonte que o Starlight usa. Light/dark pode seguir `data-theme` e/ou `prefers-color-scheme`.
- Presenter, fragments, overview, PDF e scroll view são features prontas, que você não precisa manter. Isso importa para um curso com uma aula por deck.
- Um build e um deploy, sem os problemas de `--base`/SPA do Slidev.
- O JS do reveal só carrega nas rotas de slides. As páginas de exercício continuam leves.

Trade-offs aceitos: o tema do reveal precisa de um arquivo de mapeamento (`--r-*`). O PDF fica bom só no Chrome. Animações ricas e live-coding são mais fracas que no Slidev. Os slides não usam o chrome do Starlight (isso é intencional para o fullscreen; um link "voltar para a aula" resolve).

Quando escolher outra opção:
- **A**, se os slides forem basicamente cards estáticos sem presenter e você quiser zero dependência. Dá para migrar de A para B depois, porque o conteúdo continua em `<section>`.
- **C**, só se você passar a querer desenho ao vivo, gravação, export PPTX editável ou componentes Vue nos slides.

## 4. Componentes interativos em MDX (checklist com localStorage, copiar prompt)

- **Não precisa de framework.** O Astro processa `<script>` em `.astro`: bundling, TypeScript, `type="module"`, **deduplicação** quando o componente aparece várias vezes e inline de scripts pequenos. O padrão recomendado é usar **custom elements**, com `this.querySelector` e dados via `data-*` [client-side scripts][scripts]. Frameworks enviam o próprio runtime; scripts nativos não [scripts].
- **`<ProgressChecklist id="aula-01">`**: um custom element que lê e grava `localStorage['ianvr:progress:aula-01']`. Envolva os acessos em try/catch (modo privado e storage bloqueado). Para sincronizar entre abas, escute `storage`. Uma página de "meu progresso" pode ler todas as chaves `ianvr:progress:*`.
- **`<CopyPrompt>`**: duas opções.
  1. Usar o `<Code>` embutido do Starlight ou um bloco ```` ```text ````. O **botão de copiar do Expressive Code** já existe, sem JS extra da sua parte [components][comp].
  2. Um componente próprio com `navigator.clipboard.writeText`, feedback "Copiado!" e `aria-live="polite"`, para um card de prompt com visual próprio.
- **Peso**: cada componente custa cerca de 1-2 KB minificado, deduplicado. Islands (`client:visible`) só se justificam se aparecer algo com estado complexo (quiz com várias telas, por exemplo). Nesse caso, Preact ou Svelte são os runtimes mais leves.
- Use `class="not-content"` nos wrappers para que a tipografia do Starlight não afete o componente [comp].
- O Starlight já tem `Steps`, `Tabs`, `Aside`, `Card` e `Badge`, úteis para os roteiros dos exercícios [comp].

## Perguntas em aberto e riscos
- Confirmar no código os imports exatos de CSS/plugin do reveal.js 6 (os paths mudaram no 6.0).
- Ver se `starlight-base-path` já suporta Starlight 0.42 / Astro 7 (é um plugin comunitário). Se não suportar, o fallback é um rehype plugin de cerca de 15 linhas.
- O changelog do Starlight 0.x pode ter breaking changes entre minors: fixe a versão (`~0.42`).

## Fontes
[a7]: https://astro.build/blog/astro-7/
[a6]: https://astro.build/blog/astro-6/
[up7]: https://docs.astro.build/en/guides/upgrade-to/v7/
[gh]: https://docs.astro.build/en/guides/deploy/github/
[ghsrc]: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/deploy/github.mdx
[cfg]: https://docs.astro.build/en/reference/configuration-reference/#base
[scripts]: https://docs.astro.build/en/guides/client-side-scripts/
[css]: https://starlight.astro.build/guides/css-and-tailwind/
[props]: https://github.com/withastro/starlight/blob/main/packages/starlight/src/style/props.css
[ovr]: https://starlight.astro.build/guides/overriding-components/
[cust]: https://starlight.astro.build/guides/customization/
[pages]: https://starlight.astro.build/guides/pages/
[comp]: https://starlight.astro.build/guides/components/
[slcfg]: https://starlight.astro.build/reference/configuration/
[plugins]: https://starlight.astro.build/resources/plugins/
[sbp]: https://github.com/andriygm/starlight-base-path
[d3660]: https://github.com/withastro/starlight/discussions/3660
[d966]: https://github.com/withastro/starlight/discussions/966
[rvi]: https://revealjs.com/installation/
[rvr]: https://github.com/hakimel/reveal.js/releases
[spk]: https://revealjs.com/speaker-view/
[pdf]: https://revealjs.com/pdf-export/
[slh]: https://sli.dev/guide/hosting
[sle]: https://sli.dev/guide/exporting

- Astro 7: https://astro.build/blog/astro-7/
- Astro 6 (Fonts API): https://astro.build/blog/astro-6/
- Upgrade v7: https://docs.astro.build/en/guides/upgrade-to/v7/
- Deploy GitHub Pages: https://docs.astro.build/en/guides/deploy/github/
- Config `base`: https://docs.astro.build/en/reference/configuration-reference/#base
- Client-side scripts: https://docs.astro.build/en/guides/client-side-scripts/
- Starlight CSS & Tailwind: https://starlight.astro.build/guides/css-and-tailwind/
- Starlight props.css: https://github.com/withastro/starlight/blob/main/packages/starlight/src/style/props.css
- Starlight overrides: https://starlight.astro.build/guides/overriding-components/
- Starlight customization: https://starlight.astro.build/guides/customization/
- Starlight custom pages: https://starlight.astro.build/guides/pages/
- Starlight components: https://starlight.astro.build/guides/components/
- Starlight config: https://starlight.astro.build/reference/configuration/
- starlight-base-path: https://github.com/andriygm/starlight-base-path
- Discussão base path: https://github.com/withastro/starlight/discussions/3660
- reveal.js install / speaker view / PDF / releases: https://revealjs.com/installation/ · https://revealjs.com/speaker-view/ · https://revealjs.com/pdf-export/ · https://github.com/hakimel/reveal.js/releases
- Slidev hosting / exporting: https://sli.dev/guide/hosting · https://sli.dev/guide/exporting
- Versões: `npm view astro @astrojs/starlight reveal.js @slidev/cli version` (2026-10-06)
