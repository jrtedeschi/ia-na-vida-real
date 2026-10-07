// <ivr-token-split>: frase que se quebra em tokens, com anotação "à mão".
// Web Animations API (sem dependências). Funciona igual numa página Starlight e num slide reveal.js.
//
// Atributos:
//   tokens   "Organ|ize| minha|..."  (espaço inicial = começo de palavra)
//   circle   "0,1"                    índices dos tokens circulados em laranja
//   note     "1 palavra, 2 tokens"    anotação ao lado do círculo
//   before / after                    rótulos à mão antes e depois da quebra
//   trigger  "visible" (padrão) | "manual"   (manual: quem chama .play() é o reveal.js)
//
// Acessibilidade: prefers-reduced-motion e impressão (?print-pdf, beforeprint) mostram só o
// estado final; pausar/repetir por botão; transcrição no <figcaption>.

import { roughArrow, roughEllipse, roughUnderline } from './ink.js';

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_PEN = 'cubic-bezier(0.6, 0, 0.2, 1)';
const T = {
	sentenceIn: 0,
	labelSwap: 1500,
	split: 1900,
	splitStagger: 45,
	splitDur: 950,
	box: 2300,
	boxStagger: 110,
	circle: 4000,
	note: 4900,
	words: 6000,
	tokens: 6500,
	underline: 6900,
};
const VISIBLE_THRESHOLD = 0.4;

const beforeKeyframes = (total) => [
	{ opacity: 0, offset: 0 },
	{ opacity: 0, offset: 300 / total },
	{ opacity: 1, offset: 700 / total },
	{ opacity: 1, offset: T.labelSwap / total },
	{ opacity: 0, offset: 1 },
];

const el = (tag, cls, text) => {
	const node = document.createElement(tag);
	if (cls) node.className = cls;
	if (text != null) node.textContent = text;
	return node;
};
const svgEl = (tag, cls) => {
	const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
	if (cls) node.setAttribute('class', cls);
	return node;
};
// `origin.scale`: o reveal.js escala o slide com transform; medidas de tela viram px locais.
const relRect = (node, origin) => {
	const r = node.getBoundingClientRect();
	const k = origin.scale || 1;
	return { x: (r.left - origin.left) / k, y: (r.top - origin.top) / k, width: r.width / k, height: r.height / k };
};
const originOf = (node) => {
	const r = node.getBoundingClientRect();
	const scale = node.offsetWidth ? r.width / node.offsetWidth : 1;
	return { left: r.left, top: r.top, scale };
};
const union = (rects) => {
	const x = Math.min(...rects.map((r) => r.x));
	const y = Math.min(...rects.map((r) => r.y));
	const right = Math.max(...rects.map((r) => r.x + r.width));
	const bottom = Math.max(...rects.map((r) => r.y + r.height));
	return { x, y, width: right - x, height: bottom - y };
};

export class IvrTokenSplit extends HTMLElement {
	#parts = null;
	#anims = [];
	#ready = Promise.resolve();
	/** 'start' (preparada, parada no quadro 0) | 'running' | 'final'. Começa em 'start'. */
	#state = 'start';

