/*
 * Obras. Enquanto não houver obras reais com fotos, estes itens são EXEMPLOS
 * (exemplo: true) e aparecem com o selo "exemplo" e uma moldura neutra.
 * Obra real: exemplo: false e fotos [{ src, srcset, sizes, alt, w, h }].
 * contaAntesDepois só se documentada e autorizada: { antes: '/img/...', depois: '/img/...', w, h }
 * (com dados pessoais já borrados na imagem).
 */
export const obras = [
  { id: 'setor-bueno', tipo: 'casas', bairro: 'Setor Bueno', cidade: 'Goiânia', kwp: 5.5, modulos: 10, ligacao: 'agosto de 2026', telhado: 'Cerâmico', exemplo: true, fotos: [], contaAntesDepois: null },
  { id: 'jardim-america', tipo: 'casas', bairro: 'Jardim América', cidade: 'Goiânia', kwp: 4.4, modulos: 8, ligacao: 'julho de 2026', telhado: 'Fibrocimento', exemplo: true, fotos: [], contaAntesDepois: null },
  { id: 'vila-brasilia', tipo: 'comercio', bairro: 'Vila Brasília', cidade: 'Aparecida de Goiânia', kwp: 11, modulos: 20, ligacao: 'junho de 2026', telhado: 'Metálico', exemplo: true, fotos: [], contaAntesDepois: null },
  { id: 'setor-sul', tipo: 'casas', bairro: 'Setor Sul', cidade: 'Goiânia', kwp: 3.3, modulos: 6, ligacao: 'maio de 2026', telhado: 'Cerâmico', exemplo: true, fotos: [], contaAntesDepois: null },
  { id: 'trindade-rural', tipo: 'rural', bairro: 'Zona rural', cidade: 'Trindade', kwp: 8.8, modulos: 16, ligacao: 'abril de 2026', telhado: 'Estrutura no solo', exemplo: true, fotos: [], contaAntesDepois: null },
];

export const filtrosObras = [
  { id: 'todas', nome: 'Todas' },
  { id: 'casas', nome: 'Casas' },
  { id: 'comercio', nome: 'Comércio' },
  { id: 'rural', nome: 'Rural' },
];
