/* HUD do hero: contagem na entrada e relógio vivo depois. */
import { sistema } from '../data/sistema.js';
import { formatarNumero } from '../lib/formato.js';

const h = sistema.hud;
const hora = (min) => {
  const m = Math.floor(min) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

function alvos(raiz) {
  return {
    hora: raiz.querySelector('[data-hud-hora]'),
    agora: raiz.querySelector('[data-hud-agora]'),
    hoje: raiz.querySelector('[data-hud-hoje]'),
  };
}

function escrever(el, v) {
  el.hora.textContent = hora(v.min);
  el.agora.textContent = formatarNumero(v.kw, 1);
  el.hoje.textContent = formatarNumero(v.kwh, 1);
}

/** Contagem de 05:40 a 10:40, 0 a 4,1 kW e 0 a 9,8 kWh. Devolve o tween. */
export function contarHud(gsap, raiz, atraso = 0) {
  const el = alvos(raiz);
  const v = { min: h.inicioMinutos, kw: 0, kwh: 0 };
  escrever(el, v);
  return gsap.to(v, {
    min: h.minutos,
    kw: h.agoraKw,
    kwh: h.hojeKwh,
    duration: 1.9,
    delay: atraso,
    ease: 'power2.out',
    onUpdate: () => escrever(el, v),
    onComplete: () => hudVivo(raiz),
  });
}

/** Relógio em tempo real a partir de 10:40; geração oscila entre 4,0 e 4,2 kW; o total soma. */
export function hudVivo(raiz) {
  const el = alvos(raiz);
  const inicio = performance.now();
  let kwh = h.hojeKwh;
  let kw = h.agoraKw;
  let alvoKw = h.agoraKw;
  let anterior = inicio;

  const passo = () => {
    const agora = performance.now();
    const dtH = (agora - anterior) / 3_600_000;
    anterior = agora;
    if (Math.random() < 0.25) alvoKw = 4.0 + Math.random() * 0.2;
    kw += (alvoKw - kw) * 0.35;
    kw = Math.min(4.2, Math.max(4.0, kw));
    kwh += kw * dtH;
    escrever(el, { min: h.minutos + (agora - inicio) / 60_000, kw, kwh });
  };
  passo();
  return setInterval(passo, 1000);
}
