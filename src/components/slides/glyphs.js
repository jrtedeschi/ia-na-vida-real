// A palavra em negrito de um slide .s-glyphs troca de letra até travar.
// É o modelo escolhendo o glifo, no lugar do círculo laranja do .s-hook.

const POOL = [...'aeiourstnmlpvcd'];
const timers = new WeakMap();

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || /print-pdf/.test(location.search);

const clear = (bold) => {
	timers.get(bold)?.forEach((id) => clearTimeout(id));
	timers.delete(bold);
};

const mount = (bold) => {
	const word = bold.dataset.word ?? bold.textContent;
	bold.dataset.word = word;
	bold.replaceChildren(document.createTextNode(word));
	const tracking = getComputedStyle(bold.parentElement).letterSpacing;
	bold.style.letterSpacing = tracking;
	const text = bold.firstChild;
	const range = document.createRange();
	const host = bold.getBoundingClientRect();
	const scale = host.width / bold.offsetWidth || 1;
	const lefts = [...word].map((_, i) => {
		range.setStart(text, i);
		range.setEnd(text, i + 1);
		return (range.getBoundingClientRect().left - host.left) / scale;
	});
	const total = bold.offsetWidth;
	bold.style.letterSpacing = '0';
	bold.replaceChildren(
		...[...word].map((ch, i) => {
			const node = document.createElement('span');
			node.className = 'g';
			node.dataset.final = ch;
			node.textContent = ch;
			node.style.letterSpacing = '0';
			const next = i + 1 < lefts.length ? lefts[i + 1] : total;
			node.style.width = `${next - lefts[i]}px`;
			return node;
		}),
	);
};

const lock = (node) => {
	node.textContent = node.dataset.final;
	node.classList.remove('g-spin');
	node.classList.add('g-lock');
};

/** Toca os glifos do slide. Sem movimento, mostra a palavra pronta. */
export function playGlyphs(root) {
	const bold = root?.classList?.contains('s-glyphs') ? root.querySelector('h2 b') : null;
	if (!bold) return;
	clear(bold);
	mount(bold);
	const letters = [...bold.querySelectorAll('.g')];
	if (reduced()) {
		letters.forEach(lock);
		return;
	}
	const ids = [];
	letters.forEach((node, i) => {
		const frames = 5 + i;
		let n = 0;
		const tick = () => {
			if (n++ < frames) {
				node.textContent = POOL[(Math.random() * POOL.length) | 0];
				node.classList.add('g-spin');
				ids.push(setTimeout(tick, 70));
			} else lock(node);
		};
		ids.push(setTimeout(tick, 260 + i * 100));
	});
	timers.set(bold, ids);
}

/** Para no meio e deixa a palavra escrita, para o slide de trás não continuar girando. */
export function stopGlyphs(root) {
	const bold = root?.querySelector?.('h2 b');
	if (!bold?.dataset.word) return;
	clear(bold);
	bold.querySelectorAll('.g').forEach(lock);
}
