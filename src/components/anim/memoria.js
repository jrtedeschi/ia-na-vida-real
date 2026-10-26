// <ivr-memoria>: a memória é um caderninho fora da conversa; uma cópia dele entra em toda conversa nova.
// Atributos: `memory` (JSON [linha, ...]), `ask`, `answer`, `mark` (JSON [palavra na memória, palavra na resposta]).
// Passos: 0 caderninho e conversa vazia · 1 a cópia viaja para a janela · 2 pedido e resposta, causa e efeito marcados
// · 3 conversa de amanhã: vazia de novo, e a cópia volta.

import { el, relRect } from './anim-base.js';
import { IvrStepped, flipFrom, TRAVEL_MS } from './stepped.js';

/** Texto com a palavra `word` dentro de um <mark> (a ligação entre memória e resposta). */
export function withMark(tag, cls, text, word) {
	const node = el(tag, cls);
	const at = word ? text.indexOf(word) : -1;
	if (at < 0) {
		node.textContent = text;
		return node;
	}
	node.append(text.slice(0, at), el('mark', null, word), text.slice(at + word.length));
	return node;
}

export function msg(who, text, word) {
	const m = el('p', `nj-msg nj-${who}`);
	m.append(el('small', null, who === 'ia' ? 'IA' : 'Você'), withMark('span', null, text, word));
	return m;
}

export class IvrMemoria extends IvrStepped {
	get steps() {
		return 4;
	}

	build(stage) {
		const memory = JSON.parse(this.getAttribute('memory') ?? '[]');
		const [memWord, answerWord] = JSON.parse(this.getAttribute('mark') ?? '[]');
		const ask = this.getAttribute('ask') ?? '';
		const answer = this.getAttribute('answer') ?? '';
		stage.classList.add('nj-mem');

		const book = el('div', 'nj-book');
		book.append(el('span', 'nj-label', 'memória do app'));
		const bookLines = el('ul');
		memory.forEach((line) => bookLines.append(withMark('li', null, line, memWord)));
		book.append(bookLines);

		const win = el('div', 'nj-win');
		const label = el('span', 'nj-label');
		label.append(el('span', 'nj-today', 'conversa de hoje'), el('span', 'nj-tomorrow', 'conversa de amanhã'));
		const card = el('div', 'nj-card');
		card.append(el('small', null, 'veio da memória'));
		const cardLines = el('ul');
		memory.forEach((line) => cardLines.append(withMark('li', null, line, memWord)));
		card.append(cardLines);
		const askMsg = msg('voce', ask);
		const answerMsg = msg('ia', answer, answerWord);
		const note1 = el('span', 'ivr-anim-note nj-note nj-note-1', 'entra antes do seu pedido');
		const note2 = el('span', 'ivr-anim-note nj-note nj-note-2', 'e volta em toda conversa nova');
		win.append(label, card, askMsg, answerMsg, note1, note2);

		stage.append(book, win);
		return { memory, ask, answer, bookLines, win, card, askMsg, answerMsg, note1, note2 };
	}

	measure() {
		return { book: relRect(this.parts.bookLines, this.parts.stage) };
	}

	travel(_from, to, { book }) {
		const { stage, card, askMsg, answerMsg, note1, note2, win } = this.parts;
		const rise = [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }];
		const fadeIn = [{ opacity: 0 }, { opacity: 1 }];
		if (to === 1) {
			return [
				[card, flipFrom(card, book, stage)],
				[note1, fadeIn, { duration: 400, delay: TRAVEL_MS }],
			];
		}
		if (to === 2) {
			return [
				[askMsg, rise, { duration: 400 }],
				[answerMsg, rise, { duration: 400, delay: 700 }],
			];
		}
		// Amanhã: a janela esvazia, a cópia some e viaja de novo a partir do caderninho.
		const [start, end] = flipFrom(card, book, stage);
		return [
			[win, [{ opacity: 1 }, { opacity: 0.35, offset: 0.4 }, { opacity: 1 }], { duration: 500 }],
			[card, [{ opacity: 0, offset: 0 }, { ...start, offset: 0.35 }, { ...end, offset: 1 }], { duration: TRAVEL_MS + 400 }],
			[note2, fadeIn, { duration: 400, delay: TRAVEL_MS + 400 }],
		];
	}

	ariaSummary() {
		return 'Animação em passos: a memória do app é um caderninho fora da conversa. Uma cópia dele entra na janela antes do pedido, a resposta usa essa anotação, e no dia seguinte a cópia entra de novo na conversa nova.';
	}

	transcript() {
		const { memory, ask, answer } = this.parts;
		return `Transcrição: memória do app: ${memory.join('; ')}. A cópia entra na conversa antes do pedido. Você: ${ask} / IA: ${answer} No dia seguinte, a conversa nova recebe a mesma anotação.`;
	}
}

if (!customElements.get('ivr-memoria')) customElements.define('ivr-memoria', IvrMemoria);
