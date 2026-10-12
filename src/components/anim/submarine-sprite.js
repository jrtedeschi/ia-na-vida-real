// Submarino amarelo em pixel art (o da festa), nariz à direita. Sprite 160×88 desenhado pixel a
// pixel: casco em ovo com sombreado em 6 tons, reflexo em cima e luz rebatida embaixo; escotilhas
// em relevo; torre arredondada; periscópio com cotovelo; costuras com rebites; lemes; contorno
// "selout" (mais claro no lado da luz). A hélice é desenhada à parte, a cada quadro.

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const P = (hex) => {
	const [r, g, b] = rgb(hex);
	return ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
};
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);

export const SW = 160;
export const SH = 88;
export const HULL = { cx: 92, cy: 56, rx: 62, ry: 27 };
const TOWER = { x0: 72, x1: 106, y0: 14, y1: 34, r: 11 };
const PORTHOLES = [68, 93, 118];
const SEAMS = [HULL.cx - 40, HULL.cx + 38];
export const PROP = { x: 16, y: HULL.cy };

const HULL_TONES = ['#7a420a', '#a8600e', '#d68616', '#f2ad22', '#ffd23c', '#ffe97a'].map(P);
const C = {
	shine: P('#fffbe0'),
	edgeDark: P('#3d2408'),
	edgeLit: P('#8a520c'),
	rimLight: P('#d6f2ff'),
	rim: P('#9fd6f0'),
	rimDark: P('#5f9ec4'),
	glass: P('#1e4466'),
	glassLow: P('#2f6a96'),
	glint: P('#ffffff'),
	rivet: P('#fff0a0'),
	rivetShadow: P('#a8600e'),
	prop: P('#f08a24'),
	propLight: P('#ffb25a'),
	propDark: P('#c4621a'),
};

const dither = (x, y) => BAYER[((y & 3) << 2) | (x & 3)];

/** Tom do metal pela luz (0 a 1), pontilhando entre tons vizinhos. */
function tone(light, x, y) {
	const l = clamp01(light) * (HULL_TONES.length - 1);
	const i = Math.floor(l);
	return l - i > dither(x, y) ? HULL_TONES[Math.min(i + 1, HULL_TONES.length - 1)] : HULL_TONES[i];
}

/** Casco: nariz arredondado e cheio (expoente 2,4), cauda afinando. Devolve [dentro?, nx, ny]. */
function hullAt(x, y) {
	const dx = (x - HULL.cx) / HULL.rx;
	const taper = dx < 0 ? 1 - 0.42 * dx * dx : 1;
	const dy = (y - HULL.cy) / (HULL.ry * taper);
	const inside = dx >= 0 ? Math.abs(dx) ** 2.4 + dy * dy <= 1 : dx * dx + dy * dy <= 1;
	return [inside, dx, dy];
}

function inTower(x, y) {
	const { x0, x1, y0, y1, r } = TOWER;
	if (x < x0 || x > x1 || y < y0 || y > y1) return false;
	const cx = x < x0 + r ? x0 + r : x > x1 - r ? x1 - r : x;
	return y >= y0 + r || (x - cx) ** 2 + (y - (y0 + r)) ** 2 <= r * r;
}

export function buildSub() {
	const px = new Uint32Array(SW * SH);
	const set = (x, y, c) => {
		if (x >= 0 && y >= 0 && x < SW && y < SH) px[y * SW + x] = c;
	};
	const get = (x, y) => (x >= 0 && y >= 0 && x < SW && y < SH ? px[y * SW + x] : 0);

	// Lemes: aletas pequenas em cima e embaixo da cauda, e o estabilizador visto de lado.
	for (let y = 0; y < SH; y++) {
		for (let x = 22; x <= 40; x++) {
			const off = Math.abs(y - HULL.cy);
			if (off >= 4 && off <= 5 + (40 - x) * 0.6 && !hullAt(x, y)[0]) set(x, y, tone(0.7 - (y - HULL.cy + 14) / 40, x, y));
			if (off <= 1 && x <= 34) set(x, y, tone(off === 0 ? 0.55 : 0.85, x, y));
		}
	}
	// Torre: arredondada, iluminada da esquerda; faixa escura na base (sombra no casco).
	const tw = (TOWER.x1 - TOWER.x0) / 2;
	const tcx = TOWER.x0 + tw;
	for (let y = TOWER.y0; y <= TOWER.y1; y++) {
		for (let x = TOWER.x0; x <= TOWER.x1; x++) {
			if (!inTower(x, y)) continue;
			const nx = (x - tcx) / tw;
			let c = tone(0.8 - 0.55 * nx - 0.25 * ((y - TOWER.y0) / (TOWER.y1 - TOWER.y0)), x, y);
			if (nx > -0.65 && nx < -0.25 && y > TOWER.y0 + 3 && y < TOWER.y0 + 12) c = C.shine;
			if (y >= TOWER.y1 - 2) c = tone(0.25 - 0.3 * nx, x, y);
			set(x, y, c);
		}
	}
	// Casco.
	for (let y = 0; y < SH; y++) {
		for (let x = 0; x < SW; x++) {
			const [inside, nx, ny] = hullAt(x, y);
			if (!inside) continue;
			let light = 0.66 - 0.6 * ny - 0.2 * nx;
			if (ny > 0.82) light += 0.22; // luz rebatida embaixo
			let c = tone(light, x, y);
			const sx = (x - (HULL.cx - 12)) / 30;
			const sy = (y - (HULL.cy - 18)) / 4.2;
			const spec = sx * sx + sy * sy;
			if (spec < 0.45) c = C.shine;
			else if (spec < 1 && dither(x, y) < 0.6) c = C.shine;
			set(x, y, c);
		}
	}
	// Costuras com rebites.
	SEAMS.forEach((sx) => {
		for (let y = 0; y < SH; y++) {
			const [inside, , ny] = hullAt(sx, y);
			if (!inside || ny < -0.9 || ny > 0.9) continue;
			set(sx, y, tone(0.15 - 0.3 * ny, sx, y));
			if (y % 5 === 0) {
				set(sx + 2, y, C.rivet);
				set(sx + 2, y + 1, C.rivetShadow);
			}
		}
	});
	// Periscópio: tubo curto e grosso saindo da frente da torre, cotovelo, braço curto e lente
	// grande com aro, como na peça impressa.
	const PX0 = 94; // borda esquerda do tubo
	const PW = 6; // espessura do tubo
	const ARM_Y0 = 4; // topo do braço
	const ARM_X1 = 107; // fim do braço
	const shade = (k) => (k === 0 ? 0.95 : k === PW - 1 ? 0.3 : 0.65);
	for (let y = ARM_Y0 + 2; y <= TOWER.y0 + 3; y++) {
		for (let x = PX0; x < PX0 + PW; x++) set(x, y, tone(shade(x - PX0), x, y));
	}
	for (let x = PX0; x <= ARM_X1; x++) {
		for (let y = ARM_Y0; y < ARM_Y0 + PW; y++) set(x, y, tone(shade(y - ARM_Y0), x, y));
	}
	// Lente: aro mais largo que o braço, vidro escuro na frente com brilho.
	for (let y = ARM_Y0 - 2; y <= ARM_Y0 + PW + 1; y++) {
		for (let x = ARM_X1 + 1; x <= ARM_X1 + 4; x++) {
			const edge = y === ARM_Y0 - 2 || y === ARM_Y0 + PW + 1;
			set(x, y, x === ARM_X1 + 4 && !edge ? C.glass : y < ARM_Y0 + 2 ? C.rimLight : edge ? C.rimDark : C.rim);
		}
	}
	set(ARM_X1 + 4, ARM_Y0, C.glint);
	// Escotilhas em relevo: aro com luz em cima à esquerda, vidro escuro com degradê e brilho.
	PORTHOLES.forEach((cx) => {
		const cy = HULL.cy - 2;
		for (let y = cy - 11; y <= cy + 11; y++) {
			for (let x = cx - 11; x <= cx + 11; x++) {
				const d = Math.hypot(x - cx, y - cy);
				if (d > 10.2) continue;
				if (d > 6.8) {
					const side = (x - cx + (y - cy)) / d; // -1,4 (luz) a 1,4 (sombra)
					set(x, y, side < -0.6 ? C.rimLight : side > 0.7 ? C.rimDark : C.rim);
				} else {
					set(x, y, y - cy + (x - cx) * 0.4 > 1.5 && dither(x, y) < 0.7 ? C.glassLow : C.glass);
				}
			}
		}
		[[-3, -3], [-2, -3], [-3, -2], [-2, -2], [1, -4]].forEach(([a, b]) => set(cx + a, cy + b, C.glint));
	});
	// Contorno "selout": mais claro onde encosta no lado iluminado (em cima), escuro no resto.
	const out = px.slice();
	for (let y = 0; y < SH; y++) {
		for (let x = 0; x < SW; x++) {
			if (get(x, y)) continue;
			const below = get(x, y + 1);
			const any = below || get(x, y - 1) || get(x - 1, y) || get(x + 1, y);
			if (!any) continue;
			out[y * SW + x] = below && y < HULL.cy - 6 ? C.edgeLit : C.edgeDark;
		}
	}
	return out;
}

/** Hélice laranja (vista de lado): eixo, cubo e duas pás que encolhem e crescem ao girar. */
export function drawPropeller(buf, w, h, px, py, t) {
	const put = (x, y, c) => {
		if (x >= 0 && x < w && y >= 0 && y < h) buf[y * w + x] = c;
	};
	for (let x = px + 2; x <= px + 9; x++) {
		put(x, py - 1, C.edgeDark);
		put(x, py, C.propDark);
		put(x, py + 1, C.edgeDark);
	}
	const span = [15, 10, 4, 10][Math.floor(t / 55) % 4];
	for (let dy = -span; dy <= span; dy++) {
		const width = Math.abs(dy) < span * 0.5 ? 2 : 1;
		for (let dx = -width; dx <= width; dx++) {
			const edge = Math.abs(dy) === span || Math.abs(dx) === width;
			put(px + dx, py + dy, edge ? C.edgeDark : dy < 0 ? C.propLight : C.prop);
		}
	}
	for (let dy = -2; dy <= 2; dy++) for (let dx = -1; dx <= 2; dx++) put(px + dx, py + dy, Math.abs(dy) === 2 ? C.edgeDark : C.prop);
}
