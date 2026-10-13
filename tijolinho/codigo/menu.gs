// Pontos de entrada: menu, ações e gatilho.

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Tijolinho')
    .addItem('Preparar planilha', 'prepararPlanilha')
    .addItem('Verificar planilha', 'verificarPlanilha')
    .addItem('Enviar resumo desta semana', 'enviarResumoAgora')
    .addSeparator()
    .addItem('Agendar resumo semanal', 'agendarResumoSemanal')
    .addToUi();
}

function prepararPlanilha() {
  prepararAba_();
  SpreadsheetApp.getActiveSpreadsheet().toast('Planilha pronta (localidade Brasil). Lance seus gastos.');
}

/** Mostra quais linhas têm problema. Nada é ignorado em silêncio. */
function verificarPlanilha() {
  const ui = SpreadsheetApp.getUi();
  const { gastos, erros } = lerGastos_();
  const local = localidadeDaPlanilha_();
  let msg = gastos.length + ' linha(s) válida(s), ' + erros.length + ' com problema.';
  if (local !== CONFIG.LOCALIDADE) msg += '\n\nA localidade da planilha é ' + local + '. Use Preparar planilha para mudar para Brasil.';
  if (erros.length) msg += '\n\n' + erros.map((e) => 'Linha ' + e.linha + ': ' + e.motivo).join('\n');
  ui.alert('Verificação', msg, ui.ButtonSet.OK);
}

function enviarResumo_(periodo) {
  const { gastos, erros } = lerGastos_();
  const r = resumir(filtrarPorPeriodo(gastos, periodo));
  const email = montarEmailResumo(r, periodo, erros, CONFIG.MAX_ERROS_NO_EMAIL);
  enviarEmail_(emailDoUsuario_(), email.assunto, email.html);
  return erros.length;
}

/** Usada pelo gatilho de segunda: resume a semana ANTERIOR completa (seg a dom). */
function enviarResumoSemanal() {
  enviarResumo_(semanaAnterior(new Date()));
}

function enviarResumoAgora() {
  const nErros = enviarResumo_(semanaAtual(new Date()));
  SpreadsheetApp.getActiveSpreadsheet().toast('Resumo enviado para ' + emailDoUsuario_() +
    (nErros ? '. Atenção: ' + nErros + ' linha(s) com problema.' : '.'));
}

function agendarResumoSemanal() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === CONFIG.FUNCAO_DO_GATILHO)
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger(CONFIG.FUNCAO_DO_GATILHO)
    .timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(CONFIG.HORA_DO_RESUMO).create();
  SpreadsheetApp.getActiveSpreadsheet().toast('Agendado: toda segunda entre 8h e 9h, com a semana anterior.');
}
