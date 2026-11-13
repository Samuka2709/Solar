const num = (d) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

/** R$ 1.234 (sem centavos, espaço fino não quebrável) */
export const formatarReais = (v) => 'R$ ' + num(0).format(Math.round(v));
export const formatarNumero = (v, d = 0) => num(d).format(v);
export const kwh = (v, d = 0) => `${num(d).format(v)} kWh`;
export const kwp = (v, d = 1) => `${num(d).format(v)} kWp`;
export const kw = (v, d = 1) => `${num(d).format(v)} kW`;

/** "R$ 1.234" → 1234 */
export function lerReais(texto) {
  const so = String(texto).replace(/[^\d]/g, '');
  return so ? parseInt(so, 10) : NaN;
}

/** (00) 00000-0000 */
export function mascaraTelefone(texto) {
  const d = String(texto).replace(/\D/g, '').slice(0, 11);
  if (!d.length) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
