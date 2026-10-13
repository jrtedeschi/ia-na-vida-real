// Rode com: node --test testes/dominio.test.cjs  (Node 18+). Fuso fixado para o teste ser reprodutível.
process.env.TZ = 'America/Sao_Paulo';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ctx = { module: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../codigo/dominio.gs'), 'utf8'), ctx);
const D = ctx.module.exports;
const ymd = (d) => [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()].join('-');

test('lerValor aceita número e textos BR/EUA', () => {
  assert.strictEqual(D.lerValor(45.9), 45.9);
  assert.strictEqual(D.lerValor('45,90'), 45.9);
  assert.strictEqual(D.lerValor('R$ 1.234,56'), 1234.56);
  assert.strictEqual(D.lerValor('45.90'), 45.9);
  assert.strictEqual(D.lerValor('1.234'), null); // ambíguo: pede vírgula
  assert.strictEqual(D.lerValor('-10'), -10);
  for (const ruim of ['abc', '', '12,3,4', null, undefined, NaN, '1,234.56']) assert.strictEqual(D.lerValor(ruim), null, String(ruim));
});

test('lerData aceita Date, dd/mm/aaaa, dd/mm/aa e aaaa-mm-dd; rejeita inválidas', () => {
  assert.strictEqual(ymd(D.lerData('13/10/2026')), '2026-10-13-0-0');
  assert.strictEqual(ymd(D.lerData('5/1/26')), '2026-1-5-0-0');
  assert.strictEqual(ymd(D.lerData('2026-10-13')), '2026-10-13-0-0');
  const d = new Date(2026, 0, 2); assert.strictEqual(D.lerData(d), d);
  for (const ruim of ['31/02/2026', '10/13/2026', 'ontem', '', 45000, new Date('x')]) assert.strictEqual(D.lerData(ruim), null, String(ruim));
});

test('linhas com problema são reportadas com número da linha; vazias ignoradas', () => {
  const r = D.lerLinhas([
    [new Date(2026, 9, 12), 'Mercado', 'Casa', 100],
    ['', '', '', ''],
    ['12/10/2026', 'Feira', '', '45,90'],
    ['10/13/2026', 'Erro', 'X', 'abc'],
  ]);
  assert.strictEqual(r.gastos.length, 2);
  assert.strictEqual(r.gastos[1].categoria, 'Sem categoria');
  assert.strictEqual(r.erros.length, 1);
  assert.strictEqual(r.erros[0].linha, 5);
  assert.match(r.erros[0].motivo, /data .* valor/);
});

test('semanaAnterior: segunda 8h cobre seg..dom anteriores, sem buracos entre semanas', () => {
  const p = D.semanaAnterior(new Date(2026, 9, 12, 8, 30)); // segunda 12/10
  assert.strictEqual(ymd(p.inicio), '2026-10-5-0-0');
  assert.strictEqual(ymd(p.fim), '2026-10-11-23-59');
  const prox = D.semanaAnterior(new Date(2026, 9, 19, 8, 30));
  assert.strictEqual(prox.inicio.getTime(), p.fim.getTime() + 1); // contínuo
  // gasto lançado na própria segunda 12/10 depois das 8h entra no próximo resumo
  const g = { data: new Date(2026, 9, 12), valor: 1, categoria: 'a' };
  assert.strictEqual(D.filtrarPorPeriodo([g], p).length, 0);
  assert.strictEqual(D.filtrarPorPeriodo([g], prox).length, 1);
  // domingo também funciona
  assert.strictEqual(ymd(D.semanaAnterior(new Date(2026, 9, 18)).inicio), '2026-10-5-0-0');
});

test('semanaAtual vai de segunda até o fim de hoje', () => {
  const p = D.semanaAtual(new Date(2026, 9, 14, 15));
  assert.strictEqual(ymd(p.inicio), '2026-10-12-0-0');
  assert.strictEqual(ymd(p.fim), '2026-10-14-23-59');
});

test('e-mail mostra total, categorias e alerta de linhas com problema', () => {
  const r = D.resumir([{ valor: 1234.5, categoria: 'Casa' }, { valor: 10, categoria: '<b>' }]);
  const p = { inicio: new Date(2026, 9, 5), fim: new Date(2026, 9, 11) };
  const e = D.montarEmailResumo(r, p, [{ linha: 5, motivo: 'x' }, { linha: 6, motivo: 'y' }], 1);
  assert.match(e.html, /R\$ 1\.244,50/);
  assert.match(e.html, /&lt;b&gt;/);
  assert.match(e.html, /Linha 5/);
  assert.doesNotMatch(e.html, /Linha 6/);
  assert.match(e.html, /mais 1/);
  assert.match(e.assunto, /05\/10\/2026 a 11\/10\/2026\) \[2 linha/);
  assert.match(D.montarEmailResumo(D.resumir([]), p, [], 10).html, /Nenhum gasto/);
});

test('valor com ponto e 3 dígitos sem vírgula ("1.500") é ambíguo e vira linha com problema', () => {
  for (const amb of ['1.500', 'R$ 2.000', '-1.234']) {
    assert.strictEqual(D.lerValor(amb), null, amb);
    assert.ok(D.valorAmbiguo(amb), amb);
  }
  assert.strictEqual(D.lerValor('1.500,00'), 1500);
  assert.strictEqual(D.lerValor('1500'), 1500);
  assert.strictEqual(D.lerValor('1.234.567'), 1234567);
  assert.strictEqual(D.lerValor('12.50'), 12.5);
  const r = D.lerLinhas([['12/10/2026', 'TV', 'Casa', '1.500']]);
  assert.strictEqual(r.gastos.length, 0);
  assert.strictEqual(r.erros[0].linha, 2);
  assert.match(r.erros[0].motivo, /ambíguo.*vírgula/);
});

test('data dd/mm sem ano dá erro claro', () => {
  assert.strictEqual(D.lerData('12/10'), null);
  const r = D.lerLinhas([['12/10', 'Feira', '', '10']]);
  assert.match(r.erros[0].motivo, /sem o ano/);
});

test('linha só com descrição é reportada, não ignorada', () => {
  const r = D.lerLinhas([['', 'Padaria', '', '']]);
  assert.strictEqual(r.gastos.length, 0);
  assert.strictEqual(r.erros.length, 1);
  assert.match(r.erros[0].motivo, /data .* valor/);
});

test('protegerTexto impede que texto vire fórmula', () => {
  for (const f of ['=HYPERLINK("x")', '+1', '-2', '@soma', '\tx']) assert.strictEqual(D.protegerTexto(f), "'" + f, f);
  assert.strictEqual(D.protegerTexto('Mercado'), 'Mercado');
  assert.strictEqual(D.protegerTexto(''), '');
  assert.strictEqual(D.protegerTexto(10), 10);
});

test('e-mail com mais de 10 erros lista 10 e aponta para a verificação', () => {
  const erros = Array.from({ length: 13 }, (_, i) => ({ linha: i + 2, motivo: 'm' }));
  const p = { inicio: new Date(2026, 9, 5), fim: new Date(2026, 9, 11) };
  const e = D.montarEmailResumo(D.resumir([]), p, erros, 10);
  assert.strictEqual((e.html.match(/<li>Linha /g) || []).length, 10);
  assert.match(e.html, /mais 3\. Use o menu Tijolinho, Verificar planilha/);
  assert.match(e.assunto, /\[13 linha/);
});
