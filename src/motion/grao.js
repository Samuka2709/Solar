/*
 * Grão de filme: um ladrilho de ruído de 180 px, parado e sutil, o único do site.
 * Pontos claros e escuros já transparentes, desenhados normalmente: o efeito de
 * um soft-light leve sem obrigar o navegador a reler a tela inteira a cada quadro.
 */
export function iniciarGrao() {
  const lado = 180;
  const c = document.createElement('canvas');
  c.width = c.height = lado;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  const img = ctx.createImageData(lado, lado);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 2 - 1;
    d[i] = d[i + 1] = d[i + 2] = v > 0 ? 255 : 0;
    d[i + 3] = Math.round(Math.abs(v) * 0.035 * 255);
  }
  ctx.putImageData(img, 0, 0);
  const el = document.createElement('div');
  el.className = 'grao';
  el.setAttribute('aria-hidden', 'true');
  el.style.backgroundImage = `url(${c.toDataURL('image/png')})`;
  document.body.appendChild(el);
}
