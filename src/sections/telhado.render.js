import { equipamentos } from '../data/equipamentos.js';
import { empresa, preenchido } from '../data/empresa.js';
import { selo } from './comum.js';

const marca = (n, x, y) =>
  `<g class="corte__marca" transform="translate(${x} ${y})"><circle r="15"/><text y="5" text-anchor="middle">${n}</text></g>`;

/* Corte do telhado da casa do hero, desenhado em linha. */
const corte = `<svg class="corte" viewBox="0 0 640 430" role="img" aria-labelledby="corte-titulo">
  <title id="corte-titulo">Corte do telhado com os painéis, a estrutura de fixação, o inversor na parede e o celular com o monitoramento</title>
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <!-- paredes -->
    <path d="M92 232 V392 M508 232 V392"/>
    <path d="M70 392 H560" stroke-dasharray="2 7"/>
    <!-- forro e madeiramento -->
    <path d="M92 232 H508"/>
    <path d="M300 104 V232 M196 168 L232 232 M404 168 L368 232" stroke-width="1.1" opacity=".6"/>
    <!-- telhado: duas águas com telha de barro -->
    <path d="M44 252 L300 98 L556 252"/>
    <path d="M58 260 L300 114 L542 260" stroke-width="1.1" opacity=".55"/>
    <path d="M70 236 q8 -9 16 -10 q8 -9 16 -10 q8 -9 16 -10 q8 -9 16 -10 q8 -9 16 -10 q8 -9 16 -10 q8 -9 16 -10 q8 -9 16 -10 q8 -9 16 -10 q8 -9 16 -10" stroke-width="1" opacity=".5"/>
    <!-- estrutura: ganchos e trilho na água da direita -->
    <g transform="translate(300 98) rotate(31)">
      <path d="M48 0 v-10 h10 M118 0 v-10 h10 M188 0 v-10 h10" stroke-width="1.5"/>
      <path d="M34 -12 H230" stroke-width="2.4"/>
      <!-- módulos -->
      <rect x="36" y="-26" width="62" height="11" rx="1.5"/>
      <rect x="102" y="-26" width="62" height="11" rx="1.5"/>
      <rect x="168" y="-26" width="62" height="11" rx="1.5"/>
      <path d="M52 -26 v11 M67 -26 v11 M82 -26 v11 M118 -26 v11 M133 -26 v11 M148 -26 v11 M184 -26 v11 M199 -26 v11 M214 -26 v11" stroke-width=".8" opacity=".55"/>
    </g>
    <!-- sol -->
    <g transform="translate(586 54)" stroke-width="1.3" opacity=".75">
      <circle r="12"/>
      <path d="M0 -24 v-7 M0 24 v7 M-24 0 h-7 M24 0 h7 M17 -17 l5 -5 M-17 17 l-5 5 M17 17 l5 5 M-17 -17 l-5 -5"/>
    </g>
    <!-- cabo dos painéis ao inversor -->
    <path d="M430 196 C 420 214, 300 214, 220 230" stroke-dasharray="4 4" stroke-width="1.1"/>
    <path d="M150 232 V290" stroke-dasharray="4 4" stroke-width="1.1"/>
    <!-- inversor na parede -->
    <rect x="120" y="290" width="60" height="70" rx="6"/>
    <path d="M132 306 h36 M132 318 h24" stroke-width="1.1"/>
    <circle cx="166" cy="344" r="4"/>
    <!-- sinal até o celular -->
    <path d="M196 312 q12 -12 0 -24 M206 320 q22 -20 0 -40" stroke-width="1.1" opacity=".7"/>
    <!-- celular -->
    <rect x="566" y="290" width="44" height="82" rx="8"/>
    <path d="M578 340 l8 -10 l7 6 l9 -14" stroke-width="1.3"/>
    <path d="M580 358 h16" stroke-width="1.1"/>
  </g>
  <g fill="none" stroke="currentColor" stroke-width="1" opacity=".6"><path d="M380 112 L404 134"/><path d="M480 222 L470 196"/></g>
  ${marca(1, 370, 102)}
  ${marca(2, 486, 236)}
  ${marca(3, 92, 325)}
  ${marca(4, 588, 268)}
</svg>`;

export function render() {
  const itens = equipamentos
    .map((e, i) => {
      const extra = [
        preenchido(e.marca) ? `<span>Marca: ${e.marca}</span>` : '',
        preenchido(e.garantia) ? `<span>Garantia: ${e.garantia}</span>` : '',
      ].filter(Boolean);
      return `<li class="peca">
        <span class="peca__n mono" aria-hidden="true">${i + 1}</span>
        <div>
          <h3 class="peca__nome">${e.nome}</h3>
          <p class="peca__texto">${e.oQueE}</p>
          ${extra.length ? `<p class="peca__extra mono">${extra.join(' · ')}</p>` : ''}
        </div>
      </li>`;
    })
    .join('');
  return `<section class="secao secao--creme-2 telhado" id="telhado" data-tema="claro" aria-labelledby="telhado-titulo">
  <h2 class="titulo-secao telhado__titulo" id="telhado-titulo">O que vai no seu telhado</h2>
  <div class="telhado__grade">
    <figure class="telhado__corte">${corte}</figure>
    <ol class="pecas">${itens}</ol>
  </div>
  <ul class="compromissos" aria-label="Compromissos">
    ${empresa.compromissos.map((c) => `<li class="compromisso">${c}</li>`).join('\n    ')}
  </ul>
  <p class="telhado__nota">${selo()} Marcas e garantias entram aqui quando confirmadas com os fabricantes.</p>
</section>`;
}
