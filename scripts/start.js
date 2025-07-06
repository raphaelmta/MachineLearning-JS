/**
 * scripts/start.js
 * * Este script inicia um servidor web simples com Express para servir
 * os arquivos estáticos da versão de produção. Ele deve ser usado
 * APÓS você rodar 'npm run build'. Ele simula um ambiente de servidor
 * de produção servindo a pasta 'dist/'.
 */

const express = require("express");
const chalk = require("chalk");
const paths = require("../webpack/paths");
const cors = require("cors");

const start = () => {
  try {
    const app = express();
    app.use(cors());
    
    // Configura o Express para servir os arquivos da pasta de build ('dist/').
    app.use(express.static(paths.build));
    
    // Inicia o servidor na porta 8080.
    app.listen(8080, (err) => {
      if (err) {
        throw new Error(err);
      }
      console.log(`%s App de produção rodando em http://localhost:8080`, chalk.green("✓"));
    });
  } catch (error) {
    console.log(chalk.red("error ", error));
  }
};

start();