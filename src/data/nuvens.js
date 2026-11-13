/*
 * Nuvens do hero (números do CLAUDE.md).
 * n = arquivo nuvem-N.webp · x = borda esquerda inicial (fração de L)
 * cy = centro vertical (fração de A) · w = largura em u · e = espelhada · a = opacidade
 */
export const tamanhos = {
  1: [1110, 240],
  2: [350, 211],
  3: [705, 369],
  4: [434, 255],
  6: [1208, 246],
  7: [279, 210],
};

export const camadas = {
  longe: { velocidade: 0.32, desfoque: 0.8, filtro: 'saturate(.78) brightness(1.03) contrast(.86)' },
  horizonte: { velocidade: 0.55, desfoque: 0.3, filtro: 'saturate(.9) contrast(.92)' },
  frente: { velocidade: 0.95, desfoque: 0, filtro: '' },
  muro: { velocidade: 0.5, desfoque: 2.2, filtro: 'brightness(1.07) saturate(.85)' },
};

const n = (n, x, cy, w, extra = {}) => ({ n, x, cy, w, e: false, a: 1, ...extra });

export const desktop = {
  longe: [
    n(2, 0.03, 0.36, 11, { e: true, a: 0.8 }),
    n(7, 0.77, 0.22, 9, { a: 0.75 }),
    n(4, 0.89, 0.4, 12, { a: 0.8 }),
    n(1, 0.6, 0.33, 18, { a: 0.55 }),
    n(7, 0.16, 0.19, 6, { e: true, a: 0.5 }),
  ],
  horizonte: [
    n(3, -0.05, 0.53, 33),
    n(6, 0.16, 0.67, 74),
    n(1, 0.6, 0.61, 52, { e: true }),
    n(4, 0.86, 0.53, 19, { e: true }),
  ],
  frente: [
    n(6, 0.3, 0.83, 72, { e: true }),
    n(1, -0.2, 0.88, 80),
    n(3, 0.72, 0.79, 36, { e: true }),
    n(7, 0.06, 0.74, 13),
    n(2, 0.5, 0.97, 30),
  ],
  muro: [
    n(3, -0.05, 0.17, 70),
    n(4, 0.6, 0.15, 52, { e: true }),
    n(6, -0.3, 0.42, 160, { e: true }),
    n(1, 0.36, 0.47, 140),
    n(3, 0.42, 0.66, 80, { e: true }),
    n(6, -0.2, 0.78, 170),
  ],
};

export const celular = {
  longe: [
    n(2, -0.12, 0.22, 34, { e: true, a: 0.85 }),
    n(7, 0.66, 0.17, 22, { a: 0.7 }),
    n(4, 0.78, 0.44, 26, { a: 0.8 }),
  ],
  horizonte: [
    n(3, -0.36, 0.47, 78),
    n(6, 0.04, 0.56, 150),
    n(1, 0.52, 0.5, 110, { e: true }),
  ],
  frente: [
    n(6, -0.3, 0.62, 160, { e: true }),
    n(3, 0.56, 0.6, 82, { e: true }),
    n(1, 0.2, 0.74, 170),
    n(4, -0.2, 0.86, 80),
    n(7, 0.7, 0.94, 50),
  ],
  muro: [
    n(3, -0.4, 0.14, 150),
    n(4, 0.45, 0.12, 110, { e: true }),
    n(6, -1.0, 0.38, 320, { e: true }),
    n(1, -0.3, 0.44, 280),
    n(3, 0.1, 0.62, 170, { e: true }),
    n(6, -0.6, 0.76, 330),
  ],
};

export const LIMITE_CELULAR = 760;
