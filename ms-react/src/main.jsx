import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>hola</div>
  </StrictMode>,
)
