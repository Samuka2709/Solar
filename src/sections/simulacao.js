/* Simulador: passo 1 (cálculo na tela) e passo 2 (contato pelo WhatsApp). */
import { empresa } from '../data/empresa.js';
import { premissas, simular, economiaArredondada } from '../data/premissas.js';
import { formatarNumero, formatarReais, lerReais, mascaraTelefone } from '../lib/formato.js';
import { linkContato } from '../lib/whatsapp.js';
import { MAX_MODULOS } from './simulacao.render.js';

const NOMES_TIPO = { casa: 'Casa', comercio: 'Comércio', rural: 'Rural' };

export function iniciarSimulacao(secao) {
  const conta = secao.querySelector('#sim-conta');
  const faixa = secao.querySelector('#sim-faixa');
  const chips = [...secao.querySelectorAll('[data-tipo]')];
  const saida = Object.fromEntries([...secao.querySelectorAll('[data-r]')].map((el) => [el.dataset.r, el]));
  const preco = secao.querySelector('.sim__preco');
  const modulos = [...secao.querySelectorAll('[data-sim-modulos] .modulo')];
  const mais = secao.querySelector('[data-sim-mais]');
  let ligados = modulos.filter((m) => m.classList.contains('modulo--ligado')).length;

  // os painéis novos entram em sequência, a partir do último aceso; os que saem, do fim para trás
  const desenharModulos = (n) => {
    const alvo = Math.min(n, MAX_MODULOS);
    modulos.forEach((m, i) => {
      const ligar = i < alvo;
      if (ligar === m.classList.contains('modulo--ligado')) return;
      const atraso = ligar ? (i - ligados) * 28 : (ligados - 1 - i) * 18;
      m.style.transitionDelay = `${Math.min(Math.max(atraso, 0), 420)}ms`;
      m.classList.toggle('modulo--ligado', ligar);
    });
    ligados = alvo;
    mais.hidden = n <= MAX_MODULOS;
    mais.textContent = n > MAX_MODULOS ? `+${n - MAX_MODULOS}` : '';
  };

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
    const eco = economiaArredondada(resultado.economiaMes);
    trocar(saida.economia, formatarNumero(eco.mes));
    trocar(saida['economia-ano'], formatarNumero(eco.ano));
    desenharModulos(resultado.paineis);
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

    // Mensagem organizada em blocos (no WhatsApp, *texto* sai em negrito).
    // Perguntas opcionais sem resposta não entram.
    const marcado = (nome) => form.querySelector(`input[name="${nome}"]:checked`)?.value;
    const linha = (rotulo, v) => (v ? `${rotulo}: ${v}` : '');
    const bairro = form.querySelector('#sim-bairro').value.trim();
    const cidade = campos.cidade.value.trim();
    const eco = economiaArredondada(resultado.economiaMes);
    const blocos = [
      [`Olá, ${empresa.nome}! Fiz a simulação no site e quero a avaliação do meu telhado.`],
      [
        '*Meus dados*',
        linha('Nome', campos.nome.value.trim()),
        linha('WhatsApp', mascaraTelefone(campos.whatsapp.value)),
        linha('Local', bairro ? `${bairro}, ${cidade}` : cidade),
        linha('Melhor horário', marcado('horario')?.toLowerCase()),
      ],
      [
        '*Imóvel*',
        linha('Tipo', NOMES_TIPO[tipo]),
        linha('Telhado', marcado('telhado')?.toLowerCase()),
        linha('Ligação', marcado('ligacao')?.toLowerCase()),
        linha('Conta de luz média', formatarReais(valor).replace(/\u00a0/g, ' ')),
      ],
      [
        '*Simulação do site*',
        `Cerca de ${resultado.paineis} painéis (${formatarNumero(resultado.kwp, 1)} kWp)`,
        `Economia média estimada: cerca de R$ ${formatarNumero(eco.mes)} por mês`,
      ],
      ['Se precisar, mando a foto da conta de luz por aqui.'],
    ];
    const mensagem = blocos.map((b) => b.filter(Boolean).join('\n')).join('\n\n');

    const { href, canal } = linkContato(mensagem);
    okLink.href = href;
    okLink.textContent = canal === 'email' ? 'Se o e-mail não abriu, toque aqui.' : 'Se não abriu, toque aqui.';
    ok.querySelector('p').firstChild.textContent =
      canal === 'email' ? 'Abrimos o seu e-mail com a simulação. ' : 'Abrimos o WhatsApp com a sua simulação. ';
    if (canal === 'email') location.href = href;
    else window.open(href, '_blank', 'noopener');
    ok.hidden = false;
  });
}
