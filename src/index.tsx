import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        className:
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg rounded-lg',
        duration: 3000,
      }}
    />
  </React.StrictMode>
);

reportWebVitals();
