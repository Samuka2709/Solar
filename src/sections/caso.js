/*
 * Caso: quando a linha de dados entra na tela, os números contam até o valor
 * e a conta cai de R$ 780 para R$ 86. Sem JS ou com movimento reduzido, os
 * valores finais já estão na marcação.
 */
import { formatarNumero } from '../lib/formato.js';

export function iniciarCaso(secao) {
  const linha = secao.querySelector('.dados');
  const nums = [...secao.querySelectorAll('[data-conta]')];
  if (!linha || !nums.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // já está à vista (ex.: chegou por âncora): não recontar
  if (linha.getBoundingClientRect().top < innerHeight * 0.9) return;

  const escrever = (el, v) => {
    el.textContent = formatarNumero(v, +(el.dataset.casas || 0));
  };
  nums.forEach((el) => escrever(el, +(el.dataset.de ?? 0)));

  const contar = () => {
    const inicio = performance.now();
    const duracao = 1500;
    const quadro = (agora) => {
      const t = Math.min((agora - inicio) / duracao, 1);
      const k = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // expo.out
      for (const el of nums) {
        const de = +(el.dataset.de ?? 0);
        escrever(el, de + (+el.dataset.conta - de) * k);
      }
      if (t < 1) requestAnimationFrame(quadro);
    };
    requestAnimationFrame(quadro);
  };

  const obs = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      contar();
    },
    { threshold: 0.6 }
  );
  obs.observe(linha);
}
