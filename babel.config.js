/**
 * babel.config.js
 * * Este arquivo configura o Babel, o transpilador de JavaScript.
 * * O Babel converte código JavaScript moderno (ES6+, JSX) em uma versão
 * compatível com navegadores mais antigos.
 */

module.exports = {
  // 'presets' são conjuntos de plugins do Babel para suportar determinadas funcionalidades.
  presets: [
    // '@babel/preset-env': Permite usar as últimas funcionalidades do JavaScript.
    "@babel/preset-env",
    // '@babel/preset-react': Permite usar a sintaxe JSX do React.
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};