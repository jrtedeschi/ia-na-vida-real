// Gera os artefatos estáticos da PoC a partir da animação web (Playwright + ffmpeg):
//   out/token-split-poster-{light,dark}.png   estado final (poster / PDF / fallback)
//   out/token-split-{320,768}.png             responsivo, estado final
//   out/token-split-reduced-motion.png        com prefers-reduced-motion: reduce
//   out/token-split-slide-{mid,final}.png     dentro do reveal.js 6
//   out/token-split-slides-print.pdf          reveal ?print-pdf (o "poster" vai para o PDF)
//   out/token-split.{webm,mp4}                gravação de ~9 s (para redes/WhatsApp, não para o site)
//
// Uso (da raiz do projeto, sem instalar nada no projeto):
//   NODE_PATH=/caminho/para/node_modules-com-playwright node animations/render.mjs
//   (ex.: o cache do npx: ~/.npm/_npx/<hash>/node_modules; precisa de ffmpeg no PATH)
import { createServer } from 'node:http';
import { readFile, mkdir, rm } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
// ESM ignora NODE_PATH: resolve o playwright a partir dele (ou do projeto, se instalado lá).
const { chromium } = createRequire(join(process.env.NODE_PATH ?? ROOT, 'noop.js'))('playwright');
const OUT = join(ROOT, 'animations', 'out');
const PAGE = '/animations/token-split/index.html';
const SLIDES = '/animations/token-split/slides.html';
const CLIP_SECONDS = 9;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css' };

function serve() {
	const server = createServer(async (req, res) => {
		const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
		const file = join(ROOT, path);
		if (!file.startsWith(ROOT)) return res.writeHead(403).end();
		try {
			const body = await readFile(file);
			res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
		} catch {
			res.writeHead(404).end();
		}
	});
	return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

const ISOLATE = `main > :not(ivr-token-split){display:none!important} main{padding:24px 16px!important}`;

async function settle(page) {
	await page.waitForSelector('ivr-token-split .ts-frame');
	await page.evaluate(() => document.fonts.ready);
}

async function posters(browser, base) {
	for (const theme of ['light', 'dark']) {
		const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 2 });
		await page.goto(base + PAGE);
		await settle(page);
		await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
		await page.evaluate(() => document.querySelector('ivr-token-split').showFinal());
		await page.locator('ivr-token-split .ts-frame').screenshot({ path: join(OUT, `token-split-poster-${theme}.png`) });
		await page.close();
	}
	for (const width of [320, 768]) {
		const page = await browser.newPage({ viewport: { width, height: 900 } });
		await page.goto(base + PAGE);
		await settle(page);
		await page.evaluate(() => document.querySelector('ivr-token-split').showFinal());
		await page.locator('ivr-token-split').screenshot({ path: join(OUT, `token-split-${width}.png`) });
		const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
		console.log(`${width}px: horizontal overflow = ${overflow}`);
		await page.close();
	}
}

async function reducedMotion(browser, base) {
	const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 900, height: 900 } });
	const page = await ctx.newPage();
	await page.goto(base + PAGE);
	await settle(page);
	await page.waitForTimeout(500);
	const running = await page.evaluate(() => document.getAnimations().length);
	console.log(`reduced-motion: animações ativas = ${running}`);
	await page.locator('ivr-token-split').screenshot({ path: join(OUT, 'token-split-reduced-motion.png') });
	await ctx.close();
}

async function slides(browser, base) {
	const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
	await page.goto(base + SLIDES + '#/1');
	await settle(page);
	await page.waitForTimeout(4600);
	await page.screenshot({ path: join(OUT, 'token-split-slide-mid.png') });
	await page.waitForTimeout(4500);
	await page.screenshot({ path: join(OUT, 'token-split-slide-final.png') });
	await page.close();

	const print = await browser.newPage();
	await print.goto(base + SLIDES + '?print-pdf');
	await settle(print);
	await print.waitForTimeout(800);
	await print.pdf({ path: join(OUT, 'token-split-slides-print.pdf'), width: '1280px', height: '720px', printBackground: true });
	await print.close();
}

async function video(browser, base) {
	const dir = join(OUT, '.rec');
	const size = { width: 960, height: 540 };
	const ctx = await browser.newContext({ viewport: size, recordVideo: { dir, size } });
	const t0 = Date.now();
	const page = await ctx.newPage();
	await page.goto(base + PAGE);
	await page.addStyleTag({ content: ISOLATE });
	await settle(page);
	const start = (Date.now() - t0) / 1000;
	await page.evaluate(() => document.querySelector('ivr-token-split').play({ force: true }));
	await page.waitForTimeout(CLIP_SECONDS * 1000 + 300);
	const raw = await page.video().path();
	await ctx.close();
	const ss = Math.max(0, start).toFixed(2);
	const common = ['-y', '-loglevel', 'error', '-ss', ss, '-t', String(CLIP_SECONDS), '-i', raw, '-an'];
	execFileSync('ffmpeg', [...common, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', join(OUT, 'token-split.webm')]);
	execFileSync('ffmpeg', [...common, '-c:v', 'libx264', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(OUT, 'token-split.mp4')]);
	await rm(dir, { recursive: true, force: true });
}

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
	await posters(browser, base);
	await reducedMotion(browser, base);
	await slides(browser, base);
	await video(browser, base);
} finally {
	await browser.close();
	server.close();
}
console.log('ok →', OUT);
