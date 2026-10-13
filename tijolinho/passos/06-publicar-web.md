---
id: 06
titulo: 'Publique o formulário do celular (opcional)'
objetivo: 'Publicar um web app privado para lançar gastos pelo celular.'
pre-requisitos: 05
proximo: '07'
verificacao:
- 'A implantação está como "Executar como: Eu" e "Quem pode acessar: Somente eu".'
- 'Pelo celular, logado na mesma conta, o formulário abre e salva um gasto.'
- 'O gasto aparece na aba Gastos.'
---


## O que fazer

1. No editor, clique em **Implantar**, **Nova implantação**.
2. Na engrenagem ao lado de "Selecione o tipo", escolha **App da Web**.
3. Preencha: descrição `formulario`; **Executar como**: Eu; **Quem pode acessar**: **Somente eu**. Não escolha "Qualquer pessoa": isso deixaria estranhos lançarem gastos na sua planilha.
4. Clique em **Implantar**, autorize se pedir, e copie o **URL do app da Web** (termina em `/exec`).
5. Mande esse link para você mesmo e abra no celular, logado na mesma conta Google. Salve como favorito ou atalho na tela inicial.
6. Lance um gasto e confira na planilha.

Se mudar o código depois, a página publicada não muda sozinha: **Implantar**, **Gerenciar implantações**, lápis, versão **Nova versão**, **Implantar**.

## Erros comuns

- `Exception: No HTML file named Formulario was found.`: o arquivo HTML tem outro nome. Renomeie para `Formulario`.
- "Desculpe, não foi possível abrir o arquivo no momento" no celular: o navegador está com outra conta. Entre na conta certa ou use janela anônima.
- `Erro: valor "..." não é um número`: digite o valor como `45,90`.

## Condição de parada

Nunca publique com acesso para "Qualquer pessoa" neste app.
