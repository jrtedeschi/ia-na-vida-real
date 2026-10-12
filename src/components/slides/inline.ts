/** Texto curto dos campos do .md: escapa HTML e aceita só **negrito**, *itálico* e [links](url). */
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Só http(s), caminhos do site (/...) e âncoras (#...); o resto continua texto. */
function link(label: string, url: string): string {
	if (/^https?:\/\//.test(url)) return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
	if (url.startsWith('/')) return `<a href="${BASE}${url}">${label}</a>`;
	if (url.startsWith('#')) return `<a href="${url}">${label}</a>`;
	return `[${label}](${url})`;
}

export function inline(text: string): string {
	return text
		.replace(/[&<>"]/g, (c) => ESCAPES[c])
		.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, url: string) => link(label, url))
		.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export type Item = string | { title: string; text?: string; image?: ImageMetadata; alt?: string };

export const itemTitle = (item: Item) => (typeof item === 'string' ? item : item.title);
export const itemText = (item: Item) => (typeof item === 'string' ? undefined : item.text);
