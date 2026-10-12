// <ivr-mundo-novo>: o "momento de espanto". No clique (fragmento do reveal.js) um gnomo entra
// pela esquerda, para e conjura uma porta, que se materializa entre faíscas; ele abre a porta,
// acena e sai andando para o canto direito, onde fica feliz, enquanto a porta se expande até virar
// a tela inteira: um mundo em pixel art, na paleta de Stardew Valley, onde a noite vira manhã e o
// sol nasce entre montanhas verdes, sobre um campo com cerca e árvores. Pixel art "64 bits": grade de
// 480×270, ampliada sem suavização (a camada cobre o slide e sangra 12% para cada lado: ver
// .s-overlay em slides.css). A caminhada do gnomo para o canto usa a mesma curva da expansão da
// porta, e o passo dele acompanha a distância percorrida (não desliza).
//
// API para o deck: play() abre e anima; pause() para o laço; reset() volta ao início (fechado).
// Reduced-motion e impressão: só o amanhecer pronto, parado.

import { seeded } from './ink.js';

const W = 480;
const H = 270;
const HORIZON = 192;
const SUN_X = 240;
const SUN_R = 26;
// Roteiro (ms desde o clique).
const EXPAND = 2400; // a porta vira a tela inteira; o gnomo anda até o canto no mesmo tempo
const T = {
	walk: 200, // o gnomo entra pela esquerda
	summon: 2000, // para e levanta a mão
	door: 2300, // a porta se materializa
	reach: 4300, // estica o braço até a maçaneta
	open: 4800, // a porta abre; lá dentro, a noite
	wave: 5600, // acena para a turma
	expand: 6400, // a porta se expande e o gnomo sai andando para o canto direito, juntos
	happy: 6400 + EXPAND, // chega no canto direito e fica ali, feliz
	caption: 10800, // a frase do rodapé
};
// Mesma curva para a expansão (CSS) e para a caminhada (JS), para andarem juntas.
const EXPAND_EASE = [0.45, 0, 0.25, 1];
const DOOR_BUILD = 1800;
const SPARKLE_PAD = 15; // faíscas em volta da porta, em pixels da grade
const DAWN = 5600; // da noite à manhã, a partir de T.open
// Porta (grade 480×270): o vão interno, onde o mundo aparece, e o chão do slide.
const DOOR = { x: 222, y: 159, w: 36, h: 66 };
const GAP = { x: DOOR.x + 3, y: DOOR.y + 3, w: DOOR.w - 6, h: DOOR.h - 3, arch: 15 };
const GROUND = DOOR.y + DOOR.h;
// O canto direito fica dentro da área visível do slide (a camada sangra até x≈47 e x≈433).
const GNOME = { from: 15, to: GAP.x - 29, rest: 378 };
const STRIDE = 7; // pixels de chão por passo: o pé troca conforme o gnomo anda, não conforme o tempo
const HOP_EVERY = 1600; // no canto, um pulinho de alegria de tempos em tempos

