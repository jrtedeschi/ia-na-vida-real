// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { remarkBaseLinks } from './src/plugins/remark-base-links.mjs';

const BASE = '/ia-na-vida-real';

export default defineConfig({
	site: 'https://jrtedeschi.github.io',
	base: BASE,
	markdown: { remarkPlugins: [remarkBaseLinks({ base: BASE })] },
	integrations: [
		starlight({
			title: 'IA na Vida Real',
			description: 'Material de estudo, consulta e exercícios do curso IA na Vida Real.',
			defaultLocale: 'root',
			locales: { root: { label: 'Português', lang: 'pt-BR' } },
			customCss: ['./src/styles/tokens.css', './src/styles/theme.css', './src/styles/components.css'],
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
			sidebar: [
				{ label: 'Comece aqui', link: '/' },
				{
					label: 'Encontro 1 · Como a IA funciona',
					items: [
						{ label: 'Estudo', link: '/encontro-1/' },
						{ label: 'Exercícios', link: '/encontro-1/exercicios/' },
						{ label: 'Slides', link: '/encontro-1/slides/', attrs: { target: '_blank' } },
					],
				},
				{
					label: 'Consulta',
					items: [
						{ label: 'O pedido em 5 partes', link: '/consulta/pedido-em-5-partes/' },
						{ label: 'Conceitos', items: [{ autogenerate: { directory: 'consulta/conceitos' } }] },
						{ label: 'Segurança e privacidade', link: '/consulta/seguranca-e-privacidade/' },
						{ label: 'Fique com o volante', link: '/consulta/fique-com-o-volante/' },
						{ label: 'IA e trabalho', link: '/consulta/ia-e-trabalho/' },
					],
				},
			],
		}),
	],
});
