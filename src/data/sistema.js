/*
 * A casa do hero. Caso ilustrativo, coerente com as premissas do simulador
 * (tarifa ~R$ 0,96/kWh, produtividade ~4,9 kWh por kWp por dia). [CONFIRMAR]
 */
export const sistema = {
  ilustrativo: true,
  paineis: 10,
  potenciaPainelW: 550,
  potenciaKwp: 5.5,
  geracaoDiaKwh: 27,
  geracaoMesKwh: 810,
  contaAntes: 780,
  contaDepois: 86,
  retorno: '2 anos e 9 meses',
  nota: 'Caso ilustrativo. A conta não zera: continuam a taxa mínima da distribuidora e a iluminação pública. O resultado de cada casa depende do consumo, do telhado e da tarifa.',
  // HUD do hero (ambientação; o mesmo dado aparece em texto na seção do caso)
  hud: { minutos: 10 * 60 + 40, inicioMinutos: 5 * 60 + 40, cidade: 'Goiânia', latitude: '16°40′S', agoraKw: 4.1, hojeKwh: 9.8, diaKwh: 27 },
};
