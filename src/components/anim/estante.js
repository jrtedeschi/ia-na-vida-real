// <ivr-estante>: uma estante de trechos (ou de fontes) ao lado da janela. Cada passo é uma cena descrita em dados:
// a pergunta, os trechos que acendem, os que são copiados para a janela e a resposta, com a etiqueta de onde veio.
// Serve ao slide da busca do RAG.
// Atributos: `items` (JSON [{ id, tag, title, text }]), `scenes` (JSON [Cena]), `shelf` (rótulo da estante),
// `lead` (opcional: uma frase no topo, por exemplo a definição do que a cena mostra).
// Cena: { label?, ask?, lit?: [id], pull?: [id], answer?, cites?: [id], note? } — cada cena é completa, não um delta.

import { el, relRect } from './anim-base.js';
import { IvrStepped, flipFrom, TRAVEL_MS } from './stepped.js';
import { msg } from './memoria.js';

const PULL_GAP = 160;
const same = (a = [], b = []) => a.length === b.length && a.every((x, i) => x === b[i]);

function itemCard(item, cls) {
	const card = el('div', cls);
	card.dataset.id = item.id;
	const head = el('p', 'es-head');
	head.append(el('span', 'es-tag', item.tag), el('b', null, item.title));
	card.append(head);
	if (item.text) card.append(el('p', 'es-text', item.text));
	return card;
}

export class IvrEstante extends IvrStepped {
	get steps() {
		return this.parts?.scenes.length ?? JSON.parse(this.getAttribute('scenes') ?? '[]').length;
	}

	build(stage) {
		const items = JSON.parse(this.getAttribute('items') ?? '[]');
		const scenes = JSON.parse(this.getAttribute('scenes') ?? '[{}]');
		stage.classList.add('es-stage');

		const shelf = el('div', 'es-shelf');
		shelf.append(el('span', 'nj-label', this.getAttribute('shelf') ?? ''));
		const cards = new Map(items.map((item) => [item.id, itemCard(item, 'es-item')]));
		shelf.append(...cards.values());

		const win = el('div', 'nj-win es-win');
		const label = el('span', 'nj-label', 'janela');
		const body = el('div', 'es-body');
		const note = el('span', 'ivr-anim-note nj-note es-note');
		win.append(label, body, note);
		const lead = this.getAttribute('lead');
		if (lead) stage.append(el('p', 'es-lead', lead));
		stage.append(shelf, win);
		return { items, scenes, cards, label, body, note, cur: {} };
	}

	render(step) {
		const { items, scenes, cards, label, body, note } = this.parts;
		const scene = scenes[step] ?? {};
		const lit = scene.lit ?? [];
		cards.forEach((card, id) => {
			card.classList.toggle('es-lit', lit.includes(id));
			card.classList.toggle('es-dim', lit.length > 0 && !lit.includes(id));
		});
		label.textContent = scene.label ?? 'janela';
		note.textContent = scene.note ?? '';
		const byId = new Map(items.map((item) => [item.id, item]));
		const ask = scene.ask ? msg('voce', scene.ask) : null;
		const copies = new Map((scene.pull ?? []).map((id) => [id, itemCard(byId.get(id), 'es-item es-copy')]));
		let answer = null;
		if (scene.answer) {
			answer = msg('ia', scene.answer);
			for (const id of scene.cites ?? []) answer.append(el('span', 'es-tag es-cite', byId.get(id)?.tag ?? id));
		}
		body.replaceChildren(...[ask, ...copies.values(), answer].filter(Boolean));
		this.parts.cur = { ask, copies, answer };
	}

	measure() {
		const { cards, stage } = this.parts;
		return new Map([...cards].map(([id, card]) => [id, relRect(card, stage)]));
	}

	travel(from, to, shelfRects) {
		const { scenes, stage, note } = this.parts;
		const { ask, copies, answer } = this.parts.cur;
		const prev = scenes[from] ?? {};
		const next = scenes[to] ?? {};
		const newAsk = next.ask !== prev.ask;
		const rise = [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }];
		const specs = [];
		let t = 0;
		if (ask && newAsk) {
			specs.push([ask, rise, { duration: 400 }]);
			t = 450;
		}
		// Só voa o que é novo nesta cena: o resto já estava na janela.
		const pulled = newAsk ? [] : prev.pull ?? [];
		let k = 0;
		copies.forEach((copy, id) => {
			if (pulled.includes(id)) return;
			specs.push([copy, flipFrom(copy, shelfRects.get(id), stage), { delay: t + k++ * PULL_GAP }]);
		});
		if (k) t += TRAVEL_MS + (k - 1) * PULL_GAP;
		if (answer && (newAsk || next.answer !== prev.answer || !same(next.cites, prev.cites))) {
			specs.push([answer, rise, { duration: 400, delay: t + 150 }]);
			t += 550;
		}
		if (next.note && next.note !== prev.note) specs.push([note, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: t }]);
		return specs;
	}

	ariaSummary() {
		return `Animação em passos: ${this.getAttribute('shelf') ?? 'uma estante de trechos'} ao lado da janela de contexto. A pergunta acende os trechos mais parecidos, eles entram na janela, e a resposta diz de onde veio.`;
	}

	transcript() {
		const { items, scenes } = this.parts;
		const byId = new Map(items.map((item) => [item.id, item]));
		const name = (id) => `${byId.get(id)?.tag} ${byId.get(id)?.title}`;
		return (
			'Transcrição: ' +
			scenes
				.filter((s) => s.ask || s.answer)
				.map((s) => [s.ask && `Você: ${s.ask}`, s.pull?.length && `Entram na janela: ${s.pull.map(name).join(', ')}`, s.answer && `IA: ${s.answer} (${(s.cites ?? []).map(name).join(', ')})`].filter(Boolean).join(' / '))
				.join(' · ')
		);
	}
}

if (!customElements.get('ivr-estante')) customElements.define('ivr-estante', IvrEstante);
