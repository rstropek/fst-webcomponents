import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const scm: any = await require('http://localhost:3001/index.js');
scm.SquareConfig.register();

const ccm: any = await require('http://localhost:3002/index.js');
console.log(ccm);
