// <ivr-context-window>: a conversa cresce, a janela tem tamanho fixo, o começo sai de vista.
// Mensagens vêm do atributo `messages` (JSON [["voce"|"ia", texto], ...]).
// A última pergunta testa a memória; a mensagem `lost` (índice) é circulada como "saiu da janela".

import { roughEllipse } from './ink.js';
import { IvrAnim, el, svgEl, relRect, drawSpec } from './anim-base.js';

const MSG_EVERY = 900;
const MSG_IN = 380;
const PAD = 12; // folga entre a última mensagem e o fundo da janela
const OUT_OPACITY = 0.3;

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
		const size = Number(this.getAttribute('window') ?? 4);
		stage.append(outside, win, column, ink, note);
		frame.append(stage);
		return { messages, lost, size, stage, win, column, items, circle, note };
	}

	/** Deslocamento da coluna para a mensagem k (inclusive) encostar no fundo da janela. */
	#offsets() {
		const { stage, win, column, items } = this.parts;
		column.style.transform = 'none';
		const winR = relRect(win, stage);
		const colR = relRect(column, stage);
		return items.map((m) => {
			const r = relRect(m, column);
			return winR.y + winR.height - PAD - (colR.y + r.y + r.height);
		});
	}

	/**
	 * A janela tem a altura exata das últimas `size` mensagens: a borda de cima cai no meio do vão
	 * entre duas mensagens, nunca cortando uma. A zona de fora cabe todas as que saíram.
	 */
	#sizeStage() {
		const { stage, column, items, size } = this.parts;
		column.style.transform = 'none';
		const gap = parseFloat(getComputedStyle(column).rowGap) || 12;
		const inside = items.slice(-size);
		const block = inside.reduce((h, m) => h + m.offsetHeight, 0) + gap * (inside.length - 1);
		const outside = column.offsetHeight - block - gap;
		stage.style.setProperty('--cw-win', `${block + PAD + gap / 2}px`);
		stage.style.setProperty('--cw-out', `${Math.max(outside + gap / 2 + 10, 0)}px`);
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
		items.at(-1)?.classList.add('cw-answer');
		const target = items[lost];
		items.forEach((m) => m.classList.toggle('cw-lost', m === target));
		if (target) {
			const r = relRect(target, stage);
			circle.setAttribute('d', roughEllipse(r, { seed: 4, pad: 12 }));
			// Nota à esquerda do círculo (a mensagem perdida é sua, alinhada à direita).
			note.style.right = `${stage.offsetWidth - r.x + 30}px`;
			note.style.top = `${r.y + r.height / 2 - 12}px`;
		}
	}

	specs() {
		const { stage, win, column, items, offsets, circle, note } = this.parts;
		const n = items.length;
		const total = n * MSG_EVERY + 1600;
		const winTop = relRect(win, stage).y;
		// Coluna: parada entre mensagens; sobe um degrau quando a próxima entra (easing por degrau).
		const at = (ms) => Math.min(ms / total, 1);
		const step = 'cubic-bezier(0.4, 0, 0.2, 1)';
		const colFrames = [{ transform: `translateY(${offsets[0]}px)`, offset: 0, easing: step }];
		offsets.slice(1).forEach((y, k) => {
			const i = k + 1;
			colFrames.push({ transform: `translateY(${offsets[i - 1]}px)`, offset: at(i * MSG_EVERY), easing: step });
			colFrames.push({ transform: `translateY(${y}px)`, offset: at(i * MSG_EVERY + MSG_IN), easing: step });
		});
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
				// A saída nunca antes da entrada terminar (no mesmo degrau, as duas coincidem: sem inversão por arredondamento).
				const shown = frames[2].offset;
				const t = Math.max(Math.min((exitStep * MSG_EVERY + MSG_IN) / total, 1), shown);
				frames.push({ opacity: 1, offset: Math.max(t - 0.02, shown) }, { opacity: OUT_OPACITY, offset: t });
				frames.push({ opacity: OUT_OPACITY, offset: 1 });
			} else frames.push({ opacity: 1, offset: 1 });
			m.classList.remove('cw-out', 'cw-lost'); // durante a animação quem manda é o keyframe; o destaque só no fim
			return [m, frames, { duration: total, easing: 'linear' }];
		});
		// A cada mensagem nova, a borda da janela pisca: a IA relê tudo o que está dentro.
		const pulse = [{ boxShadow: '0 0 0 0 var(--ivr-orange)', offset: 0 }];
		items.forEach((_, i) => {
			const t = i * MSG_EVERY + MSG_IN;
			pulse.push({ boxShadow: '0 0 0 0 var(--ivr-orange)', offset: at(t) });
			pulse.push({ boxShadow: '0 0 0 5px var(--ivr-orange)', offset: at(t + 120) });
			pulse.push({ boxShadow: '0 0 0 0 var(--ivr-orange)', offset: at(t + 520) });
		});
		pulse.push({ boxShadow: '0 0 0 0 var(--ivr-orange)', offset: 1 });
		const answer = items[n - 1];
		answer.classList.remove('cw-answer');
		return [
			[column, colFrames, { duration: total, easing: 'linear' }],
			[win, pulse, { duration: total, easing: 'linear' }],
			[answer, [{ outlineColor: 'transparent' }, { outlineColor: 'var(--ivr-orange)' }], { duration: 400, delay: n * MSG_EVERY + 1000 }],
			...msgSpecs,
			...drawSpec(circle, n * MSG_EVERY + 200, 700),
			[note, [{ opacity: 0, transform: 'rotate(-2deg) translateY(6px)' }, { opacity: 1, transform: 'rotate(-2deg)' }], { duration: 450, delay: n * MSG_EVERY + 800 }],
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
