// Base das animações em passos: cada clique do apresentador avança um passo (segmentação).
// O estado de cada passo mora no CSS (`data-step` no palco); a passagem de um passo ao seguinte
// é desenhada no JS com FLIP: o objeto que muda de lugar viaja da posição antiga até a nova, sem sumir.
// - No reveal.js, o slide traz fragmentos vazios `.s-step`; o passo = quantos deles estão visíveis.
// - Fora do reveal (site), botões Voltar / Próximo passo.
// - prefers-reduced-motion: troca de estado sem viagem. Impressão (?print-pdf): o último passo.
// Subclasses implementam: build(frame) → partes, steps (número), travel(from, to) → [[node, keyframes, opts], ...].

import { el, relRect, EASE_OUT } from './anim-base.js';

export const TRAVEL_MS = 750;

/** Keyframes que levam `node` (já no lugar novo) a partir do retângulo `from` (FLIP). */
export function flipFrom(node, from, stage, { scale = true, fade = false } = {}) {
	const to = relRect(node, stage);
	const dx = from.x + from.width / 2 - (to.x + to.width / 2);
	const dy = from.y + from.height / 2 - (to.y + to.height / 2);
	const s = scale ? Math.min(from.width / to.width, 1.4) : 1;
	return [
		{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: fade ? 0 : 1 },
		{ transform: 'none', opacity: 1 },
	];
}

export class IvrStepped extends HTMLElement {
	parts = null;
	step = -1;
	#anims = [];

	get reducedMotion() {
		return matchMedia('(prefers-reduced-motion: reduce)').matches;
	}
	get isPrintView() {
		return /print-pdf/.test(location.search) || matchMedia('print').matches;
	}
	get inDeck() {
		return Boolean(this.closest('.reveal'));
	}

	async connectedCallback() {
		if (this.parts) return;
		const figure = el('figure', 'ivr-anim-figure');
		const frame = el('div', 'ivr-anim-frame');
		frame.setAttribute('role', 'img');
		const stage = el('div', 'st-stage');
		frame.append(stage);
		this.parts = { frame, stage, ...this.build(stage) };
		frame.setAttribute('aria-label', this.ariaSummary());
		figure.append(frame);
		// No slide, quem fala é o apresentador: a transcrição fica só para leitores de tela.
		if (this.inDeck) this.setAttribute('hide-caption', '');
		else figure.append(this.#controls());
		figure.append(el('figcaption', null, this.transcript()));
		this.replaceChildren(figure);
		await document.fonts?.ready;
		this.go(this.isPrintView ? this.steps - 1 : this.#deckStep(), { animate: false });
	}

	/** Chamado pelo deck ao entrar no slide e a cada fragmento `.s-step`. */
	sync() {
		this.go(this.#deckStep());
	}
	play() {
		this.sync();
	}
	pause() {}
	reset() {
		this.go(0, { animate: false });
	}

	go(n, { animate = true } = {}) {
		if (!this.parts) return;
		const to = Math.max(0, Math.min(n, this.steps - 1));
		if (to === this.step) return;
		const from = this.step;
		this.#cancel();
		// Antes de trocar o estado: a subclasse guarda os retângulos de onde as coisas vão sair.
		const before = this.measure(from, to);
		this.step = to;
		this.parts.stage.dataset.step = String(to);
		this.render(to);
		this.parts.prev && (this.parts.prev.disabled = to === 0);
		this.parts.next && (this.parts.next.disabled = to === this.steps - 1);
		const moving = animate && from >= 0 && to === from + 1 && !this.reducedMotion && !this.isPrintView;
		if (!moving) return;
		this.#anims = this.travel(from, to, before).map(([node, keyframes, opts]) =>
			node.animate(keyframes, { duration: TRAVEL_MS, easing: EASE_OUT, fill: 'backwards', ...opts }),
		);
	}

	#deckStep() {
		const section = this.closest('section');
		return section ? section.querySelectorAll('.s-step.visible').length : 0;
	}

	#cancel() {
		this.#anims.forEach((a) => a.cancel());
		this.#anims = [];
	}

	#controls() {
		const controls = el('div', 'ivr-anim-controls');
		const prev = el('button', null, 'Voltar');
		const next = el('button', null, 'Próximo passo');
		prev.type = next.type = 'button';
		prev.addEventListener('click', () => this.go(this.step - 1));
		next.addEventListener('click', () => this.go(this.step + 1));
		controls.append(prev, next);
		Object.assign(this.parts, { prev, next });
		return controls;
	}

	// ---- a implementar nas subclasses ----
	get steps() {
		return 1;
	}
	build(_stage) {
		return {};
	}
	measure(_from, _to) {
		return {};
	}
	/** Para cenas guiadas por dados: monta o DOM do passo (as outras usam só o CSS de `data-step`). */
	render(_step) {}
	travel(_from, _to, _before) {
		return [];
	}
	ariaSummary() {
		return 'Animação';
	}
	transcript() {
		return '';
	}
}
