/*
 * Cursor + saída no scroll, num único requestAnimationFrame.
 * Escreve style.transform direto nas caixas de fora, só quando algo muda.
 */
const CAMADAS = {
  ceu: { prof: 0.05, saida: 0.06, escala: 0 },
  longe: { prof: 0.18, saida: 0.16, escala: 0 },
  horizonte: { prof: 0.34, saida: 0.32, escala: 0 },
  ilha: { prof: 0.58, saida: 0.6, escala: -0.14 },
  frente: { prof: 1, saida: 1.25, escala: 0.38 },
};

const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

export const estadoPalco = { p: 0 };

export function iniciarPalco(hero) {
  const palco = hero.querySelector('[data-palco]');
  const camadas = Object.entries(CAMADAS).map(([nome, cfg]) => ({
    el: palco.querySelector(`[data-camada="${nome}"]`),
    nome,
    ...cfg,
  }));
  const muro = palco.querySelector('[data-camada="muro"]');
  const ilha = palco.querySelector('[data-camada="ilha"]');
  const texto = palco.querySelector('[data-hero-texto]');
  const hud = palco.querySelector('[data-hud]');
  const sombra = palco.querySelector('[data-sombra]');
  const veu = palco.querySelector('[data-veu]');
  const dica = palco.querySelector('.dica');

  const ponteiroFino = matchMedia('(hover: hover) and (pointer: fine)').matches;

  let alvoX = 0;
  let alvoY = 0;
  let mx = 0;
  let my = 0;
  let p = 0;
  let A = palco.clientHeight;
  let alturaHero = hero.offsetHeight;
  let chave = '';
  let ativo = false;
  let ultimo = 0;
  let raf = 0;

  let celular = innerWidth <= 760;
  const medir = () => {
    A = palco.clientHeight;
    alturaHero = hero.offsetHeight;
    celular = innerWidth <= 760;
  };
  addEventListener('resize', medir);

  const alvoP = () => {
    const curso = alturaHero - innerHeight;
    if (curso <= 0) return 0;
    const topo = hero.getBoundingClientRect().top;
    return Math.min(Math.max(-topo / curso, 0), 1);
  };

  if (ponteiroFino) {
    addEventListener(
      'pointermove',
      (e) => {
        alvoX = (e.clientX / innerWidth) * 2 - 1;
        alvoY = (e.clientY / innerHeight) * 2 - 1;
        acordar();
      },
      { passive: true }
    );
  }

  const escrever = () => {
    for (const c of camadas) {
      const x = -mx * 26 * c.prof;
      const y = -my * 14 * c.prof - p * c.saida * A;
      const s = 1 + p * c.escala;
      c.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)${s !== 1 ? ` scale(${s.toFixed(4)})` : ''}`;
    }
    muro.style.transform = `translate3d(${(-mx * 26 * 1.3).toFixed(2)}px, ${((1.16 - 1.62 * p) * A).toFixed(2)}px, 0)`;
    // no celular a ilha fica no alto, longe do muro: some um pouco antes
    ilha.style.opacity = (1 - (celular ? smooth(0.2, 0.44, p) : smooth(0.28, 0.58, p))).toFixed(3);

    const tOp = 1 - smooth(0.02, 0.3, p);
    texto.style.transform = `translate3d(0, ${(-p * 0.62 * A).toFixed(2)}px, 0)`;
    texto.style.opacity = tOp.toFixed(3);
    texto.style.visibility = p > 0.32 ? 'hidden' : '';
    hud.style.opacity = (1 - smooth(0, 0.22, p)).toFixed(3);
    if (dica) dica.style.opacity = (1 - smooth(0, 0.08, p)).toFixed(3);
    sombra.style.opacity = tOp.toFixed(3);
    veu.style.opacity = smooth(0.5, 0.9, p).toFixed(3);
  };

  const quadro = (agora) => {
    const dt = Math.min(agora - (ultimo || agora), 64) || 16.67;
    ultimo = agora;
    const k = dt / 16.67;
    const alvo = alvoP();
    p += (alvo - p) * (1 - Math.pow(1 - 0.16, k));
    if (Math.abs(alvo - p) < 0.0004) p = alvo;
    mx += (alvoX - mx) * (1 - Math.pow(1 - 0.05, k));
    my += (alvoY - my) * (1 - Math.pow(1 - 0.05, k));
    estadoPalco.p = p;

    const nova = `${p.toFixed(4)}|${mx.toFixed(3)}|${my.toFixed(3)}|${A}`;
    if (nova !== chave) {
      chave = nova;
      escrever();
      raf = requestAnimationFrame(quadro);
    } else {
      // nada mudou: dorme até o próximo scroll, cursor ou resize
      raf = 0;
      ultimo = 0;
    }
  };

  function acordar() {
    if (!ativo || raf) return;
    raf = requestAnimationFrame(quadro);
  }

  addEventListener('scroll', acordar, { passive: true });
  addEventListener('resize', acordar);

  // Pausa tudo com o hero fora da tela ou a aba oculta
  const pausar = () => {
    const oculto = document.hidden || !visivel;
    palco.classList.toggle('pausado', oculto);
  };
  let visivel = true;
  new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting;
    ativo = visivel;
    pausar();
    if (visivel) acordar();
  }).observe(hero);
  document.addEventListener('visibilitychange', pausar);

  ativo = true;
  escrever();
  acordar();
}
