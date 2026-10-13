---
id: 02
titulo: 'Cole os arquivos de código'
objetivo: 'Ter os 8 arquivos do app no editor, salvos, sem erro de sintaxe.'
pre-requisitos: 01
proximo: '03'
verificacao:
- 'A barra da esquerda mostra appsscript.json, config.gs, dominio.gs, planilha.gs, email.gs, menu.gs, web.gs e Formulario.html.'
- 'Ao salvar (Ctrl+S) não aparece erro em vermelho.'
- 'A pessoa ouviu da IA, em poucas frases, o que cada arquivo faz.'
---


## O que fazer

Primeiro explique o que cada arquivo faz (uma frase cada). Depois, um arquivo por vez:

1. **Cuidado com o Código.gs.** O editor já vem com um arquivo `Código.gs`. Se ele tiver só `function myFunction() {}`, apague-o (três pontinhos ao lado do nome, **Excluir**). Se tiver qualquer outra coisa, **pare**: copie o conteúdo para um bloco de notas antes, porque esta não é uma planilha nova.
2. Clique em `appsscript.json`, apague tudo e cole o conteúdo de [appsscript.json](../codigo/appsscript.json).
3. Para cada arquivo `.gs` abaixo: clique no **+** ao lado de "Arquivos", escolha **Script**, digite o nome **sem** `.gs` (o editor acrescenta) e cole o conteúdo inteiro.
   - Arquivo: [config.gs](../codigo/config.gs)
   - Arquivo: [dominio.gs](../codigo/dominio.gs)
   - Arquivo: [planilha.gs](../codigo/planilha.gs)
   - Arquivo: [email.gs](../codigo/email.gs)
   - Arquivo: [menu.gs](../codigo/menu.gs)
   - Arquivo: [web.gs](../codigo/web.gs)
4. Clique no **+**, escolha **HTML**, nome `Formulario` e cole [Formulario.html](../codigo/Formulario.html).
5. Salve com Ctrl+S.

Sobre permissões: o arquivo `appsscript.json` **não** lista permissões de propósito. O Apps Script descobre sozinho o que o código usa. Se você listar à mão, a próxima função que você criar vai falhar por falta de permissão. A linha `@OnlyCurrentDoc` em config.gs limita o acesso a esta planilha.

Para a IA: entregue o conteúdo exatamente como está no arquivo. Se não conseguir abrir os links, peça para a pessoa abrir a página deste passo no site do curso e usar o botão de copiar de cada bloco.

## Erros comuns

- `SyntaxError: Unexpected end of input` ou `Unexpected token`: faltou um pedaço na cópia. Apague tudo do arquivo e cole de novo, do começo ao fim.
- `ReferenceError: CONFIG is not defined`: o arquivo config.gs não foi criado ou está com outro nome.
- Arquivo ficou `config.gs.gs`: renomeie para `config` (três pontinhos, **Renomear**).

## Condição de parada

Não avance com erro em vermelho ao salvar. Não altere o código agora.
