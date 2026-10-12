// <ivr-mundo-novo>: o "momento de espanto". No clique (fragmento do reveal.js) um gnomo entra
// pela esquerda, para e conjura uma porta, que se materializa entre faíscas; ele abre a porta,
// acena e sai andando para o canto direito, onde fica feliz, enquanto a porta se expande até virar
// a tela inteira: um mundo em pixel art, na paleta de Stardew Valley, onde a noite vira manhã e o
// sol nasce entre montanhas verdes, sobre um campo com cerca e árvores. Tudo numa grade de 320×180 pixels, ampliada sem suavização (a camada
// cobre o slide e sangra 12% para cada lado: ver .s-overlay em slides.css).
//
// API para o deck: play() abre e anima; pause() para o laço; reset() volta ao início (fechado).
// Reduced-motion e impressão: só o amanhecer pronto, parado.

import { seeded } from './ink.js';

const W = 320;
const H = 180;
const HORIZON = 128;
const SUN_X = 160;
const SUN_R = 17;
// Roteiro (ms desde o clique).
const T = {
	walk: 200, // o gnomo entra pela esquerda
	summon: 2000, // para e levanta a mão
	door: 2300, // a porta se constrói, fileira por fileira
	reach: 4300, // estica o braço até a maçaneta
	open: 4800, // a porta abre; lá dentro, a noite
	wave: 5600, // acena para a turma
	leave: 6200, // sai andando para a direita
	happy: 8600, // chega no canto direito e fica ali, feliz
	expand: 6900, // a porta vira a tela inteira
	caption: 10800, // a frase do rodapé
};
const DOOR_BUILD = 1800;
const SPARKLE_PAD = 10; // faíscas em volta da porta, em pixels da grade
const DAWN = 5600; // da noite à manhã, a partir de T.open
const EXPAND = 1300;
// Porta (grade 320×180): o vão interno, onde o mundo aparece, e o chão do slide.
const DOOR = { x: 148, y: 106, w: 24, h: 44 };
const GAP = { x: DOOR.x + 2, y: DOOR.y + 2, w: DOOR.w - 4, h: DOOR.h - 2, arch: 10 };
const GROUND = DOOR.y + DOOR.h;
// O canto direito fica dentro da área visível do slide (a camada sangra até x≈31 e x≈289).
const GNOME = { from: 10, to: GAP.x - 18, rest: 252 };
const HOP_EVERY = 1600; // no canto, um pulinho de alegria de tempos em tempos

// Bayer 4×4: o pontilhado dos anos 90 entre duas faixas de cor.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
// Paleta "Stardew Valley": céu anil estrelado que vira azul de manhã, montanhas verdes com a face
// iluminada mais clara, as do fundo azuladas; no chão, grama, cerca de madeira, árvores e terra.
const SKY_NIGHT = ['#070b26', '#0b1440', '#112058', '#182d6e', '#1f3a80', '#25468e'];
const SKY_DAWN = ['#1f4cb6', '#3a72d6', '#7aa6e6', '#f2b6a6', '#ffad6a', '#ffd47a'];
const LAYERS = [
	{ seed: 11, base: 127, amp: 22, day: '#2c8a2c', light: '#56b83a', crease: '#1f6e2a', night: '#0c2420' },
	{ seed: 7, base: 118, amp: 40, day: '#3c9e44', light: '#7ccf4c', crease: '#2c8338', night: '#102c2a', rim: '#ffc27a' },
	{ seed: 3, base: 108, amp: 56, day: '#4a8eb2', light: '#86c0d4', night: '#16264a', rim: '#ffd59a' },
];
const SUN_TOP = '#fff1a8';
const SUN_LOW = '#ffa63d';
const GLOW = '#ffe39a';
const RAY_TINT = '#fff4d6'; // os raios clareiam o céu, sem pontilhado
const RAYS = 16;
const RAY_REACH = 170;
const SUN_RISE = [150, 86]; // y do centro do sol: escondido atrás do vale → nascendo
const LIGHT_DEPTH = 12; // quantos pixels abaixo do cume a face iluminada vai clareando
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
const DIRT_Y = 160;
const FENCE = { top: 119, rails: [122, 127], every: 12, gap: [126, 194] };
const TREES = [
	{ x: 46, y: 100, r: 15 },
	{ x: 272, y: 98, r: 17 },
];
const PINES = [{ x: 14, h: 46 }, { x: 304, h: 52 }];

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const pack = ([r, g, b]) => ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
const smooth = (t) => t * t * (3 - 2 * t);

