// <ivr-submarino>: transição de saída do slide do submarino. No último clique a água sobe e cobre
// a tela, e um submarino amarelo (o da festa) atravessa devagar o fundo do mar: algas, bolhas,
// peixes, uma anêmona vermelha com um peixe-palhaço, raios de luz e areia. No fim abre o cabeçalho
// "Perguntas até aqui?" e a cena segue viva até o próximo clique, que leva ao próximo slide.
// Pixel art "64 bits": grade 480×270, mais fina que a do mundo novo, com sombreado suave.
//
// API para o deck: play() toca; pause() para; reset() volta ao repouso (transparente).
// Reduced-motion: mostra direto o fundo do mar parado com o cabeçalho. Impressão: não desenha nada.

import { seeded } from './ink.js';
import { buildSub, drawPropeller, SW, SH, HULL, PROP } from './submarine-sprite.js';
import { buildClown, buildTang, blit, CLOWN_W, CLOWN_H, TANG_W, TANG_H } from './fish-sprites.js';

const W = 480;
const H = 270;
const T = { rise: 1200, subFrom: 700, subTo: 7900, header: 7300 };
const SUB_Y = 122; // centro do casco na tela
const SAND_Y = 228;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const pack = ([r, g, b]) => ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
const P = (hex) => pack(rgb(hex));
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
const easeOut = (t) => 1 - (1 - t) ** 3;
const hash = (x, y) => {
	const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
	return n - Math.floor(n);
};

const C = {
	waterTop: rgb('#7fd6f2'),
	waterMid: rgb('#3aa6d8'),
	waterDeep: rgb('#1f78b4'),
	ray: P('#b8ecfb'),
	foam: P('#d8f3ff'),
	sand: P('#d9b86c'),
	sandDark: P('#b8944c'),
	sandLight: P('#f0d690'),
	rock: P('#5b6a7a'),
	rockDark: P('#3e4a58'),
	kelp: P('#2f8f5a'),
	kelpDark: P('#1f6b43'),
	kelpLight: P('#5fc07e'),
	bubble: P('#bfe8ff'),
	bubbleCore: P('#effaff'),
	anemone: P('#d8263a'),
	anemoneDark: P('#9c1428'),
	anemoneTip: P('#ff8f9a'),
};

const ANEMONE = { x: 352, tentacles: 15 };

/** Cena estática do fundo: rochas e as bases das algas (sorteadas uma vez). */
function buildScene() {
	const rand = seeded(83);
	const kelp = Array.from({ length: 14 }, (_, i) => ({ x: Math.round(18 + i * 33 + rand() * 18), h: 40 + rand() * 70, phase: rand() * 6.28 }));
	const rocks = Array.from({ length: 6 }, () => ({ x: Math.round(rand() * W), r: 8 + rand() * 12 }));
	const fish = Array.from({ length: 7 }, (_, i) => ({ y: 60 + rand() * 120, speed: 0.05 + rand() * 0.04, offset: rand() * W, phase: i }));
	const bubbles = Array.from({ length: 26 }, () => ({ x: rand() * W, speed: 0.03 + rand() * 0.05, offset: rand() * H, r: rand() < 0.3 ? 2 : 1 }));
	return { kelp, rocks, fish, bubbles };
}

export class IvrSubmarino extends HTMLElement {
	#canvas = null;
	#ctx = null;
	#img = null;
	#buf = null;
	#sub = buildSub();
	#clown = buildClown();
	#tang = buildTang();
	#header = null;
	#anims = [];
	#scene = buildScene();
	#raf = 0;
	#t0 = 0;
	#elapsed = 0;

