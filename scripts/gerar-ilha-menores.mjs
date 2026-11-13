/* Gera public/img/ilha-800.webp e ilha-1100.webp a partir de ilha.webp (alfa preservado), via canvas do Chromium. */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
const fonte = 'data:image/webp;base64,' + readFileSync('public/img/ilha.webp').toString('base64');
const b = await chromium.launch();
const p = await b.newPage();
for (const w of [800, 1100]) {
  const dados = await p.evaluate(async ([src, w]) => {
    const img = new Image(); img.src = src; await img.decode();
    const h = Math.round(w * img.naturalHeight / img.naturalWidth);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, h);
    return c.toDataURL('image/webp', 0.84);
  }, [fonte, w]);
  const buf = Buffer.from(dados.split(',')[1], 'base64');
  writeFileSync(`public/img/ilha-${w}.webp`, buf);
  console.log(`ilha-${w}.webp`, Math.round(buf.length / 1024) + ' KB');
}
await b.close();
