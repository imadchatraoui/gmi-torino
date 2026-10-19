import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSmoothScroll } from '../shared/smoothScroll'
import '../styles/base.css'
import '../styles/torino.css'
import '../styles/menu.css'
import '../styles/corposunnah.css'
import CorpoPage from './CorpoPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CorpoPage />
  </StrictMode>,
)

initSmoothScroll()
