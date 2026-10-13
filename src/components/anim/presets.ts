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
	// Quanto o último fragmento "olha" para cada um dos anteriores (ilustrativo).
	attention: [0.05, 0.4, 0.05, 0.25, 0.3],
	bets: NEXT_WORD.steps[0],
	note: 'e recomeça, um fragmento por vez',
};

export const PROMPT_ART = {
	prompt:
		'Crie uma animação em JavaScript para um slide: milhares de pontos em grafite e laranja fluem como tinta ao vento e, aos poucos, se juntam para escrever "IA na Vida Real". Depois se soltam e recomeçam. Sem bibliotecas.',
	word: 'IA na Vida Real',
};

export const MUNDO_NOVO = {
	caption: 'Um mundo de possibilidades se abre pra todos, novas formas de expressão e geração de soluções de problemas',
};
