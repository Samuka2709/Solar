/*
 * Prints headless (Playwright/Chromium) para a checagem do CLAUDE.md.
 * Uso: npm run build && npm run preview  (em outro terminal)
 *      npm run shots -- [url] [--so=hero|secoes|reduzido|og]
 * Saída em prints/.
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const url = args.find((a) => a.startsWith('http')) ?? 'http://localhost:5191/';
const so = (args.find((a) => a.startsWith('--so=')) ?? '').slice(5);
const dir = 'prints';
mkdirSync(dir, { recursive: true });

const telas = {
  desktop: { width: 1456, height: 840 },
  celular: { width: 390, height: 844 },
};

const erros = [];
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function abrir(browser, tela, extra = {}) {
  const ctx = await browser.newContext({
    viewport: telas[tela],
    deviceScaleFactor: 1,
    isMobile: tela === 'celular',
    hasTouch: tela === 'celular',
    ...extra,
  });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') erros.push(`[${tela}] ${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => erros.push(`[${tela}] pageerror: ${e.message}`));
  await page.goto(url, { waitUntil: 'load' });
  return { ctx, page };
}

/** rola até o progresso p da saída do hero */
async function rolarSaida(page, p) {
  await page.evaluate((p) => {
    const hero = document.querySelector('.hero');
    const curso = hero.offsetHeight - innerHeight;
    scrollTo(0, Math.round(p * curso));
  }, p);
  await espera(1800);
}

async function hero(browser) {
  for (const tela of ['desktop', 'celular']) {
    const { ctx, page } = await abrir(browser, tela);
    await espera(5200);
    await page.screenshot({ path: `${dir}/${tela}-hero.png` });
    if (tela === 'desktop') {
      // parágrafo do hero ampliado
      const box = await page.locator('.hero__lado').boundingBox();
      await page.screenshot({ path: `${dir}/${tela}-hero-paragrafo.png`, clip: { x: box.x - 40, y: box.y - 40, width: box.width + 80, height: box.height + 80 } });
    }
    const pontos = tela === 'desktop' ? [0.15, 0.3, 0.45, 0.62, 0.8, 1] : [0.3, 0.45, 0.8];
    for (const p of pontos) {
      await rolarSaida(page, p);
      await page.screenshot({ path: `${dir}/${tela}-saida-${Math.round(p * 100)}.png` });
    }
    // o caso saindo da nuvem
    await page.evaluate(() => scrollTo(0, document.querySelector('#caso').offsetTop - innerHeight * 0.35));
    await espera(1800);
    await page.screenshot({ path: `${dir}/${tela}-caso-chegando.png` });
    await ctx.close();
  }
}

async function secoes(browser) {
  for (const tela of ['desktop', 'celular']) {
    const { ctx, page } = await abrir(browser, tela);
    await espera(1500);
    const ids = await page.evaluate(() => [...document.querySelectorAll('main > section[id]:not(#topo)')].map((s) => s.id));
    for (const id of ids) {
      const s = page.locator(`#${id}`);
      await s.scrollIntoViewIfNeeded();
      await espera(700);
      await s.screenshot({ path: `${dir}/${tela}-secao-${id}.png` });
    }
    await page.locator('footer').screenshot({ path: `${dir}/${tela}-rodape.png` });

    // simulador preenchido
    await page.locator('#simulacao').scrollIntoViewIfNeeded();
    await espera(600);
    await page.fill('#sim-conta', '');
    await page.type('#sim-conta', '780');
    await page.click('[data-tipo="casa"]');
    await page.fill('#sim-nome', 'Ana');
    await page.type('#sim-whatsapp', '62912345678');
    await espera(500);
    await page.locator('#simulacao').screenshot({ path: `${dir}/${tela}-simulador-preenchido.png` });
    // envio sem consentimento → resumo de erros
    await page.click('.sim__enviar');
    await espera(300);
    await page.locator('.sim__contato').screenshot({ path: `${dir}/${tela}-simulador-erros.png` });

    // diálogo de obra
    await page.locator('#obras').scrollIntoViewIfNeeded();
    await espera(600);
    await page.click('[data-abrir="setor-bueno"]');
    await espera(500);
    await page.screenshot({ path: `${dir}/${tela}-obra-dialogo.png` });
    await page.keyboard.press('Escape');
    await espera(300);
    // filtro
    await page.click('[data-filtro="comercio"]');
    await espera(500);
    await page.locator('#obras').screenshot({ path: `${dir}/${tela}-obras-comercio.png` });

    // FAQ com um item aberto
    await page.locator('#duvidas').scrollIntoViewIfNeeded();
    await espera(600);
    await page.click('#duvida-4');
    await espera(400);
    await page.locator('#duvidas').screenshot({ path: `${dir}/${tela}-duvidas-aberta.png` });
    await ctx.close();
  }
}

async function reduzido(browser) {
  for (const tela of ['desktop', 'celular']) {
    const { ctx, page } = await abrir(browser, tela, { reducedMotion: 'reduce' });
    await espera(1500);
    await page.screenshot({ path: `${dir}/${tela}-reduzido-hero.png` });
    await page.evaluate(() => scrollTo(0, innerHeight * 0.7));
    await espera(600);
    await page.screenshot({ path: `${dir}/${tela}-reduzido-transicao.png` });
    await ctx.close();
  }
}

/** Imagem Open Graph 1200×630: a ilha sobre o céu, sem texto nem interface. */
async function og(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await espera(5200);
  await page.addStyleTag({ content: '.hero__texto,.hud,.nav,.dica,.grao,.fixo{display:none!important} .nuvem,.ilha__flutua{animation-play-state:paused!important}' });
  await espera(300);
  await page.screenshot({ path: 'public/og.jpg', type: 'jpeg', quality: 86 });
  await ctx.close();
}

const browser = await chromium.launch();
if (!so || so === 'hero') await hero(browser);
if (!so || so === 'secoes') await secoes(browser);
if (!so || so === 'reduzido') await reduzido(browser);
if (so === 'og') await og(browser);
await browser.close();

if (erros.length) {
  console.log('Console com erros/avisos:\n' + erros.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Console limpo. Prints em prints/.');
}
