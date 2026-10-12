/**
 * Animações e diagramas que um slide chama pelo nome (campo `visual:` do .md).
 * Animação nova: crie o componente em components/anim/ e acrescente uma entrada aqui.
 * `slideClass` = classe padrão do slide (o .md pode trocar com `class:`).
 * `visualProps:` no .md substitui os textos do preset (ex.: outra frase no NextWord).
 */
import TokenSplit from '../anim/TokenSplit.astro';
import NextWord from '../anim/NextWord.astro';
import ContextWindow from '../anim/ContextWindow.astro';
import QuemEQuem from '../anim/QuemEQuem.astro';
import Provedores from '../anim/Provedores.astro';
import Modelos from '../anim/Modelos.astro';
import { TOKEN, NEXT_WORD, HALLUCINATION, CONTEXT_WINDOW } from '../anim/presets';

const PLAYED = { trigger: 'manual', hideCaption: true } as const;

interface VisualEntry {
	// Componentes .astro não têm um tipo comum de props; cada entrada já casa preset e componente.
	Comp: (props: any) => unknown;
	props: Record<string, unknown>;
	slideClass: string;
}

export const VISUALS: Record<string, VisualEntry> = {
	fragmentos: { Comp: TokenSplit, props: { ...TOKEN, ...PLAYED }, slideClass: 's-anim' },
	'proxima-palavra': { Comp: NextWord, props: { ...NEXT_WORD, ...PLAYED }, slideClass: 's-anim' },
	alucinacao: { Comp: NextWord, props: { ...HALLUCINATION, ...PLAYED }, slideClass: 's-anim' },
	'janela-de-contexto': { Comp: ContextWindow, props: { ...CONTEXT_WINDOW, ...PLAYED }, slideClass: 's-anim s-tight' },
	'quem-e-quem': { Comp: QuemEQuem, props: {}, slideClass: '' },
	provedores: { Comp: Provedores, props: {}, slideClass: 's-wide' },
	modelos: { Comp: Modelos, props: {}, slideClass: 's-wide' },
};

export function getVisual(name: string): VisualEntry {
	const entry = VISUALS[name];
	if (!entry) {
		throw new Error(`Visual "${name}" não existe. Opções: ${Object.keys(VISUALS).join(', ')}`);
	}
	return entry;
}
