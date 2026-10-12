// <ivr-prompt-art>: vitrine do "feito com um pedido". Pontos em grafite e laranja fluem como
// tinta ao vento, se juntam para escrever `word`, se soltam e recomeçam. O pedido que gerou
// a animação fica num cartão no canto. Canvas 2D, sem dependências.
//
// Atributos:
//   prompt   texto do pedido (mostrado no cartão)
//   word     frase que os pontos escrevem
//   trigger  "visible" (padrão) | "manual" (quem chama .play() é o reveal.js)
//
// Acessibilidade: reduced-motion e impressão mostram só a frase formada; botão Pausar;
// o canvas tem descrição; fora da tela o laço para.

import { el } from './anim-base.js';
import { seeded } from './ink.js';

const CYCLE = 11000;
const PHASE = { gather: 3200, hold: 6600, release: 9200 };
const MAX_DOTS = 2600;
const STREAK = 5; // quadros de rastro: o traço liga a posição de agora à de alguns quadros atrás
const ORANGE_SHARE = 0.16;

const ease = (t) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));

export class IvrPromptArt extends HTMLElement {
	#parts = null;
	#dots = [];
	#size = { w: 0, h: 0, dpr: 1 };
	#raf = 0;
	#t0 = 0;
	#elapsed = 0;
	#playing = false;
	#visible = false;
	#io = null;
	#ro = null;
	#colors = null;

	get reducedMotion() {
		return matchMedia('(prefers-reduced-motion: reduce)').matches;
	}
	get isPrintView() {
		return /print-pdf/.test(location.search) || matchMedia('print').matches;
	}

	async connectedCallback() {
		if (!this.#parts) this.#parts = this.#build();
		try {
			await document.fonts.load('900 1em "Schibsted Grotesk"');
		} catch {
			// segue com a fonte de reserva
		}
		if (!this.isConnected) return;
		this.#observe();
		this.#resize();
		if (this.reducedMotion || this.isPrintView) this.showFinal();
	}

	disconnectedCallback() {
		this.#io?.disconnect();
		this.#ro?.disconnect();
		this.#stop();
	}

	play({ force = false } = {}) {
		if (this.isPrintView || (this.reducedMotion && !force)) return this.showFinal();
		this.#elapsed = 0;
		this.#scatter();
		this.#playing = true;
		this.#setPaused(false);
		if (this.#visible) this.#start();
	}

	togglePause() {
		this.#playing = !this.#playing;
		this.#setPaused(!this.#playing);
		if (this.#playing && this.#visible) this.#start();
		else this.#stop();
	}

	showFinal() {
		this.#stop();
		this.#playing = false;
		this.#parts.pause.hidden = true;
		this.#readColors();
		const { ctx } = this.#parts;
		const { w, h } = this.#size;
		ctx.clearRect(0, 0, w, h);
		this.#dots.forEach((d) => {
			d.x = d.tx;
			d.y = d.ty;
		});
		this.#drawDots(1);
	}

	#build() {
		const figure = el('figure', 'ivr-anim-figure');
		const frame = el('div', 'ivr-anim-frame pa-frame');
		const canvas = el('canvas', 'pa-canvas');
		canvas.setAttribute('role', 'img');
		const word = this.getAttribute('word') ?? '';
		canvas.setAttribute('aria-label', `Animação: pontos que fluem como tinta e se juntam para escrever "${word}".`);
		const card = el('div', 'pa-prompt');
		card.append(el('span', 'pa-prompt-label', 'o pedido'), el('p', null, this.getAttribute('prompt') ?? ''));
		frame.append(canvas, card);
		const controls = el('div', 'ivr-anim-controls');
		const pause = el('button', null, 'Pausar');
		const replay = el('button', null, 'Ver de novo');
		pause.type = replay.type = 'button';
		pause.hidden = true;
		pause.addEventListener('click', () => this.togglePause());
		replay.addEventListener('click', () => this.play({ force: true }));
		controls.append(pause, replay);
		const caption = el('figcaption', null, `Transcrição: milhares de pontos fluem pela tela e se juntam para escrever "${word}". O pedido que gerou a animação: ${this.getAttribute('prompt') ?? ''}`);
		figure.append(frame, controls, caption);
		this.replaceChildren(figure);
		return { frame, canvas, ctx: canvas.getContext('2d'), pause, word };
	}

