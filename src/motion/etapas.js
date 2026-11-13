/*
 * Régua de 45 dias: o fio de progresso acompanha o scroll (sem tempo próprio)
 * e cada etapa acende quando o fio chega na marca dela.
 * Com movimento reduzido, a régua aparece inteira e todas as etapas acesas.
 */
export function iniciarEtapas(secao) {
  const regua = secao.querySelector('[data-regua]');
  const fio = secao.querySelector('[data-regua-fio]');
  if (!regua || !fio) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const etapas = [...regua.querySelectorAll('.regua__etapa')];
  const vertical = matchMedia('(max-width: 900px)');
  let agendado = false;
  let ultimo = -1;
  let limites = [];

  // posição de cada marca ao longo da régua, de 0 a 1
  const medir = () => {
    limites = etapas.map((li) =>
      vertical.matches ? li.offsetTop / regua.offsetHeight : li.offsetLeft / regua.offsetWidth
    );
  };

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
    etapas.forEach((li, i) => li.classList.toggle('acesa', v > 0 && v >= limites[i]));
  };

  const agendar = () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(atualizar);
  };

  medir();
  regua.classList.add('regua--viva');

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
  const refazer = () => {
    medir();
    ultimo = -1;
    agendar();
  };
  vertical.addEventListener('change', refazer);
  addEventListener('resize', refazer);
  agendar();
}
