# Pesquisa 10: offloading, dívida cognitiva e "rendição cognitiva" (o que dizer ao aluno)

Data da pesquisa: 2026-10-06. Fontes primárias (papers, blogs dos autores) sempre que possível.

Legenda de força da evidência:
- **[PR]** revisado por pares (journal/conferência)
- **[PRE]** preprint / working paper (sem revisão por pares)
- **[OP]** opinião / ensaio / relato de experiência

---

## 1. Resposta curta

- Delegar tarefas à IA (*offloading*) é normal e muitas vezes bom: fazemos isso há séculos com agenda, calculadora e GPS. O problema não é delegar, é **delegar o julgamento**: aceitar a resposta da IA como sua, sem ter uma opinião própria para comparar.
- A evidência mais sólida (experimentos com centenas ou milhares de pessoas) aponta para o mesmo padrão: **a IA melhora o desempenho na hora e piora o desempenho quando ela é retirada**, sobretudo quando a pessoa está aprendendo algo novo. E as pessoas **ficam mais confiantes** mesmo quando a IA erra.
- O famoso estudo do MIT ("Your Brain on ChatGPT") popularizou o termo "dívida cognitiva", mas é **preprint, com amostra pequena (54 → 18) e criticado formalmente**. Serve como ilustração, não como prova.
- O artigo da "Margaret" é de **Margaret-Anne Storey** (Univ. de Victoria), sobre dívida cognitiva em **equipes de software**. É ensaio/opinião bem fundamentada, depois transformada em preprint conceitual. Útil como metáfora, não como dado.

---

## 2. O artigo da Margaret (confirmado)

**Autora:** Margaret-Anne Storey, professora de Ciência da Computação, University of Victoria (Canadá).

