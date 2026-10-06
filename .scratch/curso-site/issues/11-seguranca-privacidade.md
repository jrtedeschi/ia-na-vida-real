# Segurança, privacidade e treinamento com dados das pessoas
Type: research
Status: resolved
Blocked by: —

## Question

Estado em out/2026, para usuário comum no Brasil: Claude, ChatGPT, Gemini e Gemini Notebook usam as conversas para treinar modelos? Qual o padrão no plano grátis e no pago, e onde fica o botão de desligar (passo a passo)? Retenção de dados, conversas temporárias/anônimas, revisão humana, arquivos enviados. LGPD/ANPD: algo relevante e recente? Riscos práticos: o que nunca colar (dados de clientes, documentos sigilosos, senhas, saúde), golpes com IA (voz/deepfake, phishing), prompt injection em documentos/links explicado para leigos. Fontes oficiais com link e data. Saída: checklist de segurança de 1 página + sugestão de onde entra no curso.

## Comments

Research: research/11-seguranca-privacidade.md

## Answer

Detalhe e checklist em research/11-seguranca-privacidade.md.
- **Pagar não desliga o treinamento** em nenhuma das três; só contas de trabalho/empresa mudam o padrão.
- Claude: treina só se a chave estiver ligada (Configurações → Privacidade → "Help improve our AI models"); 30 dias desligada × até 5 anos ligada; modo anônimo nunca treina. A chave pode ter vindo ligada no aviso de 2025: todo aluno confere.
- ChatGPT: treina por padrão (Configurações → Controles de dados → "Melhorar o modelo para todos"); 👍/👎 pode mandar a conversa para treino mesmo com a chave desligada; chat temporário é apagado em 30 dias. (Fatos da OpenAI vieram de trechos de busca: conferir.)
- Gemini: "Manter atividade" ligado por padrão, com revisão humana; conversas revisadas ficam até 3 anos, desvinculadas da conta. Atividade desligada ou chat temporário: 72h.
- Gemini Notebook (conta pessoal): não treina, salvo se você der feedback.
- LGPD: a ANPD virou agência (Lei 15.352/2026) e tem IA como prioridade de fiscalização 2026–27. O PL 2338/2023 ainda não é lei.
- Riscos: prompt injection (OWASP LLM01:2025), clonagem de voz (FTC, Serpro), phishing (cartilhas CERT.br 31/03/2026); regra do cartão-postal para o que nunca colar.
- Não publicar sem conferir: rótulos em português na interface real, números de deepfake da imprensa.
- Encaixe sugerido: bloco ao vivo de 10 min no E1 (configurar as chaves), página permanente "Segurança e privacidade" com data de verificação, lembretes de 1 linha nos demais encontros, golpes em 5 min com "palavra-código da família" para casa.
