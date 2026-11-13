/*
 * Obras. Enquanto não houver obras reais com fotos, estes itens são EXEMPLOS
 * (exemplo: true) e aparecem com o selo "exemplo" e uma moldura neutra.
 * Obra real: exemplo: false e fotos [{ src, srcset, sizes, alt, w, h }].
 * contaAntesDepois só se documentada e autorizada: { antes: '/img/...', depois: '/img/...', w, h }
 * (com dados pessoais já borrados na imagem).
 */
/*
 * Fotos ILUSTRATIVAS do Unsplash (licença livre, uso comercial permitido; ver
 * CREDITOS.md). Servem para apresentar o modelo. Troque pelas fotos reais
 * das obras antes de publicar para uma empresa de verdade.
 */
const foto = (nome, alt) => ({
  src: `/img/obras/${nome}-1280.webp`,
  srcset: `/img/obras/${nome}-640.webp 640w, /img/obras/${nome}-960.webp 960w, /img/obras/${nome}-1280.webp 1280w, /img/obras/${nome}-1600.webp 1600w`,
  w: 1280,
  h: 960,
  alt,
});

export const obras = [
  { id: 'setor-bueno', tipo: 'casas', bairro: 'Setor Bueno', cidade: 'Goiânia', kwp: 5.5, modulos: 10, ligacao: 'agosto de 2026', telhado: 'Cerâmico', exemplo: true, contaAntesDepois: null,
    fotos: [foto('setor-bueno', 'Painéis solares sobre um telhado de telha de barro, com arco-íris ao fundo')] },
  { id: 'jardim-america', tipo: 'casas', bairro: 'Jardim América', cidade: 'Goiânia', kwp: 4.4, modulos: 8, ligacao: 'julho de 2026', telhado: 'Cerâmico', exemplo: true, contaAntesDepois: null,
    fotos: [foto('jardim-america', 'Painéis solares sobre um telhado de telha de barro, entre paredes de tijolo')] },
  { id: 'vila-brasilia', tipo: 'comercio', bairro: 'Vila Brasília', cidade: 'Aparecida de Goiânia', kwp: 11, modulos: 20, ligacao: 'junho de 2026', telhado: 'Telha metálica ondulada', exemplo: true, contaAntesDepois: null,
    fotos: [foto('vila-brasilia', 'Duas fileiras de painéis solares sobre o telhado de telha ondulada de um galpão')] },
  { id: 'trindade-rural', tipo: 'rural', bairro: 'Zona rural', cidade: 'Trindade', kwp: 8.8, modulos: 16, ligacao: 'abril de 2026', telhado: 'Estrutura no solo', exemplo: true, contaAntesDepois: null,
    fotos: [foto('trindade-rural', 'Fileiras de painéis solares em estrutura no chão, entre árvores')] },
  { id: 'setor-sul', tipo: 'casas', bairro: 'Setor Sul', cidade: 'Goiânia', kwp: 3.3, modulos: 6, ligacao: 'maio de 2026', telhado: 'Cerâmico', exemplo: true, contaAntesDepois: null,
    fotos: [foto('setor-sul', 'Telhados de barro de um bairro residencial, um deles com painéis solares')] },
];

export const filtrosObras = [
  { id: 'todas', nome: 'Todas' },
  { id: 'casas', nome: 'Casas' },
  { id: 'comercio', nome: 'Comércio' },
  { id: 'rural', nome: 'Rural' },
];
