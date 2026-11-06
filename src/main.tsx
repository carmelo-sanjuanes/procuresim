import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fuentes alojadas con la aplicación: no se consulta a terceros al abrirla.
import '@fontsource-variable/outfit/wght.css'
import '@fontsource-variable/plus-jakarta-sans/wght.css'
import '@fontsource-variable/plus-jakarta-sans/wght-italic.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
