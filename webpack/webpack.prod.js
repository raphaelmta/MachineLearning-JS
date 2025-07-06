/**
 * webpack/webpack.prod.js
 * * Este arquivo contém as configurações do Webpack específicas para o ambiente de PRODUÇÃO.
 * * Ele é mesclado com a configuração comum ('webpack.common.js').
 * * O foco aqui é em gerar arquivos pequenos e otimizados para o melhor desempenho possível.
 */

const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const { prodLoaders } = require("./loaders");
const paths = require("./paths");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  // 'mode' define o ambiente, otimizando o Webpack para produção (ex: minificação).
  mode: "production",
  // 'devtool' é desabilitado na produção para não expor o código-fonte.
  devtool: false,
  
  // Configuração de saída para produção.
  output: {
    path: paths.build,
    publicPath: "/",
    // Usa '[contenthash]' no nome do arquivo para cache busting. O navegador só baixa o arquivo novamente se o conteúdo mudar.
    filename: "js/[name].[contenthash].bundle.js",
  },
  
  // Define os 'loaders' que serão usados no ambiente de produção.
  module: {
    rules: prodLoaders,
  },

  // Plugins específicos para produção.
  plugins: [
    // Extrai o CSS para arquivos .css separados.
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash].css",
      chunkFilename: "[id].css",
    }),
  ],

  // 'optimization' contém configurações para otimizar o tamanho do bundle.
  optimization: {
    minimize: true, // Habilita a minificação.
    minimizer: [
      new CssMinimizerPlugin(), // Minifica os arquivos CSS.
      "..." // '...' é uma sintaxe para incluir os minificadores padrão do Webpack (para JavaScript).
    ],
    // 'runtimeChunk' cria um bundle separado para o código de tempo de execução do Webpack, melhorando o cache.
    runtimeChunk: {
      name: "runtime",
    },
  },
  
  // 'performance' controla como o Webpack notifica sobre o tamanho dos arquivos. Desabilitado aqui.
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});