/*
 * Nav: some ao descer e volta ao subir (sempre visível no topo e com foco).
 * Sobre seções claras vira tinta cheia; sobre tinta e sobre o céu fica translúcida.
 */
import { estadoPalco } from './palco.js';

export function iniciarNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;
  const secoes = [...document.querySelectorAll('[data-tema]')];
  let ultimoY = scrollY;
  let agendado = false;

  const temaSobNav = () => {
    const y = nav.getBoundingClientRect().bottom - 8;
    for (const s of secoes) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) {
        const t = s.dataset.tema;
        if (t === 'ceu') return estadoPalco.p > 0.82 ? 'claro' : 'ceu';
        return t;
      }
    }
    return 'claro';
  };

  const atualizar = () => {
    agendado = false;
    const y = scrollY;
    const dif = y - ultimoY;
    if (y < 40) nav.classList.remove('nav--oculta');
    else if (dif > 4 && !nav.matches(':focus-within')) nav.classList.add('nav--oculta');
    else if (dif < -4) nav.classList.remove('nav--oculta');
    if (Math.abs(dif) > 4 || y < 40) ultimoY = y;
    nav.classList.toggle('nav--tinta', temaSobNav() === 'claro');
  };

  const agendar = () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(atualizar);
  };

  addEventListener('scroll', agendar, { passive: true });
  addEventListener('resize', agendar);
  nav.addEventListener('focusin', () => nav.classList.remove('nav--oculta'));
  // a saída do hero é suavizada: confere o tema mais algumas vezes depois do scroll
  let cauda;
  addEventListener(
    'scroll',
    () => {
      clearInterval(cauda);
      let n = 0;
      cauda = setInterval(() => {
        nav.classList.toggle('nav--tinta', temaSobNav() === 'claro');
        if (++n > 12) clearInterval(cauda);
      }, 120);
    },
    { passive: true }
  );
  atualizar();
}
