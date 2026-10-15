import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/base.css'
import '../styles/identity.css'
import Identity from './Identity.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Identity />
  </StrictMode>,
)
