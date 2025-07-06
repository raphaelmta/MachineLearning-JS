/**
 * webpack/webpack.common.js
 * * Este arquivo contém a configuração comum do Webpack que é compartilhada
 * tanto pelo ambiente de desenvolvimento ('webpack.dev.js') quanto pelo de produção ('webpack.prod.js').
 * * Usar uma configuração comum evita duplicação de código.
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const path = require('path');

module.exports = {
  // 'entry' define o ponto de entrada da sua aplicação. É o arquivo inicial que o Webpack usará para construir o grafo de dependências.
  entry: {
    bundle: [paths.src + '/index.jsx'],
  },

  // 'output' define onde e como o Webpack deve gerar os arquivos finais (bundles).
  output: {
    path: paths.build, // O diretório de saída será 'dist/'.
    filename: '[name].bundle.js', // O nome do arquivo de saída. '[name]' é substituído pela chave do entry ('bundle').
    clean: true, // Limpa o diretório de build antes de cada nova compilação.
  },

  // 'plugins' são usados para adicionar funcionalidades extras ao processo de build.
  plugins: [
    // 'HtmlWebpackPlugin' gera automaticamente um arquivo 'index.html' na pasta de build
    // e injeta o script do bundle nele.
    new HtmlWebpackPlugin({
      title: 'WebApp ML.js',
      // Usa o 'public/index.html' como template.
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html', // O nome do arquivo gerado.
    }),
  ],

  // 'resolve' configura como o Webpack resolve os módulos importados.
  resolve: {
    // Permite importar arquivos .js e .jsx sem precisar especificar a extensão.
    extensions: ['.js', '.jsx'], 
    alias: {
      // Garante que o 'react-dom' seja substituído pela versão compatível com o 'react-hot-loader'.
      'react-dom': '@hot-loader/react-dom',
    },
  },
};