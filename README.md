# Zênite: site de energia solar

Vite sem framework, multipágina. O hero é a casa numa ilha flutuante; o resto do site é calmo.

```
npm install
npm run dev        # http://localhost:5190
npm run build      # gera dist/
npm run preview    # http://localhost:5191 (serve dist/)
npm run shots      # prints de checagem em prints/ (precisa do preview rodando)
node scripts/teclado.mjs   # teste só com teclado + link do WhatsApp gerado
```

- **Textos e números**: `src/data/`. O que falta está em `PENDENCIAS.md`.
- **Seções**: `src/sections/<nome>.render.js` gera o HTML estático no build (bom para SEO); `<nome>.css` e `<nome>.js` cuidam do visual e da interação. O JS de cada seção só carrega quando ela se aproxima.
- **Movimento do hero**: `src/motion/`. Os números das nuvens e do palco seguem o `CLAUDE.md`.
- **Imagens**: `public/img/`. Para trocar a ilha, substitua `ilha.webp` (1446×994, fundo transparente) e rode `node scripts/gerar-ilha-menores.mjs` para refazer as versões de 800 e 1100 px.
- **Imagem de compartilhamento**: `npm run shots -- --so=og` refaz `public/og.jpg` a partir do hero.
- Publicar: envie a pasta `dist/` para a hospedagem (Vercel, Netlify, Hostinger).
