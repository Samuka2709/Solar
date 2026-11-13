import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/*
 * Páginas multipágina. Para criar /servicos/ ou páginas de cidade, acrescente
 * a entrada aqui só quando houver conteúdo próprio para ela.
 */
const paginas = {
  main: resolve(import.meta.dirname, 'index.html'),
  privacidade: resolve(import.meta.dirname, 'politica-de-privacidade.html'),
};

/*
 * As seções são renderizadas em HTML estático a partir de src/data/ (bom para
 * SEO e para a primeira pintura). No HTML, cada <!--secao:nome--> é trocado
 * pela marcação de src/sections/<nome>.render.js, e {{nome}} / {{site}} pelos
 * dados de src/data/empresa.js.
 */
function secoesEstaticas() {
  let servidor;
  const carregar = async () => {
    if (servidor) return servidor.ssrLoadModule('/src/render.js');
    const url = pathToFileURL(resolve(import.meta.dirname, 'src/render.js')).href;
    return import(url + '?t=' + Date.now());
  };
  return {
    name: 'marca-secoes',
    configureServer(s) {
      servidor = s;
      s.watcher.on('change', (arq) => {
        if (/src[\\/](data|sections|lib)[\\/].*\.js$/.test(arq) || arq.endsWith('render.js')) {
          s.moduleGraph.invalidateAll();
          s.ws.send({ type: 'full-reload' });
        }
      });
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const { renderizar, empresa } = await carregar();
        return html
          .replace(/<!--secao:([a-z-]+)-->/g, (_, nome) => renderizar(nome))
          // nome e domínio da marca vêm só de src/data/empresa.js
          .replaceAll('{{nome}}', empresa.nome)
          .replaceAll('{{site}}', empresa.site);
      },
    },
  };
}

/* Preload da fonte Archivo (latin) com o nome que o build gerar. */
function preloadFonte() {
  return {
    name: 'marca-preload-fonte',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const arq = Object.keys(ctx.bundle).find((n) => /archivo-latin-wdth-normal.*\.woff2$/.test(n));
        if (!arq) return html;
        return {
          html,
          tags: [{ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: '/' + arq, crossorigin: '' }, injectTo: 'head-prepend' }],
        };
      },
    },
  };
}

export default defineConfig({
  plugins: [secoesEstaticas(), preloadFonte()],
  build: {
    rollupOptions: { input: paginas },
    assetsInlineLimit: 0,
  },
});
