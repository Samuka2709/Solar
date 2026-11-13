import { empresa } from '../data/empresa.js';
import { sistema } from '../data/sistema.js';
import { formatarNumero } from '../lib/formato.js';
import { asterisco, botao } from './comum.js';

const hora = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

const linhas = [
  '10 painéis pagam a conta de luz',
  `de uma casa em ${empresa.cidade}. Projeto,`,
  `instalação e homologação em ${empresa.prazoDias} dias.`,
];

/* Serra distante: polígono próprio, a base some pela máscara. */
const serra = `<svg class="serra" viewBox="0 0 1600 220" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path fill="#9cb0c9" d="M0 150 L60 128 L118 136 L190 104 L248 116 L310 92 L372 110 L430 98 L500 120 L566 86 L640 102 L700 80 L760 96 L842 70 L910 92 L980 84 L1040 104 L1110 78 L1180 96 L1250 88 L1316 108 L1390 90 L1450 112 L1520 100 L1600 118 L1600 220 L0 220 Z"/></svg>`;

const camada = (nome, miolo) =>
  `<div class="camada camada--${nome}" data-camada="${nome}"><div class="camada__in">${miolo}</div></div>`;

export function render() {
  const h = sistema.hud;
  const nome = [...empresa.nome].map((c) => `<span class="nome__letra">${c}</span>`).join('');
  return `<section class="hero" id="topo" data-tema="ceu" aria-labelledby="hero-nome">
  <div class="palco" data-palco>
    ${camada('ceu', `<div class="ceu"></div>${serra}`)}
    ${camada('longe', `<div class="nuvens" data-nuvens="longe"></div>`)}
    ${camada('horizonte', `<div class="nuvens" data-nuvens="horizonte"></div><div class="nevoa nevoa--horizonte"></div>`)}
    ${camada(
      // celular de tela 3x: o sizes pede 66vw para baixar a ilha-800 (147 KB) em vez da de 1446 px (517 KB); na tela cheia ela continua nítida
      'ilha',
      `<div class="ilha">
        <div class="ilha__nevoa"></div>
        <div class="ilha__flutua">
          <img class="ilha__img" src="/img/ilha.webp" width="1446" height="994" fetchpriority="high" decoding="async"
            srcset="/img/ilha-800.webp 800w, /img/ilha-1100.webp 1100w, /img/ilha.webp 1446w"
            sizes="(max-width: 760px) and (min-resolution: 2.5dppx) 66vw, (max-width: 760px) 98vw, min(62vw, 96svh)"
            alt="Casa térrea com dez painéis solares no telhado, sobre um pedaço de terra vermelha flutuando no céu">
          <div class="ilha__luz" aria-hidden="true"></div>
        </div>
      </div>`
    )}
    ${camada('frente', `<div class="nuvens" data-nuvens="frente"></div><div class="nevoa nevoa--frente"></div>`)}
    <div class="sombra" aria-hidden="true"><div class="sombra__in"><div class="sombra__tom" data-sombra></div></div></div>
    <div class="camada camada--muro" data-camada="muro"><div class="camada__in"><div class="nuvens" data-nuvens="muro"></div><div class="nevoa nevoa--muro"></div></div></div>
    <div class="veu" data-veu aria-hidden="true"></div>

    <div class="hud" data-hud aria-hidden="true">
      <div class="hud__in hud__esq">
        <span class="hud__linha"><span data-hud-hora>${hora(h.minutos)}</span> · ${h.cidade} · ${h.latitude}</span>
        <span class="hud__linha">Gerando agora <span data-hud-agora>${formatarNumero(h.agoraKw, 1)}</span> kW</span>
      </div>
      <div class="hud__in hud__dir">
        <span class="hud__linha">Hoje: <span data-hud-hoje>${formatarNumero(h.hojeKwh, 1)}</span> de ${h.diaKwh} kWh</span>
      </div>
    </div>

    <div class="hero__texto" data-hero-texto>
      <h1 class="nome" id="hero-nome" style="--letras: ${[...empresa.nome].length}"><span class="so-leitor">${empresa.nome}</span><span class="nome__linha" aria-hidden="true">${nome}<span class="nome__sol">${asterisco('asterisco nome__asterisco')}</span></span></h1>
      <div class="hero__lado">
        <p class="hero__frase">${linhas.map((l) => `<span class="linha"><span class="linha__in">${l} </span></span>`).join('')}</p>
        <div class="hero__acoes">
          ${botao('Simular minha conta', '#simulacao')}
          <a class="link-texto hero__obras" href="#obras">Ver obras</a>
        </div>
      </div>
    </div>
    <p class="dica mono" aria-hidden="true">role para ver o sistema</p>
  </div>
</section>`;
}
