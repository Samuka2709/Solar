import { linkContato, mensagemPadrao } from '../lib/whatsapp.js';
import { iconeWhatsapp } from './comum.js';

export function render() {
  const { href, canal } = linkContato(mensagemPadrao());
  const nome = canal === 'email' ? 'E-mail' : 'WhatsApp';
  const alvo = canal === 'whatsapp' ? ' target="_blank" rel="noopener"' : '';
  return `<a class="fixo" href="${href}"${alvo} data-fixo aria-label="Conversar no ${nome}">
  ${iconeWhatsapp}<span class="fixo__texto" aria-hidden="true">${nome}</span>
</a>`;
}
