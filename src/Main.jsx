/**
 * src/Main.jsx
 * * Este é o coração da aplicação. É um único e grande componente React que gerencia:
 * - O estado da aplicação (ticker, dados, resultados do modelo, etc.).
 * - A interface do usuário (layout, inputs, gráficos, abas, tabelas).
 * - A lógica de busca de dados da API no back-end.
 * - O treinamento do modelo de Inteligência Artificial com TensorFlow.js.
 * - A exibição dos resultados de forma interativa.
 */

import React, { useState, useRef, useEffect } from "react";
import { hot } from "react-hot-loader/root";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import * as tf from "@tensorflow/tfjs";
import { SMA, RSI, EMA } from "./technicalindicators";

// --- DADOS PARA A TABELA DE SUGESTÕES ---
// Uma lista estática de tickers para sugerir ao usuário, facilitando o uso.
const suggestedTickers = [
  { symbol: "LKNCY", name: "Luckin Coffee Inc." }, { symbol: "MMM", name: "3M Company" },
  { symbol: "TSLA", name: "Tesla, Inc." }, { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "PLTR", name: "Palantir Technologies Inc." }, { symbol: "VRT", name: "Vertiv Holdings Co" },
  { symbol: "XOM", name: "Exxon Mobil Corporation" }, { symbol: "META", name: "Meta Platforms, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" }, { symbol: "DDOG", name: "Datadog, Inc." },
  { symbol: "AMZN", name: "Amazon.com, Inc." }
];

// --- ESTILOS DA APLICAÇÃO (CSS-in-JS) ---
// Define uma paleta de cores para ser usada de forma consistente na aplicação.
const theme = {
  bg: '#121a2a', bgLighter: '#1f2937', border: '#374151', textPrimary: '#f9fafb',
  textSecondary: '#9ca3af', accent: '#22d3ee', gain: '#10b981', loss: '#ef4444',
};

