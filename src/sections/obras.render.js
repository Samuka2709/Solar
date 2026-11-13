import { obras, filtrosObras } from '../data/obras.js';
import { formatarNumero, esc } from '../lib/formato.js';
import { selo } from './comum.js';

/* Moldura neutra enquanto não há foto real: silhueta do telhado em linha. */
export const silhueta = `<svg class="obra__silhueta" viewBox="0 0 240 120" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="M28 70 L120 26 L212 70"/><path d="M40 64 V104 H200 V64"/><path d="M128 36 L190 66 M136 32 L198 62 M146 46 L176 60 M156 41 L186 55"/><path d="M104 104 V80 H124 V104"/><path d="M62 78 H84 V92 H62 Z"/></g></svg>`;

/**
 * Grade de 3 colunas: a primeira obra ocupa 2×2 (4 células). Se a última
 * fileira ficar com um buraco, a última obra ocupa duas colunas.
 */
export const precisaLarga = (n) => n > 1 && (4 + (n - 1)) % 3 === 2;

export function foto(o, grande = false) {
  const f = o.fotos?.[0];
  if (f) {
    return `<img class="obra__img" src="${f.src}"${f.srcset ? ` srcset="${f.srcset}" sizes="${grande ? '(max-width: 760px) 100vw, 66vw' : '(max-width: 760px) 100vw, 33vw'}"` : ''} width="${f.w}" height="${f.h}" alt="${esc(f.alt)}" loading="lazy" decoding="async">`;
  }
  return `<div class="obra__moldura">${silhueta}<span>foto da obra</span></div>`;
}

export function render() {
  return `<section class="secao secao--creme obras" id="obras" data-tema="claro" aria-labelledby="obras-titulo">
  <div class="obras__cabeca">
    <h2 class="titulo-secao" id="obras-titulo">Telhados que já estão gerando</h2>
    <div class="chips obras__filtros" role="group" aria-label="Filtrar obras">
      ${filtrosObras.map((f) => `<button type="button" class="chip" data-filtro="${f.id}" aria-pressed="${f.id === 'todas'}">${f.nome}</button>`).join('')}
    </div>
  </div>
  <p class="so-leitor" aria-live="polite" data-obras-aviso></p>
  <ul class="obras__grade" data-obras-grade>
    ${obras
      .map(
        (o, i) => `<li class="obra${i === 0 ? ' obra--grande' : ''}${i > 0 && i === obras.length - 1 && precisaLarga(obras.length) ? ' obra--larga' : ''}" data-tipo="${o.tipo}" data-id="${o.id}">
      <div class="obra__foto">${foto(o, i === 0)}${o.exemplo ? `<span class="obra__selo">${selo()}</span>` : ''}</div>
      <div class="obra__info">
        <h3 class="obra__lugar"><button type="button" class="obra__abrir" data-abrir="${o.id}" aria-haspopup="dialog">${o.bairro}, ${o.cidade}</button></h3>
        <p class="obra__dados mono">${formatarNumero(o.kwp, 1)} kWp · ${o.modulos} módulos · ${o.ligacao}</p>
      </div>
    </li>`
      )
      .join('\n    ')}
  </ul>

  <dialog class="obra-dialogo" data-obra-dialogo aria-labelledby="obra-dialogo-titulo">
    <div class="obra-dialogo__caixa">
      <button type="button" class="obra-dialogo__fechar" data-fechar aria-label="Fechar">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
      <div data-obra-conteudo></div>
    </div>
  </dialog>
</section>`;
}
