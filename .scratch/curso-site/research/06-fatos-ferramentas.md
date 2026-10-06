# Pesquisa 06: fatos atuais das ferramentas (Brasil, out/2026)

Data da pesquisa: 2026-10-06. Fontes oficiais quando acessíveis; onde a fonte oficial bloqueou (openai.com / chatgpt.com retornaram 403), uso snippets de busca da página oficial ou imprensa e marco como **[não verificado diretamente]**.

Legenda: OK = confirmado em fonte oficial · ~ = parcial / sem número oficial · X = não incluído no grátis · ? = não verificado

## Tabela: plano grátis vs pago

| Recurso | Claude (Free) | ChatGPT (Free) | Gemini (sem plano) | Gemini Notebook (ex-NotebookLM, grátis) | Obsidian |
|---|---|---|---|---|---|
| Nome atual | Claude (claude.ai) | ChatGPT | Gemini app | **Gemini Notebook** (renomeado em 16/07/2026) | Obsidian |
| Projetos / espaços | OK até 5 Projetos [1] | ? Projetos (não confirmado em fonte oficial) | OK "Notebooks in Gemini" [12] (lançado p/ pagos, expansão p/ grátis anunciada; ? status atual) | OK 100 notebooks, 50 fontes cada [10] | OK cofres locais ilimitados [9] |
| Upload de arquivo | OK (até 30 MB por arquivo com code execution) [3] | ~ sim, com limites não publicados [5] | OK [7] | OK até 200 MB / 500 mil palavras por fonte [10] | n/a |
| Deep research | **X** Research é só pago (Pro/Max/Team/Ent) [2] | ~ "limitado" no Free; número exato não publicado [5][13] | OK incluído; pode ficar indisponível em alta demanda [6] | n/a (pesquisa sobre fontes) | n/a |
| Geração de imagem | **X** Claude não gera imagens (não listado no plano) [1] | ~ sim, com limite diário não publicado [5] | OK (Nano Banana 2) [6][7] | n/a | n/a |
| Análise de planilhas | OK code execution + criação de .xlsx no Free [3] | ~ "data analysis" com limites mais restritos [5] | OK upload; ? análise com código | ~ execução de código ("cloud computer") só Ultra/Workspace, depois Pro — **não no grátis** [8] | n/a |
| Busca web | OK [1] | OK [5] | OK | n/a | n/a |
| Limites | janela de uso (reset ~5h) ? | texto ilimitado no Free; ferramentas com limites próprios [5] | "limites padrão", reset a cada 5h até limite semanal [6] | 50 chats/dia, 3 Audio Overviews/dia [10] | sem limite |
| Disponível no Brasil | OK [4] | OK (cobra em R$) [14] | OK (preços em R$) [7] | OK (via Google One/AI) | OK |
| Preço pago (BRL) | Pro ~R$ 110/mês no site (R$ 129,90 na App Store) [15] **[não verificado em fonte oficial; claude.com/pricing mostra só US$ 20]** | Go R$ 39,99; Plus R$ 99,90–99,99; Pro R$ 999,90 [14] **[imprensa, não oficial]** | AI Plus R$ 24,99; AI Pro R$ 96,99; Ultra R$ 779,90–999,90 [7] OK | incluso nos planos Google AI [7][10] | App grátis (inclusive uso comercial); Sync US$ 4–5/mês; Publish US$ 8–10/mês [9] |

## Verificações específicas

### "Open Knowledge Format, padrão aberto publicado pelo Google em 2026"
**VERDADEIRO, com ressalvas.** O Google Cloud publicou a especificação Open Knowledge Format (OKF) v0.1 em 12/06/2026 (Sam McVeety e Amir Hormati, blog Google Cloud) [11]; v0.2 saiu em 25/07/2026 [11b]. É uma especificação aberta, neutra de fornecedor, licença Apache-2.0: pastas de arquivos Markdown com frontmatter YAML (o padrão "LLM-wiki"). Ressalvas para a landing:
- É do **Google Cloud** (foco em dados/BigQuery/Knowledge Catalog), não um produto de consumo.
- O próprio Google chama v0.1 de "ponto de partida, não um padrão finalizado". Chamar de "padrão aberto" é aceitável; "especificação aberta (v0.x)" é mais preciso.

