/* Uma citação por vez, setas e teclado. Sem rotação automática. */
export function iniciarDepoimentos(secao) {
  const itens = [...secao.querySelectorAll('[data-depo-item]')];
  if (itens.length < 2) return;
  const pos = secao.querySelector('[data-depo-pos]');
  let atual = 0;
  const ir = (i) => {
    atual = (i + itens.length) % itens.length;
    itens.forEach((el, k) => (el.hidden = k !== atual));
    pos.textContent = `${atual + 1} / ${itens.length}`;
  };
  secao.querySelector('[data-depo-ant]').addEventListener('click', () => ir(atual - 1));
  secao.querySelector('[data-depo-prox]').addEventListener('click', () => ir(atual + 1));
  secao.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') ir(atual - 1);
    if (e.key === 'ArrowRight') ir(atual + 1);
  });
}
