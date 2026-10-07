// <ivr-context-window>: a conversa cresce, a janela tem tamanho fixo, o começo sai de vista.
// Mensagens vêm do atributo `messages` (JSON [["voce"|"ia", texto], ...]).
// A última pergunta testa a memória; a mensagem `lost` (índice) é circulada como "saiu da janela".

import { roughEllipse } from './ink.js';
import { IvrAnim, el, svgEl, relRect, drawSpec } from './anim-base.js';

const MSG_EVERY = 900;
const MSG_IN = 380;

export class IvrContextWindow extends IvrAnim {
	build(frame) {
		const messages = JSON.parse(this.getAttribute('messages') ?? '[]');
		const lost = Number(this.getAttribute('lost') ?? 0);
		const noteText = this.getAttribute('note') ?? 'saiu da janela';

		const stage = el('div', 'cw-stage');
		const outside = el('div', 'cw-outside');
		outside.append(el('span', 'cw-zone-label', 'fora da janela: a IA não vê mais'));
		const win = el('div', 'cw-window');
		win.append(el('span', 'cw-zone-label', 'janela de contexto: o que a IA enxerga'));
		const column = el('div', 'cw-column');
		const items = messages.map(([who, text]) => {
			const m = el('p', `cw-msg cw-${who}`);
			m.append(el('small', null, who === 'ia' ? 'IA' : 'Você'), el('span', null, text));
			column.append(m);
			return m;
		});
		const ink = svgEl('svg', 'ivr-anim-ink');
		ink.setAttribute('aria-hidden', 'true');
		const circle = svgEl('path');
		ink.append(circle);
		const note = el('span', 'ivr-anim-note cw-note', noteText);
		stage.append(outside, win, column, ink, note);
		frame.append(stage);
		return { messages, lost, stage, win, column, items, circle, note };
	}

	/** Deslocamento da coluna para a mensagem k (inclusive) encostar no fundo da janela. */
	#offsets() {
		const { stage, win, column, items } = this.parts;
		column.style.transform = 'none';
		const winR = relRect(win, stage);
		const colR = relRect(column, stage);
		const pad = 12;
		return items.map((m) => {
			const r = relRect(m, column);
			return winR.y + winR.height - pad - (colR.y + r.y + r.height);
		});
	}

	/** Ajusta a zona "fora da janela" à altura do que saiu dela, para a primeira mensagem ficar visível. */
	#sizeStage() {
		const { stage, win, column } = this.parts;
		column.style.transform = 'none';
		const colH = column.offsetHeight;
		const winInner = win.clientHeight - 24;
		stage.style.setProperty('--cw-out', `${Math.max(colH - winInner + 16, 48)}px`);
	}

	layout() {
		const { stage, win, column, items, lost, circle, note } = this.parts;
		this.#sizeStage();
		const offsets = this.#offsets();
		this.parts.offsets = offsets;
		const final = offsets[offsets.length - 1];
		column.style.transform = `translateY(${final}px)`;
		const winTop = relRect(win, stage).y;
		items.forEach((m) => {
			const r = relRect(m, stage);
			m.classList.toggle('cw-out', r.y + r.height < winTop + 4);
		});
		const target = items[lost];
		if (target) {
			const r = relRect(target, stage);
			circle.setAttribute('d', roughEllipse(r, { seed: 4, pad: 8 }));
			note.style.left = `${Math.min(r.x + r.width * 0.55, stage.offsetWidth - 150)}px`;
			note.style.top = `${r.y + r.height + 4}px`;
		}
	}

	specs() {
		const { stage, win, column, items, offsets, circle, note } = this.parts;
		const n = items.length;
		const total = n * MSG_EVERY + 1600;
		const winTop = relRect(win, stage).y;
		// Coluna: um degrau por mensagem.
		const colFrames = [{ transform: `translateY(${offsets[0]}px)`, offset: 0 }];
		offsets.forEach((y, i) => colFrames.push({ transform: `translateY(${y}px)`, offset: Math.min((i * MSG_EVERY + MSG_IN) / total, 1) }));
		colFrames.push({ transform: `translateY(${offsets[n - 1]}px)`, offset: 1 });
		// Base sem deslocamento para calcular quando cada mensagem cruza o topo da janela.
		column.style.transform = 'none';
		const colY = relRect(column, stage).y;
		const msgSpecs = items.map((m, i) => {
			const r = relRect(m, column);
			const bottom = colY + r.y + r.height;
			const appear = (i * MSG_EVERY) / total;
			const exitStep = offsets.findIndex((y, k) => k >= i && bottom + y < winTop + 4);
			const frames = [
				{ opacity: 0, offset: 0 },
				{ opacity: 0, offset: appear },
				{ opacity: 1, offset: Math.min(appear + MSG_IN / total, 1) },
			];
			if (exitStep >= 0) {
				const t = Math.min((exitStep * MSG_EVERY + MSG_IN) / total, 1);
				frames.push({ opacity: 1, offset: Math.max(t - 0.02, appear + MSG_IN / total) }, { opacity: 0.35, offset: t });
				frames.push({ opacity: 0.35, offset: 1 });
			} else frames.push({ opacity: 1, offset: 1 });
			m.classList.remove('cw-out'); // durante a animação quem manda é o keyframe
			return [m, frames, { duration: total, easing: 'linear' }];
		});
		return [
			[column, colFrames, { duration: total, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }],
			...msgSpecs,
			...drawSpec(circle, n * MSG_EVERY + 200, 700),
			[note, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: n * MSG_EVERY + 800 }],
		];
	}

	ariaSummary() {
		return 'Animação: uma conversa cresce dentro de uma janela de tamanho fixo e as primeiras mensagens saem de vista.';
	}

	transcript() {
		const { messages, lost } = this.parts;
		const lines = messages.map(([w, t]) => `${w === 'ia' ? 'IA' : 'Você'}: ${t}`).join(' / ');
		return `Transcrição: ${lines}. A mensagem "${messages[lost]?.[1] ?? ''}" saiu da janela de contexto, por isso a IA não lembra dela.`;
	}
}

if (!customElements.get('ivr-context-window')) customElements.define('ivr-context-window', IvrContextWindow);
