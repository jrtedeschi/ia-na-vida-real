#!/usr/bin/env node
// Confere o conteúdo do curso contra docs/guia-de-revisao.md (só o que dá para checar por padrão de texto).
//
// Uso:
//   node scripts/review-lint.mjs --all              revisa todo o conteúdo e sai com 1 se houver aviso
//   node scripts/review-lint.mjs arquivo.mdx ...    revisa arquivos específicos
//   (hook) JSON do Claude Code no stdin             revisa o arquivo editado e devolve avisos ao Claude

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const CONTENT_DIR = join(ROOT, 'src/content/docs');
const SLIDES_RE = /src\/pages\/.*slides\.astro$/;
const CONTENT_RE = /src\/content\/docs\/.*\.mdx?$/;

const SALES_WORDS = ['revolucionári', 'incrível', 'incríveis', 'poderos', 'mergulh', 'jornada', 'desbloque', 'potencializ', 'transformar sua vida', 'no mundo de hoje', 'game changer'];
const STRUCTURE_ECHO = [/seis blocos/i, /neste slide/i, /nesta aula vamos/i, /vamos ver agora/i, /\b\d+ blocos, \d+ minutos/i];
const GIMMICK_LABELS = [/no chat, agora/i, /antes de tudo/i, /teste rápido/i, /^\s*hoje\s*$/i];
const ENGLISH_TERMS = ['cognitive offloading', 'deep research', 'prompt injection', 'reasoning', 'tokenizer', 'onboarding'];
const AUTHOR_YEAR = /\b[A-ZÁÉÍÓÚ][a-zà-ú]+(?: (?:e|et al\.|&) [A-ZÁÉÍÓÚ]?[a-zà-ú.]+)?,? (?:19|20)\d{2}\b/;

/** Texto visível, sem código, imports, frontmatter e (nos slides) sem as notas do apresentador. */
function visibleText(file, raw) {
	let t = raw;
	if (SLIDES_RE.test(file)) {
		t = t.replace(/^---[\s\S]*?---/, '');
		t = t.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<aside class="notes">[\s\S]*?<\/aside>/g, '');
		t = t.replace(/<svg[\s\S]*?<\/svg>/g, '');
	} else {
		t = t.replace(/^---[\s\S]*?---/, '').replace(/^import .*$/gm, '');
		t = t.replace(/```[\s\S]*?```/g, '');
		t = t.replace(/^## Fontes[\s\S]*$/m, ''); // seção de fontes pode ter autor e ano
	}
	return t;
}

function lint(file) {
	const rel = relative(ROOT, file);
	const raw = readFileSync(file, 'utf8');
	const text = visibleText(file, raw);
	const isSlides = SLIDES_RE.test(file);
	const out = [];
	text.split('\n').forEach((line, i) => {
		const plain = line.replace(/<[^>]+>/g, ' ').replace(/\{[^}]*\}/g, ' ').replace(/https?:\/\/\S+/g, ' ').trim();
		if (!plain) return;
		const at = `${rel}:${i + 1}`;
		const lower = plain.toLowerCase();
		if (/—/.test(plain)) out.push(`${at} travessão (—): troque por ponto ou vírgula`);
		if (/[≠]|\s=\s/.test(plain)) out.push(`${at} símbolo no lugar de palavra (≠ ou =): escreva por extenso`);
		if (/!(?!\[)/.test(plain) && !/https?:/.test(plain)) out.push(`${at} exclamação: tom de vendedor`);
		SALES_WORDS.filter((w) => lower.includes(w)).forEach((w) => out.push(`${at} palavra de vendedor: "${w}"`));
		STRUCTURE_ECHO.filter((r) => r.test(plain)).forEach(() => out.push(`${at} eco de estrutura: diga o tema, não o formato`));
		if (!lower.includes('em inglês')) ENGLISH_TERMS.filter((w) => lower.includes(w)).forEach((w) =>
			out.push(`${at} termo em inglês "${w}": use o português primeiro (aceitável só se vier depois do equivalente)`),
		);
		if (isSlides) {
			if (/class="s-kicker"/.test(line) && GIMMICK_LABELS.some((r) => r.test(plain))) out.push(`${at} rótulo de efeito: apague ou troque por algo informativo`);
			if (AUTHOR_YEAR.test(plain) && !/class="s-cite"/.test(line)) out.push(`${at} autor e ano na tela: mova para as notas do apresentador`);
			if (/→/.test(plain) && !/Configurações|s-stats|<b>[^<]*→/.test(line)) out.push(`${at} seta (→) em frase: escreva por extenso`);
			if (/\?\s*$/.test(plain) && /<h2/.test(line)) out.push(`${at} título em forma de pergunta: diga a ideia (se for intencional, ignore)`);
		}
	});
	return out;
}

function allFiles() {
	const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
	const slides = walk(join(ROOT, 'src/pages')).filter((f) => SLIDES_RE.test(f));
	return [...walk(CONTENT_DIR).filter((f) => CONTENT_RE.test(f)), ...slides];
}

const args = process.argv.slice(2);
if (args.length) {
	const files = args[0] === '--all' ? allFiles() : args.map((a) => resolve(a));
	const warnings = files.flatMap(lint);
	warnings.forEach((w) => console.log(w));
	console.log(warnings.length ? `\n${warnings.length} aviso(s). Regras em docs/guia-de-revisao.md` : 'Nenhum aviso.');
	process.exit(warnings.length ? 1 : 0);
}

// Modo hook: lê o JSON do Claude Code no stdin.
let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
	let file;
	try {
		const payload = JSON.parse(input || '{}');
		file = payload.tool_input?.file_path ?? payload.tool_response?.filePath;
	} catch {
		process.exit(0); // payload inesperado: não atrapalha o trabalho
	}
	if (!file || !(CONTENT_RE.test(file) || SLIDES_RE.test(file))) process.exit(0);
	let warnings;
	try {
		warnings = lint(resolve(file));
	} catch (err) {
		console.error(`review-lint: não consegui ler ${file}: ${err.message}`);
		process.exit(0);
	}
	if (!warnings.length) process.exit(0);
	const shown = warnings.slice(0, 25);
	const more = warnings.length > shown.length ? `\n(+${warnings.length - shown.length} avisos; rode node scripts/review-lint.mjs --all)` : '';
	console.log(
		JSON.stringify({
			hookSpecificOutput: {
				hookEventName: 'PostToolUse',
				additionalContext: `Revisão automática (docs/guia-de-revisao.md) achou ${warnings.length} aviso(s) em ${relative(ROOT, file)}:\n${shown.join('\n')}${more}\nCorrija os que se aplicam antes de seguir.`,
			},
		}),
	);
});
