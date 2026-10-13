---
id: 03
titulo: 'Execute pela primeira vez e autorize'
objetivo: 'Rodar prepararPlanilha e conceder as permissões lendo o que está sendo pedido.'
pre-requisitos: 02
proximo: '04'
verificacao:
- 'O registro de execução mostra "Execução concluída".'
- 'A planilha ganhou a aba "Gastos" com o cabeçalho Data, Descrição, Categoria, Valor.'
- 'A pessoa leu a lista de permissões antes de clicar em Permitir.'
---


## O que fazer

1. No alto do editor, no seletor ao lado de **Executar**, escolha `prepararPlanilha`. Clique em **Executar**.
2. Aparece "Autorização necessária". Clique em **Revisar permissões** e escolha sua conta.
3. Pode aparecer "O Google não verificou este app". Isso aparece para todo script novo que não passou pela revisão do Google. Clique em **Avançado** e depois em **Acessar Tijolinho Gastos (não seguro)**.
4. **Leia a lista de permissões.** O texto varia, mas deve ser algo como: ver e editar a planilha em que o app está instalado; mostrar conteúdo em apps do Google; enviar e-mail como você; executar quando você não estiver presente; ver seu endereço de e-mail. Se aparecer algo diferente (como "ver todos os seus arquivos do Drive"), pare e pergunte.
5. Clique em **Permitir**.

Regra de segurança: só autorize código que veio de fonte que você confia e que a IA te explicou. Esta planilha é uma cópia de teste, sem dados importantes.

A função também muda a localidade da planilha para Brasil. Isso faz `45,90` e `13/10/2026` serem lidos do jeito brasileiro.

## Erros comuns

- "Este app está bloqueado" ou "Acesso bloqueado" (em inglês: "This app is blocked"): conta Workspace com bloqueio do administrador. Use conta pessoal.
- `Exception: You do not have permission to call ...`: a autorização foi cancelada. Execute de novo e conclua até **Permitir**.
- "Autorização necessária" de novo depois: normal quando o código passa a usar algo novo. Revise e permita.

## Condição de parada

Se a pessoa não quiser autorizar, respeite e pare. Explique que sem autorização o app não roda.
