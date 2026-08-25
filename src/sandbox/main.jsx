import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client'; 
import { HDSandbox } from '@hyperdart/sandbox';
import hDConfig from '../../hyperdart.config';
import defaultSearchData from '../../searchData.json';

const container = document.getElementById('root');
const root = createRoot(container); 

window.addEventListener('error', (event) => {
  document.body.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif;">
    <h2>Runtime Error</h2>
    <pre>${event.error?.stack || event.message}</pre>
  </div>`;
});

window.addEventListener('unhandledrejection', (event) => {
  document.body.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif;">
    <h2>Unhandled Promise Rejection</h2>
    <pre>${event.reason?.stack || event.reason}</pre>
  </div>`;
});

try {
  // Safe extraction of the array
  const safeSearchData = Array.isArray(defaultSearchData) 
    ? defaultSearchData 
    : (defaultSearchData?.default && Array.isArray(defaultSearchData.default)) 
      ? defaultSearchData.default 
      : (defaultSearchData ? [defaultSearchData] : []);

  root.render(<HDSandbox config={hDConfig} searchData={safeSearchData} />);
} catch (error) {
  document.body.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif;">
    <h2>Render Error</h2>
    <pre>${error.stack}</pre>
  </div>`;
}