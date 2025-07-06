# 📊 Dashboard de Análise Preditiva de Ativos com IA

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black)

## 🧭 Visão Geral

Este projeto é uma aplicação web interativa desenvolvida com **React.js** e **TensorFlow.js**, focada na previsão de preços de ativos financeiros. A aplicação permite ao usuário inserir um ticker de mercado (ex: `NVDA`) e obter previsões com base em séries temporais utilizando uma arquitetura de rede neural LSTM.

Todo o processamento — desde a aquisição dos dados até o treinamento e inferência do modelo — é realizado diretamente no navegador 🧠, aproveitando recursos de computação client-side com suporte a WebGL ⚡.

---

## ✨ Funcionalidades

- 🔍 Consulta dinâmica de dados históricos de ações via Yahoo Finance
- 🧪 Treinamento de modelo LSTM em tempo real com TensorFlow.js
- 📈 Visualização gráfica com candlestick e volume por meio de Highcharts
- 🔮 Projeção de preço para o próximo dia útil
- 📉 Tendência futura estimada para horizonte de 3 meses
- 💰 Simulador de retorno baseado nas previsões geradas
- 📱 Interface responsiva com suporte a dispositivos móveis

---

## 🧠 Arquitetura do Modelo

A arquitetura da rede neural foi projetada para lidar com séries temporais financeiras, utilizando o modelo **LSTM (Long Short-Term Memory)** — uma variante das redes neurais recorrentes (RNN) que é eficaz na captura de dependências de longo prazo.

### 🔄 Camadas LSTM
São utilizadas **duas camadas LSTM empilhadas**, cada uma com 50 neurônios. A primeira camada retorna sequências para alimentar a segunda, permitindo ao modelo capturar padrões mais profundos nas sequências de entrada.

**Características das LSTM:**
- Armazena informações relevantes por longos períodos
- Possui “portas” que controlam o fluxo de informações (entrada, esquecimento, saída)
- Evita o problema do desaparecimento/explosão do gradiente comum em RNNs tradicionais

### 🌧️ Camadas Dropout
Para evitar o **overfitting**, são aplicadas camadas de **Dropout** (com taxa de 20%) após cada LSTM. Essas camadas desativam aleatoriamente uma fração dos neurônios durante o treinamento, forçando o modelo a aprender padrões mais robustos.

### 🎯 Camada de Saída (Dense)
A última camada é uma **camada densa (fully connected)** com um único neurônio, responsável por prever o valor contínuo (preço do ativo) com base nos padrões aprendidos.

Essa arquitetura permite ao modelo capturar tendências complexas nos dados históricos e fornecer previsões com alto grau de precisão.

---

## 🔬 Engenharia de Atributos

São utilizadas 15 features técnicas derivadas dos dados brutos de mercado:

- Preços OHLC: abertura, máxima, mínima, fechamento
- Volume de negociação
- Médias móveis exponenciais (EMA): 10, 20, 50 períodos
- Médias móveis simples (SMA): 10, 20, 50, 100 períodos
- Índices RSI: 7, 14, 28 períodos

A janela deslizante utilizada para compor as sequências é de 30 dias consecutivos 🔄.

Todos os dados passam por:

- 🧹 **Limpeza**: remoção de valores nulos/inválidos
- 📊 **Normalização**: escalonamento Min-Max no intervalo [0, 1]

---

## ⚙️ Treinamento do Modelo

### 🧠 Otimizador: Adam
O **Adam (Adaptive Moment Estimation)** é um dos algoritmos de otimização mais utilizados em redes neurais modernas. Ele combina os benefícios do **Momentum** (aceleração dos gradientes) e do **RMSProp** (taxas de aprendizado adaptativas) para oferecer atualizações de pesos mais estáveis e rápidas. O Adam calcula médias móveis dos gradientes e dos quadrados dos gradientes, ajustando os pesos com base nessas estimativas.

