import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/** Um item de lista: texto simples, ou título + texto (cartões, números, encontros). */
const item = z.union([z.string(), z.object({ title: z.string(), text: z.string().optional() })]);

/** Um slide = um arquivo .md em src/content/slides/<encontro>/. Formato em src/content/slides/LEIA-ME.md. */
const slides = defineCollection({
	loader: glob({ pattern: '**/[0-9]*.md', base: './src/content/slides' }),
	schema: ({ image }) =>
		z.object({
			layout: z
				.enum(['title', 'bio', 'big', 'thesis', 'section', 'list', 'flow', 'cards', 'five', 'arc', 'numbers', 'photo', 'visual', 'demo', 'end'])
				.default('big'),
			title: z.string(),
			circle: z.string().optional(),
			kicker: z.string().optional(),
			items: z.array(item).optional(),
			fragments: z.boolean().default(false),
			caveat: z.string().optional(),
			cite: z.string().optional(),
			image: image().optional(),
			alt: z.string().optional(),
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
