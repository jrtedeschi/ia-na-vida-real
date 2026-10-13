/** Exemplos do dia a dia: fonte única da página Exemplos e da amostra na home. */
export interface Exemplo {
	id: string;
	titulo: string;
	/** Uma frase: a situação em que a ideia ajuda. */
	situacao: string;
	/** Pedido curto e copiável; trechos entre [colchetes] o aluno troca. */
	pedido: string;
	cuidado?: string;
}

export const TEMAS: { tema: string; exemplos: Exemplo[] }[] = [
	{
		tema: 'Casa e comida',
		exemplos: [
			{
				id: 'ex-geladeira',
				titulo: 'Jantar com o que tem na geladeira',
				situacao: 'Fim do dia, geladeira quase vazia e nenhuma ideia.',
				pedido: 'Tenho em casa [ovos, arroz, tomate e meio pimentão]. Me dê 3 ideias de jantar que fiquem prontas em até 30 minutos e o passo a passo da mais fácil.',
			},
			{
				id: 'ex-mercado',
				titulo: 'Lista do mercado a partir do cardápio',
				situacao: 'Você já sabe o que vai cozinhar e quer ir ao mercado uma vez só.',
				pedido: 'Monte a lista de compras para este cardápio da semana: [cole o cardápio]. Separe por seção do mercado e some o que se repete.',
			},
			{
				id: 'ex-mancha',
				titulo: 'Tirar uma mancha',
				situacao: 'Aconteceu agora e você não quer piorar.',
				pedido: 'Caiu [café] numa [camisa branca de algodão]. Como tiro a mancha com o que costuma ter em casa? Diga também o que eu não devo fazer.',
				cuidado: 'Nunca misture produtos de limpeza sem ler a embalagem. Teste primeiro num canto escondido da roupa.',
			},
		],
	},
	{
		tema: 'Dinheiro e papelada',
		exemplos: [
			{
				id: 'ex-conta',
				titulo: 'Entender uma conta da casa',
				situacao: 'A conta veio mais alta e você não entende metade das linhas.',
				pedido: 'Explique esta conta de luz em linguagem simples: o que é cada cobrança e por que ela pode ter subido. [Cole o texto da conta]',
				cuidado: 'Apague antes o seu nome, o endereço e o número de cliente. A IA não precisa deles para explicar.',
			},
			{
				id: 'ex-planos',
				titulo: 'Comparar dois planos de celular',
				situacao: 'Você quer pagar menos sem perder o que usa.',
				pedido: 'Compare estes dois planos de celular para alguém que usa [muito WhatsApp e pouco vídeo]: [cole os dois planos]. Qual compensa mais e por quê?',
				cuidado: 'Confira o preço e as condições no site da operadora antes de trocar: a IA pode estar com informação velha.',
			},
			{
				id: 'ex-contrato',
				titulo: 'Ler um contrato antes de assinar',
				situacao: 'O contrato é longo e o vocabulário não ajuda.',
				pedido: 'Resuma este contrato de aluguel em tópicos: prazos, multas e o que é obrigação minha. No fim, liste o que eu deveria perguntar antes de assinar. [Cole o texto]',
				cuidado: 'Ajuda a entender, mas não substitui um advogado. Tire dados pessoais antes de colar.',
			},
		],
	},
	{
		tema: 'Família',
		exemplos: [
			{
				id: 'ex-tarefas',
				titulo: 'Dividir as tarefas da casa',
				situacao: 'Todo mundo mora na casa, mas nem todo mundo ajuda.',
				pedido: 'Monte um quadro semanal de tarefas da casa para [2 adultos e 2 crianças de 8 e 11 anos]. Quero que seja justo e que cada criança faça o que consegue na idade dela.',
			},
			{
				id: 'ex-aniversario',
				titulo: 'Planejar um aniversário',
				situacao: 'Você quer uma festa bonita sem passar a semana inteira pensando nela.',
				pedido: 'Planeje um aniversário de [6 anos] em casa para [15 crianças], com o tema [fundo do mar] e orçamento de [R$ 400]: lista de compras, horário do dia e 3 brincadeiras.',
			},
			{
				id: 'ex-mensagem',
				titulo: 'Escrever uma mensagem difícil',
				situacao: 'Cobrar, reclamar ou recusar um convite sem criar briga.',
				pedido: 'Me ajude a escrever uma mensagem gentil e firme para [cobrar um amigo que me deve R$ 200]. Quero manter a amizade. Me dê 2 versões, uma mais direta e uma mais leve.',
				cuidado: 'A IA sugere o tom, mas quem conhece a pessoa é você. Leia, ajuste e decida o que mandar.',
			},
		],
	},
	{
		tema: 'Aprender',
		exemplos: [
			{
				id: 'ex-aprender',
				titulo: 'Aprender um assunto do zero',
				situacao: 'Aquele assunto que todo mundo comenta e você nunca entendeu.',
				pedido: 'Me explique [como funciona a energia solar] como se eu nunca tivesse ouvido falar, com um exemplo do dia a dia. No fim, me faça 3 perguntas para conferir se eu entendi.',
				cuidado: 'A IA também erra explicando. Se o assunto for importante para uma decisão, confira numa fonte confiável.',
			},
			{
				id: 'ex-dever',
				titulo: 'Ajudar no dever de casa sem dar a resposta',
				situacao: 'Você quer ajudar, mas faz tempo que estudou isso.',
				pedido: 'Meu filho de [10 anos] está com dúvida em [frações]. Me explique como eu posso ensinar, com um exemplo usando pizza, sem dar a resposta pronta.',
			},
			{
				id: 'ex-idioma',
				titulo: 'Praticar outro idioma',
				situacao: 'Treinar a conversa sem vergonha de errar.',
				pedido: 'Vamos conversar em [inglês] sobre [pedir comida num restaurante]. Fale frases curtas e, no fim de cada resposta, corrija os meus erros e explique em português.',
			},
		],
	},
	{
		tema: 'Saúde e bem-estar',
		exemplos: [
			{
				id: 'ex-consulta',
				titulo: 'Preparar uma consulta médica',
				situacao: 'A consulta é curta e você sempre esquece de perguntar alguma coisa.',
				pedido: 'Vou ao [ortopedista] por causa de [uma dor no joelho ao subir escada, há 2 meses]. Me ajude a organizar o que contar ao médico e 5 perguntas para fazer na consulta.',
				cuidado: 'Serve para você chegar preparado. Diagnóstico e tratamento são com o médico.',
			},
			{
				id: 'ex-caminhada',
				titulo: 'Começar a caminhar',
				situacao: 'Sair do sofá sem exagerar na primeira semana.',
				pedido: 'Monte um plano de [4 semanas] para eu começar a caminhar, partindo de [10 minutos por dia], aumentando aos poucos, com dias de descanso.',
				cuidado: 'Se você tem algum problema de saúde, converse com o seu médico antes de começar.',
			},
			{
				id: 'ex-sono',
				titulo: 'Uma rotina para dormir melhor',
				situacao: 'Mudar um hábito pequeno de cada vez.',
				pedido: 'Eu deito às [23h], mas fico no celular até [1h] e acordo cansado. Monte uma rotina simples para a noite, com 5 passos que eu consiga seguir a partir de hoje.',
			},
		],
	},
	{
		tema: 'Passeios e criatividade',
		exemplos: [
			{
				id: 'ex-viagem',
				titulo: 'Roteiro de viagem',
				situacao: 'Aproveitar o feriado sem passar horas pesquisando.',
				pedido: 'Monte um roteiro de [3 dias] em [Ouro Preto] para [um casal que gosta de comida e de história], sem carro, com orçamento de [R$ 1.500].',
				cuidado: 'Confira horários, preços e endereços antes de ir: a IA pode estar desatualizada ou inventar um lugar.',
			},
			{
				id: 'ex-presente',
				titulo: 'Ideia de presente',
				situacao: 'Fugir do presente de sempre.',
				pedido: 'Quero dar um presente para [a minha mãe, 65 anos, que gosta de plantas e de cozinhar], até [R$ 150]. Me dê 5 ideias diferentes, sendo uma feita à mão.',
			},
			{
				id: 'ex-convite',
				titulo: 'A imagem de um convite',
				situacao: 'Um convite bonito sem saber desenhar.',
				pedido: 'Crie a imagem de um convite de [aniversário de 6 anos, com o tema fundo do mar], com espaço em branco para eu escrever o texto.',
				cuidado: 'Para gerar imagem, use o Gemini ou o ChatGPT: o Claude não gera imagens.',
			},
			{
				id: 'ex-planta',
				titulo: 'Descobrir que planta é esta',
				situacao: 'Você ganhou uma planta e não sabe nem o nome dela.',
				pedido: '[Mande uma foto da planta] Que planta é esta? Como eu cuido dela num apartamento com pouca luz?',
				cuidado: 'A IA pode errar a identificação. Se a planta estiver doente, confira com quem entende antes de mudar tudo.',
			},
		],
	},
];
