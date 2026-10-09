Você é um revisor adversarial: um professor experiente de educação de adultos no Brasil e um editor de texto exigente, contratados para achar o que está ruim neste material antes da aula. O autor não está satisfeito com a LINGUAGEM nem com a LINHA DE APRESENTAÇÃO (a narrativa e a ordem dos slides). Não elogie. Seja específico, cite trechos exatos.

Responda em português do Brasil, em markdown, com estas seções:

1. Veredito em 5 linhas: o maior problema de linguagem e o maior problema de narrativa.
2. Linguagem: o que soa artificial, frio, professoral, "texto de IA", traduzido do inglês ou difícil para um leigo brasileiro. Para cada problema: trecho exato → por que incomoda → reescrita sugerida. Pelo menos 15 itens, priorizando slides e páginas do Encontro 1.
3. Linha de apresentação: a ordem dos 27 slides funciona para um público leigo e com medo? Onde a energia cai, onde há salto lógico, onde há excesso de conteúdo, o que falta (histórias, exemplos do cotidiano brasileiro, interação, humor, momentos "uau"). Proponha uma linha alternativa completa, slide a slide (título + ideia em uma frase), mantendo 90 minutos e a parte prática.
4. Erros de conteúdo ou afirmações arriscadas que um aluno ou especialista poderia contestar.
5. Os 5 exercícios: vão funcionar ao vivo com leigos? O que pode dar errado? Como melhorar.
6. Lista final priorizada: as 10 mudanças de maior impacto.

=================== MATERIAL ===================

# Material para revisão: curso "IA na Vida Real"

Público: brasileiros adultos, não técnicos, que já ouviram falar de IA (alguns já usam o ChatGPT), muitos com medo dela. Curso ao vivo, online, 4 encontros de 1h30. Objetivo do Encontro 1: entender como a IA funciona por dentro, perder o medo e sair fazendo pedidos melhores.

Abaixo: (1) o texto dos 27 slides do Encontro 1, na ordem, com as notas do apresentador; (2) as páginas do site (estudo, exercícios e consulta).


## 1. Slides do Encontro 1


### Slide 1
IA na Vida Real · Encontro 01 01 Como a IA funciona O que acontece quando você aperta enviar, e como pedir melhor. terça, 20/10 · 20h
Notas: Boas-vindas. Câmera ligada se puder. Avisar que a aula fica gravada e que o material está no site.

### Slide 2
Quem conduz João Rafael Engenheiro de dados sênior Mais de 8 anos construindo soluções de dados em nuvem Montou a infraestrutura de dados de uma grande instituição financeira, para 8 times de engenharia Hoje lidera integrações de dados da área de pagamentos na DoorDash Usa agentes de IA todo dia para acelerar e automatizar o trabalho e ainda confere tudo
Notas: Apresentação curta, 1 minuto. A frase final planta o "fique com o volante".

### Slide 3
No chat, agora O que você já tentou fazer com IA, e o que deu errado? suas respostas viram exemplos hoje
Notas: Ler 3 ou 4 respostas em voz alta. Anotar as que servem de exemplo nos exercícios.

### Slide 4
Hoje Seis blocos, 90 minutos Medo e adaptação o que a história ensina O que acontece quando você aperta enviar 4 ideias, 4 animações Quem é quem e seus dados configuração ao vivo O pedido em 5 partes o método Mão na massa 3 exercícios Para casa 2 exercícios

### Slide 5
Medo e adaptação Você tem medo da IA? Se tem, está em boa companhia: toda tecnologia grande começou assim. "Estamos sendo atingidos por uma nova doença: o desemprego tecnológico." John Maynard Keynes, 1930 isso foi há 96 anos
Notas: Original: "We are being afflicted with a new disease ... namely, technological unemployment." (Economic Possibilities for our Grandchildren, 1930)

### Slide 6
Estados Unidos, 1970–2010 O caixa eletrônico não acabou com o bancário 20 → 13 bancários por agência +43% agências abertas a tarefa mudou: de contar para atender Bessen, FMI, 2015
Notas: A máquina levou a tarefa de contar dinheiro. Agência ficou mais barata de abrir, abriram mais agências, e o bancário passou a atender e vender. Hoje a tendência é outra (WEF 2025 lista caixas de banco entre as funções que mais encolhem): não prometer que vai ser sempre assim.

### Slide 7
O outro lado · Brasil Aqui também doeu 730 mil bancários no início dos anos 1990 393 mil em 2001 a transição tem rosto DIEESE, 2017
Notas: Não pular este slide. É o que dá credibilidade ao otimismo. Não foi só tecnologia: autoatendimento, fim da inflação alta (Plano Real), fusões e privatizações. Quem estava no meio da transição sofreu. Por isso aprender cedo importa.

### Slide 8
The Adaptation Advantage A IA mexe em tarefas Aumenta o que você já faz Fatia o trabalho em pedaços Automatiza alguns desses pedaços cargo ≠ propósito McGowan e Shipley, 2020
Notas: A tese do livro: ancorar a identidade no porquê do trabalho, não no cargo. A IA mexe em tarefas; o propósito continua seu. Volta no exercício 5 e no Encontro 4.

### Slide 9
Você está aqui 60% dos empregos de 2018 nos EUA não existiam em 1940 Quem aprende a ferramenta e redesenha o próprio trabalho atravessa a transição melhor. é para isso que estamos aqui Autor et al., QJE 2024

