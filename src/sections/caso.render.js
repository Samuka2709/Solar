import { sistema as s } from '../data/sistema.js';
import { formatarNumero, formatarReais } from '../lib/formato.js';
import { botao } from './comum.js';

export function render() {
  const dados = [
    ['Painéis', `${s.paineis} × ${s.potenciaPainelW} W`],
    ['Potência', `${formatarNumero(s.potenciaKwp, 1)} kWp`],
    ['Geração', `${s.geracaoDiaKwh} kWh/dia`],
    ['No mês', `${s.geracaoMesKwh} kWh`],
    ['Conta', `${formatarReais(s.contaAntes)} → ${formatarReais(s.contaDepois)}`],
    ['Retorno', s.retorno],
  ];
  return `<section class="secao secao--creme-2 caso" id="caso" data-tema="claro" aria-labelledby="caso-titulo">
  <p class="caso__rotulo">O sistema da casa lá de cima</p>
  <h2 class="titulo-secao caso__titulo" id="caso-titulo">A conta de luz caiu<br> de ${formatarReais(s.contaAntes)} para ${formatarReais(s.contaDepois)}.</h2>
  <dl class="dados">
    ${dados.map(([r, v]) => `<div class="dados__item"><dt class="mono dados__rotulo">${r}</dt><dd class="dados__valor">${v}</dd></div>`).join('\n    ')}
  </dl>
  <p class="caso__nota">${s.nota}</p>
  <div class="caso__acao">
    ${botao('Simular minha conta', '#simulacao', { tinta: true })}
    <p class="caso__dica">Com a sua conta de luz em mãos, a simulação leva dois minutos.</p>
  </div>
</section>`;
}
