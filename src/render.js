/*
 * Renderização estática das seções (roda no Node, pelo vite.config.js).
 * <!--secao:nome--> no HTML vira a marcação de src/sections/<nome>.render.js.
 * Imports explícitos para funcionar tanto no dev (ssrLoadModule) quanto no build (Node puro).
 */
import * as nav from './sections/nav.render.js';
import * as hero from './sections/hero.render.js';
import * as caso from './sections/caso.render.js';
import * as etapas from './sections/etapas.render.js';
import * as simulacao from './sections/simulacao.render.js';
import * as obras from './sections/obras.render.js';
import * as telhado from './sections/telhado.render.js';
import * as depoimentos from './sections/depoimentos.render.js';
import * as equipe from './sections/equipe.render.js';
import * as duvidas from './sections/duvidas.render.js';
import * as contato from './sections/contato.render.js';
import * as rodape from './sections/rodape.render.js';
import * as fixo from './sections/whatsapp-fixo.render.js';
import * as jsonld from './sections/jsonld.render.js';

const mapa = {
  nav: nav.render,
  hero: hero.render,
  caso: caso.render,
  etapas: etapas.render,
  simulacao: simulacao.render,
  obras: obras.render,
  telhado: telhado.render,
  depoimentos: depoimentos.render,
  equipe: equipe.render,
  duvidas: duvidas.render,
  contato: contato.render,
  rodape: () => rodape.render(''),
  'rodape-interno': () => rodape.render('/'),
  'whatsapp-fixo': fixo.render,
  jsonld: jsonld.render,
};

export function renderizar(nome) {
  const fn = mapa[nome];
  if (!fn) throw new Error(`Seção desconhecida: ${nome}`);
  return fn();
}
