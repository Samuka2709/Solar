import { premissas, produtividade, simular, economiaArredondada } from '../data/premissas.js';
import { empresa } from '../data/empresa.js';
import { formatarNumero, formatarReais } from '../lib/formato.js';
import { seta, selo } from './comum.js';

/** Vagas desenhadas no telhado do simulador; acima disso aparece "+N". */
export const MAX_MODULOS = 30;

const modulos = (n) =>
  Array.from({ length: MAX_MODULOS }, (_, i) => `<span class="modulo${i < n ? ' modulo--ligado' : ''}"></span>`).join('');

/** Pergunta opcional do passo 2: rádios com cara de chip (nenhum marcado de início). */
const grupoOpcoes = (nome, rotulo, opcoes, ajuda = '') => `
      <fieldset class="opcoes">
        <legend class="campo__rotulo">${rotulo}</legend>
        <div class="chips">
          ${opcoes.map((o) => `<label class="chip opcao"><input class="so-leitor" type="radio" name="${nome}" value="${o}">${o}</label>`).join('')}
        </div>
        ${ajuda ? `<p class="campo__ajuda">${ajuda}</p>` : ''}
      </fieldset>`;

export function render() {
  const r = simular(premissas.contaPadrao, 'casa');
  const tipos = [
    ['casa', 'Casa'],
    ['comercio', 'Comércio'],
    ['rural', 'Rural'],
  ];
  const min = premissas.minimoKwh;
  const eco = economiaArredondada(r.economiaMes);
  return `<section class="secao secao--tinta simulacao" id="simulacao" data-tema="escuro" aria-labelledby="sim-titulo">
  <div class="sim__cabeca">
    <h2 class="titulo-secao" id="sim-titulo">Quanto o seu telhado pode gerar</h2>
    <p class="sim__sub">Comece pelo valor da conta de luz. Nesta parte, nenhum dado pessoal.</p>
  </div>

  <div class="sim__grade">
    <form class="sim__entrada" data-sim-calculo novalidate aria-label="Dados da conta de luz">
      <div class="campo">
        <label class="campo__rotulo" for="sim-conta">Valor médio da conta de luz</label>
        <div class="sim__reais">
          <span class="sim__cifrao" aria-hidden="true">R$</span>
          <input class="sim__valor" id="sim-conta" name="conta" inputmode="numeric" autocomplete="off"
            value="${formatarNumero(premissas.contaPadrao)}" aria-describedby="sim-conta-ajuda">
        </div>
        <p class="campo__ajuda" id="sim-conta-ajuda">A média dos últimos meses, em reais.</p>
      </div>
      <div class="sim__faixa">
        <input type="range" id="sim-faixa" min="${premissas.contaMin}" max="${premissas.contaMax}" step="10" value="${premissas.contaPadrao}"
          aria-label="Valor médio da conta de luz" aria-valuetext="${formatarReais(premissas.contaPadrao)}">
        <div class="sim__limites mono" aria-hidden="true"><span>${formatarReais(premissas.contaMin)}</span><span>${formatarReais(premissas.contaMax)}</span></div>
      </div>
      <div class="sim__tipo" role="group" aria-labelledby="sim-tipo-rotulo">
        <p class="campo__rotulo" id="sim-tipo-rotulo">Tipo de imóvel</p>
        <div class="chips">
          ${tipos.map(([id, nome]) => `<button type="button" class="chip" data-tipo="${id}" aria-pressed="${id === 'casa'}">${nome}</button>`).join('')}
        </div>
      </div>
    </form>

    <div class="sim__resultado" aria-live="polite" aria-atomic="true" data-sim-resultado>
      <p class="sim__rotulo mono">Painéis de ${premissas.potenciaPainelW} W</p>
      <p class="sim__destaque">cerca de <span class="sim__numero" data-r="paineis">${r.paineis}</span> painéis</p>
      <div class="sim__telhado" aria-hidden="true">
        <div class="sim__modulos" data-sim-modulos>${modulos(r.paineis)}</div>
        <span class="sim__mais mono" data-sim-mais hidden></span>
      </div>
      <dl class="sim__dados">
        <div><dt class="mono">Consumo estimado</dt><dd>cerca de <span data-r="consumo">${formatarNumero(r.consumo)}</span> kWh/mês</dd></div>
        <div><dt class="mono">Potência</dt><dd>cerca de <span data-r="kwp">${formatarNumero(r.kwp, 1)}</span> kWp</dd></div>
        <div><dt class="mono">Geração</dt><dd>cerca de <span data-r="geracao">${formatarNumero(r.geracaoMes)}</span> kWh/mês</dd></div>
      </dl>
      <div class="sim__economia">
        <p class="sim__rotulo mono">Economia média estimada</p>
        <p class="sim__economia-valor">cerca de R$&nbsp;<span data-r="economia">${formatarNumero(eco.mes)}</span> por mês</p>
        <p class="sim__economia-ano">Em média, R$&nbsp;<span data-r="economia-ano">${formatarNumero(eco.ano)}</span> em um ano.</p>
        <p class="sim__economia-aviso">É uma média estimada, não uma promessa. O valor real de cada mês muda com o consumo, o tempo, o telhado e a tarifa.</p>
      </div>
      <p class="sim__preco">A proposta com preço sai depois da visita técnica.</p>
      <details class="sim__premissas">
        <summary>Como calculamos</summary>
        <div class="sim__premissas-corpo">
          <ul>
            <li><span>Tarifa usada</span><span class="mono">R$&nbsp;${formatarNumero(premissas.tarifa, 2)} por kWh</span></li>
            <li><span>Produtividade em ${empresa.cidade}</span><span class="mono">${formatarNumero(produtividade, 1)} kWh por kWp por dia</span></li>
            <li><span>Perdas (calor, cabos, inversor, sujeira)</span><span class="mono">${formatarNumero(premissas.perdas * 100, 1)}%, já descontadas</span></li>
            <li><span>Custo mínimo que continua na conta</span><span class="mono">${min.casa} kWh (casa), ${min.comercio} kWh (comércio)</span></li>
            <li><span>Iluminação pública</span><span>continua na fatura, à parte</span></li>
            <li><span>Economia</span><span>energia compensada × tarifa</span></li>
          </ul>
          <p>O sistema cobre o consumo menos a taxa mínima, que a distribuidora cobra de qualquer jeito. O número de painéis é arredondado para cima. ${selo('valores de exemplo', 'Premissas de exemplo, a confirmar pela empresa')}</p>
        </div>
      </details>
    </div>
  </div>

  <form class="sim__contato" data-sim-contato novalidate aria-labelledby="sim-contato-titulo">
    <h3 class="sim__contato-titulo" id="sim-contato-titulo">Receba a avaliação do seu telhado</h3>
    <p class="sim__contato-sub">A simulação vai pronta numa mensagem de WhatsApp. Nada fica guardado no site.</p>

    <div class="sim__erros" data-sim-erros tabindex="-1" hidden>
      <p class="sim__erros-titulo">Confira estes campos:</p>
      <ul data-sim-erros-lista></ul>
    </div>

    <div class="sim__campos">
      <div class="campo" data-campo="nome">
        <label class="campo__rotulo" for="sim-nome">Seu nome</label>
        <input class="campo__entrada" id="sim-nome" name="nome" autocomplete="given-name" required aria-describedby="sim-nome-erro">
        <p class="campo__erro" id="sim-nome-erro" hidden></p>
      </div>
      <div class="campo" data-campo="whatsapp">
        <label class="campo__rotulo" for="sim-whatsapp">WhatsApp</label>
        <input class="campo__entrada" id="sim-whatsapp" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(00) 00000-0000" required aria-describedby="sim-whatsapp-erro">
        <p class="campo__erro" id="sim-whatsapp-erro" hidden></p>
      </div>
      <div class="campo" data-campo="cidade">
        <label class="campo__rotulo" for="sim-cidade">Cidade</label>
        <input class="campo__entrada" id="sim-cidade" name="cidade" autocomplete="address-level2" value="${empresa.cidade}" required aria-describedby="sim-cidade-erro">
        <p class="campo__erro" id="sim-cidade-erro" hidden></p>
      </div>
      <div class="campo" data-campo="bairro">
        <label class="campo__rotulo" for="sim-bairro">Bairro <span class="campo__opcional">(opcional)</span></label>
        <input class="campo__entrada" id="sim-bairro" name="bairro" autocomplete="address-level3">
      </div>
    </div>

    <p class="sim__extras-sub">Se souber, marque também. Ajuda a gente a chegar com a avaliação mais certa. Tudo opcional.</p>
    <div class="sim__extras">
      ${grupoOpcoes('telhado', 'Tipo de telhado', ['Cerâmica', 'Fibrocimento', 'Metálico', 'Laje', 'Não sei'])}
      ${grupoOpcoes('ligacao', 'Ligação de energia', ['Monofásica', 'Bifásica', 'Trifásica', 'Não sei'], 'Aparece na conta de luz.')}
      ${grupoOpcoes('horario', 'Melhor horário para falar', ['Manhã', 'Tarde', 'Noite'])}
    </div>

    <div class="campo campo--check" data-campo="lgpd">
      <input type="checkbox" id="sim-lgpd" name="lgpd" required aria-describedby="sim-lgpd-erro">
      <label for="sim-lgpd">Concordo em enviar estes dados pelo WhatsApp para receber a avaliação, conforme a <a href="/politica-de-privacidade.html">política de privacidade</a>.</label>
      <p class="campo__erro" id="sim-lgpd-erro" hidden></p>
    </div>

    <button class="botao sim__enviar" type="submit"><span>Quero receber minha avaliação</span><span class="botao__circulo">${seta}</span></button>

    <div class="sim__ok" data-sim-ok role="status" hidden>
      <p>Abrimos o WhatsApp com a sua simulação. <a data-sim-ok-link href="#" target="_blank" rel="noopener">Se não abriu, toque aqui.</a></p>
    </div>
  </form>
</section>`;
}