// Bayer 4×4: o pontilhado dos anos 90 entre duas faixas de cor.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
// Paleta "Stardew Valley": céu anil estrelado que vira azul de manhã, montanhas verdes com a face
// iluminada mais clara, as do fundo azuladas; no chão, grama, cerca de madeira, árvores e terra.
const SKY_NIGHT = ['#070b26', '#0b1440', '#112058', '#182d6e', '#1f3a80', '#25468e'];
const SKY_DAWN = ['#1f4cb6', '#3a72d6', '#7aa6e6', '#f2b6a6', '#ffad6a', '#ffd47a'];
const LAYERS = [
	{ seed: 11, base: 190, amp: 33, day: '#2c8a2c', light: '#56b83a', crease: '#1f6e2a', night: '#0c2420' },
	{ seed: 7, base: 177, amp: 60, day: '#3c9e44', light: '#7ccf4c', crease: '#2c8338', night: '#102c2a', rim: '#ffc27a' },
	{ seed: 3, base: 162, amp: 84, day: '#4a8eb2', light: '#86c0d4', night: '#16264a', rim: '#ffd59a' },
];
const SUN_TOP = '#fff1a8';
const SUN_LOW = '#ffa63d';
const GLOW = '#ffe39a';
const RAY_TINT = '#fff4d6'; // os raios clareiam o céu, sem pontilhado
const RAYS = 16;
const RAY_REACH = 255;
const SUN_RISE = [225, 129]; // y do centro do sol: escondido atrás do vale → nascendo
const LIGHT_DEPTH = 18; // quantos pixels abaixo do cume a face iluminada vai clareando
// Primeiro plano: [noite, dia]
const FG = {
	grass: ['#0f2a1c', '#5cb83c'],
	tuft: ['#0b2016', '#3c9a30'],
	dirt: ['#2a2638', '#e2b56c'],
	speck: ['#211d2e', '#c48f4c'],
	wood: ['#251c2a', '#a8703a'],
	woodLight: ['#2e2433', '#d39a52'],
	trunk: ['#1c1520', '#7a4e2a'],
	leaf: ['#0d2a1a', '#3f9e34'],
	leafLight: ['#123620', '#78cc48'],
	leafDark: ['#081c12', '#25742a'],
	pine: ['#071a14', '#1f5e36'],
	outline: ['#05060f', '#2a2a1a'],
};
const DIRT_Y = 240;
const FENCE = { top: 178, rails: [183, 191], every: 18, gap: [189, 291] };
const TREES = [
	{ x: 69, y: 150, r: 22 },
	{ x: 408, y: 147, r: 25 },
];
const PINES = [{ x: 21, h: 69 }, { x: 456, h: 78 }];

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const pack = ([r, g, b]) => ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
const smooth = (t) => t * t * (3 - 2 * t);
/** Valor de uma cubic-bezier CSS ([x1, y1, x2, y2]) no tempo t (0 a 1), por bisseção em x. */
function cubicBezier([x1, y1, x2, y2], t) {
	const k = clamp01(t);
	const at = (a, b, u) => 3 * a * u * (1 - u) ** 2 + 3 * b * u * u * (1 - u) + u ** 3;
	let lo = 0;
	let hi = 1;
	for (let i = 0; i < 24; i++) {
		const mid = (lo + hi) / 2;
		if (at(x1, x2, mid) < k) lo = mid;
		else hi = mid;
	}
	return at(y1, y2, (lo + hi) / 2);
}

// Gnomo, virado para a direita, 24×35, desenhado por código: gorro com brilho e sombra e a ponta
// caída para trás, rosto com olho, bochecha e nariz arredondado, barba com mechas, túnica azul,
// cinto com fivela, calça e botas. Quadros: dois de caminhada, braço esticado e aceno.
const GNOME_W = 24;
const GNOME_H = 35;
const INK = {
	hat: '#d63a2a', hatLight: '#f06a4a', hatDark: '#9e2a20',
	skin: '#f6c9a0', skinDark: '#e0a07a', cheek: '#f08a7a', nose: '#f2a088', eye: '#2a1a14', shine: '#ffffff',
	beard: '#fbf7ee', beardShade: '#d9d2c4',
	shirt: '#3f6fd0', shirtDark: '#2d50a0', belt: '#3a2a1a', buckle: '#ffc861',
	pants: '#7a4e2a', boot: '#4a2a18', bootLight: '#6a3c22',
};

function gnomeColor(frame, x, y) {
	// Braços (antes do corpo, para a barba passar por cima).
	const arm = (x0, x1, y0, y1) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
	if (frame === 'wave' && arm(19, 21, 12, 20)) return y <= 13 ? INK.skin : x === 21 ? INK.shirtDark : INK.shirt;
	if (frame === 'reach' && arm(18, 23, 20, 22)) return x >= 22 ? INK.skin : y === 22 ? INK.shirtDark : INK.shirt;
	if (frame !== 'wave' && frame !== 'reach' && arm(17, 19, 20, 25)) return y >= 25 ? INK.skin : INK.shirtDark;
	if (arm(3, 5, 20, 25)) return y >= 25 ? INK.skin : x === 3 ? INK.shirtDark : INK.shirt;
	// Gorro: cone com a ponta caída para trás (esquerda), brilho à direita, sombra à esquerda.
	if (y <= 12) {
		const half = 1 + (y / 12) * 8;
		const cx = 11 - (12 - y) * 0.35;
		const dx = x - cx;
		if (Math.abs(dx) > half) return null;
		if (y >= 11) return INK.hatDark; // aba
		return dx > half - 2 ? INK.hatLight : dx < -half + 2 ? INK.hatDark : INK.hat;
	}
	// Rosto.
	if (y >= 13 && y <= 17 && x >= 7 && x <= 16) {
		if (x === 14 && (y === 14 || y === 15)) return y === 14 ? INK.shine : INK.eye;
		if (x === 15 && y === 15) return INK.eye;
		if ((x === 12 || x === 13) && y === 16) return INK.cheek;
		return x === 7 ? INK.skinDark : INK.skin;
	}
	if (x >= 16 && x <= 18 && y >= 14 && y <= 17 && (x - 17) ** 2 + (y - 15.5) ** 2 <= 2.4) return INK.nose;
	// Barba: alarga e termina em ponta, com mechas mais escuras.
	if (y >= 17 && y <= 28) {
		const half = y < 22 ? 5 + (y - 17) * 0.6 : 8 - (y - 22) * 1.25;
		if (Math.abs(x - 11.5) <= half) return (x + Math.floor(y / 2)) % 4 === 0 || x < 8 ? INK.beardShade : INK.beard;
	}
	// Túnica atrás da barba.
	if (y >= 19 && y <= 27 && x >= 5 && x <= 17) return x <= 6 || y === 27 ? INK.shirtDark : INK.shirt;
	// Cinto com fivela.
	if (y >= 28 && y <= 29 && x >= 5 && x <= 17) return x >= 10 && x <= 12 ? INK.buckle : INK.belt;
	// Calça.
	if (y >= 30 && y <= 31 && x >= 6 && x <= 16) return INK.pants;
	// Pernas e botas: abertas ou juntas.
	const legs = frame === 'walkA' ? [[4, 8], [13, 17]] : [[7, 10], [12, 15]];
	for (const [a, b] of legs) {
		if (x < a || x > b) continue;
		if (y === 32) return INK.pants;
		if (y >= 33 && y <= 34) return y === 33 && x === a ? INK.bootLight : INK.boot;
	}
	// Bico da bota para a frente.
	if (y === 34 && legs.some(([, b]) => x === b + 1)) return INK.boot;
	return null;
}