// Objeto que contém todos os estilos dos componentes. Esta abordagem (CSS-in-JS)
// mantém os estilos junto com a lógica do componente, evitando a necessidade de arquivos .css externos.
const styles = {
  container: { backgroundColor: theme.bg, color: theme.textPrimary, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif", minHeight: '100vh', padding: '2rem 1.5rem', },
  mainContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', },
  header: { textAlign: 'center', paddingBottom: '1rem', borderBottom: `1px solid ${theme.border}`, },
  headerH1: { fontSize: '2.5rem', fontWeight: 'bold', color: theme.textPrimary, margin: '0 0 0.5rem 0', },
  headerP: { fontSize: '1.1rem', color: theme.textSecondary, margin: 0, },
  card: { backgroundColor: theme.bgLighter, padding: '1.5rem', borderRadius: '12px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', },
  inputArea: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', },
  input: { flex: '1', minWidth: '200px', padding: '12px', fontSize: '1rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.bg, color: theme.textPrimary, },
  button: { padding: '12px 24px', fontSize: '1rem', fontWeight: '600', border: 'none', borderRadius: '8px', backgroundColor: theme.accent, color: theme.bg, cursor: 'pointer', transition: 'all 0.2s ease', },
  buttonDisabled: { backgroundColor: theme.textSecondary, cursor: 'not-allowed', },
  statusBar: { textAlign: 'center', color: theme.textSecondary, padding: '0.5rem', },
  tabs: { display: 'flex', borderBottom: `1px solid ${theme.border}`, marginBottom: '1.5rem', },
  tabButton: { padding: '1rem 1.5rem', border: 'none', background: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '1rem', fontWeight: '500', borderBottom: '3px solid transparent', transition: 'all 0.2s', },
  activeTabButton: { color: theme.accent, borderBottom: `3px solid ${theme.accent}`, },
  predictionSummary: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', },
  predictionCard: { backgroundColor: theme.bg, padding: '1.5rem', borderRadius: '8px', textAlign: 'center', },
  predictionCardTitle: { margin: '0 0 0.75rem 0', color: theme.textSecondary, fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', },
  predictionCardValue: { margin: 0, fontSize: '1.75rem', fontWeight: 'bold', },
  calculatorInput: { display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '300px', marginBottom: '1.5rem', },
  modelLogs: { backgroundColor: '#000', border: `1px solid ${theme.border}`, padding: '1rem', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', fontSize: '0.85rem', fontFamily: 'monospace', color: '#0f0', },
  suggestionContainer: { display: 'flex', flexDirection: 'column', gap: '1rem', },
  suggestionButton: { padding: '8px 16px', fontSize: '0.9rem', fontWeight: '500', alignSelf: 'flex-start', backgroundColor: 'transparent', color: theme.accent, border: `1px solid ${theme.accent}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease', },
  tableContainer: { width: '100%', overflowX: 'auto', },
  suggestionTable: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', },
  suggestionTableTh: { padding: '12px', borderBottom: `2px solid ${theme.border}`, color: theme.textSecondary, textTransform: 'uppercase', fontSize: '0.8rem', },
  suggestionTableTd: { padding: '12px', borderBottom: `1px solid ${theme.border}`, },
  suggestionTableRow: { cursor: 'pointer', transition: 'background-color 0.2s ease', },
  sectionTitle: { marginTop: '2rem', color: theme.textSecondary, borderBottom: `1px solid ${theme.border}`, paddingBottom: '0.5rem', fontWeight: '500', },
  explanationText: { color: theme.textSecondary, lineHeight: '1.6', fontSize: '1.05rem', backgroundColor: theme.bg, padding: '1rem', borderRadius: '8px', borderLeft: `4px solid ${theme.accent}` }
};

/**
 * Componente para a tabela de sugestão de Tickers.
 * @param {object} props - Propriedades do componente.
 * @param {Array} props.tickers - A lista de tickers a ser exibida.
 * @param {Function} props.onTickerSelect - Função a ser chamada quando um ticker é clicado.
 * @param {object} props.styles - O objeto de estilos da aplicação.
 */
const TickerSuggestionTable = ({ tickers, onTickerSelect, styles }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  return (
    <div style={styles.tableContainer}>
      <table style={styles.suggestionTable}>
        <thead><tr><th style={styles.suggestionTableTh}>Símbolo</th><th style={styles.suggestionTableTh}>Nome da Empresa</th></tr></thead>
        <tbody>
          {tickers.map((ticker, index) => (
            <tr key={ticker.symbol} onClick={() => onTickerSelect(ticker.symbol)} style={{...styles.suggestionTableRow, backgroundColor: hoveredRow === index ? theme.bg : 'transparent'}} onMouseEnter={() => setHoveredRow(index)} onMouseLeave={() => setHoveredRow(null)}>
              <td style={{...styles.suggestionTableTd, color: theme.accent, fontWeight: 'bold'}}>{ticker.symbol}</td>
              <td style={styles.suggestionTableTd}>{ticker.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Componente para gerar o texto explicativo sobre o resultado do modelo.
 */
const ModelExplanation = ({ ticker, result, styles }) => {
  if (!result) return null;
  const direction = result.nextDayChange >= 0 ? "uma VALORIZAÇÃO" : "uma DESVALORIZAÇÃO";
  const formattedChange = `${(result.nextDayChange * 100).toFixed(2)}%`.replace('-', '');

  return (
    <div style={styles.explanationText}>
      Com base nos padrões dos últimos 30 dias de indicadores técnicos (como Médias Móveis e RSI), o modelo de IA previu {direction} para o ativo <strong>{ticker}</strong> no próximo dia de negociação, com uma variação estimada de <strong>{formattedChange}</strong>, projetando o preço para <strong>{result.nextDayValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>.
    </div>
  );
};


const Main = () => {
  // --- ESTADO DA APLICAÇÃO ---
  // Hooks 'useState' do React para gerenciar o estado da aplicação.
  const [ticker, setTicker] = useState("Digite o TICKER"); // Armazena o ticker atual.
  const [series, setSeries] = useState([]); // Armazena os dados para o gráfico Highcharts.
  const [statusMessage, setStatusMessage] = useState("Insira um ticker para começar."); // Mensagens de status para o usuário.
  const [isModelTraining, setIsModelTraining] = useState(false); // Flag para indicar se o modelo está treinando.
  const [modelLogs, setModelLogs] = useState([]); // Armazena os logs de cada época do treinamento.
  const [modelResultTraining, setModelResultTraining] = useState(null); // Armazena o objeto de resultado final da previsão.
  const [activeTab, setActiveTab] = useState('prediction'); // Controla qual aba de resultado está ativa.
  const [investmentValue, setInvestmentValue] = useState(1000); // Armazena o valor do investimento na calculadora.
  const [showTickerTable, setShowTickerTable] = useState(false); // Controla a visibilidade da tabela de sugestões.
  
  // Nomes das colunas para a tabela de base de cálculo. A ordem deve ser a mesma dos dados.
  const featureNames = [
    'Open', 'High', 'Low', 'Close', 'Volume', 'EMA10', 'EMA20', 'EMA50',
    'SMA10', 'SMA20', 'SMA50', 'SMA100', 'RSI7', 'RSI14', 'RSI28'
  ];

  /**
   * Hook 'useEffect' para otimização.
   * Executa uma vez quando o componente é montado para configurar o backend do TensorFlow.js
   * para usar a GPU (via WebGL), o que acelera drasticamente o treinamento.
   */
  useEffect(() => {
    const setupBackend = async () => {
      await tf.setBackend('webgl');
      console.log("Backend do TensorFlow.js configurado para 'webgl' (GPU).");
    };
    setupBackend();
  }, []); // O array vazio [] garante que rode apenas na montagem do componente.

  /**
   * Função principal que orquestra a busca de dados e o início do treinamento.
   * É chamada quando o usuário clica no botão "Analisar Ativo".
   */
  const handleFetchAndTrain = async () => {
    if (!ticker) {
      setStatusMessage("Por favor, insira um ticker de ação.");
      return;
    }

    // Reseta os estados para uma nova análise
    setStatusMessage(`Buscando dados para ${ticker} via Yahoo Finance...`);
    setIsModelTraining(true);
    setModelResultTraining(null);
    setModelLogs([]);
    setSeries([]);

    try {
      // 1. Busca os dados na nossa API local (que por sua vez busca no Yahoo Finance)
      const response = await fetch(`/api/yfinance/${ticker}`);
      const formatedData = await response.json();

      if (formatedData.error || formatedData.length === 0) {
        throw new Error(formatedData.error || "Nenhum dado retornado. O ticker pode ser inválido.");
      }

      // 2. Prepara os dados para o gráfico de Candlestick e Volume
      const candlestickData = formatedData.map(d => [d.time, d.open, d.high, d.low, d.close]);
      const volumeData = formatedData.map(d => [d.time, d.volume]);

      setSeries([
        { type: 'candlestick', name: `${ticker} Preço`, data: candlestickData, id: ticker },
        { type: 'column', name: `${ticker} Volume`, data: volumeData, yAxis: 1 }
      ]);

      // 3. Prepara os dados para o modelo de IA e inicia o treinamento
      setStatusMessage("Dados carregados. Iniciando treinamento do modelo...");
      const modelInputData = formatedData.map(d => [d.time, {
        "1. open": d.open, "2. high": d.high, "3. low": d.low, "4. close": d.close, "5. volume": d.volume
      }]);
      await trainModel(modelInputData);

    } catch (error) {
      console.error("Erro na busca ou treinamento:", error);
      setStatusMessage(`Erro: ${error.message}`);
      setIsModelTraining(false);
    }
  };

  /**
   * O coração da IA. Esta função prepara os dados, treina o modelo LSTM e gera a previsão.
   * @param {Array} inputData - Dados históricos brutos recebidos da API.
   */
  const trainModel = async (inputData) => {
    // Janela de análise: o modelo olhará 30 dias para trás para prever o próximo.
    const LOOKBACK_PERIOD = 30;

    // 1. Calcula todos os indicadores técnicos necessários.
    const dataEma10 = EMA({ period: 10, data: inputData });
    const dataEma20 = EMA({ period: 20, data: inputData });
    const dataEma50 = EMA({ period: 50, data: inputData });
    const dataSma10 = SMA({ period: 10, data: inputData });
    const dataSma20 = SMA({ period: 20, data: inputData });
    const dataSma50 = SMA({ period: 50, data: inputData });
    const dataSma100 = SMA({ period: 100, data: inputData });
    const dataRsi7 = RSI({ period: 7, data: inputData });
    const dataRsi14 = RSI({ period: 14, data: inputData });
    const dataRsi28 = RSI({ period: 28, data: inputData });

    // 2. Alinha os dados, removendo os dias iniciais onde os indicadores ainda não podiam ser calculados.
    const basePeriod = Math.max(
      inputData.length - dataEma10.length, inputData.length - dataEma20.length, inputData.length - dataEma50.length, 
      inputData.length - dataSma10.length, inputData.length - dataSma20.length, inputData.length - dataSma50.length, 
      inputData.length - dataSma100.length, inputData.length - dataRsi7.length, inputData.length - dataRsi14.length, 
      inputData.length - dataRsi28.length
    );
    
    // 3. Monta o array de "features" (características) que o modelo usará para aprender.
    const allFeaturesData = inputData.slice(basePeriod).map((e, i) => ([
        Number(e[1]["1. open"]), Number(e[1]["2. high"]), Number(e[1]["3. low"]), Number(e[1]["4. close"]),
        Number(e[1]["5. volume"]), dataEma10[i], dataEma20[i], dataEma50[i],
        dataSma10[i], dataSma20[i], dataSma50[i], dataSma100[i],
        dataRsi7[i], dataRsi14[i], dataRsi28[i]
    ]));

    // 4. Limpeza de Dados: passo crucial para remover qualquer linha com valores inválidos (null, NaN, Infinity).
    const cleanedData = allFeaturesData.filter(row => row.every(cell => cell != null && !isNaN(cell) && isFinite(cell)));

    if (cleanedData.length < LOOKBACK_PERIOD + 50) {
        throw new Error("Não há dados suficientes para treinar o modelo após a limpeza.");
    }
    
    // 5. Normalização dos Dados: transforma todos os números para uma escala entre 0 e 1.
    // Isso estabiliza o treinamento e evita o erro 'NaN'.
    const inputsTensor = tf.tensor2d(cleanedData);
    const inputMax = inputsTensor.max(0);
    const inputMin = inputsTensor.min(0);
    const normalizedInputs = inputsTensor.sub(inputMin).div(inputMax.sub(inputMin));

    // 6. Estruturação em Sequências: agrupa os dados em "janelas" de 30 dias para o modelo LSTM.
    const sequences = [];
    const labels = [];
    const normalizedDataArray = await normalizedInputs.array();
    
    for (let i = 0; i < normalizedDataArray.length - LOOKBACK_PERIOD; i++) {
        sequences.push(normalizedDataArray.slice(i, i + LOOKBACK_PERIOD));
        labels.push(normalizedDataArray[i + LOOKBACK_PERIOD][3]); // O alvo é o preço de fechamento (índice 3)
    }

    const x_train = tf.tensor3d(sequences);
    const y_train = tf.tensor2d(labels, [labels.length, 1]);

    const onEpochEnd = (epoch, logs) => {
        const log = `Época ${epoch + 1}/${100} - Perda: ${logs.loss.toFixed(6)}`;
        setModelLogs(prevLogs => [...prevLogs, log]);
    };

    // 7. Definição do Modelo LSTM: cria a arquitetura da rede neural.
    const model = tf.sequential();
    model.add(tf.layers.lstm({ units: 50, returnSequences: true, inputShape: [LOOKBACK_PERIOD, x_train.shape[2]] }));
    model.add(tf.layers.dropout({ rate: 0.2 })); // Dropout ajuda a prevenir overfitting.
    model.add(tf.layers.lstm({ units: 50, returnSequences: false }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    // 8. Treinamento do Modelo
    await model.fit(x_train, y_train, { epochs: 100, batchSize: 32, shuffle: true, callbacks: { onEpochEnd } });

    // 9. Geração da Previsão
    const lastSequence = normalizedDataArray.slice(normalizedDataArray.length - LOOKBACK_PERIOD);
    const x_test = tf.tensor3d([lastSequence]);
    const y_test_predict_normalized = model.predict(x_test);

    // 10. De-normalização: "traduz" o resultado de volta para a escala de preço original.
    const closePriceColumn = 3; 
    const closePriceMin = inputMin.slice([closePriceColumn], [1]);
    const closePriceMax = inputMax.slice([closePriceColumn], [1]);
    const unnormalizedPrediction = y_test_predict_normalized.mul(closePriceMax.sub(closePriceMin)).add(closePriceMin);
    const nextDayPrediction = unnormalizedPrediction.dataSync()[0];

    const lastClose = cleanedData[cleanedData.length-1][closePriceColumn];
    
    if (isNaN(nextDayPrediction)) {
        throw new Error("O modelo ainda resultou em uma previsão inválida (NaN) mesmo após a normalização.");
    }

    // 11. Calcula os resultados finais e atualiza o estado para exibir na UI.
    const dailyChange = (nextDayPrediction - lastClose) / lastClose;
    const tradingDaysIn3Months = 63;
    const threeMonthProjection = lastClose * Math.pow(1 + dailyChange, tradingDaysIn3Months);

    setModelResultTraining({
        lastClose,
        nextDayValue: nextDayPrediction,
        nextDayChange: dailyChange,
        threeMonthProjection,
        predictionFeatures: cleanedData[cleanedData.length-1].slice(1, featureNames.length + 1) // Captura as features usadas
    });

    setIsModelTraining(false);
    setStatusMessage(`Previsão para ${ticker} concluída.`);
  };
  
  // --- FUNÇÕES AUXILIARES E OPÇÕES DO GRÁFICO ---
  const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatPercentage = (value) => {
    const color = value >= 0 ? theme.gain : theme.loss;
    const sign = value >= 0 ? '+' : '';
    return <span style={{ color }}>{sign}{(value * 100).toFixed(2)}%</span>;
  };
  const handleTickerSelect = (selectedTicker) => {
    setTicker(selectedTicker);
    setShowTickerTable(false);
  };
  
  const chartOptions = {
    chart: { backgroundColor: theme.bgLighter, }, credits: { enabled: false }, title: { text: "", style: { color: theme.textPrimary } },
    legend: { itemStyle: { color: theme.textSecondary } },
    yAxis: [
      { labels: { align: 'right', x: -3, style: {color: theme.textSecondary} }, title: { text: 'Preço', style: {color: theme.textSecondary} }, height: '60%', lineWidth: 2, resize: { enabled: true }, gridLineColor: theme.border },
      { labels: { align: 'right', x: -3, style: {color: theme.textSecondary} }, title: { text: 'Volume', style: {color: theme.textSecondary} }, top: '65%', height: '35%', offset: 0, lineWidth: 2, gridLineColor: theme.border }
    ],
    series: series, navigator: { adaptToUpdatedData: true, }, scrollbar: { liveRedraw: true }, rangeSelector: { selected: 1 }
  };
  
  // --- RENDERIZAÇÃO DO COMPONENTE (JSX) ---
  return (
    <div style={styles.container}>
      <main style={styles.mainContent}>
        {/* Cabeçalho da Aplicação */}
        <header style={styles.header}>
          <h1 style={styles.headerH1}>Dashboard de Análise Preditiva</h1>
          <p style={styles.headerP}>Use IA para obter insights sobre ativos financeiros</p>
        </header>
        
        {/* Área de Inputs do Usuário */}
        <div style={{...styles.card, ...styles.suggestionContainer}}>
          <div style={styles.inputArea}>
            <input
              style={styles.input}
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Ex: TSLA, AAPL"
            />
            <button
              style={{...styles.button, ...(isModelTraining && styles.buttonDisabled)}}
              onClick={handleFetchAndTrain}
              disabled={isModelTraining}
            >
              {isModelTraining ? "Processando..." : "Analisar Ativo"}
            </button>
          </div>
          <button style={styles.suggestionButton} onClick={() => setShowTickerTable(!showTickerTable)}>
            {showTickerTable ? 'Ocultar Sugestões' : 'Sugerir Tickers'}
          </button>
          {showTickerTable && <TickerSuggestionTable tickers={suggestedTickers} onTickerSelect={handleTickerSelect} styles={styles} />}
        </div>
        
        {/* Barra de Status */}
        <div style={styles.statusBar}><p>{statusMessage}</p></div>
        
        {/* Gráfico */}
        {series.length > 0 && (
          <div style={styles.card}>
            <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={chartOptions} />
          </div>
        )}
        
        {/* Resultados e Calculadora */}
        {modelResultTraining && (
          <div style={styles.card}>
            <div style={styles.tabs}>
              <button style={{...styles.tabButton, ...(activeTab === 'prediction' && styles.activeTabButton)}} onClick={() => setActiveTab('prediction')}>
                Previsão do Modelo
              </button>
              <button style={{...styles.tabButton, ...(activeTab === 'calculator' && styles.activeTabButton)}} onClick={() => setActiveTab('calculator')}>
                Calculadora de Investimento
              </button>
            </div>
            
            {activeTab === 'prediction' && (
              <div>
                <ModelExplanation ticker={ticker} result={modelResultTraining} styles={styles} />
                <div style={{...styles.predictionSummary, marginTop: '1.5rem'}}>
                  <div style={styles.predictionCard}>
                    <h4 style={styles.predictionCardTitle}>Último Fechamento</h4>
                    <p style={styles.predictionCardValue}>{formatCurrency(modelResultTraining.lastClose)}</p>
                  </div>
                  <div style={styles.predictionCard}>
                    <h4 style={styles.predictionCardTitle}>Previsão (Próximo Dia)</h4>
                    <p style={styles.predictionCardValue}>{formatCurrency(modelResultTraining.nextDayValue)} ({formatPercentage(modelResultTraining.nextDayChange)})</p>
                  </div>
                  <div style={styles.predictionCard}>
                    <h4 style={styles.predictionCardTitle}>Projeção Tendência (3 Meses)</h4>
                    <p style={styles.predictionCardValue}>{formatCurrency(modelResultTraining.threeMonthProjection)}</p>
                  </div>
                </div>

                <div style={{marginTop: '2rem'}}>
                    <h3 style={styles.sectionTitle}>Base de Cálculo da Previsão</h3>
                    <p style={{color: theme.textSecondary, fontSize: '0.9rem'}}>O modelo usou a sequência dos últimos 30 dias de dados, sendo que o dia mais recente (usado como base principal) tinha os seguintes indicadores:</p>
                    <div style={styles.tableContainer}>
                        <table style={styles.suggestionTable}>
                           <thead>
                             <tr>
                               <th style={styles.suggestionTableTh}>Indicador</th>
                               <th style={styles.suggestionTableTh}>Valor</th>
                             </tr>
                           </thead>
                           <tbody>
                                {featureNames.map((name, index) => (
                                    <tr key={name}>
                                        <td style={{...styles.suggestionTableTd, fontWeight: 'bold', color: theme.textSecondary}}>{name}</td>
                                        <td style={styles.suggestionTableTd}>{modelResultTraining.predictionFeatures[index].toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
              </div>
            )}
            
            {activeTab === 'calculator' && (
              <div>
                <div style={styles.calculatorInput}>
                  <label htmlFor="investment" style={{marginBottom: '0.5rem', color: theme.textSecondary}}>Seu Investimento (R$)</label>
                  <input style={styles.input} id="investment" type="number" value={investmentValue} onChange={(e) => setInvestmentValue(Number(e.target.value))} />
                </div>
                <div style={styles.predictionSummary}>
                   <div style={styles.predictionCard}>
                     <h4 style={styles.predictionCardTitle}>Valor Projetado (Próximo Dia)</h4>
                     <p style={styles.predictionCardValue}>{formatCurrency(investmentValue * (1 + modelResultTraining.nextDayChange))}</p>
                   </div>
                   <div style={styles.predictionCard}>
                     <h4 style={styles.predictionCardTitle}>Valor Projetado (3 Meses)</h4>
                     <p style={styles.predictionCardValue}>{formatCurrency(investmentValue * (modelResultTraining.threeMonthProjection / modelResultTraining.lastClose))}</p>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Logs de Treinamento */}
        {isModelTraining && modelLogs.length > 0 && (
          <div style={{...styles.card, marginTop: '2rem'}}>
            <h3 style={styles.sectionTitle}>Log de Treinamento</h3>
            <div style={styles.modelLogs}>
              {modelLogs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default hot(Main);