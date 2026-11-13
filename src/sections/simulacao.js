/* Simulador: passo 1 (cálculo na tela) e passo 2 (contato pelo WhatsApp). */
import { premissas, simular } from '../data/premissas.js';
import { formatarNumero, formatarReais, lerReais, mascaraTelefone } from '../lib/formato.js';
import { linkContato } from '../lib/whatsapp.js';

const NOMES_TIPO = { casa: 'Casa', comercio: 'Comércio', rural: 'Rural' };

export function iniciarSimulacao(secao) {
  const conta = secao.querySelector('#sim-conta');
  const faixa = secao.querySelector('#sim-faixa');
  const chips = [...secao.querySelectorAll('[data-tipo]')];
  const saida = Object.fromEntries([...secao.querySelectorAll('[data-r]')].map((el) => [el.dataset.r, el]));
  const preco = secao.querySelector('.sim__preco');

  let tipo = 'casa';
  let valor = premissas.contaPadrao;
  let resultado = simular(valor, tipo);
  let espera;

  const posFaixa = (v) => {
    const t = (Math.min(Math.max(v, premissas.contaMin), premissas.contaMax) - premissas.contaMin) / (premissas.contaMax - premissas.contaMin);
    faixa.style.setProperty('--pos', `${(t * 100).toFixed(1)}%`);
  };

  const trocar = (el, texto) => {
    if (!el || el.textContent === texto) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = texto;
      return;
    }
    el.classList.add('trocando');
    setTimeout(() => {
      el.textContent = texto;
      el.classList.remove('trocando');
    }, 120);
  };

  const recalcular = () => {
    if (!Number.isFinite(valor) || valor < 50) return;
    resultado = simular(valor, tipo);
    trocar(saida.paineis, String(resultado.paineis));
    trocar(saida.consumo, formatarNumero(resultado.consumo));
    trocar(saida.kwp, formatarNumero(resultado.kwp, 1));
    trocar(saida.geracao, formatarNumero(resultado.geracaoMes));
  };

  const agendar = () => {
    clearTimeout(espera);
    espera = setTimeout(recalcular, 150);
  };

  conta.addEventListener('input', () => {
    const v = lerReais(conta.value);
    conta.value = Number.isFinite(v) ? formatarNumero(Math.min(v, 99999)) : '';
    valor = Math.min(v, 99999);
    if (Number.isFinite(valor)) {
      faixa.value = Math.min(Math.max(valor, premissas.contaMin), premissas.contaMax);
      faixa.setAttribute('aria-valuetext', formatarReais(valor));
      posFaixa(valor);
    }
    agendar();
  });

  faixa.addEventListener('input', () => {
    valor = +faixa.value;
    conta.value = formatarNumero(valor);
    faixa.setAttribute('aria-valuetext', formatarReais(valor));
    posFaixa(valor);
    agendar();
  });

  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      tipo = chip.dataset.tipo;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      recalcular();
    })
  );

  secao.querySelector('[data-sim-calculo]').addEventListener('submit', (e) => {
    e.preventDefault();
    recalcular();
  });

  posFaixa(valor);
  if (premissas.precoConfirmado && preco) preco.hidden = false;

  /* ---------- Passo 2 ---------- */
  const form = secao.querySelector('[data-sim-contato]');
  const resumo = secao.querySelector('[data-sim-erros]');
  const resumoLista = secao.querySelector('[data-sim-erros-lista]');
  const ok = secao.querySelector('[data-sim-ok]');
  const okLink = secao.querySelector('[data-sim-ok-link]');
  const campos = {
    nome: form.querySelector('#sim-nome'),
    whatsapp: form.querySelector('#sim-whatsapp'),
    cidade: form.querySelector('#sim-cidade'),
    lgpd: form.querySelector('#sim-lgpd'),
  };

  const regras = {
    nome: (v) => (v.trim().length < 2 ? 'Escreva o seu nome.' : ''),
    whatsapp: (v) => {
      const d = v.replace(/\D/g, '');
      if (!d) return 'Informe o seu WhatsApp com DDD.';
      if (d.length < 10 || d.length > 11) return 'O número precisa ter DDD e 8 ou 9 dígitos, como (62) 91234-5678.';
      return '';
    },
    cidade: (v) => (v.trim().length < 2 ? 'Informe a cidade do imóvel.' : ''),
    lgpd: (_, el) => (el.checked ? '' : 'Marque a caixa para concordar com o envio pelo WhatsApp.'),
  };

  const validar = (nome) => {
    const el = campos[nome];
    const msg = regras[nome](el.value, el);
    const caixa = el.closest('.campo');
    const erro = caixa.querySelector('.campo__erro');
    erro.textContent = msg;
    erro.hidden = !msg;
    caixa.classList.toggle('campo--erro', !!msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return msg;
  };

  campos.whatsapp.addEventListener('input', () => {
    campos.whatsapp.value = mascaraTelefone(campos.whatsapp.value);
  });

  for (const nome of Object.keys(campos)) {
    const el = campos[nome];
    el.addEventListener(nome === 'lgpd' ? 'change' : 'blur', () => {
      // valida ao sair do campo, mas não acusa campo vazio que ainda não foi tocado
      if (nome !== 'lgpd' && !el.value && !el.dataset.tocado) return;
      el.dataset.tocado = '1';
      validar(nome);
    });
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true') validar(nome);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const erros = Object.keys(campos)
      .map((nome) => ({ nome, msg: validar(nome) }))
      .filter((x) => x.msg);

    if (erros.length) {
      ok.hidden = true;
      resumoLista.innerHTML = '';
      for (const { nome, msg } of erros) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${campos[nome].id}`;
        a.textContent = msg;
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          campos[nome].focus();
        });
        li.append(a);
        resumoLista.append(li);
      }
      resumo.hidden = false;
      resumo.focus();
      return;
    }
    resumo.hidden = true;

    const primeiroNome = campos.nome.value.trim().split(/\s+/)[0];
    const kwpTxt = formatarNumero(resultado.kwp, 1);
    const mensagem =
      `Olá! Fiz a simulação no site da Zênite. ` +
      `Imóvel: ${NOMES_TIPO[tipo]}. ` +
      `Conta média: ${formatarReais(valor).replace(' ', ' ')}. ` +
      `Cidade: ${campos.cidade.value.trim()}. ` +
      `Sistema estimado: cerca de ${resultado.paineis} painéis (${kwpTxt} kWp). ` +
      `Meu nome é ${primeiroNome}.`;

    // No WhatsApp o número já vai junto; no e-mail ele precisa estar no texto.
    let { href, canal } = linkContato(mensagem);
    if (canal === 'email') ({ href } = linkContato(`${mensagem} Meu WhatsApp: ${campos.whatsapp.value}.`));
    okLink.href = href;
    okLink.textContent = canal === 'email' ? 'Se o e-mail não abriu, toque aqui.' : 'Se não abriu, toque aqui.';
    ok.querySelector('p').firstChild.textContent =
      canal === 'email' ? 'Abrimos o seu e-mail com a simulação. ' : 'Abrimos o WhatsApp com a sua simulação. ';
    if (canal === 'email') location.href = href;
    else window.open(href, '_blank', 'noopener');
    ok.hidden = false;
  });
}
