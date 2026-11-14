import { empresa, preenchido } from '../data/empresa.js';
import { linksNav } from './nav.render.js';
import { asterisco, iconeWhatsapp } from './comum.js';
import { linkContato, mensagemPadrao } from '../lib/whatsapp.js';
import { esc } from '../lib/formato.js';

const telefone = (d) => {
  const n = String(d).replace(/\D/g, '').replace(/^55/, '');
  return n.length === 11 ? `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}` : n;
};

/** base = '' na home; '/' nas páginas internas, para os links de seção voltarem à home. */
export function render(base = '') {
  const e = empresa;
  const contato = [
    preenchido(e.whatsapp) && `<li><a href="${linkContato(mensagemPadrao()).href}" target="_blank" rel="noopener">WhatsApp ${telefone(e.whatsapp)}</a></li>`,
    preenchido(e.email) && `<li><a href="mailto:${e.email}">${esc(e.email)}</a></li>`,
    preenchido(e.endereco) && `<li>${esc(e.endereco)}</li>`,
    preenchido(e.horario) && `<li>${esc(e.horario)}</li>`,
    preenchido(e.instagram) && `<li><a href="${e.instagram}" target="_blank" rel="noopener">Instagram</a></li>`,
  ].filter(Boolean);
  const legal = [
    preenchido(e.razaoSocial) && esc(e.razaoSocial),
    preenchido(e.cnpj) && `CNPJ ${esc(e.cnpj)}`,
  ].filter(Boolean);

  // Mapa: o endereço, quando houver; até lá, a cidade (área de atendimento)
  const local = preenchido(e.endereco) ? `${e.endereco}, ${e.cidade}, ${e.uf}` : `${e.cidade}, ${e.uf}`;
  const q = encodeURIComponent(local);
  const zap = linkContato(mensagemPadrao());

  return `<footer class="rodape" data-tema="escuro">
  <div class="rodape__grade">
    <div class="rodape__marca">
      <p class="rodape__nome">${e.nome}<span class="rodape__sol">${asterisco()}</span></p>
      <p class="rodape__frase">${e.frase}</p>
    </div>
    <nav class="rodape__col" aria-label="Seções">
      <ul>
        ${linksNav.map((l) => `<li><a href="${base}${l.href}">${l.texto}</a></li>`).join('')}
        <li><a href="${base}#contato">Contato</a></li>
      </ul>
    </nav>
    <div class="rodape__col rodape__atende">
      <p class="rodape__titulo">Atendimento</p>
      <p>${esc(e.regiao)}</p>
      ${preenchido(e.respostaEm) ? `<p class="rodape__resposta">Resposta em ${esc(e.respostaEm)}.</p>` : ''}
      ${contato.length ? `<ul>${contato.join('')}</ul>` : ''}
      <a class="rodape__zap" href="${zap.href}" target="_blank" rel="noopener">${iconeWhatsapp}<span>Falar no WhatsApp</span></a>
    </div>
    <figure class="rodape__mapa">
      <iframe src="https://www.google.com/maps?q=${q}&amp;z=13&amp;hl=pt-BR&amp;output=embed" title="Mapa: ${esc(local)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </figure>
  </div>
  <div class="rodape__base">
    ${legal.length ? `<p>${legal.join(' · ')}</p>` : ''}
    <p><a href="/politica-de-privacidade.html">Política de privacidade</a></p>
    <p class="rodape__demo">${e.nome} é uma marca de demonstração. Números, obras e prazos desta página são exemplos.</p>
  </div>
</footer>`;
}