	#observe() {
		this.#io?.disconnect();
		this.#ro?.disconnect();
		let queued = false;
		this.#ro = new ResizeObserver(() => {
			if (queued) return;
			queued = true;
			requestAnimationFrame(() => {
				queued = false;
				this.#resize();
			});
		});
		this.#ro.observe(this.#parts.frame);
		this.#io = new IntersectionObserver((entries) => {
			this.#visible = entries.some((e) => e.isIntersecting);
			if (!this.#visible) return this.#stop();
			const auto = this.getAttribute('trigger') !== 'manual' && !this.#playing && this.#elapsed === 0;
			if (auto && !this.reducedMotion && !this.isPrintView) this.play();
			else if (this.#playing) this.#start();
		});
		this.#io.observe(this);
	}

	/** Mede em px locais (o reveal.js escala o slide) e refaz os alvos da frase. */
	#resize() {
		const { frame, canvas, ctx } = this.#parts;
		const w = frame.clientWidth;
		const h = frame.clientHeight;
		if (!w || !h) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		this.#size = { w, h, dpr };
		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(h * dpr);
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		this.#targets();
		if (!this.#playing) this.showFinal();
	}

	#targets() {
		const { w, h } = this.#size;
		const off = document.createElement('canvas');
		off.width = Math.round(w);
		off.height = Math.round(h);
		const o = off.getContext('2d');
		let size = h * 0.3;
		o.font = `900 ${size}px "Schibsted Grotesk", "Helvetica Neue", Arial, sans-serif`;
		const fit = (w * 0.86) / o.measureText(this.#parts.word).width;
		size = Math.min(size, size * fit);
		o.font = `900 ${size}px "Schibsted Grotesk", "Helvetica Neue", Arial, sans-serif`;
		o.textAlign = 'center';
		o.textBaseline = 'middle';
		o.fillText(this.#parts.word, w / 2, h * 0.4);
		const data = o.getImageData(0, 0, off.width, off.height).data;
		const step = Math.max(3, Math.round(size / 26));
		const pts = [];
		for (let y = 0; y < off.height; y += step) {
			for (let x = 0; x < off.width; x += step) {
				if (data[(y * off.width + x) * 4 + 3] > 128) pts.push([x, y]);
			}
		}
		const rand = seeded(17);
		while (pts.length > MAX_DOTS) pts.splice(Math.floor(rand() * pts.length), 1);
		this.#dots = pts.map(([tx, ty], i) => ({
			tx,
			ty,
			x: rand() * w,
			y: rand() * h,
			r: 1.1 + rand() * 1.3,
			orange: rand() < ORANGE_SHARE,
			lag: rand() * 900,
			trail: [],
		}));
	}

	#scatter() {
		const { w, h } = this.#size;
		const rand = seeded(Date.now() & 0xffff);
		this.#dots.forEach((d) => {
			d.x = rand() * w;
			d.y = rand() * h;
			d.trail = [];
		});
		this.#parts.ctx.clearRect(0, 0, w, h);
	}

	#readColors() {
		const cs = getComputedStyle(this);
		this.#colors = {
			ink: cs.getPropertyValue('--ivr-graphite').trim() || '#5b5f57',
			orange: cs.getPropertyValue('--ivr-orange').trim() || '#ff5a1f',
		};
	}

	#start() {
		if (this.#raf) return;
		this.#readColors();
		this.#t0 = performance.now() - this.#elapsed;
		const tick = (now) => {
			this.#elapsed = now - this.#t0;
			this.#frame(this.#elapsed % CYCLE, now);
			this.#raf = requestAnimationFrame(tick);
		};
		this.#raf = requestAnimationFrame(tick);
	}

	#stop() {
		cancelAnimationFrame(this.#raf);
		this.#raf = 0;
	}

	/** Campo de vento: ângulo suave que muda com a posição e o tempo. */
	#angle(x, y, now) {
		const t = now * 0.00025;
		return Math.sin(x * 0.0042 + t) * 2.1 + Math.cos(y * 0.0051 - t * 0.8) * 2.1 + Math.sin((x + y) * 0.0017 + t * 0.5);
	}

	#frame(t, now) {
		const { ctx } = this.#parts;
		const { w, h } = this.#size;
		// Limpa tudo a cada quadro (rastro por fade deixa "fantasmas" de arredondamento no canvas).
		ctx.clearRect(0, 0, w, h);
		this.#dots.forEach((d) => {
			d.trail.push(d.x, d.y);
			if (d.trail.length > STREAK * 2) d.trail.splice(0, 2);
			const pull = t < PHASE.release ? ease((t - PHASE.gather - d.lag) / 1600) : 1 - ease((t - PHASE.release - d.lag * 0.5) / 900);
			const a = this.#angle(d.x, d.y, now);
			const speed = 1.9 * (1 - pull);
			d.x += Math.cos(a) * speed;
			d.y += Math.sin(a) * speed;
			d.x += (d.tx - d.x) * 0.09 * pull;
			d.y += (d.ty - d.y) * 0.09 * pull;
			const wrapped = d.x < -10 || d.x > w + 10 || d.y < -10 || d.y > h + 10;
			if (d.x < -10) d.x += w + 20;
			if (d.x > w + 10) d.x -= w + 20;
			if (d.y < -10) d.y += h + 20;
			if (d.y > h + 10) d.y -= h + 20;
			if (wrapped) d.trail = [];
		});
		this.#drawTrails();
		this.#drawDots(t > PHASE.hold && t < PHASE.release ? 1 : 0.85);
	}

	#drawTrails() {
		const { ctx } = this.#parts;
		ctx.lineCap = 'round';
		ctx.globalAlpha = 0.35;
		[false, true].forEach((orange) => {
			ctx.strokeStyle = orange ? this.#colors.orange : this.#colors.ink;
			ctx.lineWidth = 1.6;
			ctx.beginPath();
			this.#dots.forEach((d) => {
				if (d.orange !== orange || d.trail.length < 4) return;
				ctx.moveTo(d.trail[0], d.trail[1]);
				ctx.lineTo(d.x, d.y);
			});
			ctx.stroke();
		});
		ctx.globalAlpha = 1;
	}

	#drawDots(alpha) {
		const { ctx } = this.#parts;
		ctx.globalAlpha = alpha;
		[false, true].forEach((orange) => {
			ctx.fillStyle = orange ? this.#colors.orange : this.#colors.ink;
			ctx.beginPath();
			this.#dots.forEach((d) => {
				if (d.orange !== orange) return;
				ctx.moveTo(d.x + d.r, d.y);
				ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
			});
			ctx.fill();
		});
		ctx.globalAlpha = 1;
	}

	#setPaused(paused) {
		const { pause } = this.#parts;
		pause.hidden = false;
		pause.textContent = paused ? 'Continuar' : 'Pausar';
	}
}

if (!customElements.get('ivr-prompt-art')) customElements.define('ivr-prompt-art', IvrPromptArt);
