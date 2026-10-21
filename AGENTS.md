## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Slides

Each slide is one `.md` file in `src/content/slides/encontro-N/`, rendered by `src/components/slides/Slide.astro`. Format and layouts: `src/content/slides/LEIA-ME.md`. Edit slide content there, never in `src/pages/encontro-N/slides.astro`.

Speaker notes, site pages and exercises speak in João's **voice**, for a lay audience: read `~/.claude/voz/voz.md` (classroom vs. written register in `tom.md`) before writing them.

New animation requested for a slide: build the component in `src/components/anim/`, register it in `src/components/slides/visuals.ts`, and set `visual: <name>` on the slide. Screenshot the slide at 1280×720 before calling it done.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