const GNOME_FRAMES = ['walkA', 'walkB', 'reach', 'wave'];

const WOOD = { frame: '#5a3a22', panel: '#8b5a2b', plank: '#6e4422', knob: '#ffc861' };
const OUTLINE = '#24183f';

/** Desenha um sprite (função cor(x, y) ou null) num canvas com contorno de 1 pixel em volta. */
function sprite(w, h, colorAt) {
	const c = document.createElement('canvas');
	c.width = w + 2;
	c.height = h + 2;
	const ctx = c.getContext('2d');
	const filled = (x, y) => x >= 0 && y >= 0 && x < w && y < h && colorAt(x, y);
	ctx.fillStyle = OUTLINE;
	for (let y = -1; y <= h; y++) {
		for (let x = -1; x <= w; x++) {
			if (!filled(x, y) && (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))) ctx.fillRect(x + 1, y + 1, 1, 1);
		}
	}
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const col = colorAt(x, y);
			if (!col) continue;
			ctx.fillStyle = col;
			ctx.fillRect(x + 1, y + 1, 1, 1);
		}
	}
	return c;
}

const gnomeSprite = (frame) => sprite(GNOME_W, GNOME_H, (x, y) => gnomeColor(frame, x, y));

/** Dentro do arco: retângulo com o topo arredondado. */
const inArch = (x, y, w, r) => y >= r || ((x + 0.5 - w / 2) / (w / 2)) ** 2 + ((y + 0.5 - r) / r) ** 2 <= 1;

function doorFrame() {
	const { w, h } = DOOR;
	return sprite(w, h, (x, y) => (inArch(x, y, w, 18) && !(x >= 3 && x < w - 3 && y >= 3 && inArch(x - 3, y - 3, w - 6, GAP.arch)) ? WOOD.frame : null));
}

function doorPanel() {
	const { w, h, arch } = GAP;
	return sprite(w, h, (x, y) => {
		if (!inArch(x, y, w, arch)) return null;
		if (x >= 3 && x <= 5 && y >= 34 && y <= 36) return WOOD.knob;
		if (x % 7 === 6 || y === 24 || y === 51) return WOOD.plank;
		return WOOD.panel;
	});
}

/** Cume de montanha: ruído suave em duas escalas, com um vale no meio para o sol nascer. */
function ridge({ seed, base, amp }) {
	const rand = seeded(seed);
	const coarse = Array.from({ length: 16 }, rand);
	const fine = Array.from({ length: 64 }, rand);
	const sample = (arr, x, period) => {
		const f = x / period;
		const i = Math.floor(f);
		const t = smooth(f - i);
		return arr[i % arr.length] + (arr[(i + 1) % arr.length] - arr[i % arr.length]) * t;
	};
	return Array.from({ length: W }, (_, x) => {
		const valley = 1 - 0.75 * Math.exp(-(((x - SUN_X) / 72) ** 2));
		const v = (sample(coarse, x, 51) * 0.78 + sample(fine, x, 9) * 0.22) * valley;
		return Math.round(base - amp * v);
	});
}

