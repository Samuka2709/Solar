/* Acordeões: botão com aria-expanded; o corpo abre por grid-template-rows 0fr → 1fr. */
export function iniciarDuvidas(secao) {
  secao.querySelectorAll('.acordeao__botao').forEach((b) => {
    const corpo = document.getElementById(b.getAttribute('aria-controls'));
    corpo.inert = true;
    b.addEventListener('click', () => {
      const aberto = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!aberto));
      corpo.classList.toggle('aberto', !aberto);
      corpo.inert = aberto;
    });
  });
}