**Título exato:** "How Generative and Agentic AI Shift Concern from Technical Debt to Cognitive Debt"
**Data:** 9 de fevereiro de 2026
**Link:** https://margaretstorey.com/blog/2026/02/09/cognitive-debt/
**Força:** [OP] post de blog (pesquisadora reconhecida; Simon Willison o chamou de "a melhor explicação do termo que já vi": https://simonwillison.net/2026/Feb/15/cognitive-debt/).

**Argumento central:** com IA, o código sai rápido; o gargalo passa a ser o **entendimento humano**. "Dívida técnica vive no código; dívida cognitiva vive nas pessoas." Ela parte da ideia de Peter Naur de que "um programa é uma teoria que vive na cabeça dos desenvolvedores": se ninguém entende mais o porquê das decisões, a equipe trava, mesmo com código limpo.
- Exemplo: um time de alunos que ela orientava parou na semana 7–8. Achavam que era código bagunçado; na verdade, **ninguém sabia explicar por que as decisões tinham sido tomadas** nem como as partes se encaixavam.
- Frase-chave: "Velocity without understanding is not sustainable." (Velocidade sem entendimento não se sustenta.)
- Recomendações: garantir que alguém entenda de fato cada mudança gerada pela IA; registrar o **porquê**, não só o quê; pontos regulares de compartilhamento de entendimento; sinais de alerta (medo de mexer, sistema virando caixa-preta).

**Desdobramentos:**
- "What I'm Hearing About Cognitive Debt (So Far)", 18/02/2026 [OP]: https://margaretstorey.com/blog/2026/02/18/cognitive-debt-revisited/ (define dívida cognitiva como o fosso acumulado entre a estrutura de um sistema e o entendimento compartilhado da equipe sobre como e por que ele funciona).
- Preprint "From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in the Age of AI", arXiv:2603.22106, v1 23/03/2026, v4 06/04/2026 [PRE, conceitual, sem dados experimentais]: https://arxiv.org/abs/2603.22106. Propõe o **Triple Debt Model**: dívida técnica (no código), cognitiva (nas cabeças), de intenção (na ausência de registro de metas, restrições e motivos).

**Atenção:** o termo "cognitive debt" de Storey (equipes, software) é **diferente** do "cognitive debt" de Kosmyna/MIT (indivíduo, cérebro, redação). Mesmo nome, ideias vizinhas, evidências de natureza bem diferente. No curso, não misturar como se fossem a mesma coisa.

---

## 3. Mapa da evidência

### 3.1 Base clássica: cognitive offloading
**Risko, E. F. & Gilbert, S. J. (2016). "Cognitive Offloading". *Trends in Cognitive Sciences* 20(9): 676–688.** doi:10.1016/j.tics.2016.07.002. Cópia aberta: https://discovery.ucl.ac.uk/1508770/
- **Força:** [PR] artigo de revisão, muito citado.
- Definição: usar uma ação física (anotar, usar calculadora, buscar no Google, GPS) para reduzir a exigência mental de uma tarefa.
- Mensagem: offloading tem **benefícios e custos**; é uma estratégia normal e frequentemente racional. Os próprios autores notam que **há pouca pesquisa sobre efeitos de longo prazo**.
- Uso no curso: legitima delegar. "Anotar na agenda não deixou ninguém burro; esquecer o que estava na agenda, talvez."

### 3.2 Rendição cognitiva (Shaw & Nave, Wharton)
**Shaw, S. & Nave, G. (2026). "Thinking—Fast, Slow, and Artificial: How AI Is Reshaping Human Reasoning and the Rise of Cognitive Surrender".** PsyArXiv/SSRN, jan/2026. https://osf.io/preprints/psyarxiv/yk25n_v1 · resumo Wharton: https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2026/05/thinking-fast-slow-and-artificially/
- **Força:** [PRE] working paper, mas **3 experimentos pré-registrados, 1.372 participantes, ~9.600 tentativas**. É a evidência experimental mais forte sobre "aceitar a IA sem pensar".
- Distinção útil: **offloading** = passar o *como* e manter o *o quê* (calculadora); **rendição cognitiva** = a resposta da IA vira a sua, sem visão independente.
- Desenho: questões de raciocínio (Cognitive Reflection Test); um chatbot dava, sem os participantes saberem, respostas certas em algumas questões e **erradas com confiança** em outras.
- Números (Estudo 1): quando consultavam a IA, seguiam a resposta certa em ~93% e a **errada em ~80% (79,8%)**. Acurácia +25 p.p. com IA certa; **−15 p.p.** com IA errada. Confiança ~**11,7% maior** com IA disponível. Confiar mais em IA = 3,5× mais chance de seguir o conselho errado. Incentivo financeiro + feedback imediato **dobrou** a taxa de correção, mas a maioria ainda seguiu a IA quando ela errava.
- **Discrepância nas notas do Osmani:** ele cita "73%". Não é erro, é outra medida: 73% das tentativas com IA errada foram classificadas como "rendição" (vs. 20% de correção bem-sucedida, 7% de tentativas fracassadas). Para o curso, usar **"cerca de 8 em cada 10 vezes"** (79,8%, aceitou a resposta errada quando consultou a IA).
- Ressalvas: tarefas de laboratório (charadas lógicas), amostra online, ainda sem revisão por pares.

### 3.3 Aprender com IA vs. aprender dependendo de IA
**Bastani et al. (2025). "Generative AI without guardrails can harm learning: Evidence from high school mathematics". *PNAS* 122(26): e2422633122.** https://www.pnas.org/doi/10.1073/pnas.2422633122
- **Força:** [PR] experimento de campo randomizado, ~1.000 alunos, escola de ensino médio na Turquia.
- Achado: com ChatGPT "puro", desempenho na prática +48%; na prova **sem IA, −17%** em relação a quem nunca usou. Com um "tutor" configurado para dar **dicas e não respostas**, o prejuízo praticamente sumiu (+127% na prática).
- Lição direta: **o problema não é a IA, é usá-la como muleta para pular o esforço.** O jeito de usar muda o resultado.
- Ressalvas: uma escola, uma matéria (matemática), 4 sessões de 90 min.

**Liu, Christian, Dumbalska, Bakker, Dubey (2026). "AI Assistance Reduces Persistence and Hurts Independent Performance".** arXiv:2604.04721 (última versão 03/10/2026). https://arxiv.org/abs/2604.04721
- **Força:** [PRE] experimentos randomizados, 1.222 participantes.
- Achado: ajuda da IA melhora o desempenho na hora, mas depois, sem IA, as pessoas vão **pior e desistem mais**; efeito apareceu com **~10 minutos** de uso.
- Ressalva: preprint recente; efeitos de curto prazo.

**Rismanchian et al. (2026). "Faster Completion, Less Learning: Generative AI Reduced Study Time on Math Problems and the Knowledge They Build".** arXiv:2605.21629. https://arxiv.org/abs/2605.21629
- **Força:** [PRE] quase-experimento com 3,2 milhões de interações na plataforma ALEKS em 10 anos.
- Achado: depois do ChatGPT, o tempo de estudo em problemas "resolvíveis por IA" caiu ~27% (universitários) e ~31% (ensino médio), sem mudança no 5º ano; em prova **supervisionada** a diferença sumiu. Sugere que parte do "estudo" passou a ser feita pela IA.
- Ressalva: observacional (não randomizado); infere comportamento a partir de logs.

### 3.4 Trabalho do dia a dia (adultos)
**Lee, Sarkar, Tankelevitch et al. (2025). "The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers". CHI '25.** doi:10.1145/3706598.3713778. https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/
- **Força:** [PR] conferência de ponta, mas **pesquisa de autorrelato** (319 profissionais, 936 exemplos). Mede percepção, não capacidade real.
- Achado: **mais confiança na IA → menos pensamento crítico; mais autoconfiança na tarefa → mais pensamento crítico.** O esforço muda de "fazer" para "verificar, integrar e supervisionar".
- Mais próximo do público do curso (adultos usando IA no trabalho).

### 3.5 O estudo do MIT: "Your Brain on ChatGPT"
**Kosmyna, N. et al. (2025). "Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task".** arXiv:2506.08872 (v1 10/06/2025; v2 31/12/2025). https://arxiv.org/abs/2506.08872
- **Força:** [PRE] **ainda preprint em out/2026** (não encontrei publicação em journal; a página do MIT Media Lab e o Google Scholar da autora citam só o arXiv).
- Desenho: 54 participantes em 3 grupos (ChatGPT, Google, só cérebro), redações de 20 min, EEG; **só 18 voltaram para a 4ª sessão**, em que os grupos foram trocados.
- Achados relatados: grupo ChatGPT com a menor conectividade cerebral; **dificuldade de citar o próprio texto** minutos depois; ao tirar a IA na sessão 4, sinais de "subengajamento".
- **Críticas:**
  - Comentário formal de Stanković, Hirche, Kollatzsch & Doetsch (Univ. de Viena), arXiv:2601.00856 (https://arxiv.org/abs/2601.00856): amostra pequena diante do número enorme de comparações (risco de falso positivo e de efeito inflado), problemas na análise de EEG, inconsistências de relato, pouca transparência, dificuldade de reproduzir.
  - Science (AAAS), ScienceAdviser (https://www.science.org/content/article/scienceadviser-your-brain-chatgpt): 18 pessoas em até 4 meses não sustentam conclusões amplas; publicar antes da revisão por pares com conclusões fortes é questionável.
  - Limite de 20 min pode ter induzido copiar e colar; EEG mostra engajamento durante a tarefa, **não "dano cerebral" nem perda de inteligência**.
- **Como usar no curso:** como gancho ("você lembraria do que 'escreveu' com a IA?"), nunca como "a IA deixa o cérebro preguiçoso, comprovado pelo MIT". A manchete da imprensa exagerou o que o estudo mostra.

### 3.6 Notas do Osmani (Designing Agent Skills — Research Notes)
Fonte: Addy Osmani, posts de blog [OP] (engenheiro do Google; foco em desenvolvedores).
- **Cognitive Surrender** (mai/2026, https://addyosmani.com/blog/cognitive-surrender/): resume Shaw & Nave. Contramedidas aproveitáveis para leigos: **formar uma expectativa antes de ler a resposta**; pedir ao modelo para argumentar contra si mesmo; **parar quando estiver cansado demais para avaliar**; mudanças pequenas ("a unidade de revisão é a unidade de compreensão"); atrito deliberado nas decisões importantes.
- **The Intent Debt** (jun/2026, https://addyosmani.com/blog/intent-debt/): parte do Triple Debt Model de Storey. "A IA não consegue gerar intenção, só inventá-la": se você não escreveu o porquê, ela preenche com um palpite confiante. Para leigos, isso é **escrever o objetivo e o contexto no pedido** (já é o método das 5 partes).
- **Agentic Skill Decay** (ago/2026, https://addyosmani.com/blog/agentic-skill-decay/): a IA tira as "repetições" que formavam a competência. Quatro habilidades a manter: **decidir, especificar, conduzir, verificar**. "Verificar é o piso; imaginar é o teto." "Loop duplo": cada correção boa deve virar algo durável (anotação, regra, instrução salva).
- Força: [OP]. Boas sínteses e boas práticas, mas voltadas a programadores; os números citados vêm de Shaw & Nave.

---

## 4. Forte vs. fraco (resumo)

| Afirmação | Força | Base |
|---|---|---|
| Delegar tarefas mentais é normal e muitas vezes racional | Forte | Risko & Gilbert 2016 [PR] |
| Usar IA como "muleta" para pular o esforço piora o aprendizado quando a IA é tirada | Forte (com ressalvas de contexto) | Bastani 2025 [PR]; Liu 2026 [PRE]; Rismanchian 2026 [PRE] |
| O modo de uso importa: IA que dá dicas, não respostas, evita o prejuízo | Moderada | Bastani 2025 [PR] |
| As pessoas aceitam respostas erradas da IA com frequência e ficam mais confiantes | Moderada-forte (preprint, pré-registrado, n grande) | Shaw & Nave 2026 [PRE] |
| Confiar muito na IA está associado a pensar menos criticamente | Moderada (autorrelato) | Lee 2025 [PR] |
| A IA "reduz a atividade cerebral" / causa "dívida cognitiva" no cérebro | **Fraca / preliminar** | Kosmyna 2025 [PRE], criticado |
| Equipes perdem o entendimento compartilhado quando a IA produz rápido demais | Opinião bem fundamentada (sem dados experimentais) | Storey 2026 [OP/PRE] |
| Efeitos de longo prazo (meses/anos) na capacidade de pensar | **Desconhecido** | Ninguém mediu de forma robusta ainda |

---

## 5. Saída prática para leigos

### Quando delegar à IA ajuda
- Tarefas que você **já sabe fazer** e quer fazer mais rápido (resumir, reformatar, rascunhar um e-mail que você vai revisar).
- Quando você **consegue verificar** o resultado (você sabe reconhecer se está certo).
- Para **ampliar** o pensamento: pedir contra-argumentos, outros pontos de vista, perguntas que você não fez.
- Para **aprender**, se você pedir explicações, dicas e exemplos, não a resposta pronta.

### Quando atrapalha
- Quando você está **aprendendo** algo e pede a resposta final (vira muleta; o estudo da Turquia mostra o custo).
- Quando você **não tem opinião própria** para comparar e a decisão importa (saúde, dinheiro, jurídico, trabalho que vai com o seu nome).
- Quando você está **cansado ou com pressa** demais para conferir.
- Quando a resposta "soa certa" e você se pega mais confiante do que deveria (o efeito de Shaw & Nave).

### 5 hábitos concretos
1. **Pense antes de perguntar.** Escreva (ou diga) em uma frase o que você espera da resposta antes de ler. Assim você tem com o que comparar.
2. **Explique de volta.** Depois da resposta, resuma com suas palavras em 2–3 frases (ou peça "me faça 3 perguntas para ver se entendi"). Se não conseguir explicar, você ainda não entendeu.
3. **Peça o contra.** "Quais são os pontos fracos dessa resposta?" / "Argumente contra." / "Do que você não tem certeza?"
4. **Para aprender, peça dicas, não respostas.** "Não me dê a resposta; me dê uma dica de cada vez."
5. **Deixe registrado o porquê.** Ao tomar uma decisão com ajuda da IA, anote o motivo com suas palavras. Daqui a um mês, é isso que você vai precisar (a ideia de Storey e Osmani adaptada à vida pessoal).

Bônus (regra de bolso): **"A IA pode fazer o rascunho; a decisão é sua."** E: **"Cansado demais para conferir? Cansado demais para delegar."**

### Frases prontas (voz da marca: fato primeiro, um número por ideia)
- "Num experimento com 1.372 pessoas, quem consultou a IA aceitou a resposta errada cerca de 8 em cada 10 vezes, e ainda se sentiu mais confiante."
- "Alunos que usaram ChatGPT livre para treinar foram 17% pior na prova sem IA. Quem usou uma IA que só dava dicas não teve essa perda."
- "Delegar a tarefa é normal. Delegar o julgamento é o risco."

---

## 6. Onde isso entra no curso (sugestão)

1. **Encontro 1, bloco curto de abertura (5–8 min):** conceito "Delegar a tarefa, não o julgamento" (offloading vs. rendição). Um número (Shaw & Nave, ~8 em 10) e a regra de bolso. É onde se forma o hábito; depois fica caro corrigir.
2. **Fio em todos os encontros, dentro do formato de exercício (issue 04):** no "deu certo se…", incluir sempre um item de verificação humana: "você consegue explicar a resposta com suas palavras" ou "você comparou com o que esperava". Custa uma linha por exercício e pratica os hábitos 1 e 2.
3. **Página de Consulta:** "Pensar com IA sem terceirizar o juízo" com os 5 hábitos, a tabela forte/fraco simplificada e um box "E aquele estudo do MIT?" explicando que é preliminar (vacina contra a manchete que os alunos já devem ter visto).
4. **Encontro 4 (rotinas/skills):** dívida de intenção para leigos: ao criar uma rotina, escreva o **porquê** e o critério "deu certo se…"; se não escrever, a IA inventa. Liga direto com o método das 5 partes e com o "loop duplo" (cada correção boa vira instrução salva).

Não recomendo uma aula inteira sobre o tema nem tom alarmista: o público é iniciante e precisa ganhar confiança para usar; a mensagem é "use, e mantenha o volante".

---

## 7. Fontes

- Storey, M.-A. "How Generative and Agentic AI Shift Concern from Technical Debt to Cognitive Debt", 09/02/2026. https://margaretstorey.com/blog/2026/02/09/cognitive-debt/
- Storey, M.-A. "What I'm Hearing About Cognitive Debt (So Far)", 18/02/2026. https://margaretstorey.com/blog/2026/02/18/cognitive-debt-revisited/
- Storey, M.-A. "From Technical Debt to Cognitive and Intent Debt", arXiv:2603.22106. https://arxiv.org/abs/2603.22106
- Willison, S. comentário, 15/02/2026. https://simonwillison.net/2026/Feb/15/cognitive-debt/
- Risko & Gilbert 2016, Trends in Cognitive Sciences. https://discovery.ucl.ac.uk/1508770/
- Shaw & Nave 2026, PsyArXiv. https://osf.io/preprints/psyarxiv/yk25n_v1 ; resumo Wharton: https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2026/05/thinking-fast-slow-and-artificially/ ; PsyPost: https://www.psypost.org/high-trust-in-ai-leaves-individuals-vulnerable-to-cognitive-surrender-study-finds/
- Bastani et al. 2025, PNAS. https://www.pnas.org/doi/10.1073/pnas.2422633122
- Liu et al. 2026, arXiv:2604.04721. https://arxiv.org/abs/2604.04721
- Rismanchian et al. 2026, arXiv:2605.21629. https://arxiv.org/abs/2605.21629
- Lee et al. 2025, CHI. https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/
- Kosmyna et al. 2025, arXiv:2506.08872. https://arxiv.org/abs/2506.08872
- Stanković et al. 2026, comentário, arXiv:2601.00856. https://arxiv.org/abs/2601.00856
- Science, ScienceAdviser. https://www.science.org/content/article/scienceadviser-your-brain-chatgpt
- Osmani, A. Cognitive Surrender / The Intent Debt / Agentic Skill Decay. https://addyosmani.com/blog/cognitive-surrender/ · https://addyosmani.com/blog/intent-debt/ · https://addyosmani.com/blog/agentic-skill-decay/

Não verificado diretamente: números do Shaw & Nave vieram do resumo Wharton, PsyPost e síntese de busca (o PDF não foi lido na íntegra); o 79,8%/73% deve ser conferido no PDF antes de ir para o site.