	get reducedMotion() {
		return matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	get isPrintView() {
		return /print-pdf/.test(location.search) || matchMedia('print').matches;
	}

	async connectedCallback() {
		// Pode ser chamado de novo: o reveal.js move os slides no DOM (ex.: ?print-pdf).
		if (!this.#parts) {
			this.#parts = this.#build(this.#readConfig());
			this.#ready = this.#fontsReady();
		}
		await this.#ready;
		if (!this.isConnected) return;
		const still = this.reducedMotion || this.isPrintView;
		if (still || this.#state === 'final') this.showFinal();
		else if (this.#state === 'start') this.#prepare();
		this.#observe({ autoplay: !still });
	}

	disconnectedCallback() {
		this.#io?.disconnect();
		this.#ro?.disconnect();
		window.removeEventListener('beforeprint', this.#onPrint);
	}

	/**
	 * Toca do começo (chamado pelo IntersectionObserver ou pelo reveal.js com trigger="manual").
	 * Respeita reduced-motion e impressão; o botão "Ver de novo" força (ação explícita da pessoa).
	 */
	async play({ force = false } = {}) {
		await this.#ready;
		if (this.isPrintView || (this.reducedMotion && !force)) return this.showFinal();
		this.#prepare();
		const anims = this.#anims;
		anims.forEach((a) => a.play());
		this.#state = 'running';
		this.#setPlaying(true);
		Promise.all(anims.map((a) => a.finished))
			// Fim: troca os efeitos pelo estado final "de verdade" (mesmo visual, re-mede no resize).
			.then(() => this.showFinal())
			.catch(() => {}); // cancelada por play()/showFinal(): o estado já foi tratado lá
	}

	togglePause() {
		const running = this.#anims.some((a) => a.playState === 'running');
		this.#anims.forEach((a) => (running ? a.pause() : a.play()));
		this.#parts.pause.textContent = running ? 'Continuar' : 'Pausar';
	}

	/** Estado final, sem movimento: poster do PDF, reduced-motion e redimensionamento. */
	showFinal() {
		this.#cancel();
		this.#layout();
		this.#state = 'final';
		this.#setPlaying(false);
	}

	// ---------- montagem ----------

	#readConfig() {
		const tokens = (this.getAttribute('tokens') ?? '').split('|').filter(Boolean);
		const circle = (this.getAttribute('circle') ?? '').split(',').filter(Boolean).map(Number);
		const words = 1 + tokens.filter((t) => t.startsWith(' ')).length;
		return {
			tokens,
			circle,
			words,
			note: this.getAttribute('note') ?? '',
			before: this.getAttribute('before') ?? 'você escreve:',
			after: this.getAttribute('after') ?? 'a IA lê assim:',
			caption: this.querySelector('figcaption')?.textContent.trim(),
		};
	}

	#build(cfg) {
		const sentence = cfg.tokens.join('');
		const figure = el('figure');
		figure.style.margin = '0';
		figure.style.display = 'grid';
		figure.style.gap = '10px';

		const frame = el('div', 'ts-frame');
		frame.setAttribute('role', 'img');
		frame.setAttribute('aria-label', `Animação: "${sentence}" vira ${cfg.tokens.length} tokens.`);

		const labels = el('div', 'ts-labels');
		const before = el('span', 'ts-before', cfg.before);
		const after = el('span', null, cfg.after);
		labels.append(before, after);

		const stage = el('div', 'ts-stage');
		const row = el('div', 'ts-row');
		const mirror = el('div', 'ts-mirror');
		mirror.setAttribute('aria-hidden', 'true');
		const tokens = cfg.tokens.map((raw) => {
			const tok = el('span', 'ts-token');
			const box = el('span', 'ts-box');
			tok.append(box, el('span', 'ts-token-text', raw.trim()));
			row.append(tok);
			if (raw.startsWith(' ')) mirror.append(' ');
			const ghost = el('span', null, raw.trim());
			mirror.append(ghost);
			return { tok, box, ghost };
		});
		const ink = svgEl('svg', 'ts-ink');
		ink.setAttribute('aria-hidden', 'true');
		const circlePath = svgEl('path', 'ts-circle');
		const arrowShaft = svgEl('path', 'ts-arrow');
		const arrowHead = svgEl('path', 'ts-arrow');
		ink.append(circlePath, arrowShaft, arrowHead);
		const note = el('span', 'ts-note', cfg.note);
		stage.append(row, mirror, ink, note);

		const tally = el('div', 'ts-tally');
		const wordsEl = el('span', null, `${cfg.words} palavras`);
		const arrowText = el('span', 'ts-arrow-text', '→');
		const tokensEl = el('span', 'ts-tokens', `${cfg.tokens.length} tokens`);
		const tallyInk = svgEl('svg', 'ts-ink');
		tallyInk.setAttribute('aria-hidden', 'true');
		const underline = svgEl('path', 'ts-underline');
		tallyInk.append(underline);
		tally.style.position = 'relative';
		tally.append(wordsEl, arrowText, tokensEl, tallyInk);

		frame.append(labels, stage, tally);

		const controls = el('div', 'ts-controls');
		const replay = el('button', null, 'Ver de novo');
		const pause = el('button', null, 'Pausar');
		replay.type = pause.type = 'button';
		pause.hidden = true;
		replay.addEventListener('click', () => this.play({ force: true }));
		pause.addEventListener('click', () => this.togglePause());
		controls.append(pause, replay);

		const caption = el('figcaption', null, cfg.caption ?? this.#transcript(cfg));
		this.querySelector('figcaption')?.remove();
		figure.append(frame, controls, caption);
		this.replaceChildren(figure);

		const pathsOf = { circlePath, arrowShaft, arrowHead, underline };
		return { cfg, frame, labels, before, after, stage, row, tokens, note, tally, wordsEl, arrowText, tokensEl, replay, pause, ...pathsOf };
	}

	#transcript(cfg) {
		const list = cfg.tokens.map((t) => t.trim()).join(' | ');
		const circled = cfg.circle.map((i) => cfg.tokens[i]?.trim()).join('');
		const noteText = circled ? ` A palavra "${circled}" virou ${cfg.circle.length} tokens.` : '';
		return `Transcrição: a frase "${cfg.tokens.join('')}" se quebra em pedaços chamados tokens: ${list}.${noteText} Resultado: ${cfg.words} palavras, ${cfg.tokens.length} tokens.`;
	}

	async #fontsReady() {
		try {
			await Promise.all([
				document.fonts.load('700 1em "Schibsted Grotesk"'),
				document.fonts.load('900 1em "Schibsted Grotesk"'),
				document.fonts.load('700 1em "Kalam"'),
			]);
			await document.fonts.ready;
		} catch {
			// Sem fontes da marca: segue com os fallbacks; a geometria é medida do mesmo jeito.
		}
	}

	#io = null;
	#ro = null;
	#onPrint = () => this.showFinal();

	#observe({ autoplay }) {
		this.disconnectedCallback(); // idempotente em reconexões
		window.addEventListener('beforeprint', this.#onPrint);
		// Observa palco e tokens: no reveal (?print-pdf, escala) a fonte muda sem mudar a largura do palco.
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
		[this.#parts.stage, ...this.#parts.tokens.map((t) => t.tok)].forEach((n) => this.#ro.observe(n));
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

	// ---------- geometria (medida no layout final, sem transforms) ----------

	#layout() {
		const p = this.#parts;
		const origin = originOf(p.stage);
		const finals = p.tokens.map(({ tok }) => relRect(tok, origin));
		const circled = p.cfg.circle.map((i) => finals[i]).filter(Boolean);
		let circleRect = null;
		if (circled.length) {
			circleRect = union(circled);
			p.circlePath.setAttribute('d', roughEllipse(circleRect, { seed: 11 }));
			const noteX = circleRect.x + circleRect.width * 0.62;
			const noteY = circleRect.y + circleRect.height + 8;
			p.note.style.left = `${noteX}px`;
			p.note.style.top = `${noteY}px`;
			const arrow = roughArrow([noteX - 5, noteY + 14], [circleRect.x + circleRect.width * 0.36, circleRect.y + circleRect.height + 6], { bend: -0.3, head: 8 });
			p.arrowShaft.setAttribute('d', arrow.shaft);
			p.arrowHead.setAttribute('d', arrow.head);
		}
		const tallyOrigin = originOf(p.tally);
		p.underline.setAttribute('d', roughUnderline(relRect(p.tokensEl, tallyOrigin), { seed: 5, y: 2 }));
		return { origin, finals, circleRect };
	}

	#flipDeltas(origin, finals) {
		return this.#parts.tokens.map(({ tok, ghost }, i) => {
			const g = relRect(ghost, origin);
			const cs = getComputedStyle(tok);
			const padX = parseFloat(cs.paddingLeft);
			const padY = parseFloat(cs.paddingTop);
			return { dx: g.x - (finals[i].x + padX), dy: g.y - (finals[i].y + padY) };
		});
	}

	// ---------- linha do tempo ----------

	#prepare() {
		this.#cancel();
		const { origin, finals } = this.#layout();
		const deltas = this.#flipDeltas(origin, finals);
		const specs = [...this.#introSpecs(), ...this.#splitSpecs(deltas), ...this.#inkSpecs(), ...this.#tallySpecs()];
		this.#anims = specs.map(([node, keyframes, opts]) => {
			const a = node.animate(keyframes, { fill: 'both', easing: EASE_OUT, ...opts });
			a.pause();
			return a;
		});
		this.#state = 'start';
	}

	#introSpecs() {
		const p = this.#parts;
		return [
			[p.row, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: T.sentenceIn }],
			// Um só efeito por propriedade: dois efeitos com fill 'both' no mesmo nó se sobrepõem.
			[p.before, beforeKeyframes(T.labelSwap + 300), { duration: T.labelSwap + 300, easing: 'linear' }],
			[p.after, [{ opacity: 0, transform: 'rotate(-2deg) translateX(-8px)' }, { opacity: 1, transform: 'rotate(-2deg)' }], { duration: 400, delay: T.labelSwap + 300 }],
		];
	}

	#splitSpecs(deltas) {
		return this.#parts.tokens.flatMap(({ tok, box }, i) => [
			[tok, [{ transform: `translate(${deltas[i].dx}px, ${deltas[i].dy}px)` }, { transform: 'none' }], { duration: T.splitDur, delay: T.split + i * T.splitStagger }],
			[box, [{ opacity: 0, transform: 'scale(0.88)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: T.box + i * T.boxStagger }],
		]);
	}

	#drawSpec(path, delay, duration) {
		if (!path.getAttribute('d')) return [];
		const len = Math.ceil(path.getTotalLength()) + 1;
		path.style.strokeDasharray = `${len} ${len}`;
		return [[path, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration, delay, easing: EASE_PEN }]];
	}

	#inkSpecs() {
		const p = this.#parts;
		return [
			...this.#drawSpec(p.circlePath, T.circle, 1100),
			...this.#drawSpec(p.arrowShaft, T.note - 200, 400),
			...this.#drawSpec(p.arrowHead, T.note + 150, 200),
			[p.note, [{ opacity: 0, transform: 'rotate(-3deg) translateY(6px)' }, { opacity: 1, transform: 'rotate(-3deg)' }], { duration: 450, delay: T.note }],
		];
	}

	#tallySpecs() {
		const p = this.#parts;
		const pop = [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }];
		return [
			[p.tally, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: T.words - 100 }],
			[p.wordsEl, pop, { duration: 450, delay: T.words }],
			[p.arrowText, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: T.words + 300 }],
			[p.tokensEl, pop, { duration: 450, delay: T.tokens }],
			...this.#drawSpec(p.underline, T.underline, 700),
		];
	}

	#cancel() {
		this.#anims.forEach((a) => a.cancel());
		this.#anims = [];
	}

	#setPlaying(on) {
		const p = this.#parts;
		p.pause.hidden = !on;
		p.pause.textContent = 'Pausar';
	}
}

if (!customElements.get('ivr-token-split')) customElements.define('ivr-token-split', IvrTokenSplit);
