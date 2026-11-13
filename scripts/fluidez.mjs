/*
 * Fluidez do hero no celular (CPU 4× mais lenta): quadros com o hero parado
 * (só a deriva e a flutuação) e durante a rolagem da saída, mais o tempo de
 * pintura no thread principal e o pico de memória das camadas.
 * Uso: npm run preview (outro terminal) && node scripts/fluidez.mjs [rodadas]
 */
import { chromium } from '@playwright/test';

const url = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:5191/';
const rodadas = +(process.argv.find((a) => /^\d+$/.test(a)) ?? 3);
const b = await chromium.launch();
const res = [];

const medirQuadros = (p, ms, rolar) =>
  p.evaluate(
    async ([ms, rolar]) => {
      const t = [];
      let ativo = true;
      const laco = (x) => { t.push(x); if (ativo) requestAnimationFrame(laco); };
      requestAnimationFrame(laco);
      if (rolar) {
        const alvo = document.querySelector('.hero').offsetHeight - innerHeight;
        const passos = Math.round(ms / 16);
        for (let i = 0; i <= passos; i++) { scrollTo(0, (alvo * i) / passos); await new Promise((r) => setTimeout(r, 16)); }
      } else await new Promise((r) => setTimeout(r, ms));
      ativo = false;
      const d = t.slice(1).map((x, i) => x - t[i]);
      const ord = [...d].sort((a, b) => a - b);
      return { quadros: d.length, lentos: d.filter((x) => x > 34).length, p95: ord[Math.floor(ord.length * 0.95)] };
    },
    [ms, rolar]
  );

for (let i = 0; i < rodadas; i++) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await p.goto(url, { waitUntil: 'load' });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await p.waitForTimeout(5500); // fim da entrada
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Performance.enable');
  const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  const parado = await medirQuadros(p, 4000, false);
  const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  const rolando = await medirQuadros(p, 3000, true);
  res.push({
    paradoLentos: parado.lentos, paradoQuadros: parado.quadros, paradoP95: parado.p95,
    rolandoLentos: rolando.lentos, rolandoQuadros: rolando.quadros, rolandoP95: rolando.p95,
    estiloLayoutMs: ((m1.RecalcStyleDuration - m0.RecalcStyleDuration) + (m1.LayoutDuration - m0.LayoutDuration)) * 1000,
    tarefaMs: (m1.TaskDuration - m0.TaskDuration) * 1000,
  });
  await ctx.close();
}
await b.close();
const med = (k) => { const v = res.map((r) => r[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
console.log(`Rodadas: ${rodadas} (mediana)`);
console.log(`Parado (4 s): ${med('paradoLentos')} de ${med('paradoQuadros')} quadros > 34 ms · p95 ${med('paradoP95').toFixed(1)} ms · thread principal ${Math.round(med('tarefaMs'))} ms`);
console.log(`Rolando a saída (3 s): ${med('rolandoLentos')} de ${med('rolandoQuadros')} quadros > 34 ms · p95 ${med('rolandoP95').toFixed(1)} ms`);
