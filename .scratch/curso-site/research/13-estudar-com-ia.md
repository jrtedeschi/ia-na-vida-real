# Pesquisa 13: Estudar com IA (Gemini Notebook + boas práticas)

Data da pesquisa: 2026-10-06. Produto: o NotebookLM foi **renomeado Gemini Notebook em 16/07/2026** (ver research/06). Fontes oficiais quando acessíveis; openai.com retornou 403 (como na pesquisa 06), então ChatGPT usa imprensa e vem marcado.

Legenda: OK = confirmado em fonte oficial · ~ = imprensa / fonte secundária · ? = não verificado
Força da evidência (mesma legenda do research/10): **[PR]** revisado por pares · **[PRE]** preprint · **[OP]** opinião

---

## 1. Resposta curta

- **Ferramenta principal do curso: Gemini Notebook (grátis).** Ele responde só a partir das fontes que você sobe, com citações, e o painel **Studio** gera **Flashcards** e **Testes/Quizzes** com dificuldade e quantidade ajustáveis, salva o progresso ("Acertei / Errei") e permite refazer só os cartões errados. Isso é prática de recuperação pronta, a técnica com melhor evidência em ciência da aprendizagem.
- **Os três chatbots têm um "modo professor" grátis**: *Aprendizado guiado* (Gemini), *modo estudo* / "Study and learn" (ChatGPT) e o estilo *Learning* (Claude). Todos fazem a mesma coisa: perguntam em vez de responder de cara.
- **A regra de ouro, conectada ao ticket 10:** IA que **dá a resposta** melhora a lição de casa e **piora a prova sem IA** (Bastani et al. 2025, PNAS: −17%). IA configurada para **dar dicas e perguntar** eliminou o prejuízo, e um tutor bem desenhado em Harvard dobrou o ganho de aprendizado (Kestin et al. 2025). O que decide é **quem faz o esforço de lembrar e explicar: você ou a IA**.
- Ouvir o Audio Overview ("podcast") ou ler o resumo é **reler com outra roupa**: agradável, mas baixa utilidade. Use como porta de entrada, não como estudo.

---

## 2. Tabela de recursos (out/2026)

| Recurso | Ferramenta | O que faz | Grátis? | Português / Brasil | Fonte e data |
|---|---|---|---|---|---|
| **Fontes + chat com citações** | Gemini Notebook | Sobe PDF, Docs, sites, YouTube, áudio; responde só com base nelas e cita o trecho | OK grátis: 100 notebooks, 50 fontes cada | OK idioma de saída configurável (Configurações > idioma de saída); pt-BR listado ~ | [N1] 2026; [N2] |
| **Flashcards** | Gemini Notebook (Studio) | Gera cartões; dificuldade fácil/médio/difícil; quantidade; prompt próprio; "Acertei/Errei", refazer só os errados; botão "Explicar"; exporta CSV | OK grátis | ~ (segue idioma de saída) | [N3] ajuda oficial, consultada 06/10/2026 |
| **Testes (quizzes)** | Gemini Notebook (Studio) | Múltipla escolha com explicação dos erros e botão "Dica"; **novos formatos (resposta curta, múltipla seleção, completar lacuna) e editar perguntas** anunciados em 15/09/2026, em liberação gradual | OK todos os usuários | ~ | [N3]; [N4] 15/09/2026; [N5] 15/09/2026 |
| **Guia de estudo, briefing, FAQ, linha do tempo** | Gemini Notebook ("Relatórios") | Documentos de resumo gerados das fontes | OK grátis | ~ | [N6] ~ (guias de terceiros, 2026) |
| **Relatórios / "Visões gerais de aprendizado interativas"** | Gemini Notebook | Relatório que embute quiz, flashcards, mapa mental e infográfico | OK todos os usuários, liberação nas semanas após 15/09/2026 | ? (um guia diz "Interactive" só em inglês, não verificado) | [N4]; [N5] |
| **Mapa mental** | Gemini Notebook | Mapa clicável dos conceitos das fontes | OK grátis | ~ | [N6] ~ |
| **Audio Overview** ("podcast" de 2 vozes) | Gemini Notebook | Conversa em áudio sobre as fontes | OK grátis (era 3/dia) | OK ~80 idiomas incl. português (Brasil) ~ | research/06 [10]; [N6] ~ |
| **Video Overview** (Explainer; **Short** ~60 s) | Gemini Notebook | Vídeo narrado com slides/animações | OK todos; Short em 80+ idiomas | ~ Explainer em dezenas de idiomas; estilo "Cinematic" só inglês e 18+ ~ | [N4] 15/09/2026; [N6] ~ |
| **Conversa por voz em tempo real** | Gemini Notebook (app) | Conversar falando com o caderno | **X** só Ultra, depois Pro; 18+ | ~100 idiomas | [N4] 15/09/2026 |
| **Gravador de aulas** | Gemini Notebook (app) | Grava aula e vira fonte | OK todos | **X** só saída em inglês no lançamento | [N4] 15/09/2026 |
| **Limites de uso** | Gemini Notebook | Desde **02/09/2026** os limites diários fixos viraram **orçamento por computação, recarga a cada 5 h, teto semanal** (grátis = padrão; Plus 2×; Pro 4×). Ver em Configurações > Uso | — | — | [N7] ~ imprensa (Android Police, 09/2026); **anúncio oficial não lido diretamente** |
| **Aprendizado guiado** (Guided Learning) | Gemini app | Tutor socrático passo a passo, com imagens/vídeos; aceita arquivos; baseado no LearnLM | OK grátis para todos (lançado 06/08/2025) | OK nome em pt-BR "**Aprendizado guiado**" (Adicionar arquivos > Mais ferramentas > Aprendizado guiado). Recursos OpenStax só EUA/inglês | [G1] ajuda oficial pt-BR, consultada 06/10/2026; [G2] blog Google 08/2025 |
| **Quizzes, flashcards, guias no Gemini app** | Gemini app | Gera a partir de um pedido ou material | OK grátis; **18+** (no lançamento) | OK todas as línguas do Gemini (no lançamento) | [G3] Workspace Updates 08/2025 |
| **Notebooks no Gemini** | Gemini app | Cadernos dentro do app, sincronizados com o Gemini Notebook | ? status no grátis (ver research/06 [12]) | — | research/06 |
| **Modo estudo** ("Study and learn") | ChatGPT | Perguntas-guia, plano de aula, checagens de entendimento; ativa em Ferramentas ou chatgpt.com/studymode | ~ todos os logados, inclusive Free (desde 29/07/2025) | ? rótulo exato em pt-BR não verificado | [C1] ~ imprensa 07/2025; openai.com/index/chatgpt-study-mode/ retornou 403 |
| **Estilo "Learning"** (modo de aprendizado) | Claude (claude.ai) | Método socrático: guia com perguntas em vez de responder; liga/desliga no menu de estilos | ~ todos os usuários desde 14/08/2025 | ? rótulo em pt-BR não verificado; **página de ajuda oficial não encontrada**; menu pode ter mudado | [A1] ~ imprensa 08/2025 |

**Para o curso:** só o Gemini Notebook tem flashcards e quizzes **ancorados nas suas fontes** com progresso salvo. Ele é a escolha certa para o exercício grátis. O "modo professor" pode ser qualquer um dos três; o Gemini é o único com nome em pt-BR confirmado em fonte oficial.

---

## 3. Boas práticas baseadas em evidência (7)

Cada prática traz: **o que dizer ao aluno**, a evidência e como fazer com IA.

### 1. Teste-se em vez de reler (prática de recuperação)
- **Ao aluno:** "Fechar o material e tentar lembrar ensina mais do que ler de novo, mesmo parecendo pior na hora."
- **Evidência [PR]:** Roediger & Karpicke 2006 (*Psychological Science* 17(3):249–255): após 1 semana, quem leu 1× e se testou 3× lembrou **61%**; quem leu 4× lembrou **40%**. Aos 5 minutos, a releitura ganhava (83% × 71%). E quem releu estava **mais confiante**. Dunlosky et al. 2013 (*PSPI* 14(1):4–58) classificam o teste prático como **alta utilidade** (centenas de experimentos).
- **Com IA:** flashcards e quizzes do Gemini Notebook, respondendo **sem olhar** a fonte.
- Nota: comparar 61% com 40% contrasta os extremos (STTT × SSSS); ainda assim é o número citado pelos autores.

### 2. Espalhe o estudo no tempo (espaçamento)
- **Ao aluno:** "Três sessões curtas em dias diferentes valem mais que uma longa na véspera."
- **Evidência [PR]:** Cepeda et al. 2006 (*Psychological Bulletin* 132:354–380), meta-análise de 317 experimentos: estudo espaçado supera o concentrado; quanto mais tempo você precisa lembrar, maior deve ser o intervalo. Dunlosky 2013: **alta utilidade**.
- **Com IA:** usar "Só os cartões que errei" no dia seguinte e de novo na semana seguinte. O Gemini Notebook salva o progresso, mas **não agenda revisões sozinho** (não é um Anki): o aluno marca na agenda.

### 3. Tente antes de perguntar
- **Ao aluno:** "Chute primeiro, mesmo errado. Depois veja a resposta."
- **Evidência [PR]:** Kornell, Hays & Bjork 2009 (*JEP: LMC* 35:989–998): tentativas de lembrar que **falham** melhoram o aprendizado posterior, desde que venha o feedback; efeito do pré-teste (Richland, Kornell & Kao 2009). Ressalva: replicou com material relacionado, não com pares aleatórios (Grimaldi & Karpicke 2012).
- **Com IA:** escrever sua resposta/rascunho **antes** de abrir o chat. Conecta com o ticket 10: é o "ter uma opinião própria para comparar" que evita a rendição cognitiva (Shaw & Nave 2026 [PRE]).

### 4. Peça dicas, não respostas
- **Ao aluno:** "Use o modo professor. Se a IA te der a resposta pronta, você fez a lição, mas não aprendeu."
- **Evidência [PR]:** Bastani et al. 2025 (*PNAS* 122(26), ~1.000 alunos do ensino médio na Turquia): GPT-4 "puro" → +48% nos exercícios, mas **−17% na prova sem IA**; versão "tutor" (dicas, sem respostas) → +127% nos exercícios e o prejuízo praticamente sumiu. Kestin et al. 2025 (*Scientific Reports* 15:17458, Harvard, 194 alunos, RCT cruzado): tutor de IA desenhado com boas práticas pedagógicas (não dar a resposta, passo a passo, um conceito por vez) produziu ganho **mais que o dobro** da aula de aprendizagem ativa, em menos tempo (49 × 60 min), efeito 0,63 DP. Ressalvas de Kestin: 2 semanas, física introdutória, não mediu retenção de longo prazo.
- **Com IA:** Aprendizado guiado (Gemini), modo estudo (ChatGPT) ou estilo Learning (Claude). Esses modos **não são os mesmos tutores** dos estudos: são a mesma ideia, sem avaliação independente publicada que eu tenha encontrado **[?]**.

### 5. Explique de volta (autoexplicação / ensinar)
- **Ao aluno:** "Explique com suas palavras e peça para a IA achar os buracos."
- **Evidência:** autoexplicação e interrogação elaborativa = **utilidade moderada** em Dunlosky 2013 [PR]. Fiorella & Mayer 2013 (*Contemporary Educational Psychology* 38(4):281–288) [PR]: quem **de fato ensinou** (gravou uma miniaula) foi melhor 1 semana depois (d = 0,79); só se preparar para ensinar não sustentou o efeito (d = 0,24).
- **Com IA:** "Vou te explicar X. Não corrija o texto; me diga o que faltou ou está errado e me faça uma pergunta para eu consertar."

### 6. Desconfie da sensação de "entendi"
- **Ao aluno:** "Ouvir o podcast e achar fácil não é sinal de que aprendeu. Fácil na hora costuma ser esquecido."
- **Evidência:** releitura e resumo = **baixa utilidade** (Dunlosky 2013 [PR]); quem relê se sente mais confiante e lembra menos (Roediger & Karpicke 2006 [PR]); com IA disponível a confiança sobe ~12% mesmo quando ela erra (Shaw & Nave 2026 [PRE], ver research/10).
- **Com IA:** Audio/Video Overview e resumo = **porta de entrada**. O estudo começa no quiz. **[Inferência]**: não encontrei estudo que meça especificamente a retenção com Audio Overviews.

### 7. Confira a fonte (a IA também erra em quiz)
- **Ao aluno:** "Se uma pergunta do quiz parecer estranha, clique na citação e confira na apostila."
- **Evidência:** o Gemini Notebook responde com base nas fontes e cita trechos [N1], o que reduz mas não elimina erros. Errar em quiz com IA errada ensina o errado: no estudo de Shaw & Nave, as pessoas seguiram a IA errada em ~80% das vezes [PRE].
- **Com IA:** usar só fontes confiáveis no caderno; conferir as citações das perguntas que você errou.

