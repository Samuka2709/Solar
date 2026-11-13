/*
 * Parâmetros do simulador. Todos de exemplo, marcados [CONFIRMAR].
 * Enquanto precoConfirmado for false, o site não mostra economia em reais
 * nem retorno: diz que a proposta com preço sai depois da visita.
 */
export const premissas = {
  tarifa: 1.02, // R$/kWh com impostos, Neoenergia Coelba. Estimativa: confira na fatura [CONFIRMAR]
  irradiacao: 5.0, // horas de sol pleno por dia, média anual de Ilhéus (Atlas Brasileiro de Energia Solar, ~4,5 a 5,0) [CONFIRMAR]
  perdas: 0.125, // temperatura, cabos, inversor e sujeira [CONFIRMAR]
  potenciaPainelW: 550, // [CONFIRMAR]
  // kWh que a distribuidora cobra mesmo com o sistema (custo de disponibilidade)
  minimoKwh: { casa: 50, comercio: 100, rural: 50 }, // [CONFIRMAR] bifásico 50, trifásico 100
  contaMin: 200,
  contaMax: 2000,
  contaPadrao: 650,
  precoConfirmado: false, // [CONFIRMAR] ligue só com preço por kWp e tarifa conferidos
};

/** kWh gerados por kWp por dia, já descontadas as perdas (~4,4 em Ilhéus). */
export const produtividade = +(premissas.irradiacao * (1 - premissas.perdas)).toFixed(2);

/**
 * O sistema compensa o consumo menos a taxa mínima, que a distribuidora cobra
 * de qualquer forma. Arredonda para cima no número de painéis.
 */
export function simular(conta, tipo = 'casa') {
  const consumo = conta / premissas.tarifa;
  const minimo = premissas.minimoKwh[tipo] ?? 50;
  const aCompensar = Math.max(consumo - minimo, 0);
  const kwpNecessario = aCompensar / (produtividade * 30);
  const paineis = Math.max(2, Math.ceil(kwpNecessario / (premissas.potenciaPainelW / 1000)));
  const kwp = (paineis * premissas.potenciaPainelW) / 1000;
  const geracaoMes = kwp * produtividade * 30;
  return { consumo, paineis, kwp, geracaoMes };
}
