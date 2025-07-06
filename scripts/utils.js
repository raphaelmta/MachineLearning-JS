/**
 * scripts/utils.js
 * * Este arquivo contém uma função de utilidade para o Webpack.
 * A função 'compilerListener' monitora o processo de compilação
 * e resolve uma Promise quando a compilação termina, tratando
 * os erros e avisos.
 */

const chalk = require("chalk");

const compilerListener = (compiler, name) => {
  return new Promise((resolve, reject) => {
    // 'hooks.done.tap' é a forma como um plugin se registra para ser notificado
    // quando o Webpack termina uma compilação.
    compiler.hooks.done.tap({ name: `compiler-listener-${name}` }, (stats) => {
      const messages = stats.toJson({}, true);
      
      // Se houver erros, rejeita a Promise.
      if (messages.errors.length) {
        return reject(new Error(messages.errors.join("\n\n")));
      }
      
      // Em ambientes de Integração Contínua (CI), trata avisos como erros.
      if (
        process.env.CI &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            "\nTratando avisos como erros porque process.env.CI = true.\n" +
              "A maioria dos servidores de CI configura isso automaticamente.\n"
          )
        );
        return reject(new Error(messages.warnings.join("\n\n")));
      }
      
      // Se tudo correu bem, resolve a Promise.
      return resolve(stats);
    });
  });
};

module.exports = {
  compilerListener,
};