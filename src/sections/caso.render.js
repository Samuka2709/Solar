import { sistema as s } from '../data/sistema.js';
import { formatarNumero, formatarReais } from '../lib/formato.js';
import { botao } from './comum.js';

export function render() {
  const dados = [
    // data-conta: o número conta até o valor quando a linha entra na tela (caso.js)
    ['Painéis', `<span data-conta="${s.paineis}">${s.paineis}</span> × ${s.potenciaPainelW} W`],
    ['Potência', `<span data-conta="${s.potenciaKwp}" data-casas="1">${formatarNumero(s.potenciaKwp, 1)}</span> kWp`],
    ['Geração', `<span data-conta="${s.geracaoDiaKwh}">${s.geracaoDiaKwh}</span> kWh/dia`],
    ['No mês', `<span data-conta="${s.geracaoMesKwh}">${s.geracaoMesKwh}</span> kWh`],
    ['Conta', `${formatarReais(s.contaAntes)} → R$&nbsp;<span data-conta="${s.contaDepois}" data-de="${s.contaAntes}">${s.contaDepois}</span>`],
    ['Retorno', s.retorno],
  ];
  return `<section class="secao secao--creme-2 caso" id="caso" data-tema="claro" aria-labelledby="caso-titulo">
  <div class="cabeca">
    <h2 class="titulo-secao caso__titulo" id="caso-titulo">A conta de luz caiu<br> de ${formatarReais(s.contaAntes)} para ${formatarReais(s.contaDepois)}.</h2>
    <div class="caso__acao">
      ${botao('Simular minha conta', '#simulacao', { tinta: true })}
      <p class="caso__dica">Com a sua conta de luz em mãos, a simulação leva dois minutos.</p>
    </div>
  </div>
  <dl class="dados">
    ${dados.map(([r, v]) => `<div class="dados__item"><dt class="mono dados__rotulo">${r}</dt><dd class="dados__valor">${v}</dd></div>`).join('\n    ')}
  </dl>
  <p class="caso__nota">${s.nota}</p>
</section>`;
}
