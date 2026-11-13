/*
 * O que vai no telhado:
 * 1. o corte se desenha em linha quando entra na tela, e as marcas aparecem depois;
 * 2. passar o mouse (ou tocar) num item da lista destaca a marca dele no desenho,
 *    e vice-versa, para ligar o nome à peça.
 * Sem JS ou com movimento reduzido, o desenho já aparece pronto.
 */
export function iniciarTelhado(secao) {
  const corte = secao.querySelector('.corte');
  if (!corte) return;

  /* ---------- Desenho em linha ---------- */
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const jaVisivel = corte.getBoundingClientRect().top < innerHeight * 0.85;
  if (!reduzido && !jaVisivel) {
    // só traços contínuos: os tracejados (cabos, chão) aparecem por opacidade
    const tracos = [...corte.querySelectorAll('g[fill="none"] :is(path, rect, circle)')].filter(
      (el) => !el.closest('[stroke-dasharray]') && !el.hasAttribute('stroke-dasharray')
    );
    tracos.forEach((el, i) => {
      el.setAttribute('pathLength', '1');
      el.classList.add('tracar');
      el.style.transitionDelay = `${Math.min(i * 45, 900)}ms`;
    });
    corte.querySelectorAll('[stroke-dasharray]').forEach((el) => el.classList.add('esmaecer'));
    corte.querySelectorAll('.corte__marca').forEach((m, i) => m.style.setProperty('--i', i));
    corte.classList.add('corte--pronto');

    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        corte.classList.add('corte--visto');
        // terminado o desenho, volta ao estado parado (sem os atrasos da entrada)
        setTimeout(() => corte.classList.remove('corte--pronto', 'corte--visto'), 2600);
      },
      { threshold: 0.35 }
    );
    obs.observe(corte);
  }

  /* ---------- Lista ↔ desenho ---------- */
  const pares = (n) => secao.querySelectorAll(`[data-peca="${n}"]`);
  const ligar = (n, sim) => pares(n).forEach((el) => el.classList.toggle('ativa', sim));
  secao.querySelectorAll('[data-peca]').forEach((el) => {
    const n = el.dataset.peca;
    el.addEventListener('pointerenter', () => ligar(n, true));
    el.addEventListener('pointerleave', () => ligar(n, false));
  });
}