// Gnomo, virado para a direita (16×23). Cada letra é uma cor (ver GNOME_INK); "." é transparente.
const HEAD = [
	'..hR............',
	'...hRR..........',
	'....hRR.........',
	'....hRRr........',
	'....hRRRr.......',
	'...hhRRRRr......',
	'...hRRRRRRr.....',
	'..hRRRRRRRRr....',
	'..hhhhhhhhhhh...',
	'....sSSSSSSS....',
	'....sSSSSSES....',
	'....sSSSSCSNN...',
];
const BEARD = ['...WWWWWWWWWW...', '..WWWWWWWWWWw...'];
const BODY = ['..BWWWWWWWWWwB..', '.BBWWWWWWWWwBB..', '.SBDWWWWWWwDBS..', '..BDDWWWWwDDB...', '..LLLLGGLLLL....', '..PPPPPPPPPP....'];
const LEGS_APART = ['..PPPP..PPPP....', '.PPPP....PPPP...', '.KKKKK...KKKKK..'];
const LEGS_TOGETHER = ['...PPPPPPPP.....', '....PPPPPP......', '...KKKKKKKK.....'];
const GNOME_FRAMES = {
	walkA: [...HEAD, ...BEARD, ...BODY, ...LEGS_APART],
	walkB: [...HEAD, ...BEARD, ...BODY, ...LEGS_TOGETHER],
	reach: [...HEAD, ...BEARD, '..BWWWWWWWWWwB..', '.BBWWWWWWWWwBBBS', '..BDWWWWWWwDB...', ...BODY.slice(3), ...LEGS_TOGETHER],
	wave: [...HEAD, '...WWWWWWWWWW.S.', '..WWWWWWWWWWwB..', '..BWWWWWWWWWwB..', '.BBWWWWWWWWwB...', '.SBDWWWWWWwDB...', ...BODY.slice(3), ...LEGS_TOGETHER],
};
const GNOME_H = GNOME_FRAMES.walkA.length;
const GNOME_INK = {
	R: '#d63a2a', r: '#ef6a4a', h: '#9e2a20',
	S: '#f6c9a0', s: '#e0a07a', C: '#f08a7a', E: '#2a1a14', N: '#f0a080',
	W: '#fbf7ee', w: '#d9d2c4',
	B: '#3f6fd0', D: '#2d50a0', L: '#3a2a1a', G: '#ffc861',
	P: '#7a4e2a', K: '#4a2a18',
};
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

const fromRows = (rows) => sprite(rows[0].length, rows.length, (x, y) => GNOME_INK[rows[y][x]] ?? null);

/** Dentro do arco: retângulo com o topo arredondado. */
const inArch = (x, y, w, r) => y >= r || ((x + 0.5 - w / 2) / (w / 2)) ** 2 + ((y + 0.5 - r) / r) ** 2 <= 1;

function doorFrame() {
	const { w, h } = DOOR;
	return sprite(w, h, (x, y) => (inArch(x, y, w, 12) && !(x >= 2 && x < w - 2 && y >= 2 && inArch(x - 2, y - 2, w - 4, GAP.arch)) ? WOOD.frame : null));
}

function doorPanel() {
	const { w, h, arch } = GAP;
	return sprite(w, h, (x, y) => {
		if (!inArch(x, y, w, arch)) return null;
		if (x >= 2 && x <= 3 && y >= 23 && y <= 24) return WOOD.knob;
		if (x % 5 === 4 || y === 16 || y === 34) return WOOD.plank;
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
		const valley = 1 - 0.75 * Math.exp(-(((x - SUN_X) / 48) ** 2));
		const v = (sample(coarse, x, 34) * 0.78 + sample(fine, x, 6) * 0.22) * valley;
		return Math.round(base - amp * v);
	});
}

function stars() {
	const rand = seeded(29);
	return Array.from({ length: 70 }, () => ({ x: Math.floor(rand() * W), y: Math.floor(rand() * 70), phase: rand() * 6.28 }));
}

