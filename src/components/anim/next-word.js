// <ivr-next-word>: a IA "aposta" na próxima palavra. Serve para dois conceitos:
// - próxima palavra: várias etapas, a frase cresce um pedaço por vez;
// - alucinação: uma etapa só, com candidatas todas plausíveis e um "veredito" confiante.
//
// Atributos:
//   prompt   "O café da manhã ideal tem"
//   steps    JSON: [[["pão",41],["café",33],...], ...]  (a primeira candidata é a escolhida)
//   note     anotação à mão no fim ("provável ≠ verdadeiro")
//   verdict  frase final opcional ("A padaria Estrela foi fundada em 1987.")
//   trigger  "visible" (padrão) | "manual"

import { roughEllipse } from './ink.js';
import { IvrAnim, el, svgEl, relRect, drawSpec, EASE_OUT } from './anim-base.js';

const STEP = 2600; // duração de cada aposta
const BAR_IN = 380;
const BAR_STAGGER = 110;
const PICK = 1350;
const WORD_IN = 1750;

export class IvrNextWord extends IvrAnim {
	build(frame) {
		const prompt = this.getAttribute('prompt') ?? '';
		const steps = JSON.parse(this.getAttribute('steps') ?? '[]');
		const noteText = this.getAttribute('note') ?? '';
		const verdictText = this.getAttribute('verdict');

		const sentence = el('p', 'nw-sentence');
		sentence.append(el('span', 'nw-prompt', prompt));
		const words = steps.map((cands) => {
			const w = el('span', 'nw-word', ` ${cands[0][0]}`);
			sentence.append(w);
			return w;
		});
		const cursor = el('span', 'nw-cursor');
		cursor.setAttribute('aria-hidden', 'true');
		sentence.append(cursor);

		const label = el('p', 'nw-label', 'próxima palavra: as apostas da IA');
		const stage = el('div', 'nw-stage');
		const groups = steps.map((cands) => {
			const group = el('div', 'nw-group');
			const rows = cands.map(([word, pct], i) => {
				const row = el('div', 'nw-row');
				const w = el('span', 'nw-cand', word);
				const track = el('span', 'nw-track');
				const fill = el('i', i === 0 ? 'nw-fill nw-pick' : 'nw-fill');
				fill.style.width = `${pct}%`;
				track.append(fill);
				const p = el('span', 'nw-pct', `${pct}%`);
				row.append(w, track, p);
				group.append(row);
				return { row, w, fill };
			});
			const ink = svgEl('svg', 'ivr-anim-ink');
			ink.setAttribute('aria-hidden', 'true');
			const circle = svgEl('path');
			ink.append(circle);
			group.append(ink);
			stage.append(group);
			return { group, rows, circle };
		});

		const foot = el('div', 'nw-foot');
		const verdict = verdictText ? el('p', 'nw-verdict', verdictText) : null;
		const note = el('span', 'ivr-anim-note', noteText);
		if (verdict) foot.append(verdict);
		foot.append(note);

		frame.append(label, sentence, stage, foot);
		return { prompt, steps, sentence, words, cursor, stage, groups, foot, verdict, note };
	}

	layout() {
		const { groups, stage } = this.parts;
		groups.forEach(({ rows, circle }) => {
			const r = relRect(rows[0].w, rows[0].w.closest('.nw-group'));
			circle.setAttribute('d', roughEllipse(r, { seed: 9, pad: 10 }));
		});
		// Estado final: só a última aposta à vista.
		groups.forEach(({ group }, i) => (group.style.opacity = i === groups.length - 1 ? '1' : '0'));
		stage.dataset.count = String(groups.length);
	}

	specs() {
		const { groups, words, foot } = this.parts;
		const last = groups.length - 1;
		const total = groups.length * STEP + 900;
		return [
			...groups.flatMap(({ group, rows, circle }, s) => {
				const t0 = s * STEP;
				const isLast = s === last;
				const show = t0 / total;
				const hide = (t0 + STEP - 250) / total;
				const groupFrames = isLast
					? [{ opacity: 0, offset: 0 }, { opacity: 0, offset: show }, { opacity: 1, offset: show + 0.01 }, { opacity: 1, offset: 1 }]
					: [
							{ opacity: 0, offset: 0 },
							{ opacity: 0, offset: show },
							{ opacity: 1, offset: show + 0.01 },
							{ opacity: 1, offset: hide },
							{ opacity: 0, offset: Math.min(hide + 0.03, 1) },
							{ opacity: 0, offset: 1 },
						];
				return [
					[group, groupFrames, { duration: total, easing: 'linear' }],
					...rows.map(({ fill }, i) => [fill, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: BAR_IN, delay: t0 + 150 + i * BAR_STAGGER }]),
					...drawSpec(circle, t0 + PICK, 600),
					[words[s], [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: t0 + WORD_IN }],
				];
			}),
			[foot, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: groups.length * STEP, easing: EASE_OUT }],
		];
	}

	ariaSummary() {
		const { prompt, steps } = this.parts;
		return `Animação: a IA completa "${prompt}" escolhendo a palavra mais provável ${steps.length > 1 ? `${steps.length} vezes` : 'uma vez'}.`;
	}

	transcript() {
		const { prompt, steps } = this.parts;
		const desc = steps
			.map((c, i) => `aposta ${i + 1}: ${c.map(([w, p]) => `"${w}" ${p}%`).join(', ')}; escolhe "${c[0][0]}"`)
			.join('. ');
		const verdict = this.getAttribute('verdict');
		return `Transcrição: a IA recebe "${prompt}". ${desc}.${verdict ? ` Resposta final: "${verdict}"` : ''} ${this.getAttribute('note') ?? ''}`;
	}
}

if (!customElements.get('ivr-next-word')) customElements.define('ivr-next-word', IvrNextWord);
