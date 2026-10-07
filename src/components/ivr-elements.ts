// Custom elements do site (sem framework). Todo acesso ao localStorage fica em try/catch:
// pode falhar em janela anônima ou com dados do site bloqueados, e a página continua funcionando.

const STORE_PREFIX = 'ivr:';

const read = (key: string): string | null => {
	try {
		return localStorage.getItem(STORE_PREFIX + key);
	} catch {
		return null;
	}
};
const write = (key: string, value: string) => {
	try {
		localStorage.setItem(STORE_PREFIX + key, value);
	} catch {
		// sem armazenamento: o progresso vale só nesta visita
	}
};

/** Botão que copia o texto de um alvo (data-target = id). */
class IvrCopy extends HTMLElement {
	connectedCallback() {
		const button = this.querySelector('button');
		if (!button) return;
		const label = button.textContent ?? 'Copiar';
		button.addEventListener('click', async () => {
			const target = document.getElementById(this.dataset.target ?? '');
			const text = target?.dataset.copy ?? target?.innerText ?? '';
			try {
				await navigator.clipboard.writeText(text);
				button.textContent = 'Copiado';
			} catch {
				button.textContent = 'Não deu para copiar: selecione o texto';
			}
			setTimeout(() => (button.textContent = label), 1800);
		});
	}
}

/** Lista "deu certo se…" + campo de reflexão, salvos no navegador. Dispara `ivr-progress`. */
class IvrChecklist extends HTMLElement {
	connectedCallback() {
		const key = this.dataset.key;
		if (!key) return;
		const boxes = [...this.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];
		const saved = JSON.parse(read(`${key}:checks`) ?? '[]') as boolean[];
		boxes.forEach((box, i) => {
			box.checked = Boolean(saved[i]);
			box.addEventListener('change', () => {
				write(`${key}:checks`, JSON.stringify(boxes.map((b) => b.checked)));
				this.#update(boxes);
			});
		});
		const note = this.querySelector<HTMLTextAreaElement>('textarea');
		if (note) {
			note.value = read(`${key}:note`) ?? '';
			note.addEventListener('input', () => write(`${key}:note`, note.value));
		}
		this.#update(boxes);
	}

	#update(boxes: HTMLInputElement[]) {
		const done = boxes.length > 0 && boxes.every((b) => b.checked);
		this.toggleAttribute('data-done', done);
		this.closest('.ivr-ex')?.toggleAttribute('data-done', done);
		document.dispatchEvent(new CustomEvent('ivr-progress'));
	}
}

/** "2 de 5 exercícios feitos", contando os [data-done] da página. */
class IvrProgress extends HTMLElement {
	connectedCallback() {
		const render = () => {
			const all = document.querySelectorAll('ivr-checklist').length;
			const done = document.querySelectorAll('ivr-checklist[data-done]').length;
			this.textContent = `${done} de ${all} exercícios feitos`;
			this.style.setProperty('--ivr-pct', all ? `${(done / all) * 100}%` : '0%');
		};
		document.addEventListener('ivr-progress', render);
		render();
	}
}

const define = (name: string, ctor: CustomElementConstructor) => {
	if (!customElements.get(name)) customElements.define(name, ctor);
};
define('ivr-copy', IvrCopy);
define('ivr-checklist', IvrChecklist);
define('ivr-progress', IvrProgress);
