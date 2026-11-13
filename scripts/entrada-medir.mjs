/*
 * Fluidez da ENTRADA do hero no celular (CPU 4× mais lenta).
 * Mede o thread principal durante os 3,6 s da entrada: intervalos entre
 * quadros (requestAnimationFrame) e tarefas longas. Uma animação que roda no
 * thread principal (GSAP) trava exatamente nesses buracos; uma que roda no
 * compositor (CSS/Web Animations em transform e opacity) passa por cima deles.
 * Uso: npm run preview (outro terminal) && node scripts/entrada-medir.mjs [rodadas]
 */
import { chromium } from '@playwright/test';

const url = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:5191/';
const rodadas = +(process.argv.find((a) => /^\d+$/.test(a)) ?? 3);
const res = [];
const b = await chromium.launch();

for (let r = 0; r < rodadas; r++) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.addInitScript(() => {
    window.__e = { quadros: [], longas: [] };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__e.longas.push([e.startTime, e.duration]); }).observe({ type: 'longtask', buffered: true });
    const iniciar = () => {
      window.__e.t0 = performance.now();
      const laco = (t) => { window.__e.quadros.push(t); if (t - window.__e.t0 < 3600) requestAnimationFrame(laco); };
      requestAnimationFrame(laco);
    };
    // o <html> ainda não existe quando este script roda: verifica a cada 8 ms
    const vigia = setInterval(() => {
      const h = document.documentElement;
      if (h && h.classList.contains('js') && !h.classList.contains('js-entrada') && window.__e.t0 === undefined) { clearInterval(vigia); iniciar(); }
    }, 8);
  });
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(6000);
  res.push(
    await p.evaluate(() => {
      const { quadros, longas, t0 } = window.__e;
      const gaps = quadros.slice(1).map((t, i) => t - quadros[i]);
      const dentro = longas.filter(([s, d]) => s + d > t0 && s < t0 + 3600);
      return {
        fps: quadros.length / 3.6,
        buracos: gaps.filter((g) => g > 50).length,
        maiorBuraco: Math.max(...gaps),
        bloqueio: dentro.reduce((s, [, d]) => s + d, 0),
      };
    })
  );
  await ctx.close();
}
await b.close();
const med = (k) => { const v = res.map((x) => x[k]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
console.log(`Rodadas: ${rodadas} (mediana)`);
console.log(`Thread principal na entrada (3,6 s): ${med('fps').toFixed(0)} quadros/s · ${med('buracos')} buracos > 50 ms · maior ${Math.round(med('maiorBuraco'))} ms · ${Math.round(med('bloqueio'))} ms em tarefas longas`);
