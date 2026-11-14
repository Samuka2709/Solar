# Pendências: o que a empresa precisa fornecer

SolarisX é uma marca de demonstração. O site está pronto para receber os dados reais, mas tudo abaixo ainda é exemplo ou está em branco.

Legenda:
- **[PREENCHER]**: falta o dado. Enquanto não houver, o item **não aparece** na tela.
- **[CONFIRMAR]**: há um valor de exemplo **na tela**, com o selo "exemplo". A empresa precisa conferir ou trocar.

## 1. Contato e dados legais (`src/data/empresa.js`)

**Nome da marca:** troque só a constante `NOME` no topo de `src/data/empresa.js`. Ela vale para o hero, os títulos das páginas, a prévia do link, as mensagens do WhatsApp e a política de privacidade. O nome do hero encolhe sozinho se tiver mais de 6 letras.

| Campo | Situação | Onde aparece |
|---|---|---|
| `whatsapp` (só dígitos, com 55 + DDD) | [CONFIRMAR] hoje com um número de teste do dono da demonstração; troque pelo da empresa | Simulador, contato final, botão fixo, dúvidas, rodapé, JSON-LD |
| `email` | [PREENCHER] | Rodapé, JSON-LD; vira o canal do simulador se não houver WhatsApp |
| `endereco` | [PREENCHER] | Rodapé, JSON-LD |
| `horario` | [PREENCHER] | Rodapé |
| `instagram` (URL) | [PREENCHER] | Rodapé, JSON-LD |
| `googleAvaliacoes` (URL do perfil) | [PREENCHER] | Reservado para os depoimentos |
| `razaoSocial` | [PREENCHER] | Rodapé, JSON-LD |
| `cnpj` | [PREENCHER] | Rodapé, JSON-LD |
| `responsavelTecnico.nome` e `.crea` | [PREENCHER] | "Quem faz" |
| `site` (domínio real) | [PREENCHER] | Hoje é o endereço da demonstração (`https://solar-six-lyart.vercel.app`). As páginas puxam daqui (canonical, og:url, og:image); só `public/robots.txt` e `public/sitemap.xml` precisam ser trocados à mão |
| `prazoDias` = 45 | [CONFIRMAR] | Hero, régua, compromissos, dúvidas |
| `respostaEm` = "até um dia útil" | [CONFIRMAR] | Contato final |
| `sobre` (3 frases) | [CONFIRMAR] | "Quem faz" |
| `compromissos` (3 frases) | [CONFIRMAR] | "O que vai no seu telhado". Deixe só os que a empresa cumpre de verdade |
| `equipe` (fotos reais em obra) | [PREENCHER] | "Quem faz". Enquanto estiver vazio, aparece `fotoIlustrativa` (Unsplash, com o selo "foto ilustrativa"). Para publicar uma empresa real, preencha `equipe` ou apague `fotoIlustrativa` |

> **Sem WhatsApp nem e-mail configurados**, os botões de contato abrem `wa.me/?text=…`: o WhatsApp abre com a mensagem pronta, mas a pessoa escolhe o contato. Funciona, mas não chega à empresa. **Preencha o WhatsApp antes de publicar.**

## 2. Caso da casa do hero (`src/data/sistema.js`)
- [CONFIRMAR] 10 × 550 W, 5,5 kWp, 24 kWh/dia, 722 kWh/mês, conta de R$ 780 para R$ 86, retorno de 2 anos e 9 meses. Na tela aparece como **caso ilustrativo**. Se houver um caso real documentado, troque pelos números dele.
- [CONFIRMAR] Números do HUD (10:40, 4,1 kW, 9,8 de 24 kWh). São só ambientação.

## 3. Simulador (`src/data/premissas.js`)
- [CONFIRMAR] Tarifa: R$ 1,02/kWh com impostos (Neoenergia Coelba). É uma **estimativa**: confira o valor por kWh numa fatura recente.
- [CONFIRMAR] Irradiação: 5,0 h de sol pleno por dia em Ilhéus (Atlas Brasileiro de Energia Solar; estudos locais dão de 4,5 a 5,0); perdas de 12,5%. Com isso, a produtividade fica em 4,4 kWh por kWp por dia.
- [CONFIRMAR] Potência do painel: 550 W.
- [CONFIRMAR] Custo mínimo: 50 kWh para casa e rural, 100 kWh para comércio.
- [CONFIRMAR] `precoConfirmado: false`. Enquanto estiver assim, o site **não mostra preço nem retorno**. A economia em reais aparece sempre, como **média estimada** (energia compensada × tarifa), com o aviso de que não é promessa; ela depende da `tarifa` estar certa.
- Observação: o sistema é dimensionado para o consumo **menos** a taxa mínima, arredondando para cima. Com isso, R$ 780 dá 10 painéis (bate com o caso) e R$ 650 dá **9 painéis (4,95 kWp)**, como no exemplo do briefing. Se a empresa dimensiona de outro jeito, ajuste `simular()`.

## 4. Régua de 45 dias (`src/data/etapas.js`)
- [CONFIRMAR] Intervalos: 1–3, 4–8, 9–30, 31–33 e 34–45 dias. O trecho da distribuidora é o que mais varia.

## 5. Obras (`src/data/obras.js`)
- [CONFIRMAR] As 5 obras atuais são **exemplos** (selo "exemplo"): Pontal, Cidade Nova e Malhado (Ilhéus), Centro (Itabuna) e zona rural de Uruçuca.
- [PREENCHER] As fotos são **ilustrativas, do Unsplash** (ver `CREDITOS.md`), só para apresentar o modelo. Para uma empresa real, troque pelas fotos das obras dela: WebP ou AVIF em 640 e 1280 px, mais bairro, cidade, kWp, módulos e mês de ligação. Sem foto, o card volta para a moldura "foto da obra".
- [PREENCHER] Conta antes e depois: só se documentada e **autorizada** pelo cliente, com os dados pessoais já borrados na imagem.

## 6. Equipamentos (`src/data/equipamentos.js`)
- [PREENCHER] Marca e garantia de módulos, estrutura, inversor e monitoramento. Só marcas realmente usadas e autorizadas.

## 7. Depoimentos (`src/data/depoimentos.js`)
- [PREENCHER] Só avaliações reais do Google, com nome autorizado, nota, data e link. Vazio = a seção não existe (é o estado atual).

## 8. Dúvidas (`src/data/duvidas.js`)
- [PREENCHER] Financiamento: escreva como funciona. Enquanto estiver em branco, a pergunta não aparece.
- [CONFIRMAR] Frequência de manutenção ("em média uma vez por ano").
- [CONFIRMAR] Garantias citadas (25 anos de desempenho nos módulos, 5 a 10 anos no inversor). Precisam bater com os equipamentos usados.

## 9. Política de privacidade (`politica-de-privacidade.html`)
- [CONFIRMAR] O texto-base está escrito e tem o selo "exemplo". Revisar com o jurídico e incluir razão social, CNPJ e um contato para assuntos de privacidade.

## 10. Rodapé
- O mapa do Google Maps mostra a cidade enquanto `endereco` estiver em branco; com o endereço preenchido, aponta para ele.
- A frase "SolarisX é uma marca de demonstração…" sai quando os dados forem reais (`src/sections/rodape.render.js`).
