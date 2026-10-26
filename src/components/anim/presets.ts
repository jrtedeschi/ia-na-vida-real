// Conteúdo das animações do E1, compartilhado entre páginas e slides (uma fonte só).

export const TOKEN = {
	tokens: 'Organ|ize| minha| sem|ana| com| 3| prior|idades',
	circle: '0,1',
	note: '1 palavra, 2 tokens',
};

export const NEXT_WORD = {
	prompt: 'O café da manhã ideal tem',
	steps: [
		[['pão', 41], ['café', 33], ['fruta', 12], ['ovo', 8]],
		[['quentinho', 36], ['francês', 29], ['com', 21], ['integral', 9]],
		[['e', 44], ['com', 31], ['.', 15], ['!', 5]],
	] as [string, number][][],
	note: 'ela escreve um pedaço por vez',
};

export const HALLUCINATION = {
	prompt: 'A padaria Estrela, de Itu, foi fundada em',
	steps: [[['1987', 23], ['1992', 21], ['1979', 19], ['1995', 17]]] as [string, number][][],
	verdict: '"A padaria Estrela foi fundada em 1987, por uma família de imigrantes."',
	note: 'provável ≠ verdadeiro',
};

export const CONTEXT_WINDOW = {
	messages: [
		['voce', 'Oi! Meu nome é Rita e sou nutricionista.'],
		['ia', 'Prazer, Rita! Como posso ajudar?'],
		['voce', 'Monte um cardápio da semana para um paciente.'],
		['ia', 'Claro. Segunda: aveia com fruta no café…'],
		['voce', 'Troque o jantar de quarta por algo sem glúten.'],
		['ia', 'Feito: quarta, omelete com legumes.'],
		['voce', 'Agora uma lista de compras para tudo isso.'],
		['ia', 'Lista pronta, separada por seção do mercado.'],
		['voce', 'Qual é mesmo a minha profissão?'],
		['ia', 'Você não me contou. Quer me dizer?'],
	] as ['voce' | 'ia', string][],
	lost: 0,
	note: 'saiu da janela',
};

export const EVOLUTION = {
	from: 1400,
	to: 2030,
	ticks: [1400, 1600, 1800], // sem 2000: ali fica o círculo dos saltos recentes
	steps: [
		{ year: 1400, label: 'antes de 1450', name: 'Manuscrito', text: 'Copiar um livro levava meses' },
		{ year: 1450, label: 'c. 1450', name: 'Prensa de Gutenberg', text: 'Centenas de cópias iguais' },
		{ year: 1874, label: '1874', name: 'Máquina de escrever', text: 'Nasce o datilógrafo' },
		{ year: 1981, label: '1981', name: 'Computador pessoal', text: 'Escrever, apagar e corrigir na tela' },
		{ year: 1991, label: '1991', name: 'Web', text: 'Qualquer um publica para o mundo' },
		{ year: 2025, label: '2025', name: 'Agentes de IA', text: 'Você descreve, a máquina escreve e faz' },
	],
	note: 'os saltos ficam cada vez mais perto',
	base: 'Em todos os saltos, o fundamento ficou: ter o que dizer, dizer bem e revisar.',
};

export const TRANSFORMER = {
	tokens: ['O', ' café', ' da', ' manhã', ' ideal', ' tem'],
	// Quanto o último token "olha" para cada um dos anteriores (ilustrativo).
	attention: [0.05, 0.4, 0.05, 0.25, 0.3],
	bets: NEXT_WORD.steps[0],
	note: 'e recomeça, um token por vez',
};

export const PROMPT_ART = {
	prompt:
		'Crie uma animação em JavaScript para um slide: milhares de pontos em grafite e laranja fluem como tinta ao vento e, aos poucos, se juntam para escrever "IA na Vida Real". Depois se soltam e recomeçam. Sem bibliotecas.',
	word: 'IA na Vida Real',
};

export const MUNDO_NOVO = {
	caption: 'Um mundo de possibilidades se abre pra todos, novas formas de expressão e geração de soluções de problemas',
};

// E2: a memória é um caderninho que o app copia para toda conversa (lembra a receita italiana do E1).
export const MEMORIA = {
	memory: ['Gosta de comida italiana', 'Tem dois filhos pequenos'],
	ask: 'Me sugere um jantar para hoje?',
	answer: 'Que tal um nhoque ao sugo? Criança costuma gostar.',
	mark: ['italiana', 'nhoque'] as [string, string],
};

