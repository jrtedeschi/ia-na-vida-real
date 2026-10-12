// Peixes em pixel art, virados para a direita (o desenho espelha quando nadam para a esquerda).
// - Peixe-palhaço (28×16): laranja em 3 tons, três faixas brancas com borda preta, nadadeiras com
//   ponta escura, olho com brilho.
// - Cirurgião-patela (13×8): costas azuis, barriga clara, cauda amarela bifurcada.

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const P = (hex) => {
	const [r, g, b] = rgb(hex);
	return ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
};

const INK = P('#22100c');
const CLOWN = {
	light: P('#ffa94d'),
	mid: P('#ff7a1a'),
	dark: P('#d4560a'),
	fin: P('#ff8c2e'),
	white: P('#ffffff'),
	whiteShade: P('#dfe9f2'),
	eyeShine: P('#ffffff'),
};
const TANG = { back: P('#2f6fd1'), belly: P('#8fc2ff'), tail: P('#ffd23c'), eye: P('#101820') };

/** Sprite vazio com helpers e contorno escuro de 1 pixel no fim. */
function canvas(w, h) {
	const px = new Uint32Array(w * h);
	const set = (x, y, c) => {
		if (x >= 0 && y >= 0 && x < w && y < h) px[y * w + x] = c;
	};
	const outline = () => {
		const out = px.slice();
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				if (px[y * w + x]) continue;
				const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => {
					const X = x + a;
					const Y = y + b;
					return X >= 0 && Y >= 0 && X < w && Y < h && px[Y * w + X];
				});
				if (near) out[y * w + x] = INK;
			}
		}
		return out;
	};
	return { set, outline };
}

export const CLOWN_W = 28;
export const CLOWN_H = 16;

export function buildClown() {
	const { set, outline } = canvas(CLOWN_W, CLOWN_H);
	const cx = 15;
	const cy = 8;
	// Cauda arredondada em leque, com a ponta preta.
	for (let x = 1; x <= 5; x++) {
		const half = 1 + (5 - x) * 0.9;
		for (let y = Math.ceil(cy - half); y <= cy + half; y++) set(x, y, x <= 2 ? INK : CLOWN.fin);
	}
	// Nadadeira dorsal recortada, com borda preta em cima.
	for (let x = 8; x <= 20; x++) {
		const top = cy - 6 - (x % 4 < 2 ? 2 : 1);
		for (let y = top; y <= cy - 4; y++) set(x, y, y === top ? INK : CLOWN.fin);
	}
	// Corpo: cabeça cheia (expoente 2,6 na frente), sombreado de cima para baixo.
	for (let y = 0; y < CLOWN_H; y++) {
		for (let x = 4; x < CLOWN_W; x++) {
			const dx = (x - cx) / 11;
			const dy = (y - cy) / 5.6;
			const inside = dx >= 0 ? Math.abs(dx) ** 2.6 + dy * dy <= 1 : dx * dx + dy * dy <= 1;
			if (!inside) continue;
			set(x, y, dy < -0.35 ? CLOWN.light : dy > 0.45 ? CLOWN.dark : CLOWN.mid);
		}
	}
	// Três faixas brancas (cabeça, meio, cauda), cada uma com borda preta dos dois lados.
	[[20, 21], [12, 13], [6, 6]].forEach(([a, b]) => {
		for (let y = 0; y < CLOWN_H; y++) {
			for (let x = a - 1; x <= b + 1; x++) {
				const dx = (x - cx) / 11;
				const dy = (y - cy) / 5.6;
				const inside = dx >= 0 ? Math.abs(dx) ** 2.6 + dy * dy <= 1 : dx * dx + dy * dy <= 1;
				if (!inside) continue;
				set(x, y, x === a - 1 || x === b + 1 ? INK : dy > 0.4 ? CLOWN.whiteShade : CLOWN.white);
			}
		}
	});
	// Nadadeira peitoral, mais clara, com ponta escura.
	[[16, 10], [17, 10], [17, 11], [18, 11], [18, 12]].forEach(([x, y]) => set(x, y, CLOWN.light));
	set(19, 12, INK);
	// Olho com brilho e boca.
	[[23, 6], [24, 6], [23, 7], [24, 7]].forEach(([x, y]) => set(x, y, INK));
	set(23, 6, CLOWN.eyeShine);
	set(26, 9, INK);
	return outline();
}

export const TANG_W = 13;
export const TANG_H = 8;

export function buildTang() {
	const { set, outline } = canvas(TANG_W, TANG_H);
	const cx = 7;
	const cy = 4;
	// Cauda bifurcada amarela.
	[[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [1, 5], [1, 4], [0, 5], [0, 6]].forEach(([x, y]) => set(x, y, TANG.tail));
	for (let y = 0; y < TANG_H; y++) {
		for (let x = 2; x < TANG_W; x++) {
			if (((x - cx) / 5) ** 2 + ((y - cy) / 3.2) ** 2 > 1) continue;
			set(x, y, y > cy ? TANG.belly : TANG.back);
		}
	}
	set(10, 3, TANG.eye);
	return outline();
}

/** Copia um sprite para o buffer da cena, espelhando se `flip`. */
export function blit(buf, w, h, sprite, sw, sh, x0, y0, flip = false) {
	for (let j = 0; j < sh; j++) {
		const Y = y0 + j;
		if (Y < 0 || Y >= h) continue;
		for (let i = 0; i < sw; i++) {
			const c = sprite[j * sw + (flip ? sw - 1 - i : i)];
			const X = x0 + i;
			if (c && X >= 0 && X < w) buf[Y * w + X] = c;
		}
	}
}
