import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerOffline } from '../shared/offline'
import { initSmoothScroll } from '../shared/smoothScroll'
import '../styles/base.css'
import '../styles/torino.css'
import '../styles/reading.css'
import ReadingPage from './ReadingPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReadingPage />
  </StrictMode>,
)

registerOffline()
initSmoothScroll()
