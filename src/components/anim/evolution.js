// <ivr-evolution>: linha do tempo da escrita, do manuscrito aos agentes.
// Em cima, um cartão por salto (espaçados por igual); embaixo, um eixo em escala real de anos.
// As ligações cartão → ponto se juntam à direita: os saltos chegam cada vez mais rápido.
//
// Atributos:
//   from / to  anos das pontas do eixo (1400 / 2030)
//   ticks      "1400,1600,1800,2000"
//   steps      JSON [{ year, label, name, text }, ...]
//   note       anotação à mão no fim
//   trigger    "visible" (padrão) | "manual"

import { roughEllipse } from './ink.js';
import { IvrAnim, el, svgEl, relRect, drawSpec } from './anim-base.js';

const AXIS_IN = 700;
const STEP_START = 500;
const STEP_EVERY = 620;
const LAST_CLUSTER = 3; // quantos pontos do fim entram no círculo

export class IvrEvolution extends IvrAnim {
	build(frame) {
		const from = Number(this.getAttribute('from') ?? 1400);
		const to = Number(this.getAttribute('to') ?? 2030);
		const ticks = (this.getAttribute('ticks') ?? '').split(',').filter(Boolean).map(Number);
		const steps = JSON.parse(this.getAttribute('steps') ?? '[]');
		const noteText = this.getAttribute('note') ?? '';

		const stage = el('div', 'ev-stage');
		const cards = el('ol', 'ev-cards');
		const items = steps.map((s, i) => {
			const card = el('li', i === steps.length - 1 ? 'ev-card ev-last' : 'ev-card');
			card.append(el('span', 'ev-year', s.label), el('b', 'ev-name', s.name), el('span', 'ev-text', s.text));
			cards.append(card);
			return card;
		});
		const axis = el('div', 'ev-axis');
		const tickEls = ticks.map((t) => {
			const tick = el('span', 'ev-tick', String(t));
			tick.style.left = `${((t - from) / (to - from)) * 100}%`;
			axis.append(tick);
			return tick;
		});

		const ink = svgEl('svg', 'ivr-anim-ink ev-ink');
		ink.setAttribute('aria-hidden', 'true');
		const axisLine = svgEl('path', 'ev-axis-line');
		const links = steps.map(() => svgEl('path', 'ev-link'));
		const dots = steps.map((_, i) => svgEl('circle', i === 0 ? 'ev-dot ev-dot-open' : 'ev-dot'));
		const cluster = svgEl('path', 'ev-cluster');
		ink.append(axisLine, ...links, ...dots, cluster);

		const note = el('span', 'ivr-anim-note ev-note', noteText);
		stage.append(cards, axis, ink, note);
		frame.append(stage);
		return { from, to, steps, stage, items, axis, tickEls, axisLine, links, dots, cluster, note };
	}

	layout() {
		const { from, to, steps, stage, items, axis, axisLine, links, dots, cluster, note } = this.parts;
		const a = relRect(axis, stage);
		const y = a.y;
		const xOf = (year) => a.x + ((year - from) / (to - from)) * a.width;
		axisLine.setAttribute('d', `M${a.x} ${y}L${a.x + a.width} ${y}`);
		const points = steps.map((s) => [xOf(s.year), y]);
		items.forEach((card, i) => {
			const c = relRect(card, stage);
			const [x1, y1] = points[i];
			const x0 = c.x + c.width / 2;
			const y0 = c.y + c.height + 6;
			const mid = (y0 + y1) / 2;
			links[i].setAttribute('d', `M${x0} ${y0}C${x0} ${mid} ${x1} ${mid} ${x1} ${y1 - 9}`);
			dots[i].setAttribute('cx', String(x1));
			dots[i].setAttribute('cy', String(y1));
			dots[i].setAttribute('r', '7');
		});
		const last = points.slice(-LAST_CLUSTER);
		const box = { x: last[0][0] - 6, y: y - 10, width: last.at(-1)[0] - last[0][0] + 12, height: 20 };
		cluster.setAttribute('d', roughEllipse(box, { seed: 4, pad: 16 }));
		note.style.right = `${stage.offsetWidth - box.x + 28}px`;
		note.style.top = `${y + 46}px`;
	}

	specs() {
		const { items, links, dots, tickEls, axisLine, cluster, note } = this.parts;
		const end = STEP_START + items.length * STEP_EVERY;
		const pop = [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }];
		return [
			...drawSpec(axisLine, 0, AXIS_IN),
			...tickEls.map((t) => [t, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: AXIS_IN - 200 }]),
			...items.flatMap((card, i) => {
				const t0 = STEP_START + i * STEP_EVERY;
				return [
					[card, pop, { duration: 450, delay: t0 }],
					...drawSpec(links[i], t0 + 250, 450),
					[dots[i], [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: t0 + 650 }],
				];
			}),
			...drawSpec(cluster, end + 300, 900),
			[note, [{ opacity: 0, transform: 'rotate(-2deg) translateY(6px)' }, { opacity: 1, transform: 'rotate(-2deg)' }], { duration: 450, delay: end + 1000 }],
		];
	}

	ariaSummary() {
		return `Animação: linha do tempo da escrita, de ${this.parts.steps.map((s) => s.name).join(' a ')}. Os saltos ficam cada vez mais perto.`;
	}

	transcript() {
		const list = this.parts.steps.map((s) => `${s.name} (${s.label}): ${s.text}`).join('; ');
		return `Transcrição: ${list}. No eixo em escala de anos, os últimos saltos ficam quase colados. ${this.getAttribute('note') ?? ''}`;
	}
}

if (!customElements.get('ivr-evolution')) customElements.define('ivr-evolution', IvrEvolution);
