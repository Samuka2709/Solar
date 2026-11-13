/*
 * Regra de ouro: nenhuma passagem entre seções pode terminar em linha reta.
 * Leva cada fronteira ao meio da tela, fotografa uma faixa em volta e mede o
 * maior salto de cor entre duas linhas de pixels vizinhas. Acima do limite = linha reta.
 * Uso: npm run preview (outro terminal) && node scripts/costuras.mjs [url]
 */
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:5191/';
const LIMITE = 18; // diferença média de RGB entre linhas vizinhas
const b = await chromium.launch();
let falhas = 0;

for (const [nome, vp] of [['desktop', { width: 1456, height: 840 }], ['celular', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp });
  await p.goto(url);
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important} .grao,.fixo,.nav{display:none!important}' });
  await p.waitForTimeout(800);
  const fronteiras = await p.evaluate(() =>
    [...document.querySelectorAll('main > section, body > footer')]
      .slice(1)
      .map((s) => ({ id: s.id || s.tagName.toLowerCase(), y: s.getBoundingClientRect().top + scrollY }))
  );
  for (const f of fronteiras) {
    // as seções abaixo têm altura provisória (content-visibility) até entrarem na tela:
    // rola, deixa renderizar e mede de novo até a posição parar de mudar
    let yTela = 0;
    for (let k = 0; k < 4; k++) {
      await p.evaluate((id) => { const s = document.getElementById(id) ?? document.querySelector(id); scrollTo(0, s.getBoundingClientRect().top + scrollY - innerHeight / 2); }, f.id === 'footer' ? 'footer' : f.id);
      await p.waitForTimeout(350);
      yTela = await p.evaluate((id) => (document.getElementById(id) ?? document.querySelector(id)).getBoundingClientRect().top, f.id === 'footer' ? 'footer' : f.id);
    }
    yTela = Math.min(Math.max(yTela, 60), vp.height - 60);
    // só a margem esquerda (12 px), onde nunca há texto: mede o fundo, não o conteúdo
    const faixa = await p.screenshot({ clip: { x: 0, y: Math.max(0, yTela - 60), width: 12, height: 120 } });
    const salto = await p.evaluate(async (b64) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      const media = (y) => {
        let r = 0, g = 0, bl = 0;
        for (let x = 0; x < c.width; x++) { const i = (y * c.width + x) * 4; r += d[i]; g += d[i + 1]; bl += d[i + 2]; }
        return [r / c.width, g / c.width, bl / c.width];
      };
      let max = 0;
      let prev = media(0);
      for (let y = 1; y < c.height; y++) {
        const atual = media(y);
        const dif = (Math.abs(atual[0] - prev[0]) + Math.abs(atual[1] - prev[1]) + Math.abs(atual[2] - prev[2])) / 3;
        max = Math.max(max, dif);
        prev = atual;
      }
      return max;
    }, faixa.toString('base64'));
    const ok = salto < LIMITE;
    if (!ok) falhas++;
    console.log(`${nome.padEnd(8)} antes de #${f.id.padEnd(14)} maior salto ${salto.toFixed(1).padStart(5)} ${ok ? 'ok' : '<-- LINHA RETA'}`);
  }
  await p.close();
}
await b.close();
process.exitCode = falhas ? 1 : 0;
