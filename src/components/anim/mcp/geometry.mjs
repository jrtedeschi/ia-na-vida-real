/**
 * Geometria da figura MCP (encontro 2): uma bancada com o app de IA ao fundo, uma fileira de portas USB-C
 * iguais na frente dele (o padrão MCP) e, ligadas por cabos com o mesmo conector, as ferramentas:
 * agenda, caixa de correio, planilha. O arquivo de gaveta ainda está desligado, com o conector no chão.
 * Cada porta tem uma chave deslizante: a permissão. Tudo é montado uma vez aqui (build do Astro);
 * o mcp.js só move a chave, o pulso no cabo e a reação de cada ferramenta.
 *
 * Unidades do mundo ≈ 1 px; x e y no chão, z para cima. `node mcp/audit.mjs --audit` prova a geometria.
 */
import * as k from '../iso/iso-kit.mjs';
import * as G from '../iso/lathe.mjs';
import { tubePieces, tubeSvg } from '../iso/tube.mjs';
import * as A from '../iso/audit.mjs';

export const WIDTH = 640;

const PLATE = { x: -150, y: -84, w: 300, d: 176, r: 8 };
const PLATE_H = 10;
const FOOT_H = 5;

const HUB = { x: -112, y: -72, w: 224, d: 44, r: 5 };
const HUB_H = 40;
const FRONT = HUB.y + HUB.d; // -28: face das portas
const RISER = { x: -110, y: -72, w: 220, d: 12, r: 2 };
const RISER_TOP = 98;

export const SOCKETS = [-81, -27, 27, 81];
const BEZEL_D = 1.2;
const BEZEL_Z = [9, 21];
const PORT_Z = 15; // centro das portas USB-C
// Conector USB-C: a ponta de metal, o corpo de plástico (os dois com seção de estádio) e a capa do cabo.
const PLUG = { tip: { w: 12.6, h: 4.4, len: 1.6 }, body: { w: 16, h: 8, len: 10.4 } };
const BOOT = { len: 4, r: 2.6 };
const stadiumOf = (w, h, steps = 10) => {
	const r = h / 2;
	const c = w / 2 - r;
	const arc = (cx, from) => Array.from({ length: steps + 1 }, (_, i) => {
		const t = from + (i / steps) * Math.PI;
		return [cx + r * Math.cos(t), r * Math.sin(t)];
	});
	return [...arc(c, -Math.PI / 2), ...arc(-c, Math.PI / 2)];
};
const CABLE_R = 1.4;
const TOOL_DY = 14; // as ferramentas são desenhadas com a face de trás em y = 22 e empurradas para a frente
const PORT = { y: 22 + TOOL_DY, len: 3, r: 2.6, z: 4 };
const CAB_X = 122; // o gaveteiro fica de lado, para o conector solto aparecer na frente da porta vazia

const SWITCH_Y = -37;
export const SWITCH_TRAVEL = 4.5;

export const TOOLS = [
	{ id: 'agenda', name: 'Agenda', verb: 'marcou a reunião' },
	{ id: 'email', name: 'E-mail', verb: 'achou o e-mail' },
	{ id: 'planilha', name: 'Planilha', verb: 'atualizou a linha' },
];

const DAY = '19';
const MONTH = 'OUT';
const WEEKDAY = 'SEG';

