/**
 * Animações e diagramas que um slide chama pelo nome (campo `visual:` do .md).
 * Animação nova: crie o componente em components/anim/ e acrescente uma entrada aqui.
 * `slideClass` = classe padrão do slide (o .md pode trocar com `class:`).
 * `visualProps:` no .md substitui os textos do preset (ex.: outra frase no NextWord).
 * `overlay` = o visual cobre o slide inteiro e só aparece no próximo clique (fragmento).
 * `exit` = overlay de saída: toca no último clique, nunca ao entrar no slide; o clique seguinte vai ao próximo slide.
 */
import TokenSplit from '../anim/TokenSplit.astro';
import NextWord from '../anim/NextWord.astro';
import ContextWindow from '../anim/ContextWindow.astro';
import QuemEQuem from '../anim/QuemEQuem.astro';
import Provedores from '../anim/Provedores.astro';
import Modelos from '../anim/Modelos.astro';
import Evolucao from '../anim/Evolucao.astro';
import Transformer from '../anim/Transformer.astro';
import PromptArt from '../anim/PromptArt.astro';
import MundoNovo from '../anim/MundoNovo.astro';
import Submarino from '../anim/Submarino.astro';
import PipelineEtl from '../anim/PipelineEtl.astro';
import Harness from '../anim/Harness.astro';
import Difusao from '../anim/Difusao.astro';
import Raciocinio from '../anim/Raciocinio.astro';
import Combustivel from '../anim/Combustivel.astro';
import VidaMelhor from '../anim/VidaMelhor.astro';
import TarefasFundamentos from '../anim/TarefasFundamentos.astro';
import Timer from '../anim/Timer.astro';
import { TOKEN, NEXT_WORD, HALLUCINATION, CONTEXT_WINDOW, EVOLUTION, TRANSFORMER, PROMPT_ART, MUNDO_NOVO } from '../anim/presets';

const PLAYED = { trigger: 'manual', hideCaption: true } as const;

interface VisualEntry {
	// Componentes .astro não têm um tipo comum de props; cada entrada já casa preset e componente.
	Comp: (props: any) => unknown;
	props: Record<string, unknown>;
	slideClass: string;
	overlay?: boolean;
	exit?: boolean;
}

export const VISUALS: Record<string, VisualEntry> = {
	fragmentos: { Comp: TokenSplit, props: { ...TOKEN, ...PLAYED }, slideClass: 's-anim' },
	'proxima-palavra': { Comp: NextWord, props: { ...NEXT_WORD, ...PLAYED }, slideClass: 's-anim' },
	alucinacao: { Comp: NextWord, props: { ...HALLUCINATION, ...PLAYED }, slideClass: 's-anim' },
	'janela-de-contexto': { Comp: ContextWindow, props: { ...CONTEXT_WINDOW, ...PLAYED }, slideClass: 's-anim s-tight' },
	'quem-e-quem': { Comp: QuemEQuem, props: {}, slideClass: '' },
	provedores: { Comp: Provedores, props: {}, slideClass: 's-wide' },
	modelos: { Comp: Modelos, props: {}, slideClass: 's-wide' },
	'feita-com-um-pedido': { Comp: PromptArt, props: { ...PROMPT_ART, ...PLAYED }, slideClass: 's-anim s-art' },
	evolucao: { Comp: Evolucao, props: { ...EVOLUTION, ...PLAYED }, slideClass: 's-anim' },
	'tarefas-fundamentos': { Comp: TarefasFundamentos, props: {}, slideClass: 's-fund' },
	'vida-melhor': { Comp: VidaMelhor, props: {}, slideClass: 's-stat' },
	raciocinio: { Comp: Raciocinio, props: {}, slideClass: 's-code' },
	'raciocinio-erro': { Comp: Raciocinio, props: { erro: true }, slideClass: 's-code' },
	difusao: { Comp: Difusao, props: {}, slideClass: 's-code' },
	harness: { Comp: Harness, props: {}, slideClass: 's-code' },
	combustivel: { Comp: Combustivel, props: {}, slideClass: 's-code' },
	'pipeline-etl': { Comp: PipelineEtl, props: {}, slideClass: 's-code' },
	timer: { Comp: Timer, props: {}, slideClass: 's-timer' },
	submarino: { Comp: Submarino, props: {}, slideClass: '', overlay: true, exit: true },
	'mundo-novo': { Comp: MundoNovo, props: { ...MUNDO_NOVO }, slideClass: 's-mundo', overlay: true },
	'por-dentro-do-modelo': { Comp: Transformer, props: { ...TRANSFORMER, ...PLAYED }, slideClass: 's-anim' },
};

export function getVisual(name: string): VisualEntry {
	const entry = VISUALS[name];
	if (!entry) {
		throw new Error(`Visual "${name}" não existe. Opções: ${Object.keys(VISUALS).join(', ')}`);
	}
	return entry;
}
