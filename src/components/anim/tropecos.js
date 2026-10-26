// <ivr-tropecos>: o caminho do RAG em quatro etapas (corte, busca, seleção, janela), uma por clique,
// cada uma com o seu tropeço. O desenho vem pronto do Tropecos.astro; aqui só entra a base por cliques.
// Passos: 0 o caminho · 1 a 4 acende a etapa k e mostra o desenho do tropeço dela (as anteriores ficam).

import { IvrStepped } from './stepped.js';

const STAGES = 4;

export class IvrTropecos extends IvrStepped {
	get steps() {
		return STAGES + 1;
	}

	build(stage) {
		const grid = this.querySelector('.tr-grid');
		stage.classList.add('tr-stage');
		stage.append(...this.querySelectorAll('.tr-lead, .tr-grid'));
		return { cols: [...grid.querySelectorAll('.tr-col')], label: grid.getAttribute('aria-label') };
	}

	travel(_from, to) {
		const col = this.parts.cols[to - 1];
		if (!col) return [];
		return [
			[col.querySelector('.tr-ill'), [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 500 }],
			[col.querySelector('.tr-fail'), [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 450 }],
		];
	}

	ariaSummary() {
		return this.parts.label ?? 'O caminho do RAG e onde ele tropeça.';
	}

	transcript() {
		return '';
	}
}

if (!customElements.get('ivr-tropecos')) customElements.define('ivr-tropecos', IvrTropecos);