// E2: conversa longa demais, resposta pior. Três assuntos na mesma conversa; a Rita volta ao primeiro e o glúten se perdeu.
export const CONVERSA_LONGA = {
	topics: [
		{
			name: 'cardápio',
			at: 0,
			messages: [
				['voce', 'Sou a Rita, nutricionista.'],
				['voce', 'Meu paciente não pode comer glúten.'],
				['ia', 'Anotado. Segue o cardápio da semana…'],
			],
		},
		{
			name: 'e-mail',
			at: 1,
			messages: [
				['voce', 'Agora me ajuda com um e-mail pro meu chefe?'],
				['ia', 'Claro, segue um rascunho…'],
				['voce', 'Deixa mais formal.'],
				['ia', 'Pronto, versão formal…'],
			],
		},
		{
			name: 'viagem',
			at: 1,
			messages: [
				['voce', 'E um roteiro de 3 dias em Salvador?'],
				['ia', 'Dia 1: Pelourinho e Elevador Lacerda…'],
			],
		},
		{
			name: 'cardápio de novo',
			at: 2,
			messages: [
				['voce', 'Voltando: monte os lanches da tarde do paciente.'],
				['ia', 'Que tal torrada com geleia?'],
			],
		},
	] as { name: string; at: number; messages: ['voce' | 'ia', string][] }[],
	keep: 'glúten',
	wrong: 'torrada',
	wrongNote: 'esqueceu do glúten',
	lostNote: '↑ o glúten ficou lá atrás, fora da janela',
};

// E2, capítulo 2: a estante de fontes ao lado da janela (Estante.astro).
export interface EstanteItem {
	id: string;
	tag: string;
	title: string;
	text?: string;
}
export interface EstanteScene {
	label?: string;
	ask?: string;
	lit?: string[];
	pull?: string[];
	answer?: string;
	cites?: string[];
	note?: string;
}

// Slide do Gemini Notebook: responde a partir das suas fontes e mostra de onde tirou.
export const FONTES = {
	shelf: 'suas fontes',
	items: [
		{ id: 'pdf', tag: 'PDF', title: 'Regulamento do condomínio', text: '32 páginas' },
		{ id: 'link', tag: 'Link', title: 'Site da administradora', text: 'perguntas frequentes' },
		{ id: 'video', tag: 'Vídeo', title: 'Reunião de outubro', text: '1 hora, transcrita' },
	],
	scenes: [
		{ label: 'Gemini Notebook' },
		{ label: 'Gemini Notebook', ask: 'Até que horas pode ter obra no sábado?', lit: ['pdf', 'video'] },
		{
			label: 'Gemini Notebook',
			ask: 'Até que horas pode ter obra no sábado?',
			lit: ['pdf', 'video'],
			answer: 'Até as 12h. A reunião de outubro manteve esse horário.',
			cites: ['pdf', 'video'],
			note: 'mostra de onde tirou',
		},
	] as EstanteScene[],
};

// Slide do RAG: primeiro busca os trechos parecidos, só eles entram na janela, depois responde.
const REGULAMENTO: EstanteItem[] = [
	{ id: 'p3', tag: 'p. 3', title: 'Silêncio', text: 'das 22h às 8h, todos os dias' },
	{ id: 'p7', tag: 'p. 7', title: 'Piscina', text: 'aberta das 8h às 22h' },
	{ id: 'p12', tag: 'p. 12', title: 'Obras', text: 'seg. a sex. 8h–17h · sáb. 9h–12h' },
	{ id: 'p15', tag: 'p. 15', title: 'Multas', text: 'barulho fora de hora: advertência, depois multa' },
	{ id: 'p18', tag: 'p. 18', title: 'Animais', text: 'na coleira nas áreas comuns' },
	{ id: 'p21', tag: 'p. 21', title: 'Garagem', text: 'uma vaga por apartamento' },
];
const OBRA = 'Posso fazer obra no sábado?';
export const RAG = {
	lead: 'RAG, geração aumentada por recuperação: antes de responder, a IA busca no seu documento os trechos mais parecidos com a pergunta e lê só esses.',
	shelf: 'regulamento, picado em trechos',
	items: REGULAMENTO,
	scenes: [
		{},
		{ ask: OBRA, lit: ['p12', 'p3'], note: '1. busca os trechos parecidos' },
		{ ask: OBRA, lit: ['p12', 'p3'], pull: ['p12', 'p3'], note: '2. só eles entram na janela' },
		{ ask: OBRA, lit: ['p12', 'p3'], pull: ['p12', 'p3'], answer: 'Pode, das 9h às 12h.', cites: ['p12'], note: '3. depois responde' },
	] as EstanteScene[],
};
