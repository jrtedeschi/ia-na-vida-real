/** @OnlyCurrentDoc */
// A linha acima limita o acesso do script a ESTA planilha. Não liste permissões à mão:
// o Apps Script descobre sozinho as permissões pelo código.

const CONFIG = Object.freeze({
  NOME_ABA: 'Gastos',
  CABECALHO: ['Data', 'Descrição', 'Categoria', 'Valor'],
  LOCALIDADE: 'pt_BR',
  FUNCAO_DO_GATILHO: 'enviarResumoSemanal',
  HORA_DO_RESUMO: 8,
  MAX_ERROS_NO_EMAIL: 10,
});
