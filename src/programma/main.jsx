import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerOffline } from '../shared/offline'
import { initSmoothScroll } from '../shared/smoothScroll'
import '../styles/base.css'
import '../styles/torino.css'
import '../styles/programma.css'
import ProgramPage from './ProgramPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProgramPage />
  </StrictMode>,
)

registerOffline()
initSmoothScroll()
