# Roteiro da demonstração do Tijolinho (E4, 10 minutos)

Slides 24 a 28 do E4. Ao vivo, numa conta de teste com só ela conectada, janela anônima.
O aluno faz o resto em casa, no computador, pela página `/consulta/micro-apps-na-planilha/`.

## Antes da aula (véspera)

1. Conta de teste: fazer os passos 00 a 02 numa planilha "Controle de Gastos (demo)". Parar antes do 03, para autorizar ao vivo.
2. Numa segunda planilha, já pronta (passos 00 a 06 feitos): importar `public/assets/gastos-exemplo.csv` na aba Gastos, publicar o formulário (passo 06, "Somente eu") e deixar o link `/exec` aberto numa aba. Esta é também o plano B.
3. Deixar no Gmail da conta de teste um e-mail "Resumo de gastos" já recebido (plano B do e-mail).
4. Ensaiar uma vez, cronometrado.

## Na aula

| Tempo | Slide | O que mostrar | Fala-chave |
|---|---|---|---|
| 0:00 a 1:00 | 24 | Editor com os 8 arquivos já colados. | "A IA explicou cada arquivo antes. Ninguém reescreveu o código." |
| 1:00 a 3:30 | 24 | Executar `prepararPlanilha`. Ler a tela de permissões em voz alta, linha por linha. "O Google não verificou este app": Avançado, Acessar. | "Esse aviso é normal para script novo. A lista de permissões não é: leia cada linha." |
| 3:30 a 5:30 | 26 | Recarregar a planilha, menu Tijolinho. Lançar 3 gastos com a data de hoje (dd/mm/aaaa) e uma linha com valor `abc`. Verificar planilha. | "Linha com problema aparece, com o número. Nunca some." |
| 5:30 a 7:00 | 26 | Enviar resumo desta semana. Abrir o e-mail: total e aviso da linha `abc`. | Conferir o total de cabeça com a turma. |
| 7:00 a 8:30 | 27 | Na planilha pronta: abrir o formulário (passo 06) e digitar `1.500` no Valor. Mostrar a mensagem na tela. Depois `1.500,00`, e o gasto aparece na aba. | "Mil e quinhentos ou um e meio? O app não adivinha: pergunta." |
| 8:30 a 9:30 | 27 | Agendar resumo semanal. Mostrar Acionadores: um só. | "Toda segunda, a semana anterior inteira." |
| 9:30 a 10:00 | 28 | myaccount.google.com/permissions | "Você sabe o que autorizou, e sabe desligar." |

## Atenção ao 1.500 (corrige a nota dos slides 26 e 27)

- Pelo formulário, `1.500` **não** vai para o relatório de linhas com problema: `registrarGasto` (web.gs) recusa antes de gravar e mostra na tela `Erro: valor "1.500" é ambíguo: use vírgula nos centavos (1.500,00 ou 1,50)`. A demonstração é essa mensagem.
- Na célula, numa planilha pt_BR, o Sheets converte `1.500` em 1500 antes do código ver (a confirmar numa conta real, Q4/T17). Por isso a linha errada de propósito na célula é `abc`.
- Para ver o 1.500 no relatório de linhas: formatar a coluna Valor como texto simples antes de digitar. Não fazer ao vivo: custa tempo.

## Plano B

- Autorização falhou ou a conta pediu verificação extra: ir para a planilha pronta e seguir do menu.
- E-mail não chegou em 1 minuto: mostrar o e-mail já recebido e abrir Execuções no editor.
- Formulário não abriu: mostrar a captura da mensagem do 1.500 (fazer na véspera).
- Sem internet: vídeo gravado em T17.

## Pendências

- O slide 26 diz "15 minutos · passos 3 a 5": trocar para 10 minutos (decisão de João).
- As notas do slide 19 dizem que o passo 06 fica fora da aula; os slides 26 e 27 o usam. Este roteiro usa o 06 só na planilha pronta.
- Textos de menu e mensagens do Google ainda não foram conferidos numa conta (T17).
