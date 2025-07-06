/**
 * webpack/paths.js
 * * Este arquivo de utilidade define e exporta os caminhos de diretórios importantes do projeto.
 * * Centralizar os caminhos aqui evita a repetição de código e facilita a manutenção
 * se a estrutura de pastas do projeto mudar no futuro.
 */

// Módulo 'path' nativo do Node.js para trabalhar com caminhos de arquivos e diretórios.
const path = require('path');

module.exports = {
  // O '__dirname' é uma variável do Node.js que contém o caminho para o diretório do arquivo atual (neste caso, 'webpack/').
  // 'path.resolve' cria um caminho absoluto.

  // Caminho para a raiz do projeto (volta um nível a partir de 'webpack/').
  root: path.resolve(__dirname, '../'),

  // Caminho para a pasta de código-fonte da aplicação.
  src: path.resolve(__dirname, '../src'),

  // Caminho para a pasta onde a versão final (build) do projeto será gerada.
  build: path.resolve(__dirname, '../dist'),

  // Caminho para a pasta de arquivos estáticos, como o 'index.html'.
  public: path.resolve(__dirname, '../public'),
};