// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://jrtedeschi.github.io',
	base: '/ia-na-vida-real',
	integrations: [
		starlight({
			title: 'IA na Vida Real',
			description: 'Material de estudo, consulta e exercícios do curso IA na Vida Real.',
			defaultLocale: 'root',
			locales: { root: { label: 'Português', lang: 'pt-BR' } },
			customCss: ['./src/styles/tokens.css', './src/styles/theme.css'],
			head: [
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@700;900&family=Instrument+Sans:wght@400;500;600;700&family=Kalam:wght@700&family=IBM+Plex+Mono:wght@400;500&display=swap',
					},
				},
			],
			sidebar: [],
		}),
	],
});
