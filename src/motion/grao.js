/* Grão de filme: um ladrilho de ruído de 180 px, o único do site. */
export function iniciarGrao() {
  const lado = 180;
  const c = document.createElement('canvas');
  c.width = c.height = lado;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  const img = ctx.createImageData(lado, lado);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 255;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const el = document.createElement('div');
  el.className = 'grao';
  el.setAttribute('aria-hidden', 'true');
  el.style.backgroundImage = `url(${c.toDataURL('image/png')})`;
  document.body.appendChild(el);
}