### Slide 10
Parte 2 O que acontece quando você aperta enviar Seu texto vira pedaços A IA aposta na próxima palavra Por isso às vezes inventa A memória tem tamanho

### Slide 11
1 · Token A IA lê em pedaços
[componente: TokenSplit]
Notas: Deixar a animação rodar. Perguntar: alguém acha que a IA conta palavras? Ela conta tokens. Limite e preço são em tokens.

### Slide 12
Teste rápido Pergunte a uma IA: quantas letras R tem "arrozeiro"? ela nunca viu as letras, só os pedaços

### Slide 13
2 · Próxima palavra A IA aposta
[componente: NextWord]
Notas: É o corretor do celular, treinado com uma quantidade enorme de texto. Cada resposta é uma sequência de apostas: por isso a mesma pergunta dá respostas diferentes.

### Slide 14
3 · Alucinação O provável não é o verdadeiro
[componente: NextWord]
Notas: Ninguém sabe se a padaria Estrela existe. Todos os anos parecem plausíveis e a IA escolhe um com segurança. Ela não consulta uma lista de fatos.

### Slide 15
Onde a IA mais inventa Desconfie de detalhes Referências: livros, artigos, links, leis Datas, números e citações exatas Pessoas e lugares pouco conhecidos Perguntas com premissa falsa texto bonito não é texto certo

### Slide 16
4 · Janela de contexto A memória tem tamanho
[componente: ContextWindow]
Notas: Analogia da mesa de trabalho: cabe um tanto de papel, o resto cai no chão.

### Slide 17
Regra prática Um assunto, uma conversa E repita o essencial quando a conversa ficar longa. Nos próximos encontros: como a IA encontra o trecho certo nos seus documentos (E2) e modelos que pensam antes de responder (E3).

### Slide 18
Parte 3 Quem é quem Cada empresa tem modelos rápidos e baratos e modelos caprichados e lentos.
[componente: QuemEQuem]

### Slide 19
Seus dados Pagar não desliga o treinamento Vamos configurar juntos, agora. Claude Configurações → Privacidade ChatGPT Configurações → Controles de dados Gemini Configurações e ajuda → Atividade
Notas: Compartilhar a tela e fazer junto. Cada um decide se liga ou desliga; o importante é decidir. Avisar: 👍/👎 pode mandar a conversa para treino mesmo desligado.

### Slide 20
Antes de colar Você escreveria isso num cartão-postal? Senha, dado bancário, saúde, dado de cliente: não cole. Na dúvida, troque o nome por "Cliente A". checklist completo no site

### Slide 21
Parte 4 O pedido em 5 partes Contexto quem é você e qual é a situação Objetivo o que você quer alcançar Referências com base em quê Restrições limites e o que evitar Formato como você quer receber pedido melhor, apostas melhores
Notas: Ligar com a próxima palavra: cada parte muda as apostas da IA.

### Slide 22
Exercício 1 · 10 min Organize sua semana Primeiro só "organize minha semana". Depois o pedido completo. Compare.
[componente: Prompt]
Notas: Quem não tiver lista usa a da Ana (está no site). Debrief: o que mudou entre as duas respostas?

### Slide 23
Exercício 2 · 10 min Pergunte duas vezes O mesmo pedido em duas IAs diferentes. Anote 2 diferenças.
[componente: Prompt]

### Slide 24
Exercício 3 · 12 min Pegue a IA errando Peça leituras sobre um tema que você domina. Confira cada item numa busca comum.
[componente: Prompt]
Notas: Pedir no chat: quantos itens inventados cada um achou? Se a IA buscou na web, comparar com uma sem busca.

### Slide 25
Para levar Quais tarefas você quer delegar para ficar com o que importa? delegue a tarefa, não o julgamento

### Slide 26
Para casa Dois exercícios 4 · Seu primeiro pedido de verdade Uma tarefa real da semana, em 5 partes, do zero. 5 · Por que você faz o que faz? Seu porquê em 2 frases e 5 tarefas marcadas: aumentar, fatiar, automatizar ou só sua. o exercício 5 vira sua base no Encontro 4

### Slide 27
Material, exercícios e consulta {siteLabel} Próximo encontro: terça, 27/10, 20h · Contexto é tudo obrigado!


## 2. Páginas do site


---
### Arquivo: src/content/docs/index.mdx
---
title: Comece aqui
description: Material de estudo, consulta e exercícios do curso IA na Vida Real.
---

Este é o material do curso **IA na Vida Real**: o que vimos em cada encontro, os exercícios com o seu progresso salvo, e uma consulta para usar depois do curso.

## Próximo encontro

<LinkCard title="Encontro 1 · Como a IA funciona" description="Terça, 20/10, das 20h às 21h30, ao vivo. Veja o que preparar antes da aula." href="/encontro-1/" />

<Hand>cada encontro abre na véspera da aula</Hand>

## Consulta

<CardGrid>
	<LinkCard title="O pedido em 5 partes" description="Contexto, objetivo, referências, restrições e formato." href="/consulta/pedido-em-5-partes/" />
	<LinkCard title="Conceitos" description="Token, próxima palavra, alucinação, janela de contexto, modelos e custo." href="/consulta/conceitos/token/" />
	<LinkCard title="Segurança e privacidade" description="Configure o treinamento com seus dados e evite golpes." href="/consulta/seguranca-e-privacidade/" />
	<LinkCard title="Fique com o volante" description="Delegue a tarefa, não o julgamento." href="/consulta/fique-com-o-volante/" />
	<LinkCard title="IA e trabalho" description="O que as revoluções anteriores ensinam." href="/consulta/ia-e-trabalho/" />