*(Opcional, 8ª: misturar tipos de questão — "intercalação", utilidade moderada em Dunlosky 2013. Útil em matemática/concursos; talvez avançado para o público.)*

---

## 4. Exercícios práticos possíveis (formato do ticket 04: situação → pedido → "deu certo se…" → "não deu certo?")

### Exercício A: "Transforme a apostila em prova" (grátis, Gemini Notebook)
- **Situação:** você tem um PDF (apostila, manual do trabalho, edital de concurso, bula, regulamento) que precisa dominar.
- **Passos:** 1) crie um caderno e suba o PDF; 2) **antes de qualquer coisa**, escreva em 3 linhas o que você acha que o documento diz (prática 3); 3) no Studio, clique no lápis de **Testes**, escolha dificuldade média e escreva o pedido: "Faça perguntas sobre [tema] para alguém que vai usar isso no [trabalho/dia a dia]; foque em [ponto]"; 4) responda **sem olhar o PDF**; 5) para cada erro, clique em "Explicar" e confira a citação.
- **Deu certo se:** você respondeu tudo sem abrir o PDF, anotou sua nota e sabe dizer, para pelo menos 1 erro, em que página está a resposta certa.
- **Não deu certo?** Perguntas genéricas → reveja o pedido (contexto + foco). Pergunta que parece errada → conceito "alucinação"/confira a fonte.
- **Para casa (espaçamento):** gere **Flashcards**, marque Acertei/Errei; em 2 dias e em 1 semana, refaça "Só os cartões que errei".

### Exercício B: "Me ensina sem me dar a resposta" (grátis, qualquer chatbot)
- **Situação:** um assunto que você nunca entendeu direito (juros compostos, como funciona o INSS, uma regra de gramática).
- **Pedido (Aprendizado guiado no Gemini, modo estudo no ChatGPT ou estilo Learning no Claude; ou em qualquer chat):** "Quero aprender [tema]. Não me dê a resposta pronta. Me faça uma pergunta por vez, espere minha resposta e só dê dica se eu errar. No fim, me peça para explicar tudo com minhas palavras."
- **Deu certo se:** no fim você escreveu uma explicação de 3–5 linhas **sem copiar** da tela e a IA não apontou erro grave.
- **Não deu certo?** A IA despejou a resposta → você pulou o "não me dê a resposta"; repita o pedido ou ligue o modo de estudo.

### Exercício C: "Explique de volta" (grátis, em aula, 10 min)
- Depois de ouvir um Audio Overview de 5 min (ou ler o guia de estudo), feche e grave/escreva uma explicação de 1 minuto. Cole no chat: "Esta é minha explicação de [tema], baseada nas fontes do caderno. Diga o que faltou ou está errado, sem reescrever."
- **Deu certo se:** você corrigiu 1 ponto que tinha entendido errado.
- Mostra na prática a diferença entre "ouvi e achei fácil" e "consigo explicar" (prática 6).

---

## 5. Ligação com o ticket 10 (dívida cognitiva)

- Mesma mensagem nas duas seções: **delegar está ok; o problema é delegar o esforço que gera aprendizado (ou o julgamento)**. Estudar é justamente o caso em que o esforço *é* o produto.
- Bastani 2025 é a ponte: o mesmo estudo serve para "IA pode atrapalhar" (ticket 10) e "o modo de uso resolve" (aqui).
- Sugestão de frase: **"Para trabalhar, use a IA para fazer. Para aprender, use a IA para te perguntar."**

---

## 6. Pontos não verificados / cuidados para o site

1. **Limites do Gemini Notebook grátis:** a mudança de 02/09/2026 (5 h + semanal) veio de imprensa; não citar números de "3 por dia" como atuais. Dizer "o plano grátis tem limite de uso; veja em Configurações > Uso".
2. **Nomes em pt-BR** dos recursos do Studio (Flashcards, "Testes", "Relatórios", "Mapa mental", "Visão geral em áudio") não foram conferidos na interface em português. Conferir com print antes de publicar.
3. **ChatGPT:** página oficial bloqueada (403); disponibilidade no Free vem de imprensa; nome em pt-BR do "Study and learn" não verificado.
4. **Claude:** estilo "Learning" no claude.ai confirmado só por imprensa (08/2025); não achei artigo de ajuda atual. Menu de estilos pode ter mudado. Conferir antes de citar como caminho do exercício.
5. **Quizzes/flashcards no Gemini app** eram 18+ no lançamento; o Gemini Notebook não tem essa restrição declarada para quizzes (só a conversa por voz).
6. **Oferta estudante:** 1 ano de Google AI Plus grátis em 140+ mercados até 31/12/2026 [N4]; **não verifiquei se o Brasil está na lista** nem os requisitos.

