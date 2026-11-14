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

/**
 * Mensagem dos botões de WhatsApp fora do simulador. Já traz os campos que a
 * empresa precisa para responder com números, para a pessoa só completar.
 */
export const mensagemPadrao = () =>
  [
    `Olá, ${empresa.nome}! Vim pelo site e quero saber quanto posso economizar com energia solar.`,
    '',
    'Nome: ',
    'Cidade e bairro: ',
    'Valor médio da conta de luz: R$ ',
    'Tipo de imóvel (casa, comércio ou rural): ',
    '',
    'Se precisar, mando a foto da conta de luz por aqui.',
  ].join('\n');
