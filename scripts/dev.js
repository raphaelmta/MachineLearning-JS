/**
 * scripts/dev.js
 * * Este script inicia o servidor de desenvolvimento. Ele usa Express para criar um servidor
 * e Webpack com middlewares (webpack-dev-middleware, webpack-hot-middleware)
 * para compilar o código em tempo real e habilitar o Hot-Reloading, que atualiza
 * a aplicação no navegador sem precisar recarregar a página inteira.
 * * Ele também contém a API local '/api/yfinance/:ticker' que busca os dados
 * do Yahoo Finance e os serve para o front-end.
 */

const express = require("express");
const webpack = require("webpack");
const webpackConfig = require("../webpack/webpack.dev");
const { compilerListener } = require("./utils");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const cors = require("cors");
const chalk = require("chalk");
const yahooFinance = require("yahoo-finance2").default;

const app = express();
app.use(cors());

// --- API LOCAL PARA BUSCAR DADOS DO YAHOO FINANCE ---
// O front-end chama este endpoint para evitar problemas de CORS e centralizar a busca de dados.
app.get("/api/yfinance/:ticker", async (req, res) => {
  try {
    const { ticker } = req.params;
    console.log(chalk.blue(`[API] Recebido pedido para o ticker: ${ticker}`));

    // Busca os dados históricos para os últimos 5 anos.
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 5);

    const queryOptions = {
      period1: startDate,
      period2: endDate,
      interval: "1d",
    };

    const result = await yahooFinance.historical(ticker, queryOptions);
    console.log(chalk.green(`[API] Dados para ${ticker} encontrados. Enviando para o front-end.`));
    
    // Formata os dados para a estrutura que o front-end espera.
    const formatedData = result.map(item => ({
      time: new Date(item.date).getTime(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume
    }));

    res.json(formatedData);

  } catch (error) {
    console.error(chalk.red("[API] Erro ao buscar dados do Yahoo Finance:"), error.message);
    res.status(500).json({ error: `Não foi possível buscar dados para o ticker. Verifique se o ticker é válido no Yahoo Finance. Detalhe: ${error.message}` });
  }
});

/**
 * Função principal que configura e inicia o ambiente de desenvolvimento.
 */
const dev = async () => {
  try {
    const paths = require("../webpack/paths");
    const compiler = webpack(webpackConfig);

    // Injeta os clientes de hot-reloading no ponto de entrada do webpack.
    webpackConfig.entry.bundle = [
      "webpack-hot-middleware/client",
      "react-hot-loader/patch",
      ...webpackConfig.entry.bundle,
    ];

    // Configura o middleware do Webpack que compila os arquivos em memória.
    const devMiddleware = webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    });

    app.use(webpackHotMiddleware(compiler));
    app.use(devMiddleware);

    // Inicia o servidor web após a primeira compilação do Webpack.
    compilerListener(compiler, "client").then(() => {
      app.listen(8080, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`%s Servidor ouvindo em http://localhost:8080`, chalk.green("✓"));
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

dev();