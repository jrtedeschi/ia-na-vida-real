// <ivr-transformer>: por dentro do modelo, em quatro passos e sem matemática.
// 1 tokens → 2 cada um vira uma lista de números → 3 atenção (barras: quanto o último token
// presta atenção em cada anterior, repetido em várias camadas) → 4 a chance de cada token vir em seguida; o escolhido volta para a fila.
//
// Atributos:
//   tokens     JSON ["O", " café", ...]
//   attention  JSON [0.05, 0.4, ...]  peso do último token sobre cada anterior (ilustrativo)
//   bets       JSON [["pão", 41], ...] (a primeira é a escolhida)
//   note       anotação à mão no fim
//   trigger    "visible" (padrão) | "manual"

import { roughEllipse, roughArrow, seeded } from './ink.js';
import { IvrAnim, el, svgEl, relRect, drawSpec } from './anim-base.js';

const CELLS = 8;
const T = { tokens: 0, numbers: 1300, attention: 2700, bets: 4300, pick: 5400, loop: 6000, chip: 6700, note: 7000 };
const HEADS = ['1 · tokens', '2 · números', '3 · peso de cada palavra', '4 · chance de vir em seguida'];

export class IvrTransformer extends IvrAnim {
	build(frame) {
		const tokens = JSON.parse(this.getAttribute('tokens') ?? '[]');
		const attention = JSON.parse(this.getAttribute('attention') ?? '[]');
		const bets = JSON.parse(this.getAttribute('bets') ?? '[]');
		const noteText = this.getAttribute('note') ?? '';
		const rand = seeded(21);

		const stage = el('div', 'tf-stage');
		const heads = HEADS.map((h, i) => {
			const head = el('span', `tf-head tf-c${i + 1}`, h);
			stage.append(head);
			return head;
		});
		const rows = tokens.map((t, i) => {
			const chip = el('span', 'tf-chip', t.trim());
			chip.style.gridRow = String(i + 2);
			const vec = el('span', 'tf-vec');
			vec.style.gridRow = String(i + 2);
			const cells = Array.from({ length: CELLS }, () => {
				const c = el('i');
				c.style.opacity = (0.2 + rand() * 0.8).toFixed(2);
				vec.append(c);
				return c;
			});
			stage.append(chip, vec);
			return { chip, vec, cells };
		});
		const layers = el('div', 'tf-layers');
		layers.append(el('span'), el('span'), el('span'), el('b', 'tf-layers-tag', 'refeito em dezenas de camadas'));
		// Atenção: quanto o último token presta atenção em cada um dos anteriores (barra por linha).
		const maxW = Math.max(...attention);
		const att = attention.map((w, i) => {
			const cell = el('span', w === maxW || w >= maxW * 0.6 ? 'tf-att tf-att-hi' : 'tf-att');
			cell.style.gridRow = String(i + 2);
			const bar = el('i');
			bar.style.width = `${Math.max(4, (w / maxW) * 100)}%`;
			cell.append(bar);
			return { cell, bar };
		});
		const last = tokens.at(-1)?.trim() ?? '';
		const top = attention
			.map((w, i) => [w, tokens[i].trim()])
			.sort((a, b) => b[0] - a[0])
			.slice(0, 3)
			.map(([, t]) => t);
		const attNote = el('span', 'tf-att-note', `${top.slice(0, -1).join(', ')} e ${top.at(-1)} pesam mais`);
		attNote.style.gridRow = String(tokens.length + 1);
		const betBox = el('div', 'tf-bets');
		const betRows = bets.map(([word, pct], i) => {
			const row = el('div', 'tf-bet');
			const w = el('span', 'tf-bet-word', word);
			const track = el('span', 'tf-track');
			const fill = el('i', i === 0 ? 'tf-fill tf-pick' : 'tf-fill');
			fill.style.width = `${pct}%`;
			track.append(fill);
			row.append(w, track, el('span', 'tf-pct', `${pct}%`));
			betBox.append(row);
			return { row, w, fill };
		});
		const span = `2 / ${tokens.length + 2}`;
		layers.style.gridRow = span;
		betBox.style.gridRow = span;
		const newChip = el('span', 'tf-chip tf-new', bets[0]?.[0] ?? '');
		newChip.style.gridRow = String(tokens.length + 2);
		stage.append(layers, ...att.map((a) => a.cell), attNote, betBox, newChip);

		const ink = svgEl('svg', 'ivr-anim-ink tf-ink');
		ink.setAttribute('aria-hidden', 'true');
		const toBets = svgEl('path', 'tf-flow');
		const toBetsHead = svgEl('path', 'tf-flow');
		const circle = svgEl('path', 'tf-circle');
		const loop = svgEl('path', 'tf-loop');
		const loopHead = svgEl('path', 'tf-loop');
		ink.append(toBets, toBetsHead, circle, loop, loopHead);
		const note = el('span', 'ivr-anim-note tf-note', noteText);
		stage.append(ink, note);
		frame.append(stage);
		return { tokens, attention, bets, stage, heads, rows, layers, att, attNote, betBox, betRows, newChip, toBets, toBetsHead, circle, loop, loopHead, note };
	}

