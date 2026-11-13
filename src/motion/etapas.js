/* Fio de progresso da régua de 45 dias, ligado à posição do scroll (sem tempo próprio). */
export function iniciarEtapas(secao) {
  const regua = secao.querySelector('[data-regua]');
  const fio = secao.querySelector('[data-regua-fio]');
  if (!regua || !fio) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const vertical = matchMedia('(max-width: 900px)');
  let agendado = false;
  let ultimo = -1;

  const atualizar = () => {
    agendado = false;
    const r = regua.getBoundingClientRect();
    const vh = innerHeight;
    // começa quando a régua entra a 85% da tela e completa quando o fim dela chega a 45%
    const inicio = vh * 0.85;
    const fim = vh * 0.45;
    const t = (inicio - r.top) / (inicio - fim + r.height);
    const v = Math.min(Math.max(t, 0), 1);
    const k = Math.round(v * 1000);
    if (k === ultimo) return;
    ultimo = k;
    fio.style.transform = vertical.matches ? `scaleY(${v.toFixed(3)})` : `scaleX(${v.toFixed(3)})`;
  };

  const agendar = () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(atualizar);
  };

  let ligado = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !ligado) {
      addEventListener('scroll', agendar, { passive: true });
      ligado = true;
    } else if (!e.isIntersecting && ligado) {
      removeEventListener('scroll', agendar);
      ligado = false;
    }
    agendar();
  }).observe(regua);
  vertical.addEventListener('change', () => {
    ultimo = -1;
    agendar();
  });
  agendar();
}
