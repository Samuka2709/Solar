import { empresa, preenchido } from '../data/empresa.js';
import { esc } from '../lib/formato.js';
import { selo } from './comum.js';

export function render() {
  const rt = empresa.responsavelTecnico;
  const temRt = preenchido(rt.nome) && preenchido(rt.crea);
  const fotos = empresa.equipe.filter((p) => preenchido(p.foto));
  const ilu = !fotos.length && empresa.fotoIlustrativa;
  return `<section class="secao secao--creme equipe" id="equipe" data-tema="claro" aria-labelledby="equipe-titulo">
  <div class="equipe__grade">
    <div class="equipe__lado">
      <h2 class="titulo-secao" id="equipe-titulo">Quem faz</h2>
      ${
        ilu
          ? `<figure class="equipe__ilustrativa">
        <img src="${ilu.src}" srcset="${ilu.srcset}" sizes="(max-width: 900px) 100vw, 40vw" width="${ilu.w}" height="${ilu.h}" alt="${esc(ilu.alt)}" loading="lazy" decoding="async">
        <figcaption>${selo('foto ilustrativa', 'Foto ilustrativa, não é da equipe')}</figcaption>
      </figure>`
          : ''
      }
    </div>
    <div class="equipe__texto">
      ${empresa.sobre.map((f) => `<p>${f}</p>`).join('\n      ')}
      <p>${empresa.tambem}</p>
      ${temRt ? `<p class="equipe__rt">Responsável técnico: ${esc(rt.nome)}, CREA ${esc(rt.crea)}.</p>` : ''}
      <p class="equipe__nota">${selo('texto de exemplo', 'Texto de exemplo, a confirmar pela empresa')}</p>
    </div>
  </div>
  ${
    fotos.length
      ? `<ul class="equipe__fotos">${fotos
          .map(
            (p) => `<li><figure><img src="${p.foto}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async"><figcaption><strong>${esc(p.nome)}</strong> ${esc(p.funcao)}</figcaption></figure></li>`
          )
          .join('')}</ul>`
      : ''
  }
</section>`;
}
