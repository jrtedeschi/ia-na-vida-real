// Lógica pura: não chama nenhum serviço do Google. Testável com Node (testes/dominio.test.js).

/** @typedef {{data: Date, descricao: string, categoria: string, valor: number}} Gasto */
/** @typedef {{linha: number, motivo: string}} ErroDeLinha */
/** @typedef {{inicio: Date, fim: Date}} Periodo */

/**
 * Lê um valor em reais, aceitando número ou texto ("45,90", "R$ 1.234,56", "45.90").
 * Regra: a vírgula separa os centavos. Um único ponto seguido de exatamente 3 dígitos
 * e sem vírgula ("1.500") é ambíguo (mil e quinhentos ou um e meio?) e é recusado.
 * @param {*} v
 * @returns {number|null} null se não for um valor válido
 */
function lerValor(v) {
  if (typeof v === 'number') return isFinite(v) ? v : null;
  if (typeof v !== 'string') return null;
  const t = v.replace(/R\$/i, '').replace(/\s/g, '');
  if (valorAmbiguo(t)) return null;
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t) || /^-?\d+(,\d+)?$/.test(t)) {
    return Number(t.replace(/\./g, '').replace(',', '.'));
  }
  if (/^-?\d+\.\d+$/.test(t)) return Number(t);
  return null;
}

/** "1.500" ou "R$ 2.000": ponto único com 3 dígitos depois, sem vírgula. */
function valorAmbiguo(v) {
  return typeof v === 'string' && /^-?\d{1,3}\.\d{3}$/.test(v.replace(/R\$/i, '').replace(/\s/g, ''));
}

/** Data no formato dd/mm, sem o ano. */
function dataSemAno(v) {
  return typeof v === 'string' && /^\d{1,2}\/\d{1,2}$/.test(v.trim());
}

/**
 * Texto que a planilha trataria como fórmula (começa com =, +, -, @) ganha um apóstrofo
 * na frente e fica gravado como texto. Use em todo texto digitado pela pessoa antes de gravar.
 * @param {*} t
 * @returns {*}
 */
function protegerTexto(t) {
  return typeof t === 'string' && /^[=+\-@\t\r]/.test(t) ? "'" + t : t;
}

/**
 * Lê uma data: objeto Date, "dd/mm/aaaa", "dd/mm/aa" ou "aaaa-mm-dd" (formulário web).
 * @param {*} v
 * @returns {Date|null}
 */
function lerData(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') return isNaN(v.getTime()) ? null : v;
  if (typeof v !== 'string') return null;
  const t = v.trim();
  let d, m, a;
  let r = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (r) { d = +r[1]; m = +r[2]; a = +r[3]; if (a < 100) a += 2000; }
  r = r || t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (r && d === undefined) { a = +r[1]; m = +r[2]; d = +r[3]; }
  if (!r) return null;
  const data = new Date(a, m - 1, d);
  const ok = data.getFullYear() === a && data.getMonth() === m - 1 && data.getDate() === d;
  return ok ? data : null;
}

/**
 * Valida uma linha [Data, Descrição, Categoria, Valor].
 * @param {Array<*>} linha
 * @param {number} numero número da linha na planilha
 * @returns {{gasto?: Gasto, erro?: ErroDeLinha, vazia?: boolean}}
 */
function validarLinha(linha, numero) {
  const [data, descricao, categoria, valor] = linha;
  if (linha.every((c) => c === '' || c === null || c === undefined)) return { vazia: true };
  const d = lerData(data);
  const v = lerValor(valor);
  const motivos = [];
  if (!d && dataSemAno(data)) motivos.push('data "' + data + '" sem o ano (use dd/mm/aaaa)');
  else if (!d) motivos.push('data "' + data + '" não reconhecida (use dd/mm/aaaa)');
  if (v === null && valorAmbiguo(valor)) motivos.push('valor "' + valor + '" é ambíguo: use vírgula nos centavos (1.500,00 ou 1,50)');
  else if (v === null) motivos.push('valor "' + valor + '" não é um número (use 45,90)');
  if (motivos.length) return { erro: { linha: numero, motivo: motivos.join('; ') } };
  return {
    gasto: {
      data: d,
      descricao: String(descricao || '').trim(),
      categoria: String(categoria || '').trim() || 'Sem categoria',
      valor: v,
    },
  };
}

