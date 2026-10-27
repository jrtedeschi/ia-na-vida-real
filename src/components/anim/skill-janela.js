// <ivr-skill-janela>: como a IA acha e usa uma skill, com a mesma janela das outras animações.
// À esquerda, as pastas das skills, fechadas: só a etiqueta (nome e descrição) aparece.
// À direita, a janela de contexto, que já começa com as etiquetas de todas (é tudo o que a IA lê delas).
// Atributos: `skills` (JSON [{ name, desc, files: [arquivo, ...] }]; o primeiro arquivo é o SKILL.md),
// `pick` (índice da skill que combina), `file` (índice do arquivo que o pedido precisa), `ask`, `answer`,
// `rules` (JSON [linha do SKILL.md, ...]).
// Passos: 0 só as etiquetas na janela · 1 o pedido chega e uma etiqueta combina · 2 a pasta abre e o
// SKILL.md entra na janela · 3 só o arquivo que o pedido precisa entra, e vem a resposta.

import { el, relRect } from './anim-base.js';
import { IvrStepped, flipFrom, TRAVEL_MS } from './stepped.js';
import { msg } from './memoria.js';

export class IvrSkillJanela extends IvrStepped {
	get steps() {
		return 4;
	}

	build(stage) {
		const skills = JSON.parse(this.getAttribute('skills') ?? '[]');
		const pick = Number(this.getAttribute('pick') ?? 0);
		const need = Number(this.getAttribute('file') ?? 1);
		const rules = JSON.parse(this.getAttribute('rules') ?? '[]');
		stage.classList.add('sj');

		// As pastas: etiqueta por fora, arquivos por dentro.
		const shelf = el('div', 'sj-shelf');
		shelf.append(el('span', 'nj-label', 'suas skills'));
		const folders = skills.map((skill, i) => {
			const folder = el('div', 'sj-folder');
			if (i === pick) folder.classList.add('sj-pick');
			const tab = el('div', 'sj-tab');
			tab.append(el('b', null, skill.name), el('small', null, skill.desc));
			const inside = el('ul', 'sj-files');
			const files = skill.files.map((name, f) => {
				const item = el('li', f === 0 ? 'sj-file sj-md' : 'sj-file', name);
				if (i === pick && f === need) item.classList.add('sj-need');
				inside.append(item);
				return item;
			});
			const count = el('span', 'sj-count', `${skill.files.length} arquivos dentro`);
			folder.append(tab, count, inside);
			shelf.append(folder);
			return { folder, files };
		});

		// A janela: as etiquetas de todas, o pedido, o SKILL.md, o arquivo e a resposta.
		const win = el('div', 'nj-win sj-win');
		win.append(el('span', 'nj-label', 'janela de contexto'));
		const tags = el('div', 'sj-tags');
		tags.append(el('small', 'sj-kicker', 'etiquetas de todas as skills'));
		const tagItems = skills.map((skill, i) => {
			const tag = el('p', i === pick ? 'sj-tag sj-pick' : 'sj-tag');
			tag.append(el('b', null, skill.name), ` ${skill.desc}`);
			tags.append(tag);
			return tag;
		});
		const askMsg = msg('voce', this.getAttribute('ask') ?? '');
		const manual = el('div', 'sj-doc sj-doc-md');
		manual.append(el('small', null, skills[pick]?.files[0] ?? 'SKILL.md'));
		const list = el('ol');
		rules.forEach((rule) => list.append(el('li', null, rule)));
		manual.append(list);
		const file = el('div', 'sj-doc sj-doc-file');
		file.append(el('small', null, 'arquivo'), el('span', null, skills[pick]?.files[need] ?? ''));
		const answerMsg = msg('ia', this.getAttribute('answer') ?? '');
		win.append(tags, askMsg, manual, file, answerMsg);

		const notes = el('p', 'sj-step');
		['A IA lê só as etiquetas.', 'O pedido combina com uma etiqueta.', 'Só agora ela abre a pasta e lê as instruções.', 'Arquivo extra, só o que o pedido precisa.'].forEach((text, i) => {
			const span = el('span', null, text);
			span.dataset.at = String(i);
			notes.append(span);
		});

		stage.append(shelf, win, notes);
		return { skills, pick, need, folders, tagItems, askMsg, manual, file, answerMsg };
	}

	travel(_from, to) {
		const { stage, askMsg, manual, file, answerMsg, folders, pick, need } = this.parts;
		const rise = [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }];
		if (to === 1) return [[askMsg, rise, { duration: 400 }]];
		if (to === 2) {
			// A pasta abre primeiro; o SKILL.md sai dela e viaja até a janela.
			const md = relRect(folders[pick].files[0], stage);
			return [
				[folders[pick].files[0].parentElement, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 }],
				[manual, flipFrom(manual, md, stage), { delay: 350 }],
			];
		}
		const src = relRect(folders[pick].files[need], stage);
		return [
			[file, flipFrom(file, src, stage)],
			[answerMsg, rise, { duration: 400, delay: TRAVEL_MS + 200 }],
		];
	}

	ariaSummary() {
		return 'Animação em passos: à esquerda, as pastas das skills, fechadas, só com a etiqueta de nome e descrição. À direita, a janela de contexto, que tem só as etiquetas. Chega um pedido, uma etiqueta combina, a pasta abre e as instruções entram na janela; depois entra só o arquivo que o pedido precisa.';
	}

	transcript() {
		const { skills, pick, need } = this.parts;
		return `Transcrição: skills: ${skills.map((s) => `${s.name} (${s.desc})`).join('; ')}. Pedido: ${this.getAttribute('ask')}. Combina com ${skills[pick].name}: entram ${skills[pick].files[0]} e ${skills[pick].files[need]}. Resposta: ${this.getAttribute('answer')}`;
	}
}

if (!customElements.get('ivr-skill-janela')) customElements.define('ivr-skill-janela', IvrSkillJanela);
