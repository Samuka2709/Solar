import { empresa } from '../data/empresa.js';
import { linkContato, mensagemPadrao } from '../lib/whatsapp.js';
import { botao, selo } from './comum.js';

export function render() {
  const { href, canal } = linkContato(mensagemPadrao());
  const alvo = canal === 'whatsapp' ? 'target="_blank" rel="noopener"' : '';
  return `<section class="secao contato" id="contato" data-tema="escuro" aria-labelledby="contato-titulo">
  <div class="contato__ceu" aria-hidden="true">
    <div class="contato__nuvem contato__nuvem--a"><img src="/img/nuvem-6.webp" width="1208" height="246" alt="" loading="lazy" decoding="async"></div>
    <div class="contato__nuvem contato__nuvem--b"><img src="/img/nuvem-3.webp" width="705" height="369" alt="" loading="lazy" decoding="async"></div>
  </div>
  <div class="contato__texto">
    <h2 class="titulo-secao" id="contato-titulo">Mande a foto da sua conta de luz.</h2>
    <p class="contato__sub">Com ela a gente diz quantos painéis cabem no seu telhado e quanto a conta cai. Resposta em ${empresa.respostaEm}. ${selo('prazo de exemplo', 'Prazo de resposta de exemplo, a confirmar pela empresa')}</p>
    <div class="contato__acoes">
      ${botao(canal === 'email' ? 'Escrever por e-mail' : 'Conversar no WhatsApp', href, { attrs: alvo })}
      <a class="link-texto contato__simular" href="#simulacao">Simular minha conta</a>
    </div>
  </div>
</section>`;
}