	get #still() {
		return matchMedia('(prefers-reduced-motion: reduce)').matches;
	}
	get #print() {
		return /print-pdf/.test(location.search) || matchMedia('print').matches;
	}

	connectedCallback() {
		if (this.#canvas) return;
		this.#canvas = document.createElement('canvas');
		this.#canvas.width = W;
		this.#canvas.height = H;
		this.#canvas.setAttribute('role', 'img');
		this.#canvas.setAttribute('aria-label', 'Transição: a água sobe e um submarino amarelo atravessa o fundo do mar.');
		this.#ctx = this.#canvas.getContext('2d');
		this.#img = this.#ctx.createImageData(W, H);
		this.#buf = new Uint32Array(this.#img.data.buffer);
		this.#header = document.createElement('div');
		this.#header.className = 'sb-header';
		const h = document.createElement('p');
		h.textContent = this.getAttribute('header') ?? 'Perguntas até aqui?';
		this.#header.append(h);
		this.replaceChildren(this.#canvas, this.#header);
		this.#header.style.opacity = '0';
	}

	disconnectedCallback() {
		this.pause();
	}

	play() {
		this.reset();
		if (this.#print) return;
		if (this.#still) {
			this.#draw(T.subTo + 1);
			this.#header.style.opacity = '1';
			return;
		}
		this.#anims = [
			this.#header.animate(
				[
					{ opacity: 1, clipPath: 'inset(0 50% 0 50%)', transform: 'translateY(-12px)' },
					{ opacity: 1, clipPath: 'inset(0 0% 0 0%)', transform: 'none' },
				],
				{ duration: 700, delay: T.header, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' },
			),
		];
		this.#t0 = performance.now();
		const tick = (now) => {
			this.#elapsed = now - this.#t0;
			this.#draw(this.#elapsed);
			this.#raf = requestAnimationFrame(tick);
		};
		this.#raf = requestAnimationFrame(tick);
	}

	pause() {
		cancelAnimationFrame(this.#raf);
		this.#raf = 0;
	}

	reset() {
		this.pause();
		this.#anims.forEach((a) => a.cancel());
		this.#anims = [];
		this.#elapsed = 0;
		this.#ctx?.clearRect(0, 0, W, H);
		if (this.#header) this.#header.style.opacity = '0';
	}

	#draw(t) {
		const buf = this.#buf;
		const level = H + 12 - (H + 30) * easeOut(clamp01(t / T.rise)); // linha d'água subindo
		this.#water();
		this.#rays(t, level);
		this.#floor();
		this.#rocks();
		this.#kelp(t);
		this.#anemone(t);
		this.#fish(t);
		this.#clownfish(t);
		this.#drawSub(t);
		this.#bubbles(t);
		// Acima da linha d'água: transparente (o slide aparece por cima); na linha, espuma.
		for (let x = 0; x < W; x++) {
			const surf = Math.round(level + Math.sin(x * 0.06 + t * 0.012) * 3 + Math.sin(x * 0.17 - t * 0.02));
			for (let y = 0; y < Math.min(surf, H); y++) buf[y * W + x] = 0;
			if (surf >= 0 && surf < H) buf[surf * W + x] = C.foam;
			if (surf + 1 >= 0 && surf + 1 < H && hash(x, 3) > 0.5) buf[(surf + 1) * W + x] = C.foam;
		}
		this.#ctx.putImageData(this.#img, 0, 0);
	}

	#water() {
		const buf = this.#buf;
		for (let y = 0; y < H; y++) {
			const k = y / H;
			const [a, b, f] = k < 0.5 ? [C.waterTop, C.waterMid, k / 0.5] : [C.waterMid, C.waterDeep, (k - 0.5) / 0.5];
			const lo = pack(a.map((v, i) => Math.round(v + (b[i] - v) * Math.floor(f * 6) / 6)));
			const hi = pack(a.map((v, i) => Math.round(v + (b[i] - v) * Math.min(1, (Math.floor(f * 6) + 1) / 6))));
			const frac = f * 6 - Math.floor(f * 6);
			for (let x = 0; x < W; x++) buf[y * W + x] = frac > BAYER[((y & 3) << 2) | (x & 3)] ? hi : lo;
		}
	}

	/** Raios de luz que descem da superfície, balançando devagar. */
	#rays(t, level) {
		const buf = this.#buf;
		for (let r = 0; r < 5; r++) {
			const x0 = 40 + r * 105 + Math.sin(t * 0.001 + r) * 14;
			for (let y = Math.max(0, Math.round(level)); y < SAND_Y; y++) {
				const fade = 1 - y / SAND_Y;
				const w = 10 + y * 0.12;
				const xc = x0 + y * 0.35;
				for (let x = Math.round(xc - w); x <= xc + w; x++) {
					if (x < 0 || x >= W) continue;
					if (fade * 0.42 > BAYER[((y & 3) << 2) | (x & 3)]) buf[y * W + x] = C.ray;
				}
			}
		}
	}

	#floor() {
		const buf = this.#buf;
		for (let x = 0; x < W; x++) {
			const top = Math.round(SAND_Y + Math.sin(x * 0.045) * 5 + Math.sin(x * 0.13) * 2);
			for (let y = Math.max(top, 0); y < H; y++) {
				const n = hash(x, y);
				buf[y * W + x] = y === top ? C.sandLight : n > 0.92 ? C.sandDark : n < 0.05 ? C.sandLight : C.sand;
			}
		}
	}

	#rocks() {
		this.#scene.rocks.forEach(({ x: cx, r }) => {
			const cy = SAND_Y + 6;
			for (let y = Math.round(cy - r); y <= cy; y++) {
				for (let x = Math.round(cx - r * 1.4); x <= cx + r * 1.4; x++) {
					if (x < 0 || x >= W || y < 0 || y >= H) continue;
					const d = ((x - cx) / (r * 1.4)) ** 2 + ((y - cy) / r) ** 2;
					if (d <= 1) this.#buf[y * W + x] = x - cx + (y - cy) < -r * 0.4 ? C.rock : C.rockDark;
				}
			}
		});
	}

	/** Algas: hastes que ondulam, mais claras numa das bordas. */
	#kelp(t) {
		this.#scene.kelp.forEach(({ x: bx, h, phase }) => {
			for (let k = 0; k < h; k++) {
				const y = SAND_Y + 4 - k;
				const sway = Math.sin(t * 0.003 + phase + k * 0.06) * (k / h) * 9;
				const x = Math.round(bx + sway);
				const half = k % 14 < 7 ? 2 : 3; // folhas alternando de largura
				for (let dx = -half; dx <= half; dx++) {
					const X = x + dx;
					if (X < 0 || X >= W || y < 0) continue;
					this.#buf[y * W + X] = dx === -half ? C.kelpLight : dx === half ? C.kelpDark : C.kelp;
				}
			}
		});
	}

	/** Anêmona vermelha: base arredondada e tentáculos que ondulam, com as pontas mais claras. */
	#anemone(t) {
		const { x: bx, tentacles } = ANEMONE;
		const base = SAND_Y + 2;
		for (let y = base - 7; y <= base + 2; y++) {
			for (let x = bx - 13; x <= bx + 13; x++) {
				if (((x - bx) / 13) ** 2 + ((y - base) / 7) ** 2 <= 1) this.#buf[y * W + x] = y > base - 3 ? C.anemoneDark : C.anemone;
			}
		}
		for (let n = 0; n < tentacles; n++) {
			const spread = (n / (tentacles - 1) - 0.5) * 2; // -1 (esquerda) a 1 (direita)
			const len = 20 + (1 - Math.abs(spread)) * 10;
			for (let k = 0; k < len; k++) {
				const f = k / len;
				const sway = Math.sin(t * 0.0025 + n * 0.7 + f * 3) * f * 4;
				const x = Math.round(bx + spread * 11 + spread * f * 10 + sway);
				const y = Math.round(base - 5 - k);
				const c = f > 0.82 ? C.anemoneTip : n % 2 ? C.anemoneDark : C.anemone;
				for (let dx = 0; dx <= 1; dx++) if (x + dx >= 0 && x + dx < W && y >= 0) this.#buf[y * W + x + dx] = c;
			}
		}
	}

	/** Peixe-palhaço nadando em volta da anêmona; vira quando muda de direção. */
	#clownfish(t) {
		const a = t * 0.0011;
		const x = Math.round(ANEMONE.x + Math.sin(a) * 34 - CLOWN_W / 2);
		const y = Math.round(SAND_Y - 52 + Math.sin(t * 0.0023) * 5);
		blit(this.#buf, W, H, this.#clown, CLOWN_W, CLOWN_H, x, y, Math.cos(a) < 0);
	}

	/** Cardume de cirurgiões-patela nadando para a esquerda, balançando um pouco. */
	#fish(t) {
		this.#scene.fish.forEach(({ y, speed, offset, phase }) => {
			const x = Math.round(W + 20 - ((offset + t * speed) % (W + 40)));
			const yy = Math.round(y + Math.sin(t * 0.004 + phase) * 3);
			blit(this.#buf, W, H, this.#tang, TANG_W, TANG_H, x, yy, true);
		});
	}

	#drawSub(t) {
		const k = clamp01((t - T.subFrom) / (T.subTo - T.subFrom));
		const ox = Math.round(-SW - 10 + (W + SW + 20) * k);
		const oy = Math.round(SUB_Y - HULL.cy + Math.sin(t * 0.0025) * 3);
		blit(this.#buf, W, H, this.#sub, SW, SH, ox, oy);
		const px = ox + PROP.x;
		const py = oy + PROP.y;
		drawPropeller(this.#buf, W, H, px, py, t);
		// Rastro de bolhas atrás da hélice.
		for (let n = 0; n < 7; n++) {
			const bx = px - 8 - n * 8 + Math.round(Math.sin(t * 0.008 + n) * 2);
			const by = py - n * 3 + Math.round(Math.cos(t * 0.011 + n) * 2);
			this.#bubble(bx, by, n % 3 === 0 ? 2 : 1);
		}
	}

	#bubbles(t) {
		this.#scene.bubbles.forEach(({ x, speed, offset, r }) => {
			const y = Math.round(H - ((offset + t * speed) % (H + 10)));
			this.#bubble(Math.round(x + Math.sin(t * 0.005 + offset) * 2), y, r);
		});
	}

	#bubble(cx, cy, r) {
		for (let y = cy - r; y <= cy + r; y++) {
			for (let x = cx - r; x <= cx + r; x++) {
				if (x < 0 || x >= W || y < 0 || y >= H) continue;
				const d = Math.hypot(x - cx, y - cy);
				if (d <= r + 0.3) this.#buf[y * W + x] = d > r - 0.7 ? C.bubble : C.bubbleCore;
			}
		}
	}
}

if (!customElements.get('ivr-submarino')) customElements.define('ivr-submarino', IvrSubmarino);