**Vantagens:**
- Rápido e eficiente
- Pouca necessidade de ajuste manual
- Estável em problemas não estacionários

### 📉 Função de Perda: Mean Squared Error (MSE)
A **função de perda** mede a discrepância entre os valores reais e os valores previstos pelo modelo. O **Mean Squared Error (Erro Quadrático Médio)** é ideal para tarefas de regressão como esta, pois penaliza fortemente grandes diferenças.

**Fórmula:**
```
MSE = (1/n) * Σ (y_pred - y_real)²
```

Quanto menor o valor do MSE, mais próximo o modelo está da realidade.

### 🔁 Épocas de Treinamento
Cada **época** representa uma passagem completa por todo o conjunto de dados de treinamento. Ao repetir esse ciclo por várias épocas (neste caso, 100), o modelo tem múltiplas oportunidades para corrigir seus erros e refinar suas previsões.

> **Nota:** O número ideal de épocas pode variar. Poucas épocas podem causar *underfitting* (modelo aprende pouco), enquanto muitas podem causar *overfitting* (modelo aprende demais e perde generalização).

Durante o treinamento, o modelo ajusta os pesos para minimizar a média dos erros quadráticos entre os valores previstos e os valores reais. A previsão final é convertida de volta à escala real (denormalização) 🎯.

---

## 🛠️ Tecnologias Utilizadas

### 🤖 Inteligência Artificial
- [TensorFlow.js](https://www.tensorflow.org/js) — Execução de modelos de aprendizado de máquina no navegador

### 💻 Front-End
- [React.js](https://reactjs.org/) — UI componentizada e reativa
- [Highcharts](https://www.highcharts.com/) — Gráficos financeiros (Candlestick, Volume)

### 🌐 API & Backend
- [Node.js](https://nodejs.org/) — Ambiente de execução JavaScript
- [Express](https://expressjs.com/) — Servidor leve para intermediar dados
- [yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2) — Cliente para extração de dados históricos de ações

### 🔧 Build & Tools
- [Webpack](https://webpack.js.org/) — Empacotador de módulos
- [Babel](https://babeljs.io/) — Transpilador para compatibilidade com browsers

---

## 🚀 Como Executar Localmente

### Requisitos

- Node.js (v14 ou superior)

### Instruções

```bash
# Clone o repositório
git clone https://github.com/raphaelmta/MachineLearning-JS.git

# Acesse a pasta
cd MachineLearning-JS

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra no navegador: [http://localhost:8080](http://localhost:8080)

---

## 📁 Estrutura de Pastas

```
/
|-- public/
|   |-- index.html         # Template HTML base
|
|-- scripts/
|   |-- build.js           # Script para build de produção
|   |-- dev.js             # Script para iniciar o servidor de desenvolvimento (com a API local)
|   |-- start.js           # Script para servir a pasta de build de produção
|   |-- utils.js           # Utilitários para os scripts do Webpack
|
|-- src/
|   |-- index.jsx          # Ponto de entrada da aplicação React
|   |-- Main.jsx           # Componente principal com a lógica e UI
|   |-- technicalindicators.js # Cálculo dos indicadores técnicos (RSI, SMA, EMA etc.)
|
|-- webpack/
|   |-- loaders.js         # Configuração dos loaders
|   |-- paths.js           # Definição de caminhos
|   |-- webpack.common.js  # Configuração base
|   |-- webpack.dev.js     # Configuração para ambiente de desenvolvimento
|   |-- webpack.prod.js    # Configuração para produção
|
|-- .gitignore             # Arquivos a serem ignorados pelo Git
|-- babel.config.js        # Configuração do Babel
|-- package.json           # Metadados do projeto e dependências
|-- README.md              # Este arquivo
```

---

Este projeto demonstra a integração de coleta, processamento, modelagem e visualização de dados financeiros em uma arquitetura totalmente client-side 🌐📊.