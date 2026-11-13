import { depoimentos } from '../data/depoimentos.js';
import { esc } from '../lib/formato.js';
import { seta } from './comum.js';

const data = (iso) => {
  const [a, m] = iso.split('-');
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  return `${meses[+m - 1]} de ${a}`;
};

/* Só avaliações reais do Google. Sem nenhuma, a seção não existe. */
export function render() {
  if (!depoimentos.length) return '';
  return `<section class="secao secao--tinta depoimentos" id="depoimentos" data-tema="escuro" aria-labelledby="depo-titulo" aria-roledescription="carrossel">
  <h2 class="so-leitor" id="depo-titulo">Avaliações no Google</h2>
  <div class="depo__palco" data-depo>
    ${depoimentos
      .map(
        (d, i) => `<figure class="depo" data-depo-item ${i ? 'hidden' : ''} aria-roledescription="avaliação" aria-label="${i + 1} de ${depoimentos.length}">
      <blockquote class="depo__texto">“${esc(d.texto)}”</blockquote>
      <figcaption class="depo__autor">
        <span>${esc(d.nome)}</span>
        <span class="mono">${'★'.repeat(d.nota)}<span class="so-leitor"> nota ${d.nota} de 5</span> · ${data(d.data)}</span>
        <a class="link-texto" href="${d.link}" target="_blank" rel="noopener">Ver no Google</a>
      </figcaption>
    </figure>`
      )
      .join('\n    ')}
  </div>
  ${
    depoimentos.length > 1
      ? `<div class="depo__controles">
    <button type="button" class="chip" data-depo-ant aria-label="Avaliação anterior"><span class="depo__seta depo__seta--ant">${seta}</span></button>
    <span class="mono" data-depo-pos aria-live="polite">1 / ${depoimentos.length}</span>
    <button type="button" class="chip" data-depo-prox aria-label="Próxima avaliação"><span class="depo__seta">${seta}</span></button>
  </div>`
      : ''
  }
</section>`;
}
