# SolarisX: site de energia solar

Vite sem framework, multipágina. O hero é a casa numa ilha flutuante; o resto do site é calmo.

```
npm install
npm run dev        # http://localhost:5190
npm run build      # gera dist/
npm run preview    # http://localhost:5191 (serve dist/)
npm run shots      # prints de checagem em prints/ (precisa do preview rodando)
node scripts/teclado.mjs   # teste só com teclado + link do WhatsApp gerado
node scripts/medir.mjs 3   # LCP, CLS, bytes e quadros perdidos (celular, 4G lento, 3 rodadas)
node scripts/fluidez.mjs 3          # quadros do hero parado e rolando (celular, CPU 4x)
node scripts/entrada-medir.mjs 3    # thread principal durante a entrada do hero
node scripts/costuras.mjs           # nenhuma linha reta entre seções (desktop e celular)
```

- **Textos e números**: `src/data/`. O que falta está em `PENDENCIAS.md`.
- **Seções**: `src/sections/<nome>.render.js` gera o HTML estático no build (bom para SEO); `<nome>.css` e `<nome>.js` cuidam do visual e da interação. O JS de cada seção só carrega quando ela se aproxima.
- **Movimento do hero**: `src/motion/`. Os números das nuvens e do palco seguem o `CLAUDE.md`. A entrada usa a Web Animations API nativa (não GSAP): transform e opacity rodam no compositor, e o celular não refaz os pixels da ilha a cada quadro.
- **Imagens**: `public/img/`. Para trocar a ilha, substitua `ilha.webp` (1446×994, fundo transparente) e rode `node scripts/gerar-ilha-menores.mjs` para refazer as versões de 800 e 1100 px.
- **Imagem de compartilhamento**: `npm run shots -- --so=og` refaz `public/og.jpg` a partir do hero.
- Publicar: envie a pasta `dist/` para a hospedagem (Vercel, Netlify, Hostinger).
