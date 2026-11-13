import { etapas, etapasExemplo } from '../data/etapas.js';
import { empresa } from '../data/empresa.js';
import { selo } from './comum.js';

export function render() {
  const dias = (e) => (e.de === e.ate ? `Dia ${e.de}` : `Dias ${e.de}–${e.ate}`);
  return `<section class="secao secao--creme etapas" id="como-funciona" data-tema="claro" aria-labelledby="etapas-titulo">
  <div class="cabeca">
    <h2 class="titulo-secao etapas__titulo" id="etapas-titulo">${empresa.prazoDias} dias, do telhado ao medidor novo</h2>
    <p class="etapas__nota">${etapasExemplo ? selo() + ' ' : ''}A etapa da distribuidora é a que mais varia: a análise e a vistoria seguem os prazos dela.</p>
  </div>
  <div class="regua" data-regua>
    <div class="regua__trilho" aria-hidden="true"><div class="regua__fio" data-regua-fio></div></div>
    <ol class="regua__lista">
      ${etapas
        .map(
          (e, i) => `<li class="regua__etapa">
        <span class="regua__marca" aria-hidden="true"></span>
        <p class="regua__dias mono">${dias(e)}</p>
        <h3 class="regua__nome"><span class="so-leitor">${i + 1}. </span>${e.nome}</h3>
        <p class="regua__frase">${e.frase}</p>
      </li>`
        )
        .join('\n      ')}
    </ol>
  </div>
</section>`;
}
