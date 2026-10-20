// Parte viva da figura MCP. A geometria vem pronta do build (geometry.mjs); aqui só:
// - a chave de cada porta (permissão) desliza e acende o LED;
// - um pulso laranja leva o pedido do app até a ferramenta pelo cabo e traz a resposta de volta;
// - a ferramenta reage (círculo na data, bandeira do correio, linha da planilha).
// Roda só com o slide ativo (.present). Reduced-motion e impressão: quadro parado, tudo ligado.

// O que aparece na tela do app: o pedido, a resposta e a resposta quando a permissão foi tirada.
const TOOLS = [
	{ name: 'Agenda', did: 'marcou a reunião', ask: 'Marca uma reunião segunda às 10h', reply: 'Pronto, marquei na sua agenda.', deny: 'Não tenho acesso à sua agenda.' },
	{ name: 'E-mail', did: 'achou o e-mail', ask: 'Achou o e-mail do contador?', reply: 'Achei: chegou ontem, às 14h.', deny: 'Não tenho acesso ao seu e-mail.' },
	{ name: 'Planilha', did: 'atualizou a linha', ask: 'Anota a venda de hoje na planilha', reply: 'Anotei na planilha de vendas.', deny: 'Não tenho acesso à planilha.' },
];
const T = { go: 1500, act: 1300, back: 1200, rest: 700, blocked: 1700 };

const wait = (ms, run) =>
	new Promise((resolve, reject) => {
		const id = setTimeout(resolve, ms);
		run.cancel.push(() => {
			clearTimeout(id);
			reject(new Error('cancelado'));
		});
	});

function lengthsOf(points) {
	const out = [0];
	for (let i = 1; i < points.length; i++) {
		const [ax, ay] = points[i - 1];
		const [bx, by] = points[i];
		out.push(out[i - 1] + Math.hypot(bx - ax, by - ay));
	}
	return out;
}