/** Nuvens: bolhas de pixels, guardadas como deslocamentos a partir do centro. */
function clouds() {
	const rand = seeded(41);
	return Array.from({ length: 4 }, (_, i) => {
		const pts = [];
		const blobs = Array.from({ length: 4 }, (_, k) => ({ dx: k * 7 - 10 + rand() * 4, dy: rand() * 3, r: 4 + rand() * 4 }));
		for (let y = -9; y <= 6; y++) {
			for (let x = -20; x <= 22; x++) {
				if (blobs.some((b) => (x - b.dx) ** 2 + ((y - b.dy) * 1.6) ** 2 < b.r * b.r)) pts.push([x, y]);
			}
		}
		return { x: 40 + i * 80 + rand() * 30, y: 18 + rand() * 26, speed: 0.004 + rand() * 0.004, pts };
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
		this.#gnomeFrames = Object.fromEntries(Object.entries(GNOME_FRAMES).map(([k, rows]) => [k, fromRows(rows)]));
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
		Object.assign(this.#ground.style, { top: `${(GROUND / H) * 100}%`, height: `${(1 / H) * 100}%` });
		this.replaceChildren(this.#wrap, this.#ground, this.#door, this.#panel, this.#sparkles, this.#gnome);
		if (this.#still) this.#showFinal();
		else this.reset();
		window.addEventListener('beforeprint', () => this.#showFinal());
	}

	/** Um canvas de sprite posicionado na grade 320×180 (o canvas tem 1 px de contorno em volta). */
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
			this.#wrap.animate([{ clipPath: this.#gapClip() }, { clipPath: full }], { duration: EXPAND, delay: T.expand, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', fill: 'both' }),
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
		for (let n = 0; n < 9; n++) {
			const sx = Math.floor(rand() * this.#sparkles.width);
			const sy = Math.floor(rand() * this.#sparkles.height);
			const twinkle = Math.sin(t * 0.012 + rand() * 6.28);
			if (twinkle < 0) continue;
			const arm = twinkle > 0.6 ? 2 : 1;
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
		if (t < T.summon) {
			x = GNOME.from + (GNOME.to - GNOME.from) * clamp01((t - T.walk) / (T.summon - T.walk));
			frame = Math.floor(t / 150) % 2 ? 'walkB' : 'walkA';
			lift = frame === 'walkB' ? 1 : 0;
		} else if (t < T.reach) {
			x = GNOME.to;
			frame = 'wave'; // mão levantada: conjura a porta
		} else if (t < T.wave) {
			x = GNOME.to;
			frame = 'reach';
		} else if (t < T.leave) {
			x = GNOME.to;
			frame = 'wave';
			lift = Math.round(Math.abs(Math.sin(((t - T.wave) / (T.leave - T.wave)) * Math.PI * 2)) * 4);
		} else if (t < T.happy) {
			x = GNOME.to + (GNOME.rest - GNOME.to) * smooth(clamp01((t - T.leave) / (T.happy - T.leave)));
			frame = Math.floor(t / 150) % 2 ? 'walkB' : 'walkA';
			lift = frame === 'walkB' ? 1 : 0;
		} else {
			// Feliz no canto: acena e dá um pulinho a cada HOP_EVERY ms.
			const k = ((t - T.happy) % HOP_EVERY) / 500;
			x = GNOME.rest;
			frame = 'wave';
			lift = k < 1 ? Math.round(Math.sin(k * Math.PI) * 4) : 0;
		}
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
					if (L.rim && depth === 0 && p > 0.25 && Math.abs(x - SUN_X) < 120) c = L.rim;
					else if (lit && (depth < LIGHT_DEPTH / 2 || (depth < LIGHT_DEPTH && dither > 0.5))) c = L.light;
					else if (L.crease && depth > 3 && (x * 3 + (top >> 1)) % 17 === 0) c = L.crease;
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
				if (d2 < SUN_R * SUN_R) c = dy > 5 ? sunLow : sunTop;
				else if (p > 0.3 && (d < SUN_R + 3 || (d < SUN_R + 6 && dither > 0.5))) c = glow; // halo curto
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
			const cx = Math.round(((c.x + clock * c.speed) % (W + 60)) - 30);
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
				if (y < DIRT_Y) color = noise(x, y >> 1) > 0.93 ? c.tuft : c.grass;
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
				this.#px(x, ry + 2, c.outline);
			}
		});
		for (let x0 = 4; x0 < W; x0 += every) {
			if (open(x0) || open(x0 + 3)) continue;
			for (let y = top; y <= HORIZON + 4; y++) {
				this.#px(x0 - 1, y, c.outline);
				this.#px(x0, y, c.woodLight);
				this.#px(x0 + 1, y, c.wood);
				this.#px(x0 + 2, y, c.wood);
				this.#px(x0 + 3, y, c.outline);
			}
			[x0, x0 + 1, x0 + 2].forEach((x) => this.#px(x, top - 1, c.outline));
		}
	}

	/** Árvore redonda: tronco e copa com luz em cima à esquerda e sombra embaixo à direita. */
	#drawTree({ x: cx, y: cy, r }, c) {
		for (let y = cy; y <= HORIZON + 6; y++) {
			for (let x = cx - 2; x <= cx + 2; x++) this.#px(x, y, Math.abs(x - cx) === 2 ? c.outline : c.trunk);
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
				const lump = Math.sin(x * 0.9) * Math.cos(y * 0.8) > 0.55;
				this.#px(x, y, shade < -0.55 || (lump && shade < 0) ? c.leafLight : shade > 0.6 ? c.leafDark : c.leaf);
			}
		}
	}

	/** Pinheiros escuros nas bordas, como na moldura do Stardew. */
	#drawPines(c) {
		PINES.forEach(({ x: cx, h }) => {
			const base = HORIZON + 6;
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
		const up = [[-2, -1], [-1, 0], [0, 0], [1, 0], [2, -1]];
		const down = [[-2, 1], [-1, 0], [0, 0], [1, 0], [2, 1]];
		[[0, 30, 0], [14, 25, 300], [26, 33, 600]].forEach(([ox, oy, phase]) => {
			const bx = Math.round(((ox + clock * 0.012) % (W + 40)) + 60);
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