</CardGrid>

## Calendário

| Encontro | Data | Tema |
|---|---|---|
| 1 | terça, 20/10 | Como a IA funciona |
| 2 | terça, 27/10 | Contexto é tudo |
| 3 | terça, 03/11 | IA no seu trabalho |
| 4 | terça, 10/11 | Sua base de conhecimento |

Todas as aulas são das 20h às 21h30, ao vivo, e ficam gravadas.


---
### Arquivo: src/content/docs/encontro-1/index.mdx
---
title: 'Encontro 1 · Como a IA funciona'
description: O que acontece quando você aperta enviar. Revisão do Encontro 1, com os conceitos e o método.
---

<p class="ivr-label">Terça, 20/10 · 20h às 21h30 · ao vivo</p>

<Aside type="tip" title="Antes da aula · 5 minutos">
1. Crie conta grátis em pelo menos duas destas: [claude.ai](https://claude.ai), [chatgpt.com](https://chatgpt.com), [gemini.google.com](https://gemini.google.com).
2. Pense numa tarefa da sua semana que você gostaria de delegar.
3. Pense num tema que você conhece bem: vamos usá-lo para pegar a IA errando.
</Aside>

## A IA mexe em tarefas, não no seu propósito

Toda grande tecnologia trouxe o medo do fim dos empregos, e o padrão histórico foi de tarefas sumindo e trabalhos mudando, com uma transição dura para quem estava no meio. A tecnologia **aumenta** o que você faz, **fatia** o trabalho em pedaços e **automatiza** alguns deles. O porquê do seu trabalho continua seu. A história completa, com os números, está em [IA e trabalho](/consulta/ia-e-trabalho/).

<Hand>cargo ≠ propósito</Hand>

## O que acontece quando você aperta enviar

### 1. Seu texto vira pedaços

<TokenSplit {...TOKEN} />

A IA lê em [tokens](/consulta/conceitos/token/), pedaços de 3 a 4 letras. O limite da conversa e o preço dos planos são contados neles.

### 2. A IA aposta na próxima palavra

<NextWord {...NEXT_WORD} />

O modelo calcula a chance de cada pedaço vir a seguir, escolhe um e repete. A resposta inteira é uma sequência de apostas. Mais em [próxima palavra](/consulta/conceitos/proxima-palavra/).

### 3. Por isso ela às vezes inventa

<NextWord {...HALLUCINATION} />

A aposta escolhe o provável, não o verdadeiro. Quando a IA não sabe, a continuação provável continua soando confiante. Mais em [alucinação](/consulta/conceitos/alucinacao/).

### 4. A memória tem tamanho

<ContextWindow {...CONTEXT_WINDOW} />

A IA só enxerga um tanto de texto por vez. Numa conversa longa, o começo sai da [janela de contexto](/consulta/conceitos/janela-de-contexto/). Um assunto, uma conversa.

## Quem é quem

<QuemEQuem />

Cada empresa tem modelos rápidos e modelos caprichados. O que cada plano grátis faz está em [modelos e custo](/consulta/conceitos/modelos-e-custo/).

## Seus dados

Pagar não desliga o uso das suas conversas para treinar modelos. Se você não configurou na aula, faça agora: [Segurança e privacidade](/consulta/seguranca-e-privacidade/). E antes de colar qualquer coisa, a regra do cartão-postal: você escreveria isso num cartão-postal?

## O pedido em 5 partes

**Contexto, objetivo, referências, restrições e formato.** A diferença entre uma resposta genérica e uma resposta útil está no pedido. Veja o modelo pronto em [O pedido em 5 partes](/consulta/pedido-em-5-partes/).

## Agora pratique

<CardGrid>
	<LinkCard title="Exercícios do Encontro 1" description="3 em aula e 2 para casa, com o seu progresso salvo." href="/encontro-1/exercicios/" />
	<LinkCard title="Fique com o volante" description="Delegue a tarefa, não o julgamento: 5 hábitos." href="/consulta/fique-com-o-volante/" />
</CardGrid>


---
### Arquivo: src/content/docs/encontro-1/exercicios.mdx
---
title: 'Encontro 1 · Exercícios'
description: Três exercícios em aula e dois para casa. Tudo funciona no plano grátis.
---

Marque o que deu certo: o progresso fica salvo neste navegador. A caixinha laranja é a checagem que só você pode fazer.

<Progress />

<Exercise
	id="e1-ex1" n={1} title="Organize sua semana" when="Em aula" minutes={10} tool="Grátis · qualquer IA"
	checks={['Tem uma tabela para cada dia útil', 'Nenhum dia passa do seu limite de horas', 'Tarefas com prazo vêm antes de sexta']}
	human="Você concorda com as prioridades, ou sabe dizer qual mudaria e por quê"
	fail="Resposta genérica quase sempre é falta de contexto ou de restrição." failHref="/consulta/pedido-em-5-partes/" failLabel="o pedido em 5 partes"
	challenge="Peça para a IA explicar o critério que usou para priorizar."
	hand="a diferença está no pedido"
>
<p>Uma semana cheia de reuniões e tarefas soltas. Primeiro peça só <strong>"organize minha semana"</strong>. Depois mande o pedido completo abaixo e compare as duas respostas.</p>
<p>Sem lista à mão? Use a da Ana, analista de RH: revisar 3 currículos, preparar a integração de 2 pessoas novas, fechar a folha de ponto, responder a pesquisa de clima, agendar 4 entrevistas, atualizar a planilha de férias, montar o treinamento de quinta, ligar para o plano de saúde, revisar o manual de onboarding, enviar o relatório mensal, organizar o arquivo de contratos e preparar a reunião de sexta.</p>
<Prompt slot="prompt" id="e1-ex1-p"
	contexto="Trabalho em [uma equipe pequena, com muitas reuniões]."
	objetivo="Não deixar nada importante para sexta."
	referencias="[Cole sua lista de tarefas]"
	restricoes="No máximo [2h] livres por dia, nada depois das [18h]."
	formato="Uma tabela por dia, com 3 prioridades em cada."
/>
</Exercise>

<Exercise
	id="e1-ex2" n={2} title="Pergunte duas vezes" when="Em aula" minutes={10} tool="Grátis · duas IAs"
	checks={['As duas respeitaram a restrição alimentar e o tempo de preparo', 'Você anotou pelo menos 2 diferenças entre as respostas']}
	human="Você conferiu um preço num app de mercado e sabe qual estimativa errou mais"
	fail="Respostas quase iguais acontecem em pedidos muito fechados." failHref="/consulta/conceitos/proxima-palavra/" failLabel="a próxima palavra"
	challenge="Peça para cada IA criticar o cardápio da outra."
	hand="modelos diferentes, apostas diferentes"
>
<p>Jantar para 6 amigos no sábado. Mande o mesmo pedido para duas IAs diferentes (Claude, ChatGPT ou Gemini) e compare.</p>
<Prompt slot="prompt" id="e1-ex2-p"
	contexto="Vou receber [6] amigos para jantar no sábado; [um é vegetariano]."
	objetivo="Um cardápio simples que agrade todo mundo."
	referencias="Orçamento de [R$ 200]; tenho forno e fogão."
	restricoes="Nada que leve mais de 1h de preparo."
	formato="Entrada, prato e sobremesa, mais lista de compras com preço estimado."
/>
</Exercise>

<Exercise
	id="e1-ex3" n={3} title="Pegue a IA errando" when="Em aula" minutes={12} tool="Grátis · qualquer IA"
	checks={['Você procurou cada item numa busca comum', 'Você perguntou "tem certeza?" e viu se a IA se corrigiu']}
	human="Você sabe dizer quais itens existem e quais foram inventados"
	fail="Não achou nenhum erro? Ótimo sinal, mas repita com um tema mais de nicho. Se a IA buscou na web, compare com uma resposta sem busca." failHref="/consulta/conceitos/alucinacao/" failLabel="alucinação"
	challenge="Peça para a IA dizer o quanto confia em cada item, de 0 a 100%."
	hand="confie, mas confira"
>
<p>Você precisa de leituras sobre um tema que conhece bem. Peça, e depois confira cada item fora da IA.</p>
<Prompt slot="prompt" id="e1-ex3-p"
	contexto="Trabalho com [sua área]."
	objetivo="Encontrar leituras sobre [um tema bem específico da sua área]."
	referencias="Prefiro material em português."
	restricoes="Só livros ou artigos que existem de verdade."
	formato="Lista de 5 itens com autor, ano, editora ou revista, e link."
/>
</Exercise>

<Exercise
	id="e1-ex4" n={4} title="Seu primeiro pedido de verdade" when="Para casa" minutes={15} tool="Grátis · qualquer IA"
	checks={['Seu pedido tem as 5 partes', 'A resposta poupou tempo de verdade']}
	human="Você anotou o que mudou na resposta depois de ajustar uma das partes"
	fail="Traga o pedido para o Encontro 2: a aula começa por ele."
	hand="o método vira hábito"
>
<p>Escolha uma tarefa real desta semana e escreva o pedido em 5 partes do zero, sem modelo.</p>
</Exercise>

<Exercise
	id="e1-ex5" n={5} title="Por que você faz o que faz?" when="Para casa" minutes={15} tool="Grátis · qualquer IA"
	checks={['Seu porquê não cita o nome do cargo', 'Cada uma das 5 tarefas tem uma marcação']}
	human="Você discordou da IA em pelo menos um ponto, e sabe por quê"
	hand="vira sua base no Encontro 4"
>
<p>Escreva em 2 frases por que seu trabalho existe: para quem, e que problema resolve. Depois liste 5 tarefas da sua semana e marque cada uma: a IA pode <strong>aumentar</strong>, <strong>fatiar</strong>, <strong>automatizar</strong>, ou é <strong>só sua</strong>.</p>
<p>Guarde o resultado: no Encontro 4 ele vira a primeira página da sua base de conhecimento.</p>
<Prompt slot="prompt" id="e1-ex5-p"
	contexto="Este é o porquê do meu trabalho: [suas 2 frases]."
	objetivo="Quero saber onde a IA pode me ajudar sem eu perder o que importa."
	referencias="[Suas 5 tarefas, já marcadas]"
	restricoes="Discorde de mim quando achar que errei."
	formato="Para cada tarefa: concorda ou não, e por quê, em uma linha."
/>
</Exercise>


---
### Arquivo: src/content/docs/consulta/pedido-em-5-partes.mdx
---
title: O pedido em 5 partes
description: Contexto, objetivo, referências, restrições e formato. A lógica que transforma uma resposta genérica numa resposta útil.
---

<Definition>Um bom pedido diz à IA quem você é, o que quer, com base em quê, dentro de quais limites e em que formato.</Definition>

| Parte | A pergunta que ela responde | Exemplo |
|---|---|---|
| **Contexto** | Quem é você e qual é a situação? | Trabalho numa equipe pequena, com muitas reuniões. |
| **Objetivo** | O que você quer alcançar? | Não deixar nada importante para sexta. |
| **Referências** | Com base em quê a IA deve responder? | Minha lista de tarefas e os horários das reuniões. |
| **Restrições** | Quais são os limites e o que evitar? | No máximo 2h livres por dia, nada depois das 18h. |
| **Formato** | Como você quer receber? | Uma tabela por dia, com 3 prioridades em cada. |

<Prompt
	id="modelo-5-partes"
	contexto="[Quem é você e qual é a situação]"
	objetivo="[O que você quer alcançar com a resposta]"
	referencias="[Cole aqui materiais, exemplos ou dados]"
	restricoes="[Limites, cuidados e o que evitar]"
	formato="[Tabela, lista, e-mail, tamanho, tom]"
/>

## Por que funciona

A IA escreve apostando na [próxima palavra](/consulta/conceitos/proxima-palavra/). Cada parte do pedido muda as apostas: o contexto descarta respostas genéricas, as referências dão fatos para ela não [inventar](/consulta/conceitos/alucinacao/), e o formato evita que você precise reescrever a resposta.

<Hand>a diferença está no pedido</Hand>

## Dicas

- **Não precisa ser em ordem nem com os nomes das partes.** O que importa é que as cinco informações estejam lá.
- **Comece pelo que falta.** Resposta genérica? Quase sempre falta contexto ou restrição.
- **Converse.** Se a primeira resposta não serviu, diga o que mudar ("mais curto", "sem jargão", "considere que…"). O pedido em 5 partes é o começo, não o fim.
- **Guarde os pedidos que funcionaram.** No Encontro 4, eles viram rotinas.


---
### Arquivo: src/content/docs/consulta/conceitos/alucinacao.mdx
---
title: Alucinação
description: Por que a IA às vezes inventa, com toda a segurança. E como se proteger.
sidebar:
  order: 3
---

<Definition>Alucinação é quando a IA escreve algo falso com a mesma segurança de algo verdadeiro, porque ela escolhe o provável, não o verdadeiro.</Definition>

<NextWord {...HALLUCINATION} />

## Por que acontece

A IA escreve apostando na [próxima palavra](/consulta/conceitos/proxima-palavra/). Ela não consulta uma lista de fatos antes de responder. Quando a pergunta é sobre algo que ela viu muitas vezes no treino, o provável costuma coincidir com o verdadeiro. Quando é sobre algo raro, específico ou que nem existe, a aposta continua soando confiante, só que sem base.

Na animação, ninguém sabe se a padaria Estrela existe. Todos os anos parecem plausíveis, e a IA escolhe um como se soubesse.

<Hand>provável ≠ verdadeiro</Hand>

## Onde é mais comum

- Referências: livros, artigos, links, leis e números de processo.
- Datas, números e citações exatas.
- Pessoas e lugares pouco conhecidos.
- Perguntas com uma premissa falsa ("por que a padaria Estrela fechou em 2010?").

## Na prática

- **Confira fora da IA** tudo o que for usar para decidir, publicar ou mandar para alguém.
- **Peça a fonte**, e abra a fonte. Link que não abre é sinal de invenção.
- **Use busca na web ou seus próprios documentos** quando o assunto for específico. A IA erra menos quando tem o texto na frente.
- **Pergunte "o quanto você tem certeza?"**. Não é garantia, mas às vezes ela recua.

## Erro comum

Achar que um texto bem escrito é um texto correto. A IA escreve bem até quando inventa.

## Teste rápido · 1 minuto

Pergunte: *"Quem foi o prefeito da sua cidade em 1987?"*. Depois confira numa busca comum.


---
### Arquivo: src/content/docs/consulta/conceitos/janela-de-contexto.mdx
---
title: Janela de contexto
description: A IA só enxerga um tanto de texto por vez. Numa conversa longa, o começo sai de vista.
sidebar:
  order: 4
---

<Definition>Janela de contexto é o tanto de texto que a IA consegue considerar de uma vez: sua conversa, os arquivos enviados e as instruções, tudo somado em tokens.</Definition>

<ContextWindow {...CONTEXT_WINDOW} />

## Analogia

É uma mesa de trabalho. Cabe um tanto de papel em cima dela. Quando você coloca mais, os primeiros papéis caem no chão. A IA não está "esquecendo" por descuido: aquele texto simplesmente não está mais na mesa.

## Na prática

- **Um assunto, uma conversa.** Mudou de assunto, abra uma conversa nova.
- **Repita o essencial.** Em conversas longas, relembre o contexto importante ("lembrando: sou nutricionista e o paciente é celíaco").
- **Arquivos grandes ocupam a janela.** Um PDF de 200 páginas pode deixar pouco espaço para a conversa.
- **Os aplicativos escondem isso de você.** Alguns resumem o começo da conversa automaticamente; detalhes podem se perder no resumo.

<Hand>um assunto, uma conversa</Hand>

## Erro comum

Achar que a IA lembra de conversas antigas. Por padrão, cada conversa começa do zero. Recursos de "memória" e os Projetos (que você vê no Encontro 2) guardam algumas informações, mas elas também ocupam a janela.

## Teste rápido · 1 minuto

Numa conversa longa que você já tem, pergunte algo que você disse logo no começo. Veja se a IA acerta.


---
### Arquivo: src/content/docs/consulta/conceitos/modelos-e-custo.mdx
---
title: Quem é quem, modelos e custo
description: Empresa, modelo e aplicativo. Por que existem modelos rápidos e modelos caprichados, e o que o plano grátis faz.
sidebar:
  order: 5
---

<Definition>Uma empresa treina o modelo; o modelo roda dentro de um aplicativo; você conversa com o aplicativo.</Definition>

<QuemEQuem />

## Modelos rápidos e modelos caprichados

Cada empresa oferece mais de um modelo. Os menores respondem rápido e custam pouco. Os maiores erram menos em tarefas difíceis, mas são mais lentos e mais caros. Alguns modelos também "pensam" antes de responder: escrevem um rascunho de raciocínio antes da resposta final (você vê isso no Encontro 3).

<Hand>tarefa simples, modelo rápido</Hand>

## O que o plano grátis faz (outubro de 2026)

| | Claude grátis | ChatGPT grátis | Gemini grátis |
|---|---|---|---|
| Enviar arquivos | Sim | Sim | Sim |
| Analisar planilhas | Sim | Sim | A confirmar |
| Busca na web | Sim | Sim | Sim |
| Projetos com instruções fixas | Sim, até 5 | A confirmar | A confirmar |
| Pesquisa aprofundada (deep research) | **Não** | Limitada | Sim |
| Gerar imagens | **Não** | Sim | Sim |

Pagar libera mais uso, modelos maiores e alguns recursos. **Pagar não desliga o uso das suas conversas para treinar modelos**: isso é uma configuração separada (veja [Segurança e privacidade](/consulta/seguranca-e-privacidade/)).

<p class="ivr-label">Verificado em 06/10/2026 nas páginas oficiais. Planos e limites mudam com frequência.</p>

## Erro comum

Achar que "a IA" é uma coisa só. Quando uma resposta decepciona, às vezes o problema é o modelo escolhido, não o pedido.


---
### Arquivo: src/content/docs/consulta/conceitos/proxima-palavra.mdx
---
title: Próxima palavra
description: Um modelo de linguagem escreve apostando, pedaço por pedaço, no que é mais provável vir a seguir.
sidebar:
  order: 2
---

<Definition>Um modelo de linguagem calcula a chance de cada pedaço de texto vir a seguir, escolhe um, e repete até terminar a resposta.</Definition>

<NextWord {...NEXT_WORD} />

## Analogia

É o corretor do celular que sugere a próxima palavra, só que treinado com uma quantidade enorme de textos. Ele aprendeu tão bem os padrões da escrita que consegue continuar uma frase, um e-mail ou um relatório inteiro.

## Na prática

- **Cada resposta é uma sequência de apostas.** Por isso a mesma pergunta, feita duas vezes, pode dar respostas diferentes.
- **O seu pedido muda as apostas.** Contexto, objetivo e exemplos deixam as continuações certas mais prováveis. É por isso que [o pedido em 5 partes](/consulta/pedido-em-5-partes/) funciona.
- **Modelos diferentes apostam diferente.** Foram treinados com textos e ajustes diferentes.

<Hand>pedido melhor, apostas melhores</Hand>

## Erro comum

Achar que a IA "procura a resposta" num banco de dados. Ela não procura: ela escreve o que é provável. Quando a IA usa busca na web, ela primeiro procura páginas e depois escreve com base nelas, mas a escrita continua sendo aposta.

## Teste rápido · 1 minuto

Faça a mesma pergunta aberta duas vezes, em conversas novas: *"Me dê uma ideia de presente para minha mãe."* Compare. As respostas diferentes são apostas diferentes.


---
### Arquivo: src/content/docs/consulta/conceitos/token.mdx
---
title: Token
description: A IA lê o texto em pedaços chamados tokens. É neles que se contam o limite da conversa e o preço.
sidebar:
  order: 1
---

<Definition>Token é o pedaço de texto que a IA lê de cada vez: em português, mais ou menos 3 a 4 letras.</Definition>

<TokenSplit {...TOKEN} />

## Analogia

Lembra de quando aprendeu a ler separando sílabas? A IA também lê em pedaços, só que os pedaços dela não são sílabas: são os trechos de letras que mais apareciam nos textos usados para treiná-la. Palavras comuns viram um pedaço só; palavras raras viram vários.

## Na prática

- **O limite da conversa é contado em tokens.** Cada modelo aguenta um número máximo de tokens por conversa (veja [janela de contexto](/consulta/conceitos/janela-de-contexto/)).
- **O preço também.** Planos pagos e serviços para empresas cobram por token lido e escrito.
- **Português gasta mais tokens que inglês** para dizer a mesma coisa, porque o "dicionário" de pedaços foi montado com muito mais texto em inglês.

<Hand>conversa longa = mais tokens = mais custo</Hand>

## Erro comum

Achar que a IA conta palavras. Ela não conta. Por isso pedidos como "escreva exatamente 100 palavras" ou "quantas letras tem esta frase?" costumam sair errados: a IA nunca viu as letras, só os pedaços.

## Teste rápido · 1 minuto

Abra o [contador de tokens da OpenAI](https://platform.openai.com/tokenizer) (gratuito). Cole uma frase em português e a mesma frase em inglês. Compare quantos pedaços cada uma vira e onde as palavras foram cortadas.

<p class="ivr-label">Cada modelo tem o seu próprio "dicionário" de tokens: a mesma frase vira pedaços diferentes no Claude, no ChatGPT e no Gemini.</p>


---
### Arquivo: src/content/docs/consulta/seguranca-e-privacidade.mdx
---
title: Segurança e privacidade
description: Configure o treinamento com seus dados, saiba o que nunca colar na IA e reconheça os golpes que usam IA.
---

<p class="ivr-label">Verificado em 06/10/2026 nas páginas oficiais. Os menus mudam com frequência: se não achar, procure por "privacidade" nas configurações.</p>

## Pagar não desliga o treinamento

As três empresas podem usar suas conversas para melhorar os modelos. Isso vale no plano grátis e também nos planos individuais pagos. Só contas de trabalho ou de empresa mudam esse padrão.

| | Usa suas conversas para treinar? | Onde decidir |
|---|---|---|
| **Claude** | Só se a opção estiver ligada. O aviso de 2025 pode ter vindo com ela ligada: confira. | Configurações → Privacidade → "Help improve our AI models" |
| **ChatGPT** | Sim, por padrão. | Configurações → Controles de dados → "Melhorar o modelo para todos" |
| **Gemini** | Sim, por padrão, com revisão de pessoas. | Configurações e ajuda → Atividade |
| **Gemini Notebook** (conta pessoal) | Não, a menos que você dê feedback. | — |

Dois detalhes que pegam muita gente:

- **Dar 👍 ou 👎 numa resposta** pode enviar a conversa inteira para revisão ou treino, mesmo com a opção desligada (ChatGPT e Gemini Notebook). Não faça isso em conversa sensível.
- **Apagar não apaga na hora.** As empresas guardam por até 30 dias. No Gemini, o que já foi lido por revisores humanos fica até 3 anos, desvinculado da sua conta.

## Configure uma vez · 5 minutos

<Steps>

1. **Claude:** Configurações → Privacidade. Decida sobre "Help improve our AI models".
2. **ChatGPT:** Configurações → Controles de dados. Decida sobre "Melhorar o modelo para todos".
3. **Gemini:** Configurações e ajuda → Atividade. Escolha entre manter e desativar. Se mantiver, ajuste a exclusão automática (o padrão é 18 meses; dá para pôr 3).
4. Ative a **verificação em duas etapas** nas contas Google, OpenAI e Anthropic.
5. Use só os endereços oficiais: claude.ai · chatgpt.com · gemini.google.com.

</Steps>

## A regra do cartão-postal

Antes de colar qualquer coisa, pergunte: **eu escreveria isto num cartão-postal?**

- Senha, código, cartão ou dado bancário: **não cole.**
- Nome, CPF, telefone ou dado de saúde de outra pessoa: troque por "Cliente A".
- Documento sigiloso do trabalho: só em conta da empresa, com aval dela.
- Assunto delicado: use o **chat temporário** (Claude: ícone de fantasma · ChatGPT: "Temporário" · Gemini: chat temporário). Ainda fica guardado por alguns dias.

<Hand>na dúvida, troque o nome</Hand>

## Quando a IA lê coisas de outras pessoas

Um PDF, um site ou um e-mail podem trazer **instruções escondidas** para a IA, escritas para mudar a resposta dela. Isso se chama *prompt injection*. Em decisões importantes, confira no documento original, e dê à IA só os acessos de que ela precisa.

## Golpes que usam IA

- Voz ou vídeo de parente pedindo dinheiro com urgência: **desligue e ligue de volta** no número que você já tem.
- Combine uma **palavra-código** com a família.
- Texto perfeito não prova nada: confira o link, o remetente e quem recebe o Pix.
- Nunca passe código de SMS para ninguém.

## Fontes

- [Claude: seus dados são usados para treinar?](https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training)
- [OpenAI: como seus dados melhoram os modelos](https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance)
- [Google: Central de privacidade dos apps Gemini](https://support.google.com/gemini/answer/13594961)
- [Cartilhas de segurança do CERT.br](https://cartilha.cert.br/)
- [ANPD: temas prioritários 2026–2027](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-mapa-de-temas-prioritarios-para-o-bienio-2026-2027-e-atualiza-agenda-regulatoria-2025-2026)


---
### Arquivo: src/content/docs/consulta/fique-com-o-volante.mdx
---
title: Fique com o volante
description: Delegue a tarefa, não o julgamento. Cinco hábitos para usar IA sem desaprender a pensar.
---

<Definition>Delegar tarefas mentais é normal e muitas vezes inteligente. O risco é delegar o julgamento: aceitar a resposta sem pensar.</Definition>

## O que a pesquisa mostra

Usamos ferramentas para pensar há muito tempo: agenda, calculadora, lista de compras. Psicólogos chamam isso de *cognitive offloading*, e ele costuma ajudar ([Risko e Gilbert, 2016](https://discovery.ucl.ac.uk/1508770/)).

Com IA, a diferença está em **como** se usa. Num estudo com cerca de 1.000 alunos de ensino médio, quem treinou com o ChatGPT à vontade foi **17% pior** na prova feita sem IA. Quem treinou com uma IA que só dava dicas não teve essa perda ([Bastani et al., PNAS 2025](https://www.pnas.org/doi/10.1073/pnas.2422633122)).

<Hand>use, e fique com o volante</Hand>

## Cinco hábitos

1. **Pense antes de perguntar.** Diga em uma frase o que você espera da resposta. Assim você tem com o que comparar.
2. **Explique de volta.** Resuma a resposta com suas palavras. Se não conseguir, você ainda não entendeu.
3. **Peça o contra.** "Quais são os pontos fracos dessa resposta?" ou "Do que você não tem certeza?"
4. **Para aprender, peça dicas, não respostas.** "Não me dê a resposta; me dê uma dica de cada vez."
5. **Anote o porquê.** Ao decidir algo com ajuda da IA, escreva o motivo com suas palavras. Daqui a um mês, é isso que você vai precisar.

Regra de bolso: **a IA pode fazer o rascunho; a decisão é sua.** E: cansado demais para conferir é cansado demais para delegar.

<Aside type="note" title="E aquele estudo do MIT?">
O estudo "Your Brain on ChatGPT" (MIT Media Lab, 2025) virou manchete dizendo que a IA "deixa o cérebro preguiçoso". Ele ainda é um preprint (não passou por revisão de outros cientistas), teve 54 participantes e já recebeu críticas formais. Vale como pergunta interessante, não como prova.
</Aside>

## E a "dívida cognitiva"?

A pesquisadora Margaret-Anne Storey usa o termo para equipes de software: quando a IA escreve rápido, o código anda, mas a compreensão das pessoas fica para trás ([Storey, 2026](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/)). A lição vale para qualquer trabalho: velocidade sem entendimento cobra juros depois.


---
### Arquivo: src/content/docs/consulta/ia-e-trabalho.mdx
---
title: IA e trabalho
description: O que as revoluções anteriores ensinam sobre a IA e o emprego. Otimista, com os custos à mostra.
---

<Definition>Toda grande tecnologia trouxe o medo do fim dos empregos. O padrão histórico é de mais trabalho no total, com uma transição dura para quem estava no meio dela.</Definition>

## O medo é antigo

Em 1930, o economista John Maynard Keynes chamou o desemprego causado por máquinas de "nova doença" ([Keynes, 1930](https://www.marxists.org/reference/subject/economics/keynes/1930/our-grandchildren.htm)).

## O padrão: a tarefa some, o trabalho muda

- **Eletricidade.** Em 1899, menos de 5% da força das fábricas americanas era elétrica. A produtividade só subiu nos anos 1920, quatro décadas depois da primeira usina, quando as fábricas foram redesenhadas em volta do motor elétrico ([David, 1990](http://www.dklevine.com/archive/refs4115.pdf)).
- **Caixa eletrônico.** Cada agência passou de 20 para 13 bancários, mas o número de agências cresceu 43%. O trabalho mudou de contar dinheiro para atender (Bessen, FMI 2015).
- **Planilha eletrônica.** Desde 1980, os Estados Unidos perderam cerca de 400 mil auxiliares de contabilidade e ganharam cerca de 600 mil contadores ([NPR](https://www.npr.org/transcripts/389027988)).
- **Trabalhos novos.** Cerca de 60% dos empregos americanos de 2018 tinham nomes que não existiam em 1940 ([Autor et al., 2024](https://academic.oup.com/qje/article-abstract/139/3/1879/7614605)).

<Hand>tarefa some, profissão muda</Hand>

## O custo existe

- **Entre 1780 e 1840**, a produção por trabalhador na Grã-Bretanha subiu 46%, e o salário real só 12%. O ganho levou décadas para chegar a quem trabalhava ([Allen, 2009](https://www.nuff.ox.ac.uk/Users/Allen/engelspause.pdf)).
- **No Brasil**, os bancários caíram de mais de 730 mil para 393 mil entre o início dos anos 1990 e 2001. Não foi só tecnologia: o fim da inflação alta, fusões e privatizações também pesaram ([DIEESE](https://www.dieese.org.br/notatecnica/2017/notaTec184TecnologiaBancaria.pdf)).

## E agora?

- **No Brasil, 29,6% dos trabalhadores**, quase 30 milhões, estão em ocupações expostas à IA generativa ([FGV IBRE, 2026](https://blogdoibre.fgv.br/posts/inteligencia-artificial-generativa-e-mercado-de-trabalho-no-brasil-evidencias-iniciais-sobre)). No mundo, só 3,3% estão no grau mais alto de exposição ([OIT, 2025](https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure)). **Exposto não quer dizer substituído**: na maioria dos casos, a tarefa muda.
- **O primeiro sinal de custo** aparece em quem está começando a carreira: nos Estados Unidos, jovens de 22 a 25 anos nas funções mais expostas tiveram de 13% a 19% menos emprego relativo ([Stanford, 2025–2026](https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/)). Na economia como um todo, ainda não há ruptura ampla ([Yale Budget Lab](https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-current-state-affairs)).

## A IA mexe em tarefas

No livro *The Adaptation Advantage* (2020), Heather McGowan e Chris Shipley descrevem três coisas que a tecnologia faz com o trabalho: **aumenta** o que você faz, **fatia** o trabalho em pedaços menores e **automatiza** alguns desses pedaços. A proposta deles é ancorar a identidade no **porquê** do seu trabalho, não no cargo. O porquê continua seu.

<Hand>cargo ≠ propósito</Hand>

<Aside type="note" title="E o fim da humanidade?">
Gente séria discorda. Pesquisadores como Geoffrey Hinton e Yoshua Bengio pedem prioridade ao risco; Yann LeCun chama o cenário de absurdo. Numa pesquisa com 2.778 pesquisadores de IA, a chance mediana de um desfecho "extremamente ruim" foi de 5%, e 68% acharam bons resultados mais prováveis ([Grace et al., 2024](https://arxiv.org/abs/2401.02843)). É um debate aberto, não uma profecia.
</Aside>


---
### Conteúdo das animações
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
