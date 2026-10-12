/** Texto curto dos campos do .md: escapa HTML e aceita só **negrito** e *itálico*. */
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

export function inline(text: string): string {
	return text
		.replace(/[&<>"]/g, (c) => ESCAPES[c])
		.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export type Item = string | { title: string; text?: string };

export const itemTitle = (item: Item) => (typeof item === 'string' ? item : item.title);
export const itemText = (item: Item) => (typeof item === 'string' ? undefined : item.text);
