import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Inter self-hosted, dos pesos (sección 7: texto en sans legible, dos pesos).
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
