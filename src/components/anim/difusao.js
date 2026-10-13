// <ivr-difusao>: como um modelo de imagem trabalha. A tela começa com pixels aleatórios; a cada
// passo o ruído diminui e a imagem ganha detalhe, das formas grandes (blocos borrados) aos
// detalhes finos, até o café da manhã que o pedido descreve. Grade 32×32 com sombreado
// simples, ampliada sem suavização.
// Antes disso, o pedido passa pelo modelo: os tokens entram um a um (classe `run` dispara o CSS).
// API para o deck: play() toca do começo; pause() para. Reduced-motion e impressão: imagem pronta.

import { seeded } from './ink.js';

const N = 32;
const U = N / 32; // o desenho é pensado numa grade de 32 (pixels grandes, estilo 32 bits)
const STEPS = 12;
const STEP_MS = 380;
// Antes da imagem: o pedido entra no modelo (tokens acendendo); a imagem só começa depois.
const MODEL_MS = 2600;
// Tamanho do bloco a cada passo: das formas grandes aos detalhes finos.
const BLOCKS = [8, 8, 6, 6, 4, 4, 3, 2, 2, 1, 1, 1, 1];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
const C = {
	wallTop: hex('#fbecd0'),
	wallLow: hex('#f2cf9b'),
	table: hex('#b9773d'),
	tableDark: hex('#94582a'),
	tableLight: hex('#d59b5e'),
	shadow: hex('#7e4a22'),
	cup: hex('#f6f1e8'),
	cupShade: hex('#c8bfb0'),
	cupLight: hex('#ffffff'),
	stripe: hex('#ff6a33'),
	coffee: hex('#4a2812'),
	coffeeLight: hex('#7a4825'),
	saucer: hex('#ece4d6'),
	bread: hex('#d8963b'),
	breadLight: hex('#f3c46a'),
	breadDark: hex('#a3621c'),
	scoring: hex('#f7dc9c'),
	steam: hex('#ffffff'),
	ink: hex('#3a2208'),
};

/** A imagem que o pedido descreve, em coordenadas da grade de 32 (u, v) e cores RGB. */
function pintar(u, v) {
	// Parede em degradê e mesa de madeira com tábuas.
	let c = mix(C.wallTop, C.wallLow, v / 22);
	let sub = false;
	if (v >= 22) {
		c = v < 23 ? C.tableLight : C.table;
		if (Math.abs(v - 26.5) < 0.5 || Math.abs(v - 30.5) < 0.5) c = C.tableDark;
		// sombras dos objetos na mesa
		const sx = (u - 11.5) / 8.4;
		const sy = (v - 24.4) / 1.9;
		const bx = (u - 24) / 6.6;
		const by = (v - 24.2) / 1.6;
		if (sx * sx + sy * sy < 1 || bx * bx + by * by < 1) c = mix(c, C.shadow, 0.55);
	}
	// Pires.
	const px = (u - 11) / 7.6;
	const py = (v - 24) / 1.35;
	if (px * px + py * py <= 1) {
		c = mix(C.saucer, C.cupShade, clamp01(py * 0.6 + 0.3));
		sub = true;
	}
	// Asa da xícara: um anel à direita.
	const da = Math.hypot(u - 16.4, v - 18);
	if (u > 15.8 && da >= 1.7 && da <= 2.9) {
		c = mix(C.cup, C.cupShade, clamp01((u - 16.4) / 3));
		sub = true;
	}
	// Xícara: corpo afinando para baixo, luz à esquerda, faixa laranja.
	if (v >= 13 && v <= 23.6) {
		const meia = 5 - (v - 13) * 0.11;
		const nx = (u - 11) / meia;
		if (Math.abs(nx) <= 1) {
			c = nx < -0.55 ? mix(C.cup, C.cupLight, 0.7) : mix(C.cup, C.cupShade, clamp01((nx + 0.2) * 0.9));
			if (v >= 18.6 && v <= 19.8) c = mix(C.stripe, C.cupShade, clamp01(nx * 0.4));
			sub = true;
		}
	}
	// Café na boca da xícara.
	const cx = (u - 11) / 4.7;
	const cy = (v - 13.1) / 0.85;
	if (cx * cx + cy * cy <= 1) {
		c = cx < -0.2 && cy < 0 ? C.coffeeLight : C.coffee;
		sub = true;
	}
	// Pão francês: oval dourado inclinado, com os cortes clarinhos em cima.
	const r = (u - 24) * 0.97 + (v - 21) * 0.24;
	const t = -(u - 24) * 0.24 + (v - 21) * 0.97;
	const ex = r / 6.4;
	const ey = t / 2.7;
	if (ex * ex + ey * ey <= 1) {
		const luz = clamp01(0.6 - ey * 0.55);
		c = luz > 0.5 ? mix(C.bread, C.breadLight, (luz - 0.5) * 2) : mix(C.breadDark, C.bread, luz * 2);
		for (const k of [-3, 0, 3]) {
			const corte = (r - k) * 0.8 + t * 0.6;
			if (Math.abs(corte) < 0.5 && ey < 0.1) c = C.scoring;
		}
		sub = true;
	}
	// Vapor: três fios ondulados subindo da xícara (sem contorno).
	for (const base of [8.6, 11, 13.4]) {
		if (v >= 4 && v <= 11.6) {
			const x = base + Math.sin(v * 1.15 + base) * 0.75;
			if (Math.abs(u - x) < 0.55) c = mix(c, C.steam, 0.8 - (11.6 - v) * 0.05);
		}
	}
	return { c, sub };
}

