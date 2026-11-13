export const linksNav = [
  { href: '#como-funciona', texto: 'Como funciona' },
  { href: '#simulacao', texto: 'Simulação' },
  { href: '#obras', texto: 'Obras' },
  { href: '#duvidas', texto: 'Dúvidas' },
];

export function render() {
  return `<header class="cabecalho">
  <nav class="nav" aria-label="Principal" data-nav>
    <div class="nav__in">
      <ul class="nav__lista">
        ${linksNav.map((l) => `<li><a class="nav__link" href="${l.href}">${l.texto}</a></li>`).join('\n        ')}
      </ul>
    </div>
  </nav>
</header>`;
}
