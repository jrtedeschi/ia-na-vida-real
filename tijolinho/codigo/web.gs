// Web app (opcional, passo 06): formulário para lançar gastos pelo celular.

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Formulario')
    .setTitle('Tijolinho: novo gasto')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Chamada pelo formulário. Valida com a mesma regra da planilha. */
function registrarGasto(form) {
  const r = validarLinha([form.data, form.descricao, form.categoria, form.valor], 0);
  if (!r.gasto) throw new Error(r.erro ? r.erro.motivo : 'Preencha os campos.');
  adicionarGasto_(r.gasto);
  return 'Gasto de ' + formatarMoeda(r.gasto.valor) + ' registrado.';
}
