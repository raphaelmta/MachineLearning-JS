/**
 * webpack/webpack.dev.js
 * * Este arquivo contém as configurações do Webpack específicas para o ambiente de DESENVOLVIMENTO.
 * * Ele é mesclado com a configuração comum ('webpack.common.js').
 * * O foco aqui é em velocidade de compilação e ferramentas de depuração, como o Hot-Reloading.
 */

const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const { devLoaders } = require("./loaders");
const path = require("path");

module.exports = merge(common, {
  // 'target' especifica o ambiente de destino. 'web' é o padrão.
  target: "web",
  // 'mode' define o ambiente, otimizando o Webpack para desenvolvimento.
  mode: "development",
  // 'devtool' gera source maps para facilitar a depuração do código no navegador.
  devtool: "inline-source-map",
  
  // 'devServer' configura o servidor de desenvolvimento do Webpack.
  devServer: {
    historyApiFallback: true, // Redireciona 404s para o 'index.html', útil para SPAs com roteamento.
    open: true, // Abre o navegador automaticamente quando o servidor inicia.
    compress: true, // Habilita a compressão gzip.
    hot: true, // Habilita o Hot Module Replacement (HMR ou Hot-Reloading).
    port: 8080, // A porta do servidor.
    static: {
      // Define o diretório de onde servir arquivos estáticos (não é o principal para o dev-server, que serve da memória).
      directory: path.join(__dirname, "../build"),
    },
  },
  
  // Define os 'loaders' que serão usados no ambiente de desenvolvimento.
  module: {
    rules: devLoaders,
  },
});