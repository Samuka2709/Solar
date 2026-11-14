import { empresa } from '../data/empresa.js';
import { duvidas } from '../data/duvidas.js';
import { linkContato } from '../lib/whatsapp.js';
import { esc } from '../lib/formato.js';

export function render() {
  const { href, canal } = linkContato(`Olá, ${empresa.nome}! Vim pelo site e tenho uma dúvida sobre energia solar:

`);
  const alvo = canal === 'whatsapp' ? ' target="_blank" rel="noopener"' : '';
  return `<section class="secao secao--creme-2 duvidas" id="duvidas" data-tema="claro" aria-labelledby="duvidas-titulo">
  <div class="duvidas__grade">
    <div class="duvidas__lado">
      <h2 class="titulo-secao" id="duvidas-titulo">Dúvidas</h2>
      <a class="link-texto duvidas__contato" href="${href}"${alvo}>Ainda tem dúvida? Fale no ${canal === 'email' ? 'e-mail' : 'WhatsApp'}</a>
    </div>
    <ul class="acordeoes">
      ${duvidas
        .map(
          (d, i) => `<li class="acordeao">
        <h3 class="acordeao__titulo">
          <button type="button" class="acordeao__botao" id="duvida-${i}" aria-expanded="false" aria-controls="duvida-${i}-r">
            <span>${esc(d.p)}</span><span class="acordeao__icone" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="acordeao__corpo" id="duvida-${i}-r" role="region" aria-labelledby="duvida-${i}">
          <div class="acordeao__dentro"><p>${esc(d.r)}</p></div>
        </div>
      </li>`
        )
        .join('\n      ')}
    </ul>
  </div>
</section>`;
}
