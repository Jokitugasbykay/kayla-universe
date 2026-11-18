import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import './index.css';

const initialHash = window.location.hash;
if (import.meta.env.PROD) {
  const rootPath = new URL('.', document.baseURI).pathname;
  window.history.replaceState(window.history.state, '', rootPath + 'home' + window.location.search);
}
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  if (initialHash) {
    setTimeout(() => document.getElementById(initialHash.slice(1))?.scrollIntoView(), 0);
  }
}
