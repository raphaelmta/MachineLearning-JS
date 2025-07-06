/**
 * src/index.jsx
 * * Este é o ponto de entrada principal da sua aplicação React.
 * É o primeiro arquivo JavaScript a ser executado.
 */

// Importa o 'regenerator-runtime'. É um polyfill necessário que o Babel (nosso transpilador) 
// usa para converter funcionalidades modernas de JavaScript (como async/await) em código que 
// navegadores mais antigos possam entender.
import 'regenerator-runtime/runtime'; 
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';

// O ReactDOM "renderiza" (desenha) o seu componente principal, <Main />, dentro do elemento HTML
// que tem o id 'root'. Esse elemento está no arquivo `public/index.html`.
ReactDOM.render(<Main />, document.getElementById('root'));