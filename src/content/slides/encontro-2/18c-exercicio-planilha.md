---
layout: "demo"
kicker: "Exercício · em aula · 10 minutos"
title: "A IA lê e monta uma planilha no seu Drive"
caveat: "Deu certo se a planilha nova apareceu no Drive, o total do Delivery de setembro confere com a sua soma à mão e a planilha original continua igual."
prompt:
  contexto: "No meu Drive está a planilha [Gastos de exemplo], com gastos de julho a setembro."
  objetivo: "Saber qual categoria mais pesou em setembro, sem contar a moradia."
  referencias: "Use só os dados dessa planilha."
  restricoes: "Não mude nada na planilha."
  formato: "A categoria e o valor, em uma linha."
visual: timer
visualProps:
  minutos: 10
  sozinho: false
  compacto: true
  fim: Tempo!
tools:
  - name: "Gemini"
    logo: "/img/logos/googlegemini.svg"
    href: "https://gemini.google.com/"
  - name: "Google Drive"
    logo: "/img/logos/googledrive.svg"
    href: "https://drive.google.com/"
notes: |
  Agora é com vocês, dez minutos. Abre o Gemini com a sua conta Google pessoal. A planilha de exemplo que vocês copiaram para o Drive tem gastos inventados de julho a setembro, então pode usar sem medo. Cola o pedido e vê o que ela responde.

  Respondeu? Parte 2: "Monte uma tabela com o total de cada categoria em setembro." No fim da tabela tem um botão para exportar para o Planilhas. E confere uma conta na mão, o Delivery de setembro. Quem terminar, me manda um joinha no chat.

  **Bastidor:** cronômetro no canto: clicar no número quando a turma começar. Respostas esperadas, calculadas em 14/10/2026 a partir de public/assets/gastos-exemplo.csv: setembro sem moradia, Mercado com R$ 1.558,27; Delivery de setembro, R$ 574,95. Moradia em setembro (R$ 1.941,15) é a maior categoria, por isso o pedido exclui moradia. Não deu certo? Se ela não achar o arquivo, dizer o nome exato da planilha; se não conseguir criar a planilha, pedir a tabela na conversa e copiar para uma planilha nova. Desafio: a mesma tabela para agosto, comparando os dois meses. Plano B: planilha exportada já pronta numa aba. A análise mais funda fica para o E3.

  **Fontes:** a Ajuda do Gemini descreve o botão "Exportar para o Planilhas" no fim de uma tabela (https://support.google.com/gemini/answer/14184041). VERIFICAR: se o Gemini grátis lê a planilha do Drive (.xlsx ou só Planilhas Google), se o botão aparece na conta grátis brasileira e o rótulo exato; falta o link "fazer uma cópia" em Planilhas Google (issue #5).
---
