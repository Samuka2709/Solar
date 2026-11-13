/* Aparece depois que o hero sai da tela; some com o simulador ou o contato final visíveis. */
export function iniciarFixo() {
  const botao = document.querySelector('[data-fixo]');
  const hero = document.querySelector('.hero');
  if (!botao || !hero) return;
  const conflitos = ['#simulacao', '#contato'].map((s) => document.querySelector(s)).filter(Boolean);
  const estado = { heroVisivel: true, conflito: new Set() };

  const atualizar = () => {
    const mostrar = !estado.heroVisivel && estado.conflito.size === 0;
    botao.classList.toggle('fixo--visivel', mostrar);
  };

  new IntersectionObserver(([e]) => {
    // o hero "sai" quando o palco preso termina: usa a metade de baixo dele
    estado.heroVisivel = e.isIntersecting;
    atualizar();
  }, { rootMargin: '0px 0px -40% 0px' }).observe(hero.querySelector('[data-palco]') ?? hero);

  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (e.isIntersecting) estado.conflito.add(e.target);
      else estado.conflito.delete(e.target);
    }
    atualizar();
  }, { threshold: 0.15 });
  conflitos.forEach((c) => obs.observe(c));
}
