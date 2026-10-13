---
id: 01
titulo: 'Crie a planilha e abra o editor'
objetivo: 'Ter uma planilha "Controle de Gastos" com um projeto de Apps Script ligado a ela.'
pre-requisitos: 00
proximo: '02'
verificacao:
- 'A planilha se chama "Controle de Gastos".'
- 'O editor do Apps Script abriu numa aba nova, com o projeto "Tijolinho Gastos".'
- 'Em Configurações do projeto, o fuso horário é "(GMT-03:00) Horário de Brasília" ou equivalente de São Paulo.'
---


## O que fazer

1. Abra https://sheets.new (cria uma planilha em branco). Clique em "Planilha sem título" no alto e mude para **Controle de Gastos**.
2. No menu da planilha, clique em **Extensões** e depois em **Apps Script**. Abre uma aba nova: é o editor.
3. No alto do editor, clique em "Projeto sem título" e mude para **Tijolinho Gastos**.
4. Na barra da esquerda, clique na engrenagem (**Configurações do projeto**):
   - marque **Mostrar arquivo de manifesto "appsscript.json" no editor**;
   - confira o **fuso horário**. Se não for o de São Paulo/Brasília, escolha-o.

O projeto criado assim é um "script vinculado": mora dentro desta planilha.

## Erros comuns

- Não aparece **Extensões** ou **Apps Script**: você pode estar no celular, ou numa conta Workspace com Apps Script bloqueado. Veja o passo 00.
- O editor abre e mostra "Desculpe, não foi possível abrir o arquivo no momento": mais de uma conta conectada. Use janela anônima.

## Condição de parada

Não avance enquanto o editor não abrir a partir do menu Extensões desta planilha. Um projeto criado direto em script.google.com não serve para este app.