function stars() {
	const rand = seeded(29);
	return Array.from({ length: 110 }, () => ({ x: Math.floor(rand() * W), y: Math.floor(rand() * 105), phase: rand() * 6.28 }));
}

/** Nuvens: bolhas de pixels, guardadas como deslocamentos a partir do centro. */
function clouds() {
	const rand = seeded(41);
	return Array.from({ length: 4 }, (_, i) => {
		const pts = [];
		const blobs = Array.from({ length: 4 }, (_, k) => ({ dx: k * 10.5 - 15 + rand() * 6, dy: rand() * 4.5, r: 6 + rand() * 6 }));
		for (let y = -14; y <= 9; y++) {
			for (let x = -30; x <= 33; x++) {
				if (blobs.some((b) => (x - b.dx) ** 2 + ((y - b.dy) * 1.6) ** 2 < b.r * b.r)) pts.push([x, y]);
			}
		}
		return { x: 60 + i * 120 + rand() * 45, y: 27 + rand() * 39, speed: 0.006 + rand() * 0.006, pts };
	});
}

export class IvrMundoNovo extends HTMLElement {
	#canvas = null;
	#ctx = null;
	#img = null;
	#buf = null;
	#wrap = null;
	#caption = null;
	#ridges = LAYERS.map(ridge);
	#stars = stars();
	#clouds = clouds();
	#raf = 0;
	#t0 = 0;
	#elapsed = 0;
	#anims = [];
	#gnome = null;
	#gnomeFrames = null;
	#frameName = '';
	#door = null;
	#panel = null;
	#ground = null;
	#opened = false;
	#doorSrc = null;
	#sparkles = null;
	#doorShown = -1;