export function buildMcp({ audit = false } = {}) {
	const extremes = [
		...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
		[RISER.x, RISER.y, RISER_TOP],
		[RISER.x + RISER.w, RISER.y, RISER_TOP],
	];
	// O viewBox segue a proporção do próprio desenho, para a figura não sobrar dos lados.
	const camera = { azimuth: 80, elevation: 27 };
	const flat = extremes.map((point) => k.iso(point, { origin: [0, 0], scale: 1, ...camera }));
	const spread = (i) => Math.max(...flat.map((p) => p[i])) - Math.min(...flat.map((p) => p[i]));
	const PAD = 8;
	const HEIGHT = Math.round((WIDTH - PAD * 2) * (spread(1) / spread(0)) + PAD * 2);
	const P = k.fitProjection(extremes, WIDTH, HEIGHT, { pad: PAD, ...camera });
	const R = A.recorder(P);
	const at = (point) => k.iso(point, P);
	const S = (paths, style) => k.solidSvg(paths, style);
	const L = (d, style) => k.lineSvg(d, style);
	const D = (points, style) => k.dotsSvg(points, style);
	const poly = (points, closed = true) => k.pathOf(points.map(at), closed);
	const face = (x, y, zTop) => k.sideMatrix([x, y], zTop, P, 'left');
	const along = (o, a) => G.frameAlong(o, a);
	const put = (name, centre, svg, shapes = [], extra = {}) =>
		R.put({ name, at: centre, svg, shapes: shapes.map((shape) => R.solid({ ...shape, name: shape.name ?? name })), ...extra });
	const putTool = (name, centre, svg, shapes) =>
		put(name, [centre[0], centre[1] + TOOL_DY, centre[2]], `<g transform="${k.translateAlong(P, [0, TOOL_DY, 0])}">${svg}</g>`, shapes.map((shape) => A.moved(shape, [0, TOOL_DY, 0])));
	const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

	/* Bancada: tampo sobre quatro pés, sulco, parafusos e régua na borda da frente. */
	const base = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
	const baseShapes = [];
	for (const [x, y] of byDepth(k.corners(PLATE, 24))) {
		base.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
		base.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
		baseShapes.push(A.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, { name: 'stand.flange' }), A.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, { name: 'stand.foot' }));
	}
	base.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid' }));
	baseShapes.push(A.slab(PLATE, -PLATE_H, PLATE_H, { name: 'stand.plate' }));
	base.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }));
	const screws = k.corners(PLATE, 11);
	base.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
	base.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
	const strip = { x: -126, y: PLATE.y + PLATE.d - 13, w: 252, d: 6, r: 1 };
	base.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
	const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.6, 0.6, [1.8, 3.4], P);
	base.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));
	base.push(D([at([strip.x + 2, strip.y + 3, 0.6]), at([strip.x + strip.w - 2, strip.y + 3, 0.6])], { size: 0.45 }));
	baseShapes.forEach((shape) => R.solid(shape));

	/* O app de IA: corpo, rodapé, frisos, tela com a conversa, respiros e botão de ligar. */
	const hubBody = [];
	const skirt = k.insetPlan(HUB, -1.2);
	hubBody.push(`<path class="iso-halo" d="${k.haloOf(HUB, 0, HUB_H, P)}"/>`);
	hubBody.push(S(k.slabOf(skirt, 0, 3, P, 6, 0.5), { tone: 'lo' }));
	hubBody.push(
		S(k.slabOf(HUB, 3, HUB_H - 3, P, 6, 1.2), {
			tone: 'mid',
			inner: L(k.sideSeam(HUB, 30, P, 6), { tone: 'faint' }),
		}),
	);
	// Respiros (fendas fechadas) e parafusos no tampo.
	const vents = Array.from({ length: 7 }, (_, i) => ({ x: -98 + i * 7, y: -55, w: 3, d: 11, r: 1.5 }));
	hubBody.push(L(vents.map((v) => k.planOutline(v, HUB_H, P, 3)).join(''), { tone: 'lo' }));
	hubBody.push(D(k.corners(HUB, 4).map(([x, y]) => at([x, y, HUB_H])), { size: 0.45 }));
	// Botão de ligar com anel.
	const power = [96, -49];
	hubBody.push(L(k.ring(power[0], power[1], 4.4, HUB_H, P, 24), { tone: 'lo' }));
	hubBody.push(S(k.cylinder(power[0], power[1], 3.2, HUB_H, 1.4, P, 24), { tone: 'hi' }));
	hubBody.push(L(k.lineOnTop([power[0], power[1] - 1.6], [power[0], power[1] + 0.4], HUB_H + 1.4, P), { tone: 'mid', free: true }));

	// Tela: a face da frente do suporte, em coordenadas do plano (x para a direita, y para baixo).
	const screenFace = face(RISER.x, RISER.y + RISER.d, RISER_TOP);
	const screen = { x: 5, y: 4, w: 210, h: 46 };
	const riser = [
		S(k.slabOf(RISER, HUB_H, RISER_TOP - HUB_H, P, 3, 0.8), { tone: 'mid' }),
		`<g transform="${screenFace}">`,
		`<rect class="mcp-screen" x="${screen.x}" y="${screen.y}" width="${screen.w}" height="${screen.h}" rx="2.5"/>`,
		`<path class="mcp-screen-bar" d="M${screen.x + 0.5} ${screen.y + 7}H${screen.x + screen.w - 0.5}"/>`,
		`<circle class="mcp-win" cx="11" cy="7.5" r="1.1"/><circle class="mcp-win" cx="15" cy="7.5" r="1.1"/><circle class="mcp-win" cx="19" cy="7.5" r="1.1"/>`,
		`<rect class="mcp-screen-edge" x="${screen.x}" y="${screen.y}" width="${screen.w}" height="${screen.h}" rx="2.5"/>`,
		// O pedido de quem usa (à direita) e a resposta da IA (à esquerda); o mcp.js troca os textos.
		`<g data-ask><rect class="mcp-bubble mcp-bubble-me" x="68" y="12.5" width="140" height="11" rx="5.5"/>`,
		`<text class="mcp-chat" data-ask-text x="202" y="20.3" font-size="6.4" text-anchor="end">Marca uma reunião segunda às 10h</text></g>`,
		`<g data-answer><rect class="mcp-bubble" x="12" y="26.5" width="140" height="11" rx="5.5"/>`,
		`<text class="mcp-chat" data-reply-text x="18" y="34.3" font-size="6.4">Pronto, marquei na sua agenda.</text></g>`,
		`<rect class="mcp-input" x="12" y="40.5" width="196" height="6" rx="3"/>`,
		`<circle class="mcp-cursor" cx="17" cy="43.5" r="0.9"/>`,
		`</g>`,
		D([at([RISER.x + 3, RISER.y + RISER.d, RISER_TOP - 3]), at([RISER.x + RISER.w - 3, RISER.y + RISER.d, RISER_TOP - 3])], { size: 0.45 }),
	];
	put('hub.riser', [0, -66, 58], riser.join(''), [A.slab(RISER, HUB_H, RISER_TOP - HUB_H, { name: 'hub.riser' })]);

	// Régua de etiqueta acima das portas: a única palavra gravada na figura.
	const tag = { x: -104, y: FRONT, w: 208, d: 0.6, r: 0.3 }; // acima das portas: z 27..36
	const tagSvg = [
		S(k.slabOf(tag, 27, 9, P, 2), { tone: 'mid', crease: 'none' }),
		`<text class="iso-face-text mcp-engraved" transform="${face(tag.x, FRONT + 0.6, 36)}" x="4" y="7" font-size="7">MCP</text>`,
		D([at([tag.x + tag.w - 3, FRONT + 0.6, 31.5])], { size: 0.5 }),
	];
	put('hub.tag', [0, FRONT, 31.5], tagSvg.join(''), [A.slab(tag, 27, 9, { name: 'hub.tag' })]);

	/* As quatro portas USB-C: um espelho no painel, a abertura em estádio e a lingueta de contatos. */
	SOCKETS.forEach((sx, index) => {
		const bezel = { x: sx - 11, y: FRONT, w: 22, d: BEZEL_D, r: 0.6 };
		const local = PORT_Z - BEZEL_Z[1];
		const out = [S(k.slabOf(bezel, BEZEL_Z[0], BEZEL_Z[1] - BEZEL_Z[0], P, 2, 0.4), { tone: 'mid' })];
		out.push(D([at([sx - 9, FRONT + BEZEL_D, PORT_Z]), at([sx + 9, FRONT + BEZEL_D, PORT_Z])], { size: 0.45 }));
		out.push(`<g transform="${face(sx, FRONT + BEZEL_D, BEZEL_Z[1])}">`);
		out.push(`<rect class="mcp-recess" x="-6.5" y="${-local - 2.4}" width="13" height="4.8" rx="2.4"/>`);
		out.push(`<rect class="mcp-tongue" x="-4.2" y="${-local - 0.6}" width="8.4" height="1.2" rx="0.6"/>`);
		out.push(`</g>`);
		put(`socket.${index}`, [sx, FRONT + 0.6, PORT_Z], out.join(''), [A.slab(bezel, BEZEL_Z[0], BEZEL_Z[1] - BEZEL_Z[0], { name: `socket.${index}` })]);
	});

	/* Chaves (permissões): fenda e LED no tampo; o botão desliza (único item que se move). */
	SOCKETS.slice(0, 3).forEach((sx, index) => {
		const slot = { x: sx - 8, y: SWITCH_Y - 1.6, w: 16, d: 3.2, r: 1.6 };
		const knob = { x: sx + SWITCH_TRAVEL - 2.5, y: SWITCH_Y - 2.6, w: 5, d: 5.2, r: 1 };
		const led = [sx + 13, SWITCH_Y];
		hubBody.push(
			L(k.planOutline(slot, HUB_H, P, 3), { tone: 'lo' }),
			L(k.ring(led[0], led[1], 2.2, HUB_H, P, 16), { tone: 'lo' }),
			`<path class="mcp-led" data-led="${index}" d="${k.cylinder(led[0], led[1], 1.4, HUB_H, 0.6, P, 16).fill}"/>`,
		);
		const ribs = [1.4, 2.5, 3.6].map((dx) => k.lineOnTop([knob.x + dx, knob.y + 1.2], [knob.x + dx, knob.y + knob.d - 1.2], HUB_H + 3.6, P)).join('');
		const out = `<g class="mcp-knob" data-knob="${index}">${S(k.slabOf(knob, HUB_H, 3.6, P, 2, 0.4), { tone: 'hi' })}${L(ribs, { tone: 'lo', free: true })}</g>`;
		put(`switch.${index}`, [sx, SWITCH_Y, HUB_H + 1], out, [A.slab(knob, HUB_H, 3.6, { name: `switch.${index}` })]);
	});

	put('hub.body', [0, -50, 20], hubBody.join(''), [
		A.slab(skirt, 0, 3, { name: 'hub.skirt' }),
		A.slab(HUB, 3, HUB_H - 3, { name: 'hub.body' }),
		A.cylinder(power[0], power[1], 3.2, HUB_H, 1.4, { name: 'hub.power' }),
	]);

	/* Conectores USB-C: o mesmo em todas as ferramentas. Três encaixados; o quarto no chão. */
	const plugAt = (sx, y0, zc, index) => {
		const F = G.frameOf([sx, y0, zc], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
		const tip = stadiumOf(PLUG.tip.w, PLUG.tip.h);
		const body = stadiumOf(PLUG.body.w, PLUG.body.h);
		const s1 = PLUG.tip.len;
		const s2 = s1 + PLUG.body.len;
		const bootF = along([sx, y0 + s2, zc], [0, 1, 0]);
		const out = [
			S(G.prismOf(F, tip, 0, s1, P), { tone: 'mid' }),
			S(G.prismOf(F, body, s1, s2, P), { tone: 'hi' }),
			S(G.disc(0, BOOT.len, BOOT.r, bootF, P), { tone: 'mid' }),
		];
		put(`plug.${index}`, [sx, y0 + s2 / 2, zc], out.join(''), [
			A.prism(F, tip, 0, s1, { name: `plug.${index}.tip` }),
			A.prism(F, body, s1, s2, { name: `plug.${index}.body` }),
			A.disc(bootF, 0, BOOT.len, BOOT.r, { name: `plug.${index}.boot` }),
		]);
		return [sx, y0 + s2 + BOOT.len, zc];
	};
	const plugEnds = SOCKETS.map((sx, index) =>
		index < 3 ? plugAt(sx, FRONT + BEZEL_D, PORT_Z, index) : plugAt(sx, -6, PLUG.body.h / 2, index),
	);

	/* Ferramentas. Cada uma tem uma entrada de cabo (boss) na face de trás, rente ao chão. */
	const portOf = (sx, index) => {
		const F = along([sx, PORT.y, PORT.z], [0, -1, 0]);
		return { F, svg: S(G.disc(0, PORT.len, PORT.r, F, P), { tone: 'mid' }), shape: A.disc(F, 0, PORT.len, PORT.r, { name: `port.${index}` }), end: [sx, PORT.y - PORT.len, PORT.z] };
	};
	const ports = SOCKETS.map((sx, index) => portOf(index === 3 ? CAB_X : sx, index));
	ports.forEach((port, index) => put(`port.${index}`, port.end, port.svg, [port.shape]));

	// Agenda: bloco de folhas num pé, barra de encadernação com argolas, página com o dia.
	{
		const sx = SOCKETS[0];
		const TOP = 33;
		const stand = { x: sx - 20, y: 22, w: 40, d: 30, r: 3 };
		const block = { x: sx - 17, y: 27, w: 34, d: 20, r: 1 };
		const bar = { x: sx - 18, y: 25.5, w: 36, d: 6, r: 2 };
		const seams = [10.5, 13.5, 16.5, 19.5, 22.5, 25.5, 28.5].map((z) => L(k.sideSeam(block, z, P, 3), { tone: 'faint' })).join('');
		const page = face(block.x, block.y + block.d, TOP);
		const mid = block.w / 2;
		const out = [
			`<path class="iso-halo" d="${k.haloOf(stand, 0, 7, P)}"/>`,
			S(k.slabOf(stand, 0, 7, P, 4, 0.8), { tone: 'mid' }),
			S(k.slabOf(block, 7, TOP - 7, P, 3, 0.4), { tone: 'hi', inner: seams }),
			`<g transform="${page}">`,
			`<rect class="mcp-band" x="0.6" y="0.6" width="${block.w - 1.2}" height="5.4"/>`,
			`<text class="mcp-print" x="${mid}" y="4.6" font-size="3.8" text-anchor="middle">${MONTH}</text>`,
			`<text class="mcp-day" x="${mid}" y="19" font-size="13" text-anchor="middle">${DAY}</text>`,
			`<text class="mcp-print" x="${mid}" y="24.4" font-size="3" text-anchor="middle">${WEEKDAY}</text>`,
			`<ellipse class="mcp-mark" data-act="agenda" cx="${mid}" cy="14.6" rx="10" ry="7" pathLength="100"/>`,
			`</g>`,
			S(k.slabOf(bar, TOP, 4, P, 4, 0.5), { tone: 'mid' }),
			...[-9, 9].map((dx) => S(k.cylinder(sx + dx, 28.5, 1.8, TOP + 4, 1.6, P, 16), { tone: 'lo' })),
			D([at([stand.x + 3, stand.y + stand.d - 3, 7]), at([stand.x + stand.w - 3, stand.y + stand.d - 3, 7])], { size: 0.45 }),
		];
		putTool('tool.agenda', [sx, 37, 16], out.join(''), [
			A.slab(stand, 0, 7, { name: 'agenda.stand' }),
			A.slab(block, 7, TOP - 7, { name: 'agenda.block' }),
			A.slab(bar, TOP, 4, { name: 'agenda.bar' }),
			...[-9, 9].map((dx) => A.cylinder(sx + dx, 28.5, 1.8, TOP + 4, 1.6, { name: 'agenda.ring' })),
		]);
	}

	// E-mail: caixa de correio num poste, porta na frente, bandeira do lado que sobe quando chega algo.
	{
		const sx = SOCKETS[1];
		const stand = { x: sx - 15, y: 22, w: 30, d: 34, r: 3 };
		const post = [sx, 39];
		const mount = { x: sx - 6, y: 27, w: 12, d: 24, r: 1 };
		const BOX_Z = 24;
		const BOX_Y = [26, 52];
		const half = 9;
		const arch = Array.from({ length: 13 }, (_, i) => {
			const t = (i / 12) * Math.PI;
			return [half * Math.cos(t), 9 + half * Math.sin(t)];
		});
		const outline = [[-half, 0], [half, 0], ...arch];
		const F = G.frameOf([sx, BOX_Y[0], BOX_Z], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
		const toWorld = (s, [u, v]) => [sx + u, BOX_Y[0] + s, BOX_Z + v];
		const doorRing = [[-half + 1.6, 1.6], [half - 1.6, 1.6], ...arch.map(([u, v]) => [u * 0.82, 9 + (v - 9) * 0.82])];
		const door = poly(doorRing.map((p) => toWorld(BOX_Y[1] - BOX_Y[0], p)));
		const handle = along([sx, BOX_Y[1], BOX_Z + 7], [0, 1, 0]);
		// Bandeira: no plano x = lado direito da caixa + 1.4, girando em torno do pino.
		const pivot = { x: sx + half + 1.4, y: 46, z: BOX_Z + 7 };
		const pin = along([sx + half, pivot.y, pivot.z], [1, 0, 0]);
		const flagFace = k.sideMatrix([pivot.x, pivot.y], pivot.z, P, 'right');
		const out = [
			`<path class="iso-halo" d="${k.haloOf(stand, 0, 7, P)}"/>`,
			S(k.slabOf(stand, 0, 7, P, 4, 0.8), { tone: 'mid' }),
			S(k.cylinder(post[0], post[1], 4.2, 7, 2, P, 24), { tone: 'mid' }),
			S(k.cylinder(post[0], post[1], 2.6, 9, BOX_Z - 2 - 9, P, 20), { tone: 'mid', crease: 'none' }),
			S(k.slabOf(mount, BOX_Z - 2, 2, P, 2, 0.3), { tone: 'mid' }),
			S(G.prismOf(F, outline, 0, BOX_Y[1] - BOX_Y[0], P), { tone: 'hi' }),
			L(door, { tone: 'lo' }),
			S(G.disc(0, 1.6, 1.3, handle, P), { tone: 'mid' }),
			S(G.disc(0, 1.2, 1.5, pin, P), { tone: 'mid' }),
			`<g transform="${flagFace}"><g class="mcp-flag" data-act="email">`,
			`<path class="mcp-flag-arm" d="M-1 -0.8H13V0.8H-1Z"/>`,
			`<path class="mcp-flag-sail" d="M8 -0.8H14V-6.4H8Z"/>`,
			`</g></g>`,
			D([at([stand.x + 3, stand.y + stand.d - 3, 7]), at([stand.x + stand.w - 3, stand.y + 3, 7])], { size: 0.45 }),
		];
		putTool('tool.email', [sx, 40, 22], out.join(''), [
			A.slab(stand, 0, 7, { name: 'email.stand' }),
			A.cylinder(post[0], post[1], 4.2, 7, 2, { name: 'email.collar' }),
			A.cylinder(post[0], post[1], 2.6, 9, BOX_Z - 2 - 9, { name: 'email.post' }),
			A.slab(mount, BOX_Z - 2, 2, { name: 'email.mount' }),
			A.prism(F, outline, 0, BOX_Y[1] - BOX_Y[0], { name: 'email.box' }),
			A.disc(handle, 0, 1.6, 1.3, { name: 'email.handle' }),
			A.disc(pin, 0, 1.2, 1.5, { name: 'email.pin' }),
		]);
	}

	// Planilha: prancheta com a folha quadriculada e o prendedor; uma linha acende quando é atualizada.
	{
		const sx = SOCKETS[2];
		const board = { x: sx - 20, y: 22, w: 40, d: 40, r: 3 };
		const sheet = { x: sx - 17, y: 31, w: 34, d: 28, r: 0.6 };
		const clip = { x: sx - 12, y: 24.5, w: 24, d: 6, r: 2 };
		const Z = 6;
		const top = Z + 0.6;
		const cols = [8, 17, 25.5].map((dx) => sheet.x + dx);
		const rows = Array.from({ length: 4 }, (_, i) => sheet.y + 5.6 * (i + 1));
		const grid = [
			...cols.map((x) => k.lineOnTop([x, sheet.y], [x, sheet.y + sheet.d], top, P)),
			...rows.map((y) => k.lineOnTop([sheet.x, y], [sheet.x + sheet.w, y], top, P)),
		].join('');
		const rowY = [rows[2], rows[3]];
		const cell = (x0, x1) => poly([[x0, rowY[0], top], [x1, rowY[0], top], [x1, rowY[1], top], [x0, rowY[1], top]]);
		const header = poly([[sheet.x, sheet.y, top], [sheet.x + sheet.w, sheet.y, top], [sheet.x + sheet.w, rows[0], top], [sheet.x, rows[0], top]]);
		const out = [
			`<path class="iso-halo" d="${k.haloOf(board, 0, Z, P)}"/>`,
			S(k.slabOf(board, 0, Z, P, 4, 0.8), { tone: 'mid' }),
			S(k.slabOf(sheet, Z, 0.6, P, 2), { tone: 'hi', flat: true }),
			`<path class="mcp-band" d="${header}"/>`,
			L(grid, { tone: 'lo' }),
			`<g class="mcp-row" data-act="planilha"><path class="mcp-row-fill" d="${cell(sheet.x, sheet.x + sheet.w)}"/>`,
			L(poly([[cols[0] + 2, (rowY[0] + rowY[1]) / 2, top], [cols[1] - 2, (rowY[0] + rowY[1]) / 2, top]], false) + poly([[cols[1] + 2, (rowY[0] + rowY[1]) / 2, top], [cols[2] - 2.5, (rowY[0] + rowY[1]) / 2, top]], false) + poly([[cols[2] + 2, (rowY[0] + rowY[1]) / 2, top], [sheet.x + sheet.w - 2.5, (rowY[0] + rowY[1]) / 2, top]], false), { tone: 'lit', free: true }),
			`</g>`,
			S(k.slabOf(clip, Z, 4, P, 4, 0.5), { tone: 'mid' }),
			D([at([clip.x + 3, clip.y + clip.d / 2, Z + 4]), at([clip.x + clip.w - 3, clip.y + clip.d / 2, Z + 4])], { size: 0.5 }),
			D([at([board.x + 3, board.y + board.d - 3, Z]), at([board.x + board.w - 3, board.y + board.d - 3, Z])], { size: 0.45 }),
		];
		putTool('tool.planilha', [sx, 45, 3], out.join(''), [
			A.slab(board, 0, Z, { name: 'planilha.board' }),
			A.slab(sheet, Z, 0.6, { name: 'planilha.sheet' }),
			A.slab(clip, Z, 4, { name: 'planilha.clip' }),
		]);
	}

	// Arquivos: gaveteiro de duas gavetas, ainda sem cabo na porta.
	{
		const sx = CAB_X;
		const body = { x: sx - 17, y: 22, w: 34, d: 34, r: 2 };
		const H = 34;
		const fy = body.y + body.d;
		const fronts = [[3, 17.2], [18.8, 31]].map(([z0, z1]) => ({ plan: { x: body.x + 2, y: fy, w: body.w - 4, d: 1.2, r: 0.6 }, z0, z1 }));
		const out = [`<path class="iso-halo" d="${k.haloOf(body, 0, H, P)}"/>`, S(k.slabOf(body, 0, H, P, 3, 1), { tone: 'mid' })];
		const shapes = [A.slab(body, 0, H, { name: 'arquivos.body' })];
		fronts.forEach(({ plan, z0, z1 }, i) => {
			out.push(S(k.slabOf(plan, z0, z1 - z0, P, 2, 0.3), { tone: 'hi' }));
			const pull = { x: sx - 5, y: fy + 1.2, w: 10, d: 1.8, r: 0.8 };
			out.push(S(k.slabOf(pull, z1 - 6, 1.6, P, 2), { tone: 'mid' }));
			out.push(`<rect class="mcp-holder" transform="${face(sx - 6, fy + 1.2, z1 - 2)}" x="0" y="0" width="12" height="2.6" rx="0.4"/>`);
			out.push(D([at([sx - 7, fy + 1.2, z1 - 3.3]), at([sx + 7, fy + 1.2, z1 - 3.3])], { size: 0.4 }));
			shapes.push(A.slab(plan, z0, z1 - z0, { name: `arquivos.drawer${i}` }), A.slab(pull, z1 - 6, 1.6, { name: `arquivos.pull${i}` }));
		});
		out.push(D(k.corners(body, 3).map(([x, y]) => at([x, y, H])), { size: 0.45 }));
		putTool('tool.arquivos', [sx, 39, 17], out.join(''), shapes);
	}

	/* Cabos: do conector, desce até a bancada, corre reto e entra na entrada de trás da ferramenta. */
	const cables = plugEnds.map((start, index) => {
		const [sx, y0, z0] = start;
		const end = ports[index].end;
		const lie = CABLE_R;
		const legs = index < 3
			? [start, [sx, y0 + 6, z0], [sx, y0 + 12, lie], [sx, end[1] - 12, lie], [sx, end[1] - 6, end[2]], end]
			: [start, [sx, y0 + 4, z0], [sx, y0 + 9, lie], [end[0], y0 + 9, lie], [end[0], end[1] - 5, end[2]], end];
		const route = G.fillet(legs, 2.8 * CABLE_R, 7, { P, tube: CABLE_R });
		const name = `cable.${index}`;
		R.route(name, route, CABLE_R, { touch: ['stand.plate'], limp: true });
		const pieces = tubePieces(route, CABLE_R, P, { maxLength: 14 });
		const keys = pieces.map((piece) => put(name, piece.mid, tubeSvg(piece, { tone: 'hi' }), [A.tube(piece.points, piece.radii, { name, owner: name, limp: true, touch: ['stand.plate'] })], { chunk: true }));
		const screenPath = G.resample(route, 1.2).map(at).map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
		return { name, keys, screenPath };
	});

	A.settle(R, P, { skip: (a, b) => a.name === b.name && a.chunk && b.chunk });

	// O pulso de cada cabo pinta logo depois do pedaço de cabo mais à frente.
	cables.slice(0, 3).forEach((cable, index) => {
		const key = Math.max(...cable.keys.map((item) => item.key)) + 1e-4;
		R.items.push({ name: `pulse.${index}`, key, svg: `<circle class="mcp-pulse" data-pulse="${index}" r="2.4" cx="-99" cy="-99"/>` });
	});
	R.items.sort((a, b) => a.key - b.key);
	if (audit) A.auditOrExit(R, P);

	const body = `<g class="mcp-base">${base.join('')}</g>${R.items.map((item) => item.svg).join('')}`;
	const data = {
		knob: k.axisVector(P, [1, 0, 0]),
		travel: SWITCH_TRAVEL,
		paths: cables.slice(0, 3).map((cable) => cable.screenPath),
		hits: SOCKETS.slice(0, 3).map((sx) => at([sx, SWITCH_Y, HUB_H + 2]).map((v) => Math.round(v * 10) / 10)),
	};
	return { P, R, body, data, width: WIDTH, height: HEIGHT };
}
