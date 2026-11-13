/*
 * Entrada do hero em camadas (GSAP), nas caixas de dentro.
 * Os botões ficam clicáveis desde o primeiro quadro: só opacidade e transform.
 */
import { gsap } from 'gsap';
import { contarHud } from './hud.js';

function carregou(img) {
  if (!img) return Promise.resolve();
  if (img.complete && img.naturalWidth) return img.decode?.().catch(() => {}) ?? Promise.resolve();
  return new Promise((ok) => {
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', ok, { once: true });
  });
}

export async function entrada(hero, imagensNuvens) {
  window.__entradaOk = true;
  const raiz = document.documentElement;
  const palco = hero.querySelector('[data-palco]');
  const A = palco.clientHeight;
  const q = (s) => palco.querySelector(s);
  const qa = (s) => [...palco.querySelectorAll(s)];

  const ceu = q('.camada--ceu .camada__in');
  const longe = q('.camada--longe .camada__in');
  const horizonte = q('.camada--horizonte .camada__in');
  const ilha = q('.camada--ilha .camada__in');
  const frente = q('.camada--frente .camada__in');
  const sombra = q('.sombra__in');
  const letras = qa('.nome__letra');
  const sol = q('.nome__sol');
  const linhas = qa('.linha__in');
  const acoes = q('.hero__acoes');
  const hudIn = qa('.hud__in');
  const dica = q('.dica');
  const nav = document.querySelector('.nav__in');

  // Estado inicial antes do primeiro quadro
  gsap.set(ceu, { opacity: 0 });
  gsap.set(longe, { opacity: 0, y: 40 });
  gsap.set(horizonte, { opacity: 0, y: 70 });
  gsap.set(ilha, { opacity: 0.3, y: 0.2 * A, scale: 0.94, transformOrigin: '51.5% 40%' });
  gsap.set(frente, { opacity: 0, y: 130 });
  gsap.set(sombra, { opacity: 0 });
  // y: 0 zera o translateY(115%) do CSS inicial; o GSAP anima só o yPercent
  gsap.set([...letras, ...linhas], { y: 0, yPercent: 115 });
  gsap.set(sol, { opacity: 0, scale: 0, rotation: -140 });
  gsap.set([...hudIn, nav, dica].filter(Boolean), { opacity: 0 });
  gsap.set(acoes, { opacity: 0, y: 14 });

  // Espera ilha, nuvens visíveis e fontes (no máximo 3 s)
  const ilhaImg = q('.ilha__img');
  const espera = Promise.all([
    carregou(ilhaImg),
    ...imagensNuvens.filter((i) => i.loading !== 'lazy').map(carregou),
    document.fonts?.ready ?? Promise.resolve(),
  ]);
  await Promise.race([espera, new Promise((ok) => setTimeout(ok, 3000))]);

  raiz.classList.remove('js-entrada');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to(ceu, { opacity: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
    .to(longe, { opacity: 1, y: 0, duration: 2.2 }, 0.3)
    .to(horizonte, { opacity: 1, y: 0, duration: 2.4 }, 0.45)
    .to(ilha, { opacity: 1, y: 0, scale: 1, duration: 2.8, ease: 'power3.out' }, 0.6)
    .to(frente, { opacity: 1, y: 0, duration: 2.4 }, 0.8)
    .to(sombra, { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0.8)
    .to(letras, { yPercent: 0, duration: 1.4, stagger: 0.065 }, 1.15)
    .to([nav, ...hudIn].filter(Boolean), { opacity: 1, duration: 1.2 }, 1.3)
    .to(linhas, { yPercent: 0, duration: 1.2, stagger: 0.09 }, 1.4)
    .to(sol, { opacity: 1, scale: 1, rotation: 0, duration: 1.6 }, 1.55)
    .to(acoes, { opacity: 1, y: 0, duration: 1.1 }, 1.7)
    .to(dica, { opacity: 1, duration: 1.2 }, 2.3);

  contarHud(gsap, palco, 1.3);
  return tl;
}
