import { empresa, preenchido } from '../data/empresa.js';
import { duvidas } from '../data/duvidas.js';

/* Dados estruturados: LocalBusiness só com campos preenchidos e FAQPage das dúvidas. */
export function render() {
  const e = empresa;
  const negocio = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: e.nome,
    description: `Energia solar residencial em ${e.cidade}, ${e.uf}: projeto, instalação e homologação na distribuidora em ${e.prazoDias} dias.`,
    url: e.site,
    image: `${e.site}/og.jpg`,
    areaServed: e.regiao,
    address: { '@type': 'PostalAddress', addressLocality: e.cidade, addressRegion: e.uf, addressCountry: 'BR' },
  };
  if (preenchido(e.endereco)) negocio.address.streetAddress = e.endereco;
  if (preenchido(e.whatsapp)) negocio.telephone = '+' + String(e.whatsapp).replace(/\D/g, '');
  if (preenchido(e.email)) negocio.email = e.email;
  if (preenchido(e.razaoSocial)) negocio.legalName = e.razaoSocial;
  if (preenchido(e.cnpj)) negocio.taxID = e.cnpj;
  if (preenchido(e.instagram)) negocio.sameAs = [e.instagram];
  if (!preenchido(e.site)) delete negocio.url;

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: duvidas.map((d) => ({ '@type': 'Question', name: d.p, acceptedAnswer: { '@type': 'Answer', text: d.r } })),
  };
  const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json(negocio)}</script>
    <script type="application/ld+json">${json(faq)}</script>`;
}