	layout() {
		const p = this.parts;
		const { stage, layers, betBox, betRows, newChip } = p;
		const L = relRect(layers, stage);
		const B = relRect(betBox, stage);
		const flow = roughArrow([L.x + L.width + 6, L.y + L.height / 2], [B.x - 10, B.y + B.height / 2], { bend: 0, head: 9 });
		p.toBets.setAttribute('d', flow.shaft);
		p.toBetsHead.setAttribute('d', flow.head);
		const pick = relRect(betRows[0].w, stage);
		p.circle.setAttribute('d', roughEllipse(pick, { seed: 9, pad: 9 }));
		const N = relRect(newChip, stage);
		const loop = roughArrow([pick.x + pick.width / 2, B.y + B.height + 14], [N.x + N.width + 10, N.y + N.height / 2], { bend: -0.25, head: 10 });
		p.loop.setAttribute('d', loop.shaft);
		p.loopHead.setAttribute('d', loop.head);
		p.note.style.left = `${N.x + N.width + 36}px`;
		p.note.style.top = `${N.y + N.height + 4}px`;
	}

	specs() {
		const p = this.parts;
		const fade = [{ opacity: 0 }, { opacity: 1 }];
		const rise = [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }];
		const headAt = [T.tokens, T.numbers, T.attention, T.bets];
		return [
			...p.heads.map((h, i) => [h, fade, { duration: 400, delay: headAt[i] }]),
			...p.rows.flatMap(({ chip, cells }, i) => [
				[chip, rise, { duration: 400, delay: T.tokens + 150 + i * 120 }],
				...cells.map((c, j) => [c, [{ transform: 'scaleY(0)' }, { transform: 'none' }], { duration: 300, delay: T.numbers + 150 + i * 90 + j * 25 }]),
			]),
			[p.layers, fade, { duration: 500, delay: T.attention }],
			...p.att.map(({ bar }, i) => [bar, [{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 450, delay: T.attention + 300 + i * 160 }]),
			[p.attNote, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: T.attention + 1200 }],
			...drawSpec(p.toBets, T.bets - 300, 400),
			...drawSpec(p.toBetsHead, T.bets + 50, 150),
			[p.betBox, fade, { duration: 300, delay: T.bets }],
			...p.betRows.map(({ fill }, i) => [fill, [{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 420, delay: T.bets + 150 + i * 110 }]),
			...drawSpec(p.circle, T.pick, 600),
			...drawSpec(p.loop, T.loop, 700),
			...drawSpec(p.loopHead, T.loop + 650, 200),
			[p.newChip, [{ opacity: 0, transform: 'scale(0.8)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: T.chip }],
			[p.note, [{ opacity: 0, transform: 'rotate(-2deg) translateY(6px)' }, { opacity: 1, transform: 'rotate(-2deg)' }], { duration: 450, delay: T.note }],
		];
	}

	ariaSummary() {
		const { tokens, bets } = this.parts;
		return `Animação: o pedido "${tokens.join('')}" vira tokens, depois números, passa pelas camadas de atenção e sai a chance de cada token vir em seguida; o mais provável é "${bets[0]?.[0]}".`;
	}

	transcript() {
		const { tokens, bets } = this.parts;
		return `Transcrição: 1) o pedido "${tokens.join('')}" se quebra em ${tokens.length} tokens. 2) Cada token vira uma lista de números. 3) Peso de cada palavra: o modelo dá a cada palavra anterior um peso, conforme a relevância dela para o que vem a seguir, e refaz essa conta em dezenas de camadas. 4) Sai a chance de cada token vir em seguida: ${bets.map(([w, p]) => `"${w}" ${p}%`).join(', ')}. O escolhido, "${bets[0]?.[0]}", volta para o fim da fila e tudo recomeça.`;
	}
}

if (!customElements.get('ivr-transformer')) customElements.define('ivr-transformer', IvrTransformer);
