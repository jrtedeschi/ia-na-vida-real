# Guia de revisão do curso

Use este guia ao escrever ou revisar qualquer texto do site e dos slides. O hook `scripts/review-lint.mjs` confere automaticamente o que dá para conferir por padrão de texto; o resto é julgamento humano, nesta lista.

## Tese do curso

> O valor da IA não vem só do modelo, nem só do pedido. Vem do sistema em volta dela, e da disciplina de melhorar esse sistema quando ela não funciona. (Arvind Jain, CEO da Glean)

Cada encontro monta uma peça desse sistema: E1 o modelo e o pedido · E2 o contexto · E3 o trabalho · E4 a rotina. Todo conteúdo novo deve dizer qual peça ele ajuda a construir.

## Público

Adultos brasileiros, não técnicos, parte com medo da IA. Querem entender e sair usando. Não querem ser tratados como crianças, nem como alunos de pós-graduação.

## Linguagem

1. **O título diz a ideia.** "Ela lê em pedaços", não "1 · Token". Quem lê só os títulos entende a aula.
2. **Frase de conversa, não de ensaio.** Sujeito, verbo, complemento. Uma ideia por frase.
3. **Fato primeiro, explicação depois.** Um número concreto por ideia, no máximo.
4. **Português primeiro.** Termo em inglês só quando o aluno vai encontrá-lo na tela da ferramenta, e sempre depois do equivalente em português ("instruções escondidas, que em inglês se chamam *prompt injection*").
5. **Sem símbolos no lugar de palavras** em frases (≠, →, =). Setas só em diagramas.
6. **Sem enfeites.** Nada de rótulos de efeito ("No chat, agora", "Antes de tudo", "Teste rápido"), perguntas retóricas, exclamações, bordões ou frases à mão que só repetem o título.
7. **Sem eco de estrutura.** Não anunciar o formato ("seis blocos, 90 minutos", "neste slide vamos ver"). Diga o tema.
8. **Sem palavras de vendedor:** revolucionário, incrível, poderoso, mergulhar, jornada, desbloquear, potencializar, transformar sua vida, "no mundo de hoje".
9. **Sem travessão (—) para apostos.** Use ponto ou vírgula.

## Slides

1. **Fonte e autor ficam nas notas do apresentador**, nunca na tela. Exceção: citação literal, com o nome de quem disse.
2. **Letra à mão (Kalam) só para anotar um diagrama** (apontar, medir, rotular). Nunca como bordão, nem nos slides nem nas páginas.
3. **Rótulo em cima do título só quando informa** (ex.: "Exercício 1 · 10 minutos"). Se não informa nada, apague.
4. **Interação vem da fala do professor**, escrita nas notas, não de slides de pergunta.
5. **Um slide, uma ideia.** Se precisa de lista de mais de 5 itens, são dois slides.

## Conteúdo

1. **Toda afirmação de fato tem fonte** (nas notas do slide ou na seção de fontes da página), com data de verificação quando for sobre produto (planos, menus, preços).
2. **Não tirar conclusão individual de dado agregado.** "60% dos empregos são novos" não prova que "quem aprende atravessa melhor".
3. **Não comparar números de metodologias diferentes** lado a lado.
4. **Otimista e honesto:** o mecanismo de prosperidade das revoluções, com uma linha sobre o custo da transição.
5. **Demonstração ao vivo precisa de plano B**, escrito nas notas, para quando a IA não errar.

## Exercícios

1. Formato fixo: situação → pedido em 5 partes → "deu certo se…" → "não deu certo?" → desafio.
2. Aviso explícito: troque o que está entre colchetes.
3. Cabe no tempo para um leigo: no máximo 3 itens para conferir em 10 minutos.
4. Funciona no plano grátis; o caminho pago é opcional.
5. Um item de conferência humana (o que a IA não pode fazer por você).

## Como revisar

1. Rode `node scripts/review-lint.mjs --all` e resolva os avisos.
2. Leia só os títulos do deck em sequência: contam a aula?
3. Para revisão adversarial, use um agente sem contexto com `.scratch/revisao/pedido-gemini.md` (instruções + material).
