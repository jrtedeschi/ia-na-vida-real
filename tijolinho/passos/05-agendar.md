---
id: 05
titulo: 'Agende o resumo semanal'
objetivo: 'Ter um único gatilho que envia, toda segunda de manhã, o resumo da semana anterior completa.'
pre-requisitos: 04
proximo: '06 ou 07'
verificacao:
- 'Em Acionadores existe um acionador enviarResumoSemanal, semanal, segunda-feira, 8h a 9h.'
- 'Clicar no menu de novo continua deixando um acionador só.'
- 'A pessoa sabe que o resumo de segunda cobre de segunda a domingo da semana anterior.'
---


## O que fazer

1. Na planilha, clique em **Tijolinho**, **Agendar resumo semanal**. Se pedir autorização de novo, revise e permita.
2. No editor, clique no relógio (**Acionadores**) na barra da esquerda. Deve haver um acionador `enviarResumoSemanal`, por tempo, semanal, segunda-feira, entre 8h e 9h.
3. Clique no menu **Agendar resumo semanal** mais uma vez e confira: continua um acionador só.

Como funciona a janela de datas: o e-mail de segunda resume a semana **anterior inteira**, de segunda 00h a domingo 23h59. Um gasto lançado na própria segunda entra no resumo da semana seguinte. Assim nenhum dia fica de fora. Se você lançar um gasto da semana passada depois do envio, ele não entra nesse e-mail; use **Enviar resumo desta semana** quando quiser conferir.

## Erros comuns

- `Script function not found: enviarResumoSemanal` (nos e-mails de falha ou em Execuções): o nome da função foi alterado. Cole menu.gs de novo e clique em Agendar outra vez.
- Dois acionadores iguais: apague os extras em Acionadores (três pontinhos, **Excluir acionador**) e clique em Agendar de novo.

## Condição de parada

Se a pessoa não quiser agendamento, pule para o 07. Pergunte se ela quer lançar gastos pelo celular (passo 06).