function pointAt(points, lengths, t) {
	const target = t * lengths[lengths.length - 1];
	let i = 1;
	while (i < lengths.length - 1 && lengths[i] < target) i++;
	const span = lengths[i] - lengths[i - 1] || 1;
	const f = (target - lengths[i - 1]) / span;
	const [ax, ay] = points[i - 1];
	const [bx, by] = points[i];
	return [ax + (bx - ax) * f, ay + (by - ay) * f];
}

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function setup(root) {
	const data = JSON.parse(root.dataset.mcp);
	const svg = root.querySelector('svg');
	const readout = root.querySelector('[data-readout]');
	const section = root.closest('section');
	const on = [true, true, true];
	let touched = false;
	let run = null;

	const knobs = [...svg.querySelectorAll('[data-knob]')];
	const leds = [...svg.querySelectorAll('[data-led]')];
	const hits = [...svg.querySelectorAll('[data-hit]')];
	const acts = Object.fromEntries([...svg.querySelectorAll('[data-act]')].map((node) => [node.dataset.act, node]));
	const actOf = (i) => acts[['agenda', 'email', 'planilha'][i]];
	const pulses = [...svg.querySelectorAll('[data-pulse]')];
	const answer = svg.querySelector('[data-answer]');
	const askText = svg.querySelector('[data-ask-text]');
	const replyText = svg.querySelector('[data-reply-text]');
	const chat = (ask, reply) => {
		askText.textContent = ask;
		if (reply) replyText.textContent = reply;
		answer.toggleAttribute('data-hide', !reply);
	};
	const paths = data.paths.map((points) => ({ points, lengths: lengthsOf(points) }));
	const [ux, uy] = data.knob;

	const count = () => on.filter(Boolean).length;
	const say = (text) => {
		if (readout) readout.textContent = text;
	};
	const sayCount = () => say(`${count()} de 3 conectores ligados`);

	const paint = () => {
		on.forEach((value, i) => {
			const dx = value ? 0 : -2 * data.travel;
			knobs[i].style.transform = `translate(${dx * ux}px, ${dx * uy}px)`;
			leds[i].toggleAttribute('data-on', value);
			hits[i].setAttribute('aria-checked', String(value));
		});
	};

	const toggle = (i, value = !on[i]) => {
		on[i] = value;
		paint();
		if (!run) sayCount();
	};

	hits.forEach((hit, i) => {
		const flip = (event) => {
			event.stopPropagation();
			touched = true;
			toggle(i);
			if (!on[i]) actOf(i).removeAttribute('data-on');
		};
		hit.addEventListener('click', flip);
		hit.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				flip(event);
			}
		});
	});

	// Move o pulso i de `from` a `to` (0 = porta, 1 = ferramenta) em `ms`.
	const travel = (i, from, to, ms, current) =>
		new Promise((resolve, reject) => {
			const dot = pulses[i];
			const { points, lengths } = paths[i];
			const start = performance.now();
			let frame = 0;
			current.cancel.push(() => {
				cancelAnimationFrame(frame);
				dot.removeAttribute('data-on');
				reject(new Error('cancelado'));
			});
			dot.setAttribute('data-on', '');
			const tick = (now) => {
				const t = Math.min(1, (now - start) / ms);
				const [x, y] = pointAt(points, lengths, from + (to - from) * ease(t));
				dot.setAttribute('cx', x.toFixed(1));
				dot.setAttribute('cy', y.toFixed(1));
				if (t < 1 && on[i]) frame = requestAnimationFrame(tick);
				else {
					dot.removeAttribute('data-on');
					resolve(t >= 1);
				}
			};
			frame = requestAnimationFrame(tick);
		});

	const ask = async (i, current) => {
		const tool = TOOLS[i];
		chat(tool.ask, null);
		if (!on[i]) {
			await wait(500, current);
			say(`${tool.name}: sem permissão`);
			chat(tool.ask, tool.deny);
			leds[i].setAttribute('data-deny', '');
			await wait(T.blocked, current);
			leds[i].removeAttribute('data-deny');
			return;
		}
		say(`pedido → ${tool.name}`);
		if (!(await travel(i, 0, 1, T.go, current))) return say(`${tool.name}: desligada no meio`);
		actOf(i).setAttribute('data-on', '');
		say(`${tool.name} ${tool.did}`);
		await wait(T.act, current);
		say(`resposta → app de IA`);
		await travel(i, 1, 0, T.back, current);
		chat(tool.ask, tool.reply);
		answer.setAttribute('data-on', '');
		await wait(T.rest, current);
		answer.removeAttribute('data-on');
		actOf(i).removeAttribute('data-on');
	};

	const tour = async (current) => {
		for (;;) {
			for (const i of [0, 1, 2]) await ask(i, current);
			if (touched) continue;
			// Mostra que a permissão se tira: desliga a planilha, tenta de novo, religa.
			await wait(600, current);
			toggle(2, false);
			await wait(700, current);
			await ask(2, current);
			toggle(2, true);
			await wait(900, current);
		}
	};

	const stop = () => {
		if (!run) return;
		run.cancel.forEach((cancel) => cancel());
		run = null;
		Object.values(acts).forEach((node) => node.removeAttribute('data-on'));
		answer.removeAttribute('data-on');
		chat(TOOLS[0].ask, TOOLS[0].reply);
		sayCount();
	};
	const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches || /print-pdf/.test(location.search);
	const start = () => {
		if (run || still()) return;
		run = { cancel: [] };
		tour(run).catch(() => {});
	};

	paint();
	if (still()) {
		actOf(0).setAttribute('data-on', '');
		sayCount();
		return;
	}
	sayCount();
	const sync = () => (section && !section.classList.contains('present') ? stop() : start());
	if (section) new MutationObserver(sync).observe(section, { attributes: true, attributeFilter: ['class'] });
	else new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(root);
	sync();
}

document.querySelectorAll('.mcp[data-mcp]').forEach(setup);
