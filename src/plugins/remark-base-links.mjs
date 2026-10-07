// Prefixa o `base` do Astro em links absolutos escritos em Markdown/MDX ("/consulta/..." → "/ia-na-vida-real/consulta/...").
// Astro e Starlight não fazem isso sozinhos (ver research/01).
export function remarkBaseLinks({ base }) {
	const prefix = base.replace(/\/$/, '');
	const fix = (url) =>
		typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') && !url.startsWith(`${prefix}/`)
			? `${prefix}${url}`
			: url;
	const walk = (node) => {
		if (node.type === 'link' || node.type === 'definition') node.url = fix(node.url);
		if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
			for (const attr of node.attributes ?? []) {
				if (attr.name === 'href' && typeof attr.value === 'string') attr.value = fix(attr.value);
			}
		}
		node.children?.forEach(walk);
	};
	return () => walk;
}
