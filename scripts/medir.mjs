/*
 * Medição de desempenho repetível (celular, 4G lento, CPU 4×).
 * Uso: npm run build && npm run preview (outro terminal) && node scripts/medir.mjs [rodadas]
 * Mede LCP, CLS, FCP, tarefas longas, bytes da primeira carga e da página inteira
 * rolada, e quadros perdidos durante a saída do hero.
 */
import { chromium } from '@playwright/test';

const url = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:5191/';
const rodadas = +(process.argv.find((a) => /^\d+$/.test(a)) ?? 3);
const res = [];
const b = await chromium.launch();

for (let i = 0; i < rodadas; i++) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.addInitScript(() => {
    window.__m = { cls: 0, lcp: 0, longas: 0, longasMs: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { window.__m.lcp = l.getEntries().at(-1).startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__m.longas++; window.__m.longasMs += e.duration - 50; (window.__m.lista ??= []).push(Math.round(e.startTime) + '+' + Math.round(e.duration)); } }).observe({ type: 'longtask', buffered: true });
  });
  await p.goto(url, { waitUntil: 'load' });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await p.waitForTimeout(6000);
  const inicial = await p.evaluate(() => ({
    ...window.__m,
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0,
    kb: performance.getEntriesByType('resource').reduce((s, r) => s + r.transferSize, 0) / 1024,
  }));
  // quadros durante a saída do hero (rolagem contínua)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const quadros = await p.evaluate(async () => {
    const tempos = [];
    let ativo = true;
    const laco = (t) => { tempos.push(t); if (ativo) requestAnimationFrame(laco); };
    requestAnimationFrame(laco);
    const alvo = document.querySelector('.hero').offsetHeight;
    for (let y = 0; y <= alvo; y += 24) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 16)); }
    await new Promise((r) => setTimeout(r, 400));
    ativo = false;
    const d = tempos.slice(1).map((t, i) => t - tempos[i]);
    return { quadros: d.length, perdidos: d.filter((x) => x > 34).length };
  });
  // rola o resto da página para carregar tudo
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
  await p.waitForTimeout(12000);
  const total = await p.evaluate(() => performance.getEntriesByType('resource').reduce((s, r) => s + r.transferSize, 0) / 1024);
  res.push({ ...inicial, ...quadros, kbTotal: total });
  if (process.env.DET) console.log('longas', inicial.lista);
  await ctx.close();
}
await b.close();

const med = (k) => { const v = res.map((r) => r[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
const faixa = (k) => `${Math.round(Math.min(...res.map((r) => r[k])))}–${Math.round(Math.max(...res.map((r) => r[k])))}`;
console.log(`Rodadas: ${rodadas} (mediana [faixa])`);
console.log(`LCP ${Math.round(med('lcp'))} ms [${faixa('lcp')}] · FCP ${Math.round(med('fcp'))} ms · CLS ${med('cls').toFixed(4)}`);
console.log(`Tarefas longas ${med('longas')} (${Math.round(med('longasMs'))} ms bloqueando)`);
console.log(`Primeira carga ${Math.round(med('kb'))} KB · página inteira ${Math.round(med('kbTotal'))} KB`);
console.log(`Saída do hero: ${med('perdidos')} de ${med('quadros')} quadros acima de 34 ms`);