function imagem() {
	const px = [];
	const sub = [];
	for (let y = 0; y < N; y++) {
		for (let x = 0; x < N; x++) {
			const r = pintar((x + 0.5) / U, (y + 0.5) / U);
			px.push(r.c);
			sub.push(r.sub);
		}
	}
	// Contorno escuro de 1 pixel em volta dos objetos (xícara, pires e pão).
	const dentro = (x, y) => x >= 0 && y >= 0 && x < N && y < N && sub[y * N + x];
	return px.map((c, i) => {
		const x = i % N;
		const y = Math.floor(i / N);
		if (sub[i]) return c;
		for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (dentro(x + dx, y + dy)) return C.ink;
		return c;
	});
}

/** A imagem vista em blocos de `b` pixels: a média de cada bloco (as formas grandes). */
function emBlocos(px, b) {
	if (b <= 1) return px;
	const out = new Array(N * N);
	for (let by = 0; by < N; by += b) {
		for (let bx = 0; bx < N; bx += b) {
			const soma = [0, 0, 0];
			let n = 0;
			for (let y = by; y < Math.min(by + b, N); y++) for (let x = bx; x < Math.min(bx + b, N); x++) {
				const c = px[y * N + x];
				soma[0] += c[0];
				soma[1] += c[1];
				soma[2] += c[2];
				n++;
			}
			const m = soma.map((v) => v / n);
			for (let y = by; y < Math.min(by + b, N); y++) for (let x = bx; x < Math.min(bx + b, N); x++) out[y * N + x] = m;
		}
	}
	return out;
}

export class IvrDifusao extends HTMLElement {
	#ctx = null;
	#img = null;
	#alvo = imagem();
	#passos = BLOCKS.map((b) => emBlocos(this.#alvo, b));
	#ruido = (() => {
		const rand = seeded(17);
		return Array.from({ length: N * N }, () => [rand() * 255, rand() * 255, rand() * 255]);
	})();
	#timer = 0;
	#start = 0;
	#label = null;

	get #still() {
		return matchMedia('(prefers-reduced-motion: reduce)').matches || /print-pdf/.test(location.search);
	}

	connectedCallback() {
		if (this.#ctx) return;
		const canvas = this.querySelector('canvas');
		canvas.width = N;
		canvas.height = N;
		this.#ctx = canvas.getContext('2d');
		this.#img = this.#ctx.createImageData(N, N);
		this.#label = this.querySelector('[data-passo]');
		this.#draw(this.#still ? STEPS : 0);
	}

	disconnectedCallback() {
		this.pause();
	}

	play() {
		this.pause();
		if (this.#still) {
			this.classList.add('done');
			return this.#draw(STEPS);
		}
		// reinicia as animações de CSS da etapa do modelo
		this.classList.remove('run', 'done');
		void this.offsetWidth;
		this.classList.add('run');
		let step = 0;
		this.#draw(0);
		this.#start = setTimeout(() => {
			this.#timer = setInterval(() => {
				step += 1;
				this.#draw(step);
				if (step >= STEPS) this.pause();
			}, STEP_MS);
		}, MODEL_MS);
	}

	pause() {
		clearTimeout(this.#start);
		clearInterval(this.#timer);
		this.#timer = 0;
	}

	/** Passo s: a imagem no nível de detalhe do passo, misturada com o ruído que ainda sobra. */
	#draw(s) {
		const resto = (1 - s / STEPS) ** 1.5;
		const base = this.#passos[Math.min(s, BLOCKS.length - 1)];
		const d = this.#img.data;
		for (let i = 0; i < N * N; i++) {
			const t = base[i];
			const n = this.#ruido[i];
			for (let c = 0; c < 3; c++) d[i * 4 + c] = Math.round(t[c] + (n[c] - t[c]) * resto);
			d[i * 4 + 3] = 255;
		}
		this.#ctx.putImageData(this.#img, 0, 0);
		if (this.#label) this.#label.textContent = s >= STEPS ? 'pronto' : `passo ${s} de ${STEPS}`;
	}
}

if (!customElements.get('ivr-difusao')) customElements.define('ivr-difusao', IvrDifusao);
