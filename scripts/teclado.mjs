/*
 * Teste só com teclado + link do WhatsApp gerado.
 * Uso: npm run preview (outro terminal) && node scripts/teclado.mjs [url]
 */
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:5191/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1456, height: 840 } });
await page.goto(url);
await page.waitForTimeout(1200);

// 1. Tab pela página inteira: cada parada precisa de foco visível
const paradas = [];
for (let i = 0; i < 80; i++) {
  await page.keyboard.press('Tab');
  await page.waitForTimeout(700); // espera a rolagem suave até o foco
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    const depois = getComputedStyle(el, '::after');
    const visivel =
      (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) ||
      (depois.outlineStyle !== 'none' && parseFloat(depois.outlineWidth) > 0) ||
      cs.boxShadow !== 'none';
    const r = el.getBoundingClientRect();
    const naTela = r.bottom > 0 && r.top < innerHeight;
    const nome = (el.getAttribute('aria-label') || el.textContent || el.id || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 48);
    return { tag: el.tagName.toLowerCase(), nome, visivel, naTela };
  });
  if (!info) break;
  paradas.push(info);
}
const semFoco = paradas.filter((p) => !p.visivel);
const foraDaTela = paradas.filter((p) => !p.naTela);
console.log(`Paradas de Tab: ${paradas.length}`);
console.log(paradas.map((p, i) => `${String(i + 1).padStart(2)} ${p.tag.padEnd(6)} ${p.nome}${p.visivel ? '' : '  <-- SEM FOCO VISÍVEL'}${p.naTela ? '' : '  <-- FORA DA TELA'}`).join('\n'));

// 2. Diálogo pelo teclado: abre com Enter, Esc fecha e o foco volta
await page.locator('[data-abrir="setor-bueno"]').focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(300);
const abriu = await page.evaluate(() => document.querySelector('[data-obra-dialogo]').open);
const focoDentro = await page.evaluate(() => !!document.activeElement.closest('dialog'));
await page.keyboard.press('Tab');
await page.keyboard.press('Tab');
const focoPreso = await page.evaluate(() => !!document.activeElement.closest('dialog'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
const fechou = await page.evaluate(() => !document.querySelector('[data-obra-dialogo]').open);
const voltou = await page.evaluate(() => document.activeElement.dataset.abrir === 'setor-bueno');
console.log(`\nDiálogo: abriu=${abriu} focoDentro=${focoDentro} focoPreso=${focoPreso} fechouComEsc=${fechou} focoVoltou=${voltou}`);

// 3. Acordeão pelo teclado
await page.locator('#duvida-1').focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(300);
console.log(`Acordeão: aria-expanded=${await page.getAttribute('#duvida-1', 'aria-expanded')}`);

// 4. Simulador: R$ 650, casa, Ana → link gerado
await page.locator('#simulacao').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.fill('#sim-conta', '');
await page.type('#sim-conta', '650');
await page.waitForTimeout(300);
await page.fill('#sim-nome', 'Ana');
await page.type('#sim-whatsapp', '62912345678');
await page.check('#sim-lgpd');
const [popup] = await Promise.all([page.waitForEvent('popup', { timeout: 5000 }).catch(() => null), page.click('.sim__enviar')]);
const link = popup ? popup.url() : await page.getAttribute('[data-sim-ok-link]', 'href');
const confirmacao = await page.locator('[data-sim-ok]').isVisible();
console.log(`\nLink gerado: ${link}`);
try {
  const u = new URL(link);
  console.log(`Mensagem: ${u.searchParams.get('text')}`);
} catch {}
console.log(`Confirmação visível: ${confirmacao}`);

// 5. Nada de [PREENCHER]/[CONFIRMAR] cru na tela
const cru = await page.evaluate(() => /\[(PREENCHER|CONFIRMAR)\]/.test(document.body.innerText));
console.log(`Marcadores crus na tela: ${cru}`);

await browser.close();
if (semFoco.length || cru || !abriu || !fechou) process.exitCode = 1;
