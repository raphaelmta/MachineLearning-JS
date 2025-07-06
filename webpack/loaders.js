/**
 * webpack/loaders.js
 * * Este arquivo centraliza a configuração dos "loaders" do Webpack.
 * * Loaders são responsáveis por processar diferentes tipos de arquivos (como JavaScript, CSS, imagens)
 * e transformá-los em módulos que o Webpack possa entender e incluir no bundle final.
 */

// Plugin para extrair o CSS para um arquivo separado na build de produção.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Regra para arquivos JavaScript, garantindo que o Webpack resolva módulos corretamente.
const babel = {
  test: /\.m?js/,
  resolve: {
    fullySpecified: false,
  },
};

// Regra principal para arquivos .js e .jsx.
const js = {
  test: /\.js$|jsx/, // Aplica esta regra para arquivos que terminam em .js ou .jsx
  exclude: /node_modules/, // Ignora a pasta node_modules para acelerar a compilação.
  use: {
    loader: "babel-loader", // Usa o Babel para transpilar o código.
    options: {
      // Presets do Babel para entender sintaxe moderna de JS (ES6+) e React (JSX).
      presets: ["@babel/preset-env", "@babel/preset-react"],
    },
  },
};

// Regra para arquivos .css.
const css = {
  test: /\.css$/,
  // 'use' define uma cadeia de loaders que são aplicados da direita para a esquerda.
  // 1. 'css-loader': Interpreta o CSS e resolve as importações (@import, url()).
  // 2. 'style-loader': Injeta o CSS processado diretamente no DOM dentro de uma tag <style>.
  use: ["style-loader", "css-loader"],
};

// Regra para arquivos de imagem.
const fileLoader = {
  test: /\.(png|jp(e*)g|svg|gif)$/,
  use: [
    {
      loader: "file-loader", // Processa os arquivos de imagem.
      options: {
        // Define o padrão de nome para as imagens no diretório de build.
        name: "images/[hash]-[name].[ext]",
      },
    },
  ],
};

// Agrupa os loaders para o ambiente de DESENVOLVIMENTO.
const devLoaders = [babel, js, css, fileLoader];

// Agrupa os loaders para o ambiente de PRODUÇÃO.
const prodLoaders = [
  babel,
  js,
  {
    test: /\.css$/,
    use: [
      // Na produção, em vez do 'style-loader', usamos o 'MiniCssExtractPlugin.loader'.
      // Ele extrai todo o CSS para um único arquivo .css, o que é melhor para performance.
      MiniCssExtractPlugin.loader, 
      "css-loader"
    ],
  },
  fileLoader,
];

// Exporta os dois conjuntos de loaders.
module.exports = {
  devLoaders,
  prodLoaders,
};