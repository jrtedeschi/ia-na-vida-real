import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/** Um item de lista: texto simples, ou título + texto (cartões, números, encontros), com foto opcional (galeria). */
const item = (image: () => z.ZodTypeAny) =>
	z.union([z.string(), z.object({ title: z.string(), text: z.string().optional(), image: image().optional(), alt: z.string().optional() })]);

/** Um slide = um arquivo .md em src/content/slides/<encontro>/. Formato em src/content/slides/LEIA-ME.md. */
const slides = defineCollection({
	loader: glob({ pattern: '**/[0-9]*.md', base: './src/content/slides' }),
	schema: ({ image }) =>
		z.object({
			layout: z
				.enum(['title', 'bio', 'big', 'thesis', 'section', 'list', 'flow', 'cards', 'five', 'arc', 'numbers', 'photo', 'visual', 'demo', 'end', 'roteiro', 'ponte', 'gallery'])
				.default('big'),
			title: z.string(),
			circle: z.string().optional(),
			chapter: z.number().int().positive().optional(),
			kicker: z.string().optional(),
			items: z.array(item(image)).optional(),
			fragments: z.boolean().default(false),
			caveat: z.string().optional(),
			cite: z.string().optional(),
			// logo ao lado da citação: caminho em public/ (ex.: /img/glean-wordmark.svg), pintado na cor do texto
			citeLogo: z.string().optional(),
			// foto redonda de quem disse a citação: caminho em public/ (ex.: /img/arvind-jain.jpg)
			citePhoto: z.string().optional(),
			image: image().optional(),
			alt: z.string().optional(),
			// ferramentas citadas no slide: logo (em public/, pintado na cor do texto), nome e link que abre em outra aba
			tools: z.array(z.object({ name: z.string(), logo: z.string(), href: z.string().url() })).optional(),
			visual: z.string().optional(),
			visualProps: z.record(z.string(), z.unknown()).optional(),
			prompt: z
				.object({ contexto: z.string(), objetivo: z.string(), referencias: z.string(), restricoes: z.string(), formato: z.string() })
				.optional(),
			class: z.string().optional(),
			hidden: z.boolean().default(false),
			notes: z.string().optional(),
		}),
});

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	slides,
};
