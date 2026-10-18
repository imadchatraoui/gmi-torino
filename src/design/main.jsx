import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerOffline } from '../shared/offline'
import { initSmoothScroll } from '../shared/smoothScroll'
import '../styles/base.css'
import '../styles/torino.css'
import '../styles/design.css'
import Design from './Design.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Design />
  </StrictMode>,
)

registerOffline()
initSmoothScroll()
