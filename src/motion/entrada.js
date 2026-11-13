/*
 * Entrada do hero em camadas, com a Web Animations API (nativa do navegador).
 *
 * Por que não GSAP: o GSAP escreve transform/opacity pelo thread principal a cada
 * quadro, e no celular isso fazia o navegador refazer os pixels da ilha, das
 * nuvens e do céu em todo quadro (≈1,4 s de rasterização nos primeiros 4 s).
 * Animações nativas de transform e opacity rodam no compositor, na GPU: a ilha
 * sobe lisa mesmo com o thread principal ocupado carregando a página.
 *
 * O estado inicial vem do CSS (.js-entrada); cada animação usa fill: 'backwards'
 * para segurar esse estado durante o atraso, e ao terminar o elemento volta ao
 * CSS normal (estado final). Os botões ficam clicáveis desde o primeiro quadro.
 */
import { contarHud } from './hud.js';

// equivalentes das curvas usadas antes
const EXPO_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const POWER3_OUT = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
const POWER2_IN_OUT = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';
const POWER2_OUT = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

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
  const q = (s) => palco.querySelector(s);
  const qa = (s) => [...palco.querySelectorAll(s)];

  // Espera ilha, nuvens visíveis e fontes (no máximo 3 s)
  const espera = Promise.all([
    carregou(q('.ilha__img')),
    ...imagensNuvens.filter((i) => i.loading !== 'lazy').map(carregou),
    document.fonts?.ready ?? Promise.resolve(),
  ]);
  await Promise.race([espera, new Promise((ok) => setTimeout(ok, 3000))]);

  const A = palco.clientHeight;
  const animacoes = [];
  const anima = (el, de, { inicio, duracao, curva = EXPO_OUT }) => {
    if (!el) return;
    animacoes.push(
      el.animate([de, { opacity: 1, transform: 'none' }], {
        duration: duracao * 1000,
        delay: inicio * 1000,
        easing: curva,
        fill: 'backwards',
      })
    );
  };
  const sobe = (y, opacidade = 0) => ({ opacity: opacidade, transform: `translate3d(0, ${y}px, 0)` });

  // tempos em segundos, os mesmos da versão anterior (CLAUDE.md)
  anima(q('.camada--ceu .camada__in'), { opacity: 0, transform: 'none' }, { inicio: 0, duracao: 1.4, curva: POWER2_IN_OUT });
  anima(q('.camada--longe .camada__in'), sobe(40), { inicio: 0.3, duracao: 2.2 });
  anima(q('.camada--horizonte .camada__in'), sobe(70), { inicio: 0.45, duracao: 2.4 });
  anima(
    q('.camada--ilha .camada__in'),
    { opacity: 0.3, transform: `translate3d(0, ${(0.2 * A).toFixed(1)}px, 0) scale(0.94)` },
    { inicio: 0.6, duracao: 2.8, curva: POWER3_OUT }
  );
  anima(q('.camada--frente .camada__in'), sobe(130), { inicio: 0.8, duracao: 2.4 });
  anima(q('.sombra__in'), { opacity: 0, transform: 'none' }, { inicio: 0.8, duracao: 1.6, curva: POWER2_OUT });
  qa('.nome__letra').forEach((el, i) =>
    anima(el, { opacity: 1, transform: 'translateY(115%)' }, { inicio: 1.15 + i * 0.065, duracao: 1.4 })
  );
  [document.querySelector('.nav__in'), ...qa('.hud__in')].forEach((el) =>
    anima(el, { opacity: 0, transform: 'none' }, { inicio: 1.3, duracao: 1.2 })
  );
  qa('.linha__in').forEach((el, i) =>
    anima(el, { opacity: 1, transform: 'translateY(115%)' }, { inicio: 1.4 + i * 0.09, duracao: 1.2 })
  );
  anima(q('.nome__sol'), { opacity: 0, transform: 'scale(0) rotate(-140deg)' }, { inicio: 1.55, duracao: 1.6 });
  anima(q('.hero__acoes'), sobe(14), { inicio: 1.7, duracao: 1.1 });
  anima(q('.dica'), { opacity: 0, transform: 'none' }, { inicio: 2.3, duracao: 1.2 });

  // as animações já seguram o estado inicial: agora o CSS de espera pode sair
  palco.classList.add('entrando');
  raiz.classList.remove('js-entrada');

  contarHud(palco, 1.3);
  Promise.all(animacoes.map((a) => a.finished)).then(() => palco.classList.remove('entrando'), () => {});
  return animacoes;
}
