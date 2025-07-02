// Polyfill for Codespaces: fallback for window.crypto.getRandomValues if missing (not cryptographically secure)
if (typeof window !== 'undefined' && (!window.crypto || !window.crypto.getRandomValues)) {
  window.crypto = {
    getRandomValues: function (arr: Uint8Array): Uint8Array {
      if (!(arr instanceof Uint8Array)) throw new TypeError('Expected Uint8Array');
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }
  } as Crypto;
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
