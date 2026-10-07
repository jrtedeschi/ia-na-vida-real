// Base das animações do curso: ciclo de vida, controles (Pausar / Ver de novo), legenda,
// e as regras de acessibilidade que valem para todas:
// - prefers-reduced-motion e impressão (?print-pdf, beforeprint) mostram só o estado final (o "poster");
// - trigger="manual": quem chama .play() é o reveal.js; senão toca ao aparecer na tela.
// Subclasses implementam: build(root) → partes, layout() → mede, specs() → [[node, keyframes, opts], ...].

export const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE_PEN = 'cubic-bezier(0.6, 0, 0.2, 1)';
const VISIBLE_THRESHOLD = 0.4;

export const el = (tag, cls, text) => {
	const node = document.createElement(tag);
	if (cls) node.className = cls;
	if (text != null) node.textContent = text;
	return node;
};
export const svgEl = (tag, cls) => {
	const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
	if (cls) node.setAttribute('class', cls);
	return node;
};
/** Retângulo de `node` em px locais de `origin` (desfaz a escala do reveal.js). */
export const relRect = (node, origin) => {
	const o = origin.getBoundingClientRect();
	const k = origin.offsetWidth ? o.width / origin.offsetWidth : 1;
	const r = node.getBoundingClientRect();
	return { x: (r.left - o.left) / k, y: (r.top - o.top) / k, width: r.width / k, height: r.height / k };
};
/** Efeito de "desenhar" um path SVG (tracejado que anda). */
export const drawSpec = (path, delay, duration) => {
	if (!path.getAttribute('d')) return [];
	const len = Math.ceil(path.getTotalLength()) + 1;
	path.style.strokeDasharray = `${len} ${len}`;
	return [[path, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration, delay, easing: EASE_PEN }]];
};

export class IvrAnim extends HTMLElement {
	parts = null;
	#anims = [];
	#ready = Promise.resolve();
	#state = 'start';
	#io = null;
	#ro = null;
	#onPrint = () => this.showFinal();

	get reducedMotion() {
		return matchMedia('(prefers-reduced-motion: reduce)').matches;
	}
	get isPrintView() {
		return /print-pdf/.test(location.search) || matchMedia('print').matches;
	}

	async connectedCallback() {
		if (!this.parts) {
			const caption = this.querySelector('figcaption')?.textContent.trim();
			const figure = el('figure', 'ivr-anim-figure');
			const frame = el('div', 'ivr-anim-frame');
			frame.setAttribute('role', 'img');
			const controls = el('div', 'ivr-anim-controls');
			const pause = el('button', null, 'Pausar');
			const replay = el('button', null, 'Ver de novo');
			pause.type = replay.type = 'button';
			pause.hidden = true;
			pause.addEventListener('click', () => this.togglePause());
			replay.addEventListener('click', () => this.play({ force: true }));
			controls.append(pause, replay);
			this.parts = { frame, pause, ...this.build(frame) };
			frame.setAttribute('aria-label', this.ariaSummary());
			const figcaption = el('figcaption', null, caption ?? this.transcript());
			this.querySelector('figcaption')?.remove();
			figure.append(frame, controls, figcaption);
			this.replaceChildren(figure);
			this.#ready = this.#fontsReady();
		}
		await this.#ready;
		if (!this.isConnected) return;
		const still = this.reducedMotion || this.isPrintView;
		if (still || this.#state === 'final') this.showFinal();
		else if (this.#state === 'start') this.#prepare();
		this.#observe(!still);
	}

	disconnectedCallback() {
		this.#io?.disconnect();
		this.#ro?.disconnect();
		window.removeEventListener('beforeprint', this.#onPrint);
	}

	async play({ force = false } = {}) {
		await this.#ready;
		if (this.isPrintView || (this.reducedMotion && !force)) return this.showFinal();
		this.#prepare();
		const anims = this.#anims;
		anims.forEach((a) => a.play());
		this.#state = 'running';
		this.parts.pause.hidden = false;
		this.parts.pause.textContent = 'Pausar';
		Promise.all(anims.map((a) => a.finished))
			.then(() => this.showFinal())
			.catch(() => {}); // cancelada por play()/showFinal()
	}

	togglePause() {
		const running = this.#anims.some((a) => a.playState === 'running');
		this.#anims.forEach((a) => (running ? a.pause() : a.play()));
		this.parts.pause.textContent = running ? 'Continuar' : 'Pausar';
	}

	showFinal() {
		this.#cancel();
		this.layout();
		this.#state = 'final';
		this.parts.pause.hidden = true;
	}

	#prepare() {
		this.#cancel();
		this.layout();
		this.#anims = this.specs().map(([node, keyframes, opts]) => {
			const a = node.animate(keyframes, { fill: 'both', easing: EASE_OUT, ...opts });
			a.pause();
			return a;
		});
		this.#state = 'start';
	}

	#cancel() {
		this.#anims.forEach((a) => a.cancel());
		this.#anims = [];
	}

	async #fontsReady() {
		try {
			await Promise.all([
				document.fonts.load('700 1em "Schibsted Grotesk"'),
				document.fonts.load('700 1em "Kalam"'),
				document.fonts.load('500 1em "IBM Plex Mono"'),
			]);
			await document.fonts.ready;
		} catch {
			// segue com as fontes de reserva; a geometria é medida do mesmo jeito
		}
	}

	#observe(autoplay) {
		this.disconnectedCallback();
		window.addEventListener('beforeprint', this.#onPrint);
		let queued = false;
		this.#ro = new ResizeObserver(() => {
			if (queued) return;
			queued = true;
			requestAnimationFrame(() => {
				queued = false;
				if (this.#state === 'final') this.showFinal();
				else if (this.#state === 'start') this.#prepare();
			});
		});
		this.#ro.observe(this.parts.frame);
		if (!autoplay || this.getAttribute('trigger') === 'manual') return;
		this.#io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting) || this.#state !== 'start') return;
				this.#io.disconnect();
				this.play();
			},
			{ threshold: VISIBLE_THRESHOLD },
		);
		this.#io.observe(this);
	}

	// ---- a implementar nas subclasses ----
	build(_frame) {
		return {};
	}
	layout() {}
	specs() {
		return [];
	}
	ariaSummary() {
		return 'Animação';
	}
	transcript() {
		return '';
	}
}
