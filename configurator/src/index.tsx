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

// Dynamically load square configuration and circle configuration modules.
//
// Note that these configuration tools are not imported using a package manager.
// The goal is that they can be loaded from a remote server, and that they can be
// updated independently of the main application.
//
// The technology used to implement the configuration tools is not important.
// Configuration tools must make their functionality available through Web Components.
// How they work internally is not important.
//
// In this simple PoC, the configuration modules are loaded at startup.
// However, in a real-world application, they might be loaded on demand.
//
const scm: any = await require('http://localhost:3001/index.js');
console.log('Square configuration module', scm); // For demonstration purposes
scm.SquareConfig.register();

const ccm: any = await require('http://localhost:3002/index.js');
console.log('Circle configuration module', ccm); // For demonstration purposes
ccm.CircleConfigWC.register();
