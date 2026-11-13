/* Obras: filtros em chips e painel de detalhe em <dialog>. */
import { obras } from '../data/obras.js';
import { formatarNumero, esc } from '../lib/formato.js';
import { foto, colunas, temDestaque } from './obras.render.js';
import { selo } from './comum.js';

const NOMES = { casas: 'casas', comercio: 'comércio', rural: 'rural' };

export function iniciarObras(secao) {
  const grade = secao.querySelector('[data-obras-grade]');
  const itens = [...grade.children];
  const chips = [...secao.querySelectorAll('[data-filtro]')];
  const aviso = secao.querySelector('[data-obras-aviso]');
  const dialogo = secao.querySelector('[data-obra-dialogo]');
  const conteudo = secao.querySelector('[data-obra-conteudo]');
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Entrada: as fotos se revelam em sequência, de baixo para cima ---------- */
  if (!reduzido.matches && grade.getBoundingClientRect().top > innerHeight * 0.85) {
    itens.forEach((li, i) => li.style.setProperty('--atraso', `${Math.min(i * 90, 360)}ms`));
    grade.classList.add('obras__grade--antes');
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        grade.classList.add('obras__grade--revelar');
        requestAnimationFrame(() => grade.classList.remove('obras__grade--antes'));
        // depois da entrada, sem atrasos: o filtro e o hover respondem na hora
        setTimeout(() => {
          grade.classList.remove('obras__grade--revelar');
          itens.forEach((li) => li.style.removeProperty('--atraso'));
        }, 1600);
      },
      { threshold: 0.15 }
    );
    obs.observe(grade);
  }

  /* ---------- Filtros ---------- */
  let trocando;
  const aplicar = (filtro) => {
    const visiveis = itens.filter((li) => filtro === 'todas' || li.dataset.tipo === filtro);
    itens.forEach((li) => {
      li.hidden = !visiveis.includes(li);
      li.classList.remove('obra--grande');
    });
    if (temDestaque(visiveis.length)) visiveis[0].classList.add('obra--grande');
    grade.classList.remove('obras__grade--c2', 'obras__grade--c3', 'obras__grade--c4');
    grade.classList.add(`obras__grade--c${colunas(visiveis.length)}`);
    aviso.textContent = `${visiveis.length} ${visiveis.length === 1 ? 'obra' : 'obras'}${filtro === 'todas' ? '' : ` de ${NOMES[filtro]}`}.`;
  };

  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      if (chip.getAttribute('aria-pressed') === 'true') return;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      clearTimeout(trocando);
      if (reduzido.matches) {
        aplicar(chip.dataset.filtro);
        return;
      }
      grade.classList.add('obras__grade--saindo');
      trocando = setTimeout(() => {
        aplicar(chip.dataset.filtro);
        grade.classList.remove('obras__grade--saindo');
      }, 160);
    })
  );

  /* ---------- Diálogo ---------- */
  let origem = null;
  const abrir = (id, botao) => {
    const o = obras.find((x) => x.id === id);
    if (!o) return;
    origem = botao;
    const fotos = o.fotos?.length
      ? `<div class="obra-dialogo__fotos">${o.fotos.map((f) => `<img src="${f.src}"${f.srcset ? ` srcset="${f.srcset}" sizes="(max-width: 960px) 100vw, 920px"` : ''} width="${f.w}" height="${f.h}" alt="${esc(f.alt)}" decoding="async">`).join('')}</div>`
      : `<div class="obra-dialogo__fotos">${foto(o, true)}</div>`;
    const conta = o.contaAntesDepois
      ? `<div class="obra-dialogo__conta">
          <h3>A conta antes e depois</h3>
          <div class="obra-dialogo__contas">
            <figure><img src="${o.contaAntesDepois.antes}" width="${o.contaAntesDepois.w}" height="${o.contaAntesDepois.h}" alt="Conta de luz antes do sistema, com dados pessoais borrados" loading="lazy"><figcaption>Antes</figcaption></figure>
            <figure><img src="${o.contaAntesDepois.depois}" width="${o.contaAntesDepois.w}" height="${o.contaAntesDepois.h}" alt="Conta de luz depois do sistema, com dados pessoais borrados" loading="lazy"><figcaption>Depois</figcaption></figure>
          </div>
        </div>`
      : '';
    conteudo.innerHTML = `
      ${fotos}
      <div class="obra-dialogo__texto">
        <h2 class="obra-dialogo__titulo" id="obra-dialogo-titulo">${o.bairro}, ${o.cidade}</h2>
        ${o.exemplo ? `<p class="obra-dialogo__exemplo">${selo()} Obra e foto de exemplo, para mostrar como a página vai ficar.</p>` : ''}
        <dl class="obra-dialogo__dados">
          <div><dt class="mono">Potência</dt><dd>${formatarNumero(o.kwp, 1)} kWp</dd></div>
          <div><dt class="mono">Módulos</dt><dd>${o.modulos} × 550 W</dd></div>
          <div><dt class="mono">Telhado</dt><dd>${o.telhado}</dd></div>
          <div><dt class="mono">Ligação</dt><dd>${o.ligacao}</dd></div>
        </dl>
      </div>
      ${conta}`;
    dialogo.showModal();
    dialogo.querySelector('[data-fechar]').focus();
  };

  grade.addEventListener('click', (e) => {
    const b = e.target.closest('[data-abrir]');
    if (b) abrir(b.dataset.abrir, b);
  });

  const fechar = () => dialogo.close();
  dialogo.querySelector('[data-fechar]').addEventListener('click', fechar);
  // clique fora da caixa fecha
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) fechar();
  });
  dialogo.addEventListener('close', () => origem?.focus());
}
