/**
 * Os quatro encontros do curso: fonte única para a home (escada e material da semana).
 * O slide "Do pedido ao sistema" tem o mesmo texto no seu próprio arquivo; ao mudar aqui, mude lá.
 */
export interface Encontro {
	n: number;
	titulo: string;
	/** Dia da aula, para mostrar (ex.: "terça, 20/10"). */
	dia: string;
	/** Fim da aula, com fuso de Brasília: até esse momento ele ainda é o "próximo". */
	fim: string;
	texto: string;
	/** Material publicado; encontros futuros ainda não têm. */
	links?: { estudo?: string; exercicios: string; slides: string };
}

export const HORARIO = 'das 20h às 21h30, ao vivo';

export const ENCONTROS: Encontro[] = [
	{
		n: 1,
		titulo: 'Aprender a pedir',
		dia: 'terça, 20/10',
		fim: '2026-10-20T21:30:00-03:00',
		texto: 'Como a IA funciona por dentro e o método para pedir bem.',
		links: { estudo: '/encontro-1/', exercicios: '/encontro-1/exercicios/', slides: '/encontro-1/slides/' },
	},
	{
		n: 2,
		titulo: 'Contexto é tudo',
		dia: 'terça, 27/10',
		fim: '2026-10-27T21:30:00-03:00',
		texto: 'A IA usando os seus documentos, as suas instruções salvas e as suas ferramentas. E como manter a conversa no rumo.',
		links: { exercicios: '/encontro-2/exercicios/', slides: '/encontro-2/slides/' },
	},
	{
		n: 3,
		titulo: 'IA no seu trabalho',
		dia: 'terça, 03/11',
		fim: '2026-11-03T21:30:00-03:00',
		texto: 'Revisar, escrever, analisar planilhas e pesquisar a fundo, sempre checando as fontes.',
	},
	{
		n: 4,
		titulo: 'Sua rotina com IA',
		dia: 'terça, 10/11',
		fim: '2026-11-10T21:30:00-03:00',
		texto: 'Guardar o que deu certo, deixar a IA conferir por você e um pequeno app na sua planilha.',
	},
];

/** O próximo encontro (ou o que está acontecendo) na data dada; `undefined` depois do último. */
export function proximoEncontro(agora: Date, encontros: Encontro[] = ENCONTROS): Encontro | undefined {
	return encontros.find((e) => new Date(e.fim).getTime() > agora.getTime());
}
