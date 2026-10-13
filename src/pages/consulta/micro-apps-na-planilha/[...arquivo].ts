// Serve as fontes do Tijolinho (pasta tijolinho/ na raiz do repositório) como arquivos de texto,
// para um assistente de IA ler por link: AGENTS.md, passos/*.md, codigo/*, erros.md, glossario.md.
// As páginas do site importam os mesmos arquivos: uma fonte só.
import type { APIRoute, GetStaticPaths } from 'astro';

const files = import.meta.glob(['/tijolinho/*.md', '/tijolinho/passos/*.md', '/tijolinho/codigo/*'], {
	query: '?raw',
	import: 'default',
	eager: true,
}) as Record<string, string>;

const TYPES: Record<string, string> = {
	md: 'text/markdown; charset=utf-8',
	gs: 'text/plain; charset=utf-8',
	json: 'application/json; charset=utf-8',
	html: 'text/plain; charset=utf-8',
};

export const getStaticPaths = (() =>
	Object.entries(files).map(([path, body]) => ({
		params: { arquivo: path.replace('/tijolinho/', '') },
		props: { body },
	}))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params, props }) => {
	const ext = String(params.arquivo).split('.').pop() ?? '';
	return new Response(props.body as string, { headers: { 'Content-Type': TYPES[ext] ?? 'text/plain; charset=utf-8' } });
};