---

## Fontes

Produto
- [N1] Gemini Notebook Help (central) — https://support.google.com/notebooklm/answer/14278184?hl=en ; criar caderno — https://support.google.com/notebooklm/answer/16206563?hl=en (consultado 06/10/2026)
- [N2] Planos do Gemini Notebook — https://support.google.com/notebooklm/answer/16213268?hl=en (100 notebooks / 50 fontes no grátis; consultado 06/10/2026)
- [N3] "Generate Flashcards or Quizzes in Gemini Notebook" — https://support.google.com/notebooklm/answer/16958963?hl=en (consultado 06/10/2026)
- [N4] Blog Google, "Sharpen your study routine with new Gemini Notebook tools", 15/09/2026 — https://blog.google/innovation-and-ai/products/gemini-notebook/new-study-tools-september-2026/
- [N5] Workspace Updates, novos recursos de volta às aulas, 15/09/2026 — https://workspaceupdates.googleblog.com/2026/09/new-back-to-school-features-and-learning-tools-available-in-Gemini-Notebook.html
- [N6] ~ Guias de terceiros (2026): https://www.educatorstechnology.com/2026/09/gemini-notebook-review.html ; https://aiweekly.co/learning-ai/generative-ai/how-to-use-notebooklm
- [N7] ~ Android Police, limites por computação — https://www.androidpolice.com/gemini-notebook-ditching-daily-limits-more-complicated/ (09/2026)
- [G1] "Usar ferramentas de aprendizado nos Apps Gemini" (pt-BR) — https://support.google.com/gemini/answer/16448384?hl=pt-BR (consultado 06/10/2026)
- [G2] Blog Google, Guided Learning, 08/2025 — https://blog.google/products-and-platforms/products/education/guided-learning/
- [G3] Workspace Updates, study tools no Gemini app, 08/2025 — https://workspaceupdates.googleblog.com/2025/08/gemini-study-tools.html
- [C1] ~ OpenAI, "Introducing study mode", 29/07/2025 — https://openai.com/index/chatgpt-study-mode/ (403; conteúdo via imprensa: https://www.infoq.com/news/2025/08/study-mode-chatgpt)
- [A1] ~ Engadget, learning mode no Claude para todos, 14/08/2025 — https://www.engadget.com/ai/anthropic-brings-claudes-learning-mode-to-regular-users-and-devs-170018471.html

Ciência da aprendizagem
- Dunlosky, Rawson, Marsh, Nathan & Willingham (2013). *Psychological Science in the Public Interest* 14(1):4–58. doi:10.1177/1529100612453266 — https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html [PR]
- Roediger & Karpicke (2006). Test-enhanced learning. *Psychological Science* 17(3):249–255. doi:10.1111/j.1467-9280.2006.01693.x — http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Karpicke-2006_PsychSci.pdf [PR]
- Cepeda, Pashler, Vul, Wixted & Rohrer (2006). *Psychological Bulletin* 132(3):354–380. doi:10.1037/0033-2909.132.3.354 — https://escholarship.org/uc/item/3rr6q10c [PR]
- Kornell, Hays & Bjork (2009). *JEP: Learning, Memory, and Cognition* 35:989–998. doi:10.1037/a0015729 — https://web.williams.edu/Psychology/Faculty/Kornell/Publications/Kornell.Hays.Bjork.2009.pdf [PR]
- Fiorella & Mayer (2013). *Contemporary Educational Psychology* 38(4):281–288. doi:10.1016/j.cedpsych.2013.06.001 [PR]
- Bastani et al. (2025). Generative AI without guardrails can harm learning. *PNAS* 122(26):e2422633122 — https://www.pnas.org/doi/10.1073/pnas.2422633122 [PR]
- Kestin, Miller, Klales, Milbourne & Ponti (2025). AI tutoring outperforms in-class active learning. *Scientific Reports* 15:17458, 03/06/2025 — https://www.nature.com/articles/s41598-025-97652-6 [PR]
- Shaw & Nave (2026), rendição cognitiva — ver research/10 [PRE]
