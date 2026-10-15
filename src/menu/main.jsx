import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/base.css'
import '../styles/torino.css'
import '../styles/menu.css'
import MenuPage from './MenuPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MenuPage />
  </StrictMode>,
)
