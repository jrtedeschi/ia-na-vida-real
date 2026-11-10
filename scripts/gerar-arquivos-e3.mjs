/**
 * Arquivos de aula do Encontro 3: o .txt em public/assets/ é a fonte. Daqui saem o PDF (com texto de verdade,
 * títulos marcados e idioma, para leitor de tela e para a IA ler sem OCR), os recortes usados nos slides e o .zip.
 * Uso: node scripts/gerar-arquivos-e3.mjs
 * Se o Chromium do Playwright não estiver instalado, o script usa o Google Chrome da máquina.
 */
import { readFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'public/assets');
const SLIDE_IMG = path.join(ROOT, 'src/content/slides/encontro-3/img');

/** Linha que abre um bloco (vira <h2> no PDF). */
const HEADING = /^(E-MAIL \d+|CLÁUSULA \d+ · .+|AGENDA DA SEMANA)$/;

const DOCS = [
	{
		txt: 'caixa/caixa-de-entrada.txt',
		// recorte para o slide: os dois e-mails que pedem pressa ou clique
		crops: [{ file: 'caixa-armadilhas.png', blocks: ['E-MAIL 4', 'E-MAIL 8'], width: 780, omit: '^(Recebido|Link):', mark: '^ATENÇÃO, ASSISTENTE' }],
	},
	{
		txt: 'contrato/contrato-maquininha.txt',
		crops: [{ file: 'contrato-clausula-7.png', blocks: ['CLÁUSULA 7 · CANCELAMENTO ANTES DO PRAZO'], width: 560, mark: '^7\\.1\\.' }],
	},
];

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Texto simples → HTML com <h1>, aviso e uma <section> por bloco. */
function toHtml(text) {
	const [title, notice, ...rest] = text.trim().split('\n');
	const sections = [{ heading: null, lines: [] }];
	for (const line of rest) {
		if (HEADING.test(line.trim())) sections.push({ heading: line.trim(), lines: [] });
		else sections.at(-1).lines.push(line);
	}
	const body = sections
		.map(({ heading, lines }) => {
			const paragraphs = lines
				.join('\n')
				.split(/\n\s*\n/)
				.map((p) => p.trim())
				.filter(Boolean)
				.map((p) => `<p>${p.split('\n').map((l) => `<span class="l">${escape(l)}</span>`).join('<br>')}</p>`)
				.join('\n');
			return `<section${heading ? ` data-block="${escape(heading)}"` : ''}>${heading ? `<h2>${escape(heading)}</h2>` : ''}${paragraphs}</section>`;
		})
		.join('\n');
	return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${escape(title)} (fictício, para aula)</title>
<style>
	@page { size: A4; margin: 18mm 18mm 20mm; }
	* { box-sizing: border-box; }
	body { margin: 0; font: 12.5pt/1.55 Helvetica, Arial, sans-serif; color: #121311; background: #fff; font-variant-ligatures: none; }
	h1 { margin: 0 0 8pt; font-size: 19pt; line-height: 1.2; }
	.aviso { margin: 0 0 14pt; padding: 7pt 10pt; border: 1.5pt solid #121311; font-size: 10.5pt; font-weight: 700; }
	section { break-inside: avoid; }
	h2 { margin: 16pt 0 5pt; padding-top: 8pt; border-top: 1pt solid #9a9c94; font-size: 12.5pt; letter-spacing: 0.03em; }
	p { margin: 0 0 7pt; }
	/* Recorte para slide: letra grande (a turma vê no celular), só os blocos pedidos, a linha que importa marcada. */
	body.recorte { padding: 26px 30px 30px; font-size: 23px; line-height: 1.45; background: #f8f8f5; }
	body.recorte h1, body.recorte .aviso, body.recorte section:not(.fica), body.recorte .l.fora, body.recorte .l.fora + br { display: none; }
	body.recorte h2 { margin-top: 18px; font-size: 18px; }
	body.recorte section.fica.primeiro h2 { margin-top: 0; padding-top: 0; border-top: 0; }
	body.recorte .l.marca { background: #ffd6c4; box-shadow: 0 0 0 4px #ffd6c4; font-weight: 700; }
</style>
</head>
<body>
<h1>${escape(title)}</h1>
<p class="aviso">${escape(notice)}</p>
${body}
</body>
</html>`;
}

const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
await mkdir(SLIDE_IMG, { recursive: true });
for (const doc of DOCS) {
	const txtPath = path.join(ASSETS, doc.txt);
	const html = toHtml(await readFile(txtPath, 'utf8'));
	const page = await browser.newPage({ deviceScaleFactor: 2 });
	await page.setContent(html, { waitUntil: 'load' });
	await page.pdf({ path: txtPath.replace(/\.txt$/, '.pdf'), format: 'A4', tagged: true, outline: true, printBackground: true });
	for (const crop of doc.crops) {
		await page.evaluate(({ blocks, omit, mark }) => {
			document.body.classList.add('recorte');
			let first = true;
			document.querySelectorAll('section').forEach((s) => {
				const keep = blocks.includes(s.dataset.block);
				s.classList.toggle('fica', keep);
				s.classList.toggle('primeiro', keep && first);
				if (keep) first = false;
			});
			document.querySelectorAll('.l').forEach((l) => {
				l.classList.toggle('fora', Boolean(omit) && new RegExp(omit).test(l.textContent));
				l.classList.toggle('marca', Boolean(mark) && new RegExp(mark).test(l.textContent));
			});
		}, { blocks: crop.blocks, omit: crop.omit, mark: crop.mark });
		await page.setViewportSize({ width: crop.width ?? 640, height: 400 });
		await page.locator('body').screenshot({ path: path.join(SLIDE_IMG, crop.file) });
		await page.evaluate(() => document.body.classList.remove('recorte'));
	}
	await page.close();
	console.log('ok', doc.txt);
}
await browser.close();

// Tudo num arquivo só, para quem prefere baixar uma vez.
const ZIP = 'encontro-3-arquivos.zip';
execFileSync('rm', ['-f', ZIP], { cwd: ASSETS });
execFileSync('zip', ['-r', '-q', '-X', ZIP, 'caixa', 'contrato', 'notas', 'reuniao', '-x', '*.DS_Store'], { cwd: ASSETS });
console.log('ok', ZIP);