/**
 * @param {Array<Array<*>>} linhas valores a partir da linha 2
 * @returns {{gastos: Gasto[], erros: ErroDeLinha[]}}
 */
function lerLinhas(linhas) {
  const gastos = [];
  const erros = [];
  linhas.forEach((linha, i) => {
    const r = validarLinha(linha, i + 2);
    if (r.gasto) gastos.push(r.gasto);
    if (r.erro) erros.push(r.erro);
  });
  return { gastos, erros };
}

/** @param {Date} hoje @returns {Date} segunda-feira 00:00 da semana de `hoje` */
function inicioDaSemana(hoje) {
  const desde = (hoje.getDay() + 6) % 7; // segunda = 0
  return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - desde);
}

/** Semana anterior completa, de segunda 00:00 a domingo 23:59:59.999. */
function semanaAnterior(hoje) {
  const seg = inicioDaSemana(hoje);
  return { inicio: new Date(seg.getFullYear(), seg.getMonth(), seg.getDate() - 7), fim: new Date(seg.getTime() - 1) };
}

/** Semana atual até o fim de hoje. */
function semanaAtual(hoje) {
  return {
    inicio: inicioDaSemana(hoje),
    fim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 0, 0, 0, -1),
  };
}

function filtrarPorPeriodo(gastos, p) {
  return gastos.filter((g) => g.data >= p.inicio && g.data <= p.fim);
}

function resumir(gastos) {
  const porCategoria = {};
  let total = 0;
  for (const g of gastos) {
    total += g.valor;
    porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.valor;
  }
  return { total, quantidade: gastos.length, porCategoria };
}

function formatarMoeda(valor) {
  const [inteiro, centavos] = Math.abs(valor).toFixed(2).split('.');
  return (valor < 0 ? '-' : '') + 'R$ ' + inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + centavos;
}

function formatarData(d) {
  return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
}

function escaparHtml(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * @param {{total:number, quantidade:number, porCategoria:Object<string,number>}} resumo
 * @param {Periodo} periodo
 * @param {ErroDeLinha[]} erros linhas que NÃO entraram na conta
 * @param {number} maxErros
 */
function montarEmailResumo(resumo, periodo, erros, maxErros) {
  const intervalo = formatarData(periodo.inicio) + ' a ' + formatarData(periodo.fim);
  const cats = Object.keys(resumo.porCategoria)
    .sort((a, b) => resumo.porCategoria[b] - resumo.porCategoria[a])
    .map((c) => '<li>' + escaparHtml(c) + ': <b>' + formatarMoeda(resumo.porCategoria[c]) + '</b></li>')
    .join('');
  let html = '<h2>Resumo de gastos</h2><p>' + intervalo + '</p>' + (resumo.quantidade === 0
    ? '<p>Nenhum gasto registrado no período.</p>'
    : '<p>Total: <b>' + formatarMoeda(resumo.total) + '</b> em ' + resumo.quantidade + ' lançamento(s).</p><ul>' + cats + '</ul>');
  if (erros.length) {
    html += '<p style="color:#a33"><b>Atenção: ' + erros.length + ' linha(s) com problema ficaram fora da conta.</b> Corrija na planilha:</p><ul>' +
      erros.slice(0, maxErros).map((e) => '<li>Linha ' + e.linha + ': ' + escaparHtml(e.motivo) + '</li>').join('') +
      (erros.length > maxErros ? '<li>... e mais ' + (erros.length - maxErros) + '. Use o menu Tijolinho, Verificar planilha.</li>' : '') + '</ul>';
  }
  return { assunto: 'Resumo de gastos (' + intervalo + ')' + (erros.length ? ' [' + erros.length + ' linha(s) com problema]' : ''), html };
}

if (typeof module !== 'undefined') {
  module.exports = { lerValor, valorAmbiguo, dataSemAno, protegerTexto, lerData, validarLinha, lerLinhas, inicioDaSemana, semanaAnterior, semanaAtual,
    filtrarPorPeriodo, resumir, formatarMoeda, formatarData, escaparHtml, montarEmailResumo };
}