### "Gemini Notebook" é o nome atual do NotebookLM?
**SIM.** Google anunciou em 16/07/2026: "We're renaming NotebookLM to Gemini Notebook" [8]; confirmado no Workspace Updates [16] e a central de ajuda já se chama "Gemini Notebook Help" [10]. Mesmo produto standalone; links antigos redirecionam. Cuidado: **"Notebooks in Gemini"** (dentro do app Gemini, abril/2026) é outra coisa, sincronizada com o Gemini Notebook [12].
- Domínio: o site de planos está em notebook.google/plans [10]; o post oficial menciona notebooklm.google. Redirecionamento automático confirmado [16]; domínio canônico exato **? não verificado**.

## Notas para o curso (promessa "dá pra fazer no plano grátis")
1. **Deep research no grátis:** só Gemini garante (com risco de indisponibilidade em pico) e ChatGPT tem cota pequena não publicada. **Claude Free não tem Research** — exercícios de pesquisa profunda não devem depender do Claude.
2. **Imagem:** Gemini e ChatGPT grátis geram; Claude não gera imagem.
3. **Planilhas:** Claude Free e ChatGPT Free analisam (com limites). A execução de código do Gemini Notebook não está no grátis.
4. **Projetos:** Claude Free tem até 5 Projetos — suficiente para o curso, mas avise para não criar projetos à toa.
5. Limites do ChatGPT Free (imagens, deep research, uploads) **não são publicados** pela OpenAI e mudam; planeje exercícios com alternativa.
6. Preços em BRL de Claude e ChatGPT vieram de imprensa; confirmar no checkout antes de citar no site.

## Fontes
- [1] Claude pricing — https://claude.com/pricing
- [2] Use research on Claude — https://support.claude.com/en/articles/11088861-use-research-on-claude
- [3] Create and edit files with Claude — https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude
- [4] Anthropic supported countries — https://www.anthropic.com/supported-countries
- [5] ChatGPT Free Tier FAQ — https://help.openai.com/en/articles/9275245-chatgpt-free-tier-faq (403 no fetch; conteúdo via snippet de busca) **[não verificado diretamente]**
- [6] Gemini Apps limits & upgrades — https://support.google.com/gemini/answer/16275805?hl=en ; Deep Research help — https://support.google.com/gemini/answer/15719111?hl=en
- [7] Gemini subscriptions (preços BR em R$) — https://gemini.google/subscriptions/
- [8] Google blog, "NotebookLM is now Gemini Notebook" — https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/
- [9] Obsidian pricing — https://obsidian.md/pricing
- [10] Gemini Notebook plans — https://support.google.com/notebooklm/answer/16213268?hl=en ; https://notebook.google/plans
- [11] Google Cloud blog, OKF — https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing
- [11b] OKF v0.2 — https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals
- [12] Notebooks in Gemini — https://blog.google/innovation-and-ai/products/gemini-app/notebooks-gemini-notebooklm/
- [13] What is ChatGPT Go — https://help.openai.com/en/articles/11989085-what-is-chatgpt-go **[não verificado diretamente]**
- [14] Olhar Digital, ChatGPT cobra em real — https://olhardigital.com.br/2025/10/30/internet-e-redes-sociais/chatgpt-lanca-plano-acessivel-no-brasil-cobra-em-real-e-fica-mais-barato/ (imprensa)
- [15] Canaltech, Claude Pro preço — https://canaltech.com.br/inteligencia-artificial/como-assinar-claude-mais-barato/ (imprensa)
- [16] Workspace Updates — https://workspaceupdates.googleblog.com/2026/07/notebooklm-now-gemini-notebook.html
