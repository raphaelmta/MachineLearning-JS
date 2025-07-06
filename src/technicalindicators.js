/**
 * src/technicalindicators.js
 * * Este arquivo contém funções para calcular indicadores técnicos financeiros,
 * como Média Móvel Simples (SMA), Média Móvel Exponencial (EMA) e
 * Índice de Força Relativa (RSI).
 */


/**
 * Calcula a Média Móvel Simples (SMA).
 * @param {object} params - Parâmetros.
 * @param {number} params.period - O período da média móvel (ex: 10, 20).
 * @param {Array} params.data - O array de dados históricos.
 * @returns {Array<number>} Um array com os valores da SMA.
 */
export const SMA = ({ period, data }) => {
  const result = [];
  for (let i = 0; i <= data.length - period; i++) {
    const values = data.slice(i, i + period).map((e) => Number(e[1]["4. close"]));
    result.push(values.reduce((a, b) => a + b) / period);
  }
  return result;
};

/**
 * Calcula o Índice de Força Relativa (RSI).
 * @param {object} params - Parâmetros.
 * @param {number} params.period - O período do RSI (ex: 14).
 * @param {Array} params.data - O array de dados históricos.
 * @returns {Array<number>} Um array com os valores do RSI.
 */
export const RSI = ({ period, data }) => {
  const result = [];
  const changes = data.slice(1).map((e, i) => Number(e[1]["4. close"]) - Number(data[i][1]["4. close"]));

  for (let i = period - 1; i < changes.length; i++) {
    const slice = changes.slice(i - (period - 1), i + 1);
    const gains = slice.filter((c) => c > 0).reduce((a, b) => a + b, 0);
    const losses = Math.abs(slice.filter((c) => c < 0).reduce((a, b) => a + b, 0));
    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) {
      result.push(100);
      continue;
    }

    const rs = avgGain / avgLoss;
    result.push(100 - (100 / (1 + rs)));
  }
  return result;
};

/**
 * Calcula a Média Móvel Exponencial (EMA).
 * @param {object} params - Parâmetros.
 * @param {number} params.period - O período da EMA (ex: 10, 20).
 * @param {Array} params.data - O array de dados históricos.
 * @returns {Array<number>} Um array com os valores da EMA.
 */
export const EMA = ({ period, data }) => {
  const result = [];
  const multiplier = 2 / (period + 1);
  const initialSMA = data.slice(0, period).reduce((acc, val) => acc + Number(val[1]["4. close"]), 0) / period;
  result.push(initialSMA);

  for (let i = period; i < data.length; i++) {
    const close = Number(data[i][1]["4. close"]);
    const ema = (close - result[result.length - 1]) * multiplier + result[result.length - 1];
    result.push(ema);
  }
  return result;
};