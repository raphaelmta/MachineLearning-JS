/**
 * scripts/build.js
 * * Este script é usado para criar a versão final de produção da aplicação.
 * Ele limpa a pasta de build antiga e roda o Webpack com a configuração
 * de produção (webpack.prod.js), que otimiza e minifica os arquivos
 * para o melhor desempenho.
 */

const webpack = require("webpack");
const webpackConfig = require("../webpack/webpack.prod.js");
const chalk = require("chalk");
const paths = require("../webpack/paths");
const rimraf = require("rimraf"); // Ferramenta para apagar pastas

const build = async () => {
  try {
    // 1. Limpa a pasta de build anterior ('dist/') para garantir uma compilação limpa.
    rimraf.sync(paths.build);
    
    // 2. Cria o 'compiler' do Webpack com as configurações de produção.
    const compiler = webpack(webpackConfig);
    
    // 3. Executa a compilação.
    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      // Exibe as estatísticas da compilação no console.
      console.log(stats.toString({ colors: true }));
    });
  } catch (err) {
    console.log(chalk.red(err));
  }
};

build();