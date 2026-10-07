// Traços "à mão" em SVG, gerados em coordenadas de pixel (sem preserveAspectRatio="none",
// então a espessura do traço não deforma). Determinístico: mesma semente = mesmo traço.

const TAU = Math.PI * 2;

/** Pseudo-aleatório determinístico (mulberry32). */
export function seeded(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Catmull-Rom -> Bézier cúbica: curva suave passando por todos os pontos. */
export function smoothPath(points) {
	if (points.length < 2) return '';
	const f = (n) => n.toFixed(1);
	const parts = [`M${f(points[0][0])} ${f(points[0][1])}`];
	for (let i = 0; i < points.length - 1; i++) {
		const p0 = points[i - 1] ?? points[i];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 = points[i + 2] ?? p2;
		const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
		const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
		parts.push(`C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`);
	}
	return parts.join('');
}

/** Elipse rabiscada em volta de um retângulo, com sobreposição no fim (como caneta). */
export function roughEllipse(rect, { seed = 7, pad = 14, overshoot = 0.55, steps = 30 } = {}) {
	const rand = seeded(seed);
	const cx = rect.x + rect.width / 2;
	const cy = rect.y + rect.height / 2;
	const rx = rect.width / 2 + pad;
	const ry = rect.height / 2 + pad * 0.8;
	const start = -2.2 + rand() * 0.3; // começa no alto, à esquerda
	const wobble = [rand() * TAU, rand() * TAU];
	const points = [];
	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const a = start + t * (TAU + overshoot);
		const grow = 1 + 0.12 * t; // espiral leve: a volta final não fecha exatamente
		const noise = 1 + 0.035 * Math.sin(3 * a + wobble[0]) + 0.02 * Math.sin(5 * a + wobble[1]);
		points.push([cx + Math.cos(a) * rx * grow * noise, cy + Math.sin(a) * ry * grow * noise]);
	}
	return smoothPath(points);
}

/**
 * Seta curva de `from` até `to`. Devolve haste e ponta separadas: o tracejado
 * (stroke-dasharray) que "desenha" o traço funciona melhor com um subcaminho por path.
 */
export function roughArrow(from, to, { bend = 0.25, head = 10 } = {}) {
	const [x0, y0] = from;
	const [x1, y1] = to;
	const mx = (x0 + x1) / 2 - (y1 - y0) * bend;
	const my = (y0 + y1) / 2 + (x1 - x0) * bend;
	const angle = Math.atan2(y1 - my, x1 - mx);
	const leg = (da) => [x1 - head * Math.cos(angle + da), y1 - head * Math.sin(angle + da)];
	const [l1, l2] = [leg(0.5), leg(-0.5)];
	const f = (n) => n.toFixed(1);
	return {
		shaft: `M${f(x0)} ${f(y0)}Q${f(mx)} ${f(my)} ${f(x1)} ${f(y1)}`,
		head: `M${f(l1[0])} ${f(l1[1])}L${f(x1)} ${f(y1)}L${f(l2[0])} ${f(l2[1])}`,
	};
}

/** Sublinhado ondulado, ida e volta, sob um retângulo. */
export function roughUnderline(rect, { seed = 3, y = 6 } = {}) {
	const rand = seeded(seed);
	const base = rect.y + rect.height + y;
	const left = rect.x - 4;
	const right = rect.x + rect.width + 6;
	const points = [
		[left, base + rand() * 3],
		[right, base - 2 + rand() * 3],
		[left + rect.width * 0.25, base + 6 + rand() * 3],
		[right - rect.width * 0.1, base + 5 + rand() * 2],
	];
	return smoothPath(points);
}
