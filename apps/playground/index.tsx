import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app';

import './app.css';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
