import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/ibm-plex-mono/400.css';
import './styles/tokens.css';
import './styles/base.css';
import './sections/nav.css';
import './sections/hero.css';
import './sections/caso.css';
import './sections/etapas.css';
import './sections/simulacao.css';
import './sections/obras.css';
import './sections/telhado.css';
import './sections/fim.css';

import { iniciarGrao } from './motion/grao.js';
import { iniciarNav } from './motion/nav.js';
import { iniciarNuvens } from './motion/nuvens.js';
import { iniciarPalco } from './motion/palco.js';
import { hudVivo } from './motion/hud.js';
import { iniciarFixo } from './sections/whatsapp-fixo.js';

const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = document.querySelector('.hero');

iniciarGrao();

if (hero) {
  const palco = hero.querySelector('[data-palco]');
  const imagens = iniciarNuvens(palco);
  if (reduzido) {
    // HUD já com os valores; o relógio anda
    hudVivo(palco);
  } else {
    iniciarPalco(hero);
    import('./motion/entrada.js').then(({ entrada }) => entrada(hero, imagens));
  }
}

iniciarNav();
iniciarFixo();

/* JS das seções carregado quando a seção se aproxima */
const preguicosos = {
  'como-funciona': () => import('./motion/etapas.js').then((m) => m.iniciarEtapas),
  simulacao: () => import('./sections/simulacao.js').then((m) => m.iniciarSimulacao),
  obras: () => import('./sections/obras.js').then((m) => m.iniciarObras),
  depoimentos: () => import('./sections/depoimentos.js').then((m) => m.iniciarDepoimentos),
  duvidas: () => import('./sections/duvidas.js').then((m) => m.iniciarDuvidas),
};

const carregar = (secao) => {
  const fn = preguicosos[secao.id];
  if (!fn || secao.dataset.iniciada) return;
  secao.dataset.iniciada = '1';
  fn().then((iniciar) => iniciar(secao));
};

const obs = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (e.isIntersecting) {
        carregar(e.target);
        obs.unobserve(e.target);
      }
    }
  },
  { rootMargin: '900px 0px' }
);

for (const id of Object.keys(preguicosos)) {
  const s = document.getElementById(id);
  if (s) obs.observe(s);
}

// Quem chega por âncora ou usa o teclado não espera o observer
addEventListener('hashchange', () => {
  const s = document.getElementById(location.hash.slice(1));
  if (s) carregar(s);
});
// acordeões fechados por padrão precisam do JS logo; se o usuário buscar com Ctrl+F, abre tudo
addEventListener('beforeprint', () => document.querySelectorAll('.acordeao__corpo').forEach((c) => c.classList.add('aberto')));
