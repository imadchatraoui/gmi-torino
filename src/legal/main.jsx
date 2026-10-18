import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerOffline } from '../shared/offline'
import { initSmoothScroll } from '../shared/smoothScroll'
import '../styles/base.css'
import '../styles/legal.css'
import LegalPage from './LegalPage.jsx'

const root = document.getElementById('root')

createRoot(root).render(
  <StrictMode>
    <LegalPage page={root.dataset.page} />
  </StrictMode>,
)

registerOffline()
initSmoothScroll()
