---
id: 04
titulo: 'Teste o menu e o resumo'
objetivo: 'Ver o menu Tijolinho, lançar gastos, verificar a planilha e receber o resumo por e-mail.'
pre-requisitos: 03
proximo: '05'
verificacao:
- 'O menu Tijolinho aparece na planilha.'
- '"Verificar planilha" aponta a linha com erro de propósito, com o número da linha.'
- 'O e-mail "Resumo de gastos" chegou, com o total e o aviso da linha com problema.'
---


## O que fazer

1. Volte à aba da planilha e recarregue a página (F5). Espere alguns segundos: o menu **Tijolinho** aparece ao lado de **Ajuda**.
2. Na aba **Gastos**, lance 3 gastos desta semana. Na coluna Data, use a data de hoje (dd/mm/aaaa, com o ano), por exemplo: data de hoje, `Mercado`, `Casa`, `85,40`. Pode usar datas de segunda-feira até hoje, nunca futuras. Nos valores, a vírgula separa os centavos: `1.500` sem vírgula é recusado como ambíguo; escreva `1500` ou `1.500,00`.
3. Lance uma 4ª linha **errada de propósito**: valor `abc`.
4. Clique em **Tijolinho**, **Verificar planilha**. A janela deve dizer "3 linha(s) válida(s), 1 com problema" e mostrar o número da linha.
5. Clique em **Tijolinho**, **Enviar resumo desta semana**. Confira o e-mail: total dos 3 gastos e um aviso em vermelho sobre a linha errada.
6. Corrija ou apague a linha errada.

O app nunca ignora uma linha em silêncio: linha com problema aparece na verificação e no e-mail.

## Erros comuns

- Menu não aparece: recarregue de novo e espere. Se continuar, no editor execute `onOpen` uma vez e volte à planilha.
- `Exception: Cannot call SpreadsheetApp.getUi() from this context.`: você executou `verificarPlanilha` pelo editor. Use o menu na planilha.
- `Exception: Service invoked too many times for one day: email.`: passou do limite diário de e-mails da conta. Tente amanhã.
- E-mail não chegou: olhe a pasta Spam. No editor, abra **Execuções** (barra da esquerda) e copie o erro.

## Condição de parada

Não avance se o resumo não chegou. Resolva antes, com o texto do erro da tela Execuções.
