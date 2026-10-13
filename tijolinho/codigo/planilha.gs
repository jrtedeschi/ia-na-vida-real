// Adaptador: único arquivo que mexe na planilha.

function obterAbaGastos_() {
  const p = SpreadsheetApp.getActiveSpreadsheet();
  return p.getSheetByName(CONFIG.NOME_ABA) || p.insertSheet(CONFIG.NOME_ABA);
}

/** Ajusta localidade e fuso da planilha para o Brasil e formata a aba. */
function prepararAba_() {
  const p = SpreadsheetApp.getActiveSpreadsheet();
  p.setSpreadsheetLocale(CONFIG.LOCALIDADE);
  p.setSpreadsheetTimeZone(Session.getScriptTimeZone());
  const aba = obterAbaGastos_();
  const n = CONFIG.CABECALHO.length;
  aba.getRange(1, 1, 1, n).setValues([CONFIG.CABECALHO]).setFontWeight('bold');
  aba.setFrozenRows(1);
  aba.getRange('A2:A').setNumberFormat('dd/mm/yyyy');
  aba.getRange('D2:D').setNumberFormat('R$ #,##0.00');
  aba.autoResizeColumns(1, n);
}

/** @returns {string} localidade atual da planilha, ex.: "pt_BR" */
function localidadeDaPlanilha_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetLocale();
}

/** @returns {{gastos: Gasto[], erros: ErroDeLinha[]}} */
function lerGastos_() {
  const aba = obterAbaGastos_();
  const ultima = aba.getLastRow();
  if (ultima < 2) return { gastos: [], erros: [] };
  return lerLinhas(aba.getRange(2, 1, ultima - 1, CONFIG.CABECALHO.length).getValues());
}

/** @param {Gasto} g textos protegidos para não virarem fórmula */
function adicionarGasto_(g) {
  obterAbaGastos_().appendRow([g.data, protegerTexto(g.descricao), protegerTexto(g.categoria), g.valor]);
}
