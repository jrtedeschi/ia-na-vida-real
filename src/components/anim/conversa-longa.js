// <ivr-conversa-longa>: conversa longa demais, resposta pior. Os assuntos se acumulam na mesma janela,
// o que importava sobe e se perde, e a resposta no fim esquece o combinado.
// Atributo `topics` (JSON [{ name, at, messages: [["voce"|"ia", texto], ...] }, ...]): `at` = passo em que o assunto entra.
// `keep` (palavra que importava, no começo), `wrong` (palavra errada na última resposta), `wrong-note` e `lost-note` (os bilhetes).
// Passos: 0 um assunto · 1 outros assuntos na mesma conversa · 2 volta ao primeiro, e a resposta erra.

import { el, relRect } from './anim-base.js';
import { IvrStepped } from './stepped.js';
import { msg } from './memoria.js';

const STAGGER = 140;

export class IvrConversaLonga extends IvrStepped {
	get steps() {
		return 3;
	}

	build(stage) {
		const topics = JSON.parse(this.getAttribute('topics') ?? '[]');
		const keep = this.getAttribute('keep') ?? '';
		const wrong = this.getAttribute('wrong') ?? '';
		stage.classList.add('nj-long');

		const win = el('div', 'nj-win nj-long-win');
		const column = el('div', 'nj-long-col');
		const rows = [];
		topics.forEach(({ name, at, messages }, t) => {
			if (name) {
				const chip = el('span', 'nj-topic', name);
				chip.dataset.at = String(at);
				rows.push(chip);
			}
			messages.forEach(([who, text], i) => {
				const last = t === topics.length - 1 && i === messages.length - 1;
				const m = msg(who, text, last ? wrong : t === 0 ? keep : '');
				m.dataset.at = String(at);
				if (last) m.classList.add('nj-worse');
				if (t === 0 && keep && text.includes(keep)) m.classList.add('nj-keep');
				rows.push(m);
			});
		});
		column.append(...rows);
		const noteWrong = el('span', 'ivr-anim-note nj-note nj-note-wrong', this.getAttribute('wrong-note') ?? '');
		const noteLost = el('span', 'ivr-anim-note nj-note nj-note-lost', this.getAttribute('lost-note') ?? '');
		win.append(column, noteLost, noteWrong);
		stage.append(win);
		return { topics, win, column, rows, noteWrong, noteLost };
	}

	/** Onde cada linha visível estava antes do passo: as que ficam sobem a partir dali (FLIP). */
	measure() {
		const { rows, stage } = this.parts;
		return new Map(rows.filter((r) => r.offsetParent).map((r) => [r, relRect(r, stage)]));
	}

	travel(_from, to, before) {
		const { rows, stage, noteWrong, noteLost } = this.parts;
		const specs = [];
		let fresh = 0;
		rows.forEach((r) => {
			if (!r.offsetParent) return;
			const was = before.get(r);
			if (was) {
				const dy = was.y - relRect(r, stage).y;
				if (Math.abs(dy) > 0.5) specs.push([r, [{ transform: `translateY(${dy}px)` }, { transform: 'none' }]]);
				return;
			}
			specs.push([r, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 250 + fresh++ * STAGGER }]);
		});
		if (to === 2) {
			const t = 250 + fresh * STAGGER + 300;
			specs.push([noteWrong, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: t }]);
			specs.push([noteLost, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: t + 600 }]);
		}
		return specs;
	}

	ariaSummary() {
		return 'Animação em passos: numa conversa só, vários assuntos se acumulam. O que importava no começo sobe e se perde, e quando a pessoa volta ao primeiro assunto a resposta esquece o combinado.';
	}

	transcript() {
		const lines = this.parts.topics.flatMap(({ messages }) => messages.map(([w, t]) => `${w === 'ia' ? 'IA' : 'Você'}: ${t}`));
		return `Transcrição: ${lines.join(' / ')}. A última resposta esqueceu o que foi dito no começo.`;
	}
}

if (!customElements.get('ivr-conversa-longa')) customElements.define('ivr-conversa-longa', IvrConversaLonga);