	get #still() {
		return matchMedia('(prefers-reduced-motion: reduce)').matches || /print-pdf/.test(location.search) || matchMedia('print').matches;
	}

	connectedCallback() {
		if (this.#canvas) return;
		this.#wrap = document.createElement('div');
		this.#wrap.className = 'mn-wrap';
		this.#canvas = document.createElement('canvas');
		this.#canvas.width = W;
		this.#canvas.height = H;
		this.#canvas.setAttribute('role', 'img');
		this.#canvas.setAttribute('aria-label', 'Um gnomo abre uma porta para uma paisagem em pixel art: a noite vira manhã e o sol nasce entre montanhas verdes, sobre um campo com cerca e árvores.');
		this.#ctx = this.#canvas.getContext('2d');
		this.#img = this.#ctx.createImageData(W, H);
		this.#buf = new Uint32Array(this.#img.data.buffer);
		this.#caption = document.createElement('p');
		this.#caption.className = 'mn-caption';
		this.#caption.textContent = this.getAttribute('caption') ?? '';
		this.#wrap.append(this.#canvas, this.#caption);
		this.#gnomeFrames = Object.fromEntries(GNOME_FRAMES.map((k) => [k, gnomeSprite(k)]));
		this.#gnome = this.#place(this.#gnomeFrames.walkA, 0, GROUND - GNOME_H, 'mn-gnome');
		this.#doorSrc = [doorFrame(), doorPanel()].map((c) => c.getContext('2d').getImageData(0, 0, c.width, c.height));
		this.#door = this.#place(doorFrame(), DOOR.x, DOOR.y, 'mn-door');
		this.#panel = this.#place(doorPanel(), GAP.x, GAP.y, 'mn-panel');
		const sp = document.createElement('canvas');
		sp.width = DOOR.w + SPARKLE_PAD * 2;
		sp.height = DOOR.h + SPARKLE_PAD * 2;
		this.#sparkles = this.#place(sp, DOOR.x - SPARKLE_PAD + 1, DOOR.y - SPARKLE_PAD + 1, 'mn-sparkles');
		this.#ground = document.createElement('div');
		this.#ground.className = 'mn-ground';
		Object.assign(this.#ground.style, { top: `${(GROUND / H) * 100}%`, height: `${(2 / H) * 100}%` });
		this.replaceChildren(this.#wrap, this.#ground, this.#door, this.#panel, this.#sparkles, this.#gnome);
		if (this.#still) this.#showFinal();
		else this.reset();
		window.addEventListener('beforeprint', () => this.#showFinal());
	}

	/** Um canvas de sprite posicionado na grade 480×270 (o canvas tem 1 px de contorno em volta). */
	#place(canvas, x, y, cls) {
		const node = document.createElement('canvas');
		node.width = canvas.width;
		node.height = canvas.height;
		node.getContext('2d').drawImage(canvas, 0, 0);
		node.className = `mn-sprite ${cls}`;
		Object.assign(node.style, {
			left: `${((x - 1) / W) * 100}%`,
			top: `${((y - 1) / H) * 100}%`,
			width: `${(canvas.width / W) * 100}%`,
			height: `${(canvas.height / H) * 100}%`,
		});
		return node;
	}

	#setGnome(name) {
		if (name === this.#frameName) return;
		this.#frameName = name;
		const ctx = this.#gnome.getContext('2d');
		ctx.clearRect(0, 0, this.#gnome.width, this.#gnome.height);
		ctx.drawImage(this.#gnomeFrames[name], 0, 0);
	}

	/** O vão da porta como clip-path: só ali o mundo aparece, até a porta virar a tela inteira. */
	#gapClip() {
		const r = (GAP.arch / W) * this.#wrap.clientWidth;
		const pct = (v, total) => `${((v / total) * 100).toFixed(3)}%`;
		return `inset(${pct(GAP.y, H)} ${pct(W - GAP.x - GAP.w, W)} ${pct(H - GAP.y - GAP.h, H)} ${pct(GAP.x, W)} round ${r}px ${r}px 0 0)`;
	}

	#section() {
		return this.closest('section');
	}

	#showFinal() {
		this.pause();
		this.#anims.forEach((a) => a.cancel());
		this.#anims = [];
		this.#wrap.style.clipPath = 'none';
		[this.#door, this.#panel, this.#ground, this.#sparkles].forEach((n) => (n.style.opacity = '0'));
		this.#moveGnome(T.happy + HOP_EVERY - 1); // parado no canto, acenando
		this.#section()?.classList.add('mn-open');
		this.#draw(Infinity);
	}

	disconnectedCallback() {
		this.pause();
	}

	play() {
		this.reset();
		if (this.#still) return this.#showFinal();
		const fade = [{ opacity: 1 }, { opacity: 0 }];
		const full = 'inset(0% 0% 0% 0% round 0px 0px 0 0)';
		this.#anims = [
			this.#ground.animate([{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 700, delay: 0, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' }),
			// A porta abre como em jogo 2D: a folha se recolhe para a dobradiça (à direita) em poucos quadros.
			this.#panel.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0.14)' }], { duration: 420, delay: T.open, easing: 'steps(4, end)', fill: 'forwards' }),
			// O mundo só aparece quando a porta abre (antes, o vão ficaria vazando atrás da porta em construção).
			this.#wrap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1, delay: T.open, fill: 'backwards' }),
			this.#wrap.animate([{ clipPath: this.#gapClip() }, { clipPath: full }], { duration: EXPAND, delay: T.expand, easing: `cubic-bezier(${EXPAND_EASE.join(', ')})`, fill: 'both' }),
			...[this.#door, this.#panel, this.#ground].map((n) => n.animate(fade, { duration: 400, delay: T.expand, fill: 'forwards' })),
			this.#caption.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, delay: T.caption, fill: 'both' }),
		];
		this.#resume();
	}

	pause() {
		cancelAnimationFrame(this.#raf);
		this.#raf = 0;
	}

	/** Volta ao começo: porta fechada, gnomo fora de cena, mundo escondido atrás da porta. */
	reset() {
		this.pause();
		this.#anims.forEach((a) => a.cancel());
		this.#anims = [];
		this.#elapsed = 0;
		this.#opened = false;
		this.#section()?.classList.remove('mn-open');
		this.#wrap.style.clipPath = this.#gapClip();
		[this.#door, this.#panel, this.#ground, this.#sparkles].forEach((n) => (n.style.opacity = ''));
		this.#doorShown = -1;
		this.#conjure(0);
		this.#moveGnome(0);
		this.#draw(0);
	}

	/**
	 * A porta se materializa: pixels aparecem em ordem aleatória (dissolve), com faíscas douradas
	 * piscando em volta enquanto ela se forma.
	 */
	#conjure(t) {
		const k = clamp01((t - T.door) / DOOR_BUILD);
		const step = Math.round(k * 24); // redesenha só quando muda (24 quadros de dissolve)
		if (step !== this.#doorShown) {
			this.#doorShown = step;
			[this.#door, this.#panel].forEach((node, n) => {
				const src = this.#doorSrc[n];
				const out = new ImageData(src.width, src.height);
				for (let i = 0; i < src.data.length; i += 4) {
					const px = i / 4;
					const h = Math.sin((px % src.width) * 12.9898 + Math.floor(px / src.width) * 78.233 + n) * 43758.5453;
					if (h - Math.floor(h) < step / 24) out.data.set(src.data.subarray(i, i + 4), i);
				}
				node.getContext('2d').putImageData(out, 0, 0);
			});
		}
		const ctx = this.#sparkles.getContext('2d');
		ctx.clearRect(0, 0, this.#sparkles.width, this.#sparkles.height);
		if (t < T.door - 300 || t > T.door + DOOR_BUILD + 500) return;
		const rand = seeded(61);
		for (let n = 0; n < 12; n++) {
			const sx = Math.floor(rand() * this.#sparkles.width);
			const sy = Math.floor(rand() * this.#sparkles.height);
			const twinkle = Math.sin(t * 0.012 + rand() * 6.28);
			if (twinkle < 0) continue;
			const arm = twinkle > 0.6 ? 3 : 2;
			ctx.fillStyle = '#ffe27a';
			ctx.fillRect(sx - arm, sy, arm * 2 + 1, 1);
			ctx.fillRect(sx, sy - arm, 1, arm * 2 + 1);
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(sx, sy, 1, 1);
		}
	}

	/** Gnomo: anda até a porta, conjura, estica o braço, acena e vai para o canto direito, feliz. */
	#moveGnome(t) {
		const g = this.#gnome;
		let x = GNOME.from;
		let lift = 0;
		let frame = 'walkA';
		const step = (pos) => (Math.floor(pos / STRIDE) % 2 ? 'walkB' : 'walkA'); // o pé troca a cada STRIDE pixels
		if (t < T.summon) {
			x = GNOME.from + (GNOME.to - GNOME.from) * clamp01((t - T.walk) / (T.summon - T.walk));
			frame = step(x);
		} else if (t < T.reach) {
			x = GNOME.to;
			frame = 'wave'; // mão levantada: conjura a porta
		} else if (t < T.wave) {
			x = GNOME.to;
			frame = 'reach';
		} else if (t < T.expand) {
			x = GNOME.to;
			frame = 'wave';
			lift = Math.round(Math.abs(Math.sin(((t - T.wave) / (T.expand - T.wave)) * Math.PI * 2)) * 6);
		} else if (t < T.happy) {
			// Mesma curva e mesmo tempo da expansão da porta: o gnomo e o cenário andam juntos.
			x = GNOME.to + (GNOME.rest - GNOME.to) * cubicBezier(EXPAND_EASE, (t - T.expand) / EXPAND);
			frame = step(x);
		} else {
			// Feliz no canto: acena e dá um pulinho a cada HOP_EVERY ms.
			const k = ((t - T.happy) % HOP_EVERY) / 500;
			x = GNOME.rest;
			frame = 'wave';
			lift = k < 1 ? Math.round(Math.sin(k * Math.PI) * 6) : 0;
		}
		if (frame === 'walkB') lift = Math.max(lift, 1); // balanço leve a cada passo
		this.#setGnome(frame);
		g.style.left = `${((Math.round(x) - 1) / W) * 100}%`;
		g.style.opacity = t >= T.walk ? '1' : '0';
		g.style.transform = `translateY(${(-lift / (GNOME_H + 2)) * 100}%)`;
	}

	#resume() {
		if (this.#raf) return;
		this.#t0 = performance.now() - this.#elapsed;
		const tick = (now) => {
			this.#elapsed = now - this.#t0;
			this.#moveGnome(this.#elapsed);
			this.#conjure(this.#elapsed);
			if (!this.#opened && this.#elapsed >= T.expand) {
				this.#opened = true;
				this.#section()?.classList.add('mn-open');
			}
			this.#draw(this.#elapsed);
			this.#raf = requestAnimationFrame(tick);
		};
		this.#raf = requestAnimationFrame(tick);
	}

	/** Um quadro inteiro, pixel a pixel. `t` em ms desde o clique (Infinity = amanhecer pronto). */
	#draw(t) {
		const done = t === Infinity;
		const clock = done ? 0 : t;
		const p = done ? 1 : smooth(clamp01((t - T.open) / DAWN));
		const sunY = SUN_RISE[0] + (SUN_RISE[1] - SUN_RISE[0]) * p;
		const rot = clock * 0.00003;
		const skyRgb = SKY_NIGHT.map((c, i) => mix(rgb(c), rgb(SKY_DAWN[i]), p));
		const sky = skyRgb.map(pack);
		const skyRay = skyRgb.map((c) => pack(mix(c, rgb(RAY_TINT), 0.22 * p)));
		const layers = LAYERS.map((l) => ({
			body: pack(mix(rgb(l.night), rgb(l.day), p)),
			light: pack(mix(rgb(l.night), rgb(l.light), p)),
			crease: l.crease && pack(mix(rgb(l.night), rgb(l.crease), p)),
			rim: l.rim && pack(mix(rgb(l.night), rgb(l.rim), p)),
		}));
		const sunTop = pack(rgb(SUN_TOP));
		const sunLow = pack(rgb(SUN_LOW));
		const glow = pack(rgb(GLOW));
		const buf = this.#buf;
		const last = sky.length - 1;

		for (let y = 0; y < HORIZON; y++) {
			const f = (y / (HORIZON - 1)) * last;
			const band = Math.min(Math.floor(f), last - 1);
			const frac = f - band;
			const dy = y - sunY;
			for (let x = 0; x < W; x++) {
				const i = y * W + x;
				const dither = BAYER[((y & 3) << 2) | (x & 3)];
				// Montanhas, da mais próxima para a mais distante.
				let hit = false;
				for (let k = 0; k < LAYERS.length && !hit; k++) {
					const ridgeK = this.#ridges[k];
					const top = ridgeK[x];
					if (y < top) continue;
					const L = layers[k];
					const depth = y - top;
					// Face virada para a esquerda (o cume sobe para a direita) pega luz; clareia perto do cume.
					const lit = x > 0 && top <= ridgeK[x - 1];
					let c = L.body;
					// Luz quente do nascer do sol no cume, mais forte perto do sol.
					if (L.rim && depth <= 1 && p > 0.25 && Math.abs(x - SUN_X) < 180) c = L.rim;
					else if (lit && (depth < LIGHT_DEPTH / 2 || (depth < LIGHT_DEPTH && dither > 0.5))) c = L.light;
					else if (L.crease && depth > 4 && (x * 3 + (top >> 1)) % 25 === 0) c = L.crease;
					buf[i] = c;
					hit = true;
				}
				if (hit) continue;
				// Céu em faixas pontilhadas; dentro de um raio, a mesma faixa clareada.
				const dx = x - SUN_X;
				const d2 = dx * dx + dy * dy;
				const d = Math.sqrt(d2);
				const upper = frac > dither;
				let c = upper ? sky[band + 1] : sky[band];
				if (p > 0.15 && d < RAY_REACH * p) {
					const a = (Math.atan2(dy, dx) / (Math.PI * 2) + 1 + rot) * RAYS;
					if ((a | 0) % 2 === 0) c = upper ? skyRay[band + 1] : skyRay[band];
				}
				if (d2 < SUN_R * SUN_R) c = dy > 8 ? sunLow : sunTop;
				else if (p > 0.3 && (d < SUN_R + 4 || (d < SUN_R + 9 && dither > 0.5))) c = glow; // halo curto
				buf[i] = c;
			}
		}
		this.#drawStars(clock, p);
		this.#drawClouds(clock, p);
		this.#drawGround(p);
		this.#drawBirds(clock, p);
		this.#ctx.putImageData(this.#img, 0, 0);
	}

	#drawStars(clock, p) {
		const fade = 1 - p * 1.4;
		if (fade <= 0) return;
		const star = pack(mix(rgb('#182d6e'), rgb('#fffbe6'), fade));
		this.#stars.forEach((s) => {
			if (Math.sin(clock * 0.004 + s.phase) < -0.6) return; // pisca
			const i = s.y * W + s.x;
			if (s.y < this.#ridges[2][s.x]) this.#buf[i] = star;
		});
	}

	#drawClouds(clock, p) {
		const light = pack(mix(rgb('#25356a'), rgb('#ffffff'), p));
		const shade = pack(mix(rgb('#1a2756'), rgb('#cfe6f7'), p));
		this.#clouds.forEach((c) => {
			const cx = Math.round(((c.x + clock * c.speed) % (W + 90)) - 45);
			const cy = Math.round(c.y);
			c.pts.forEach(([dx, dy]) => {
				const x = cx + dx;
				const y = cy + dy;
				if (x < 0 || x >= W || y < 0 || y >= HORIZON || y >= this.#ridges[2][x]) return;
				this.#buf[y * W + x] = dy > 2 ? shade : light;
			});
		});
	}

	/** Primeiro plano: grama com tufos, cerca de madeira, árvores e uma faixa de terra. */
	#drawGround(p) {
		const buf = this.#buf;
		const c = Object.fromEntries(Object.entries(FG).map(([k, [n, d]]) => [k, pack(mix(rgb(n), rgb(d), p))]));
		// Ruído fixo por pixel: tufos de grama (2 px de altura) e pedrinhas na terra.
		const noise = (x, y) => {
			const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
			return n - Math.floor(n);
		};
		for (let y = HORIZON; y < H; y++) {
			for (let x = 0; x < W; x++) {
				let color = c.dirt;
				if (y < DIRT_Y) color = noise(x, Math.floor(y / 3)) > 0.93 ? c.tuft : c.grass;
				else if (y === DIRT_Y) color = c.tuft;
				else if (noise(x, y) > 0.9) color = c.speck;
				buf[y * W + x] = color;
			}
		}
		this.#drawPines(c);
		this.#drawFence(c);
		TREES.forEach((t) => this.#drawTree(t, c));
	}

	#px(x, y, color) {
		if (x >= 0 && x < W && y >= 0 && y < H) this.#buf[y * W + x] = color;
	}

	#drawFence(c) {
		const { top, rails, every, gap } = FENCE;
		const open = (x) => x >= gap[0] && x <= gap[1];
		rails.forEach((ry) => {
			for (let x = 0; x < W; x++) {
				if (open(x)) continue;
				this.#px(x, ry - 1, c.outline);
				this.#px(x, ry, c.woodLight);
				this.#px(x, ry + 1, c.wood);
				this.#px(x, ry + 2, c.wood);
				this.#px(x, ry + 3, c.outline);
			}
		});
		for (let x0 = 6; x0 < W; x0 += every) {
			if (open(x0) || open(x0 + 5)) continue;
			for (let y = top; y <= HORIZON + 6; y++) {
				this.#px(x0 - 1, y, c.outline);
				this.#px(x0, y, c.woodLight);
				this.#px(x0 + 1, y, c.woodLight);
				for (let k = 2; k <= 4; k++) this.#px(x0 + k, y, c.wood);
				this.#px(x0 + 5, y, c.outline);
			}
			for (let k = 0; k <= 4; k++) this.#px(x0 + k, top - 1, c.outline);
		}
	}

	/** Árvore redonda: tronco e copa com luz em cima à esquerda e sombra embaixo à direita. */
	#drawTree({ x: cx, y: cy, r }, c) {
		for (let y = cy; y <= HORIZON + 9; y++) {
			for (let x = cx - 3; x <= cx + 3; x++) this.#px(x, y, Math.abs(x - cx) === 3 ? c.outline : c.trunk);
		}
		for (let y = cy - r - 1; y <= cy + r + 1; y++) {
			for (let x = cx - r - 1; x <= cx + r + 1; x++) {
				const d = Math.hypot(x - cx, (y - cy) * 1.1);
				if (d > r + 1) continue;
				if (d > r) {
					this.#px(x, y, c.outline);
					continue;
				}
				const shade = (x - cx + (y - cy)) / r;
				const lump = Math.sin(x * 0.6) * Math.cos(y * 0.55) > 0.55;
				this.#px(x, y, shade < -0.55 || (lump && shade < 0) ? c.leafLight : shade > 0.6 ? c.leafDark : c.leaf);
			}
		}
	}

	/** Pinheiros escuros nas bordas, como na moldura do Stardew. */
	#drawPines(c) {
		PINES.forEach(({ x: cx, h }) => {
			const base = HORIZON + 9;
			for (let k = 0; k < h; k++) {
				const y = base - k;
				const half = Math.round(((h - k) / h) * (h / 3.2) * (0.7 + 0.3 * ((k % 8) / 8)));
				for (let x = cx - half; x <= cx + half; x++) this.#px(x, y, Math.abs(x - cx) === half ? c.outline : c.pine);
			}
		});
	}

	#drawBirds(clock, p) {
		if (p < 0.5) return;
		const ink = pack(rgb('#1b2a52'));
		const up = [[-3, -2], [-2, -1], [-1, 0], [0, 0], [1, 0], [2, -1], [3, -2]];
		const down = [[-3, 1], [-2, 1], [-1, 0], [0, 0], [1, 0], [2, 1], [3, 1]];
		[[0, 45, 0], [21, 38, 300], [39, 50, 600]].forEach(([ox, oy, phase]) => {
			const bx = Math.round(((ox + clock * 0.018) % (W + 60)) + 90);
			const shape = Math.floor((clock + phase) / 260) % 2 ? up : down;
			shape.forEach(([dx, dy]) => {
				const x = bx + dx;
				const y = oy + dy;
				if (x >= 0 && x < W) this.#buf[y * W + x] = ink;
			});
		});
	}
}

if (!customElements.get('ivr-mundo-novo')) customElements.define('ivr-mundo-novo', IvrMundoNovo);
