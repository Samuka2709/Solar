/*
 * Dados da empresa. A marca (NOME) é de demonstração.
 * Tudo que ainda não é real está marcado com [PREENCHER] (falta o dado) ou
 * [CONFIRMAR] (há um valor de exemplo que a empresa precisa conferir).
 * Campo com [PREENCHER] nunca aparece na tela: o site esconde o item.
 */
export const P = '[PREENCHER]';

// Nome da marca: troque só aqui (aparece no hero, títulos, mensagens e páginas).
const NOME = 'SolarisX';

export const empresa = {
  nome: NOME,
  cidade: 'Ilhéus',
  uf: 'BA',
  regiao: 'Ilhéus e região',
  prazoDias: 45, // [CONFIRMAR] prazo do contrato, da visita à troca do medidor
  respostaEm: 'até um dia útil', // [CONFIRMAR]
  frase: 'Energia solar residencial em Ilhéus, BA.',

  // Contato. WhatsApp só com dígitos, com DDI e DDD (ex.: 5562912345678).
  whatsapp: '5573998258544', // [CONFIRMAR] número de teste do dono da demonstração; troque pelo da empresa
  email: P,
  endereco: P,
  horario: P, // ex.: 'Segunda a sexta, 8h às 18h; sábado, 8h às 12h'
  instagram: P, // URL completa do perfil
  googleAvaliacoes: P, // URL do perfil no Google

  razaoSocial: P,
  cnpj: P,
  responsavelTecnico: { nome: P, crea: P },
  site: 'https://solar-six-lyart.vercel.app', // [PREENCHER] domínio real da empresa; hoje é o endereço da demonstração na Vercel (canonical, sitemap, Open Graph)

  // Quem faz. Três ou quatro frases sobre a empresa. [CONFIRMAR] cada uma.
  sobre: [
    `A ${NOME} projeta e instala energia solar em casas de Ilhéus e região.`,
    'A mesma equipe faz a visita técnica, o projeto e a instalação, e cuida do pedido na distribuidora até a troca do medidor.',
    'O preço sai fechado e por escrito depois da visita, com o prazo no contrato.',
  ],
  // Só fotos reais, em obra: { nome, funcao, foto: '/img/equipe/x.webp', w, h, alt }
  equipe: [],
  // Foto ILUSTRATIVA (Unsplash) para apresentar o modelo; aparece com selo e
  // some quando houver fotos reais em `equipe`. Troque antes de publicar.
  fotoIlustrativa: {
    src: '/img/equipe/instalacao-1280.webp',
    srcset: '/img/equipe/instalacao-640.webp 640w, /img/equipe/instalacao-960.webp 960w, /img/equipe/instalacao-1280.webp 1280w, /img/equipe/instalacao-1600.webp 1600w',
    w: 1280,
    h: 960,
    alt: 'Instalador fixando painéis solares com uma parafusadeira',
  },

  // Compromissos: só os que a empresa cumpre de verdade. [CONFIRMAR] cada um.
  compromissos: [
    'Equipe própria, sem terceirizar a instalação.',
    'Prazo de 45 dias no contrato.',
    'Você acompanha a geração pelo celular.',
  ],

  // Público secundário, em uma linha.
  tambem: 'Também atendemos pequeno comércio e propriedade rural.',
};

/** true quando o valor existe e não é marcador. */
export function preenchido(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '' && !v.includes('[PREENCHER]');
  return true;
}
