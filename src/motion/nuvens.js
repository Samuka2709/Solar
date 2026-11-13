/*
 * Monta e posiciona as nuvens do hero a partir de src/data/nuvens.js.
 * Deriva em CSS (compositor): cada nuvem vai de logo antes da borda esquerda
 * até logo depois da direita, com atraso negativo para começar no lugar.
 */
import { tamanhos, camadas, desktop, celular, LIMITE_CELULAR } from '../data/nuvens.js';

const reduzido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let modoAtual = null;

/*
 * Celular: a ilha é o maior elemento da primeira tela (LCP) e, no 4G, as seis
 * nuvens (~160 KB) dividiam a banda com ela. Lá as nuvens só começam a baixar
 * depois que a ilha chega (ou após 1,2 s) e cada uma aparece num fade curto
 * quando termina de carregar, em vez de surgir de repente.
 */
function ilhaPronta(palco) {
  const img = palco.querySelector('.ilha__img');
  if (!img || (img.complete && img.naturalWidth)) return Promise.resolve();
  return Promise.race([
    new Promise((ok) => {
      img.addEventListener('load', ok, { once: true });
      img.addEventListener('error', ok, { once: true });
    }),
    new Promise((ok) => setTimeout(ok, 1200)),
  ]);
}

function adiar(palco) {
  const imgs = [...palco.querySelectorAll('.nuvem img[data-src]')];
  ilhaPronta(palco).then(() =>
    imgs.forEach((img) => {
      const pronto = () => img.classList.remove('chega');
      img.addEventListener('load', pronto, { once: true });
      img.addEventListener('error', pronto, { once: true });
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    })
  );
}

function montar(palco, modo) {
  const layout = modo === 'celular' ? celular : desktop;
  const depois = modo === 'celular';
  for (const [nome, lista] of Object.entries(layout)) {
    const alvo = palco.querySelector(`[data-nuvens="${nome}"]`);
    if (!alvo) continue;
    const longe = nome === 'muro';
    alvo.innerHTML = lista
      .map((c, i) => {
        const [w, h] = tamanhos[c.n];
        return `<div class="nuvem${c.e ? ' nuvem--e' : ''}" data-i="${i}"><img ${depois ? 'class="chega" data-src' : 'src'}="/img/nuvem-${c.n}.webp" width="${w}" height="${h}" alt="" decoding="async"${longe ? ' loading="lazy"' : ''}></div>`;
      })
      .join('');
  }
  if (depois) adiar(palco);
}

function posicionar(palco, modo) {
  const L = palco.clientWidth;
  const A = palco.clientHeight;
  const u = (modo === 'celular' ? Math.max(L, 0.62 * A) : Math.min(L, 1.9 * A)) / 100;
  const layout = modo === 'celular' ? celular : desktop;
  const parado = reduzido();

  for (const [nome, lista] of Object.entries(layout)) {
    const cfg = camadas[nome];
    const alvo = palco.querySelector(`[data-nuvens="${nome}"]`);
    if (!alvo) continue;
    const els = alvo.children;
    lista.forEach((c, i) => {
      const el = els[i];
      if (!el) return;
      const [nw, nh] = tamanhos[c.n];
      const wpx = c.w * u;
      const hpx = (wpx * nh) / nw;
      const inicio = -wpx - 90;
      const percurso = L + wpx + 180;
      const duracao = percurso / (cfg.velocidade * u);
      let fase = (c.x * L - inicio) / percurso;
      fase = ((fase % 1) + 1) % 1;

      const s = el.style;
      s.width = `${wpx.toFixed(1)}px`;
      s.top = `${(c.cy * A - hpx / 2).toFixed(1)}px`;
      s.opacity = c.a;
      s.setProperty('--de', `${inicio.toFixed(1)}px`);
      s.setProperty('--ate', `${(inicio + percurso).toFixed(1)}px`);
      s.setProperty('--x0', `${(c.x * L).toFixed(1)}px`);
      if (!parado) {
        s.animationDuration = `${duracao.toFixed(2)}s`;
        s.animationDelay = `${(-fase * duracao).toFixed(2)}s`;
      }
      const blur = cfg.desfoque ? `blur(${((cfg.desfoque * u) / 14).toFixed(2)}px)` : '';
      const filtro = [blur, cfg.filtro].filter(Boolean).join(' ');
      el.firstElementChild.style.filter = filtro || '';
    });
  }
}

export function iniciarNuvens(palco) {
  const modo = () => (innerWidth <= LIMITE_CELULAR ? 'celular' : 'desktop');
  modoAtual = modo();
  montar(palco, modoAtual);
  posicionar(palco, modoAtual);

  let largura = innerWidth;
  let espera;
  addEventListener('resize', () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      // No celular a barra de endereço muda a altura ao rolar: só reposiciona
      // quando a largura muda ou a altura muda muito.
      const m = modo();
      if (m !== modoAtual) {
        modoAtual = m;
        montar(palco, m);
      } else if (innerWidth === largura && m === 'celular') {
        return;
      }
      largura = innerWidth;
      posicionar(palco, m);
    }, 160);
  });

  return [...palco.querySelectorAll('.nuvem img')];
}
