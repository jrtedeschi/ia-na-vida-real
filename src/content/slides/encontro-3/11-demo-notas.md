---
layout: "demo"
kicker: "Demonstração · 5 minutos"
title: "Três notas fiscais viram uma tabela"
prompt:
  contexto: "Anexei [3 notas fiscais em PDF] de fornecedores do meu comércio."
  objetivo: "Uma tabela para lançar no controle do mês."
  referencias: "Use só o que está escrito nas notas."
  restricoes: "Campo ilegível, escreva \"não achei\". Não invente."
  formato: "Tabela: fornecedor, data, número da nota, valor. Na última linha, o total."
tools:
  - name: "Claude"
    logo: "/img/logos/claude.svg"
    href: "https://claude.ai/"
  - name: "Gemini"
    logo: "/img/logos/googlegemini.svg"
    href: "https://gemini.google.com/"
notes: |
  Vou mostrar ao vivo. São três notas inventadas, de um mercadinho de mentira, então pode olhar à vontade.

  Repara na restrição: "campo ilegível, escreva não achei". Sem isso, quando a IA não consegue ler um número, ela chuta um. E chute em nota fiscal vira erro no caixa.

  [depois da resposta] Agora a conferência: escolho a terceira nota, abro o PDF e comparo o valor. Bateu. E o total? Eu somo na calculadora. Isso é o "a IA faz, você confere".

  **Bastidor:** os PDFs estão em `public/assets/notas/` (no site: `/ia-na-vida-real/assets/notas/`). A nota 2, da Serra Azul, é uma imagem escaneada, sem texto por baixo, e o número dela está borrado: a resposta certa ali é "não achei". Gabarito: Sol Nascente, 03/11/2026, nº 004.512, R$ 380,40; Serra Azul, 04/11/2026, nº ilegível, R$ 449,04; Vale Verde, 05/11/2026, nº 000.931, R$ 284,42. Total: R$ 1.113,86. Plano B: se o upload falhar, colar o conteúdo de `notas-plano-b.txt`.
---
