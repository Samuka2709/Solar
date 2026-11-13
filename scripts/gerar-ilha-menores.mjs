/* Gera public/img/ilha-800.webp (qualidade 0,72) e ilha-1100.webp (0,84) a partir de ilha.webp, alfa preservado. Ajuste com Q800=/Q1100=. */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
const fonte = 'data:image/webp;base64,' + readFileSync('public/img/ilha.webp').toString('base64');
const b = await chromium.launch();
const p = await b.newPage();
for (const [w, q] of [[800, +(process.env.Q800 ?? 0.72)], [1100, +(process.env.Q1100 ?? 0.84)]]) {
  const dados = await p.evaluate(async ([src, w, q]) => {
    const img = new Image(); img.src = src; await img.decode();
    const h = Math.round(w * img.naturalHeight / img.naturalWidth);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, h);
    return c.toDataURL('image/webp', q);
  }, [fonte, w, q]);
  const buf = Buffer.from(dados.split(',')[1], 'base64');
  writeFileSync(`public/img/ilha-${w}.webp`, buf);
  console.log(`ilha-${w}.webp`, Math.round(buf.length / 1024) + ' KB');
}
await b.close();
