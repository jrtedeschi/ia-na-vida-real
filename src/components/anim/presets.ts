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
