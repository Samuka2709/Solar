/* Dúvidas frequentes. Respostas curtas. [CONFIRMAR] marca o que a empresa precisa conferir. */
import { P, preenchido } from './empresa.js';

const financiamento = P; // [PREENCHER] como funciona; enquanto for P, a pergunta não aparece

const todas = [
  { p: 'Quanto custa instalar?', r: 'Depende do tamanho do sistema, que depende do seu consumo e do seu telhado. O preço fechado sai por escrito depois da visita técnica. Antes disso, a simulação mostra quantos painéis você vai precisar.' },
  { p: 'Quanto vou economizar?', r: 'A maior parte da conta, mas ela não zera. A distribuidora continua cobrando a taxa mínima (o custo de disponibilidade, de 30 a 100 kWh conforme o tipo de ligação), e a iluminação pública continua vindo na fatura.' },
  { p: 'Quanto tempo leva?', r: 'Cerca de 45 dias, da visita técnica à troca do medidor. A obra no telhado leva um ou dois dias; a maior parte do prazo é a análise e a vistoria da distribuidora, que podem variar.' },
  { p: 'Funciona em dia nublado?', r: 'Funciona, mas gera menos. O sistema é dimensionado pela média do ano: os meses mais ensolarados compensam os mais chuvosos, e o crédito que sobra num mês fica para os seguintes.' },
  { p: 'Fico com luz se faltar energia na rua?', r: 'Não. No sistema ligado à rede, o inversor desliga sozinho quando a rede cai, para proteger quem trabalha nela. Para ter luz na falta de energia é preciso bateria e um inversor próprio para isso.' },
  { p: 'Precisa de manutenção?', r: 'Pouca: limpeza dos painéis com água e pano macio e uma inspeção das conexões e do inversor, em média uma vez por ano.' }, // [CONFIRMAR] frequência
  { p: 'Quanto duram os equipamentos?', r: 'Os módulos costumam ter garantia de desempenho de 25 anos e o inversor de 5 a 10 anos, conforme o fabricante. As garantias exatas dos equipamentos usados vêm escritas na proposta.' }, // [CONFIRMAR] com equipamentos.js
  { p: 'Como funciona o financiamento?', r: financiamento },
];

export const duvidas = todas.filter((d) => preenchido(d.r));
