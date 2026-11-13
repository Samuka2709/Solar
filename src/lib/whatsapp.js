import { empresa, preenchido } from '../data/empresa.js';

/**
 * Link de contato com a mensagem pronta. Nunca devolve um link morto:
 * 1. WhatsApp da empresa (wa.me/<número>?text=);
 * 2. sem número: e-mail (mailto:) com o mesmo texto;
 * 3. sem os dois (marca de demonstração): wa.me/?text=, que abre o WhatsApp
 *    com a mensagem para a pessoa escolher o contato.
 */
export function linkContato(mensagem) {
  const texto = encodeURIComponent(mensagem);
  if (preenchido(empresa.whatsapp)) {
    const numero = String(empresa.whatsapp).replace(/\D/g, '');
    return { href: `https://wa.me/${numero}?text=${texto}`, canal: 'whatsapp' };
  }
  if (preenchido(empresa.email)) {
    const assunto = encodeURIComponent(`Simulação pelo site da ${empresa.nome}`);
    return { href: `mailto:${empresa.email}?subject=${assunto}&body=${texto}`, canal: 'email' };
  }
  return { href: `https://wa.me/?text=${texto}`, canal: 'whatsapp' };
}

export const mensagemPadrao = () =>
  `Olá! Vim pelo site da ${empresa.nome} e quero saber quantos painéis cabem no meu telhado.`;
