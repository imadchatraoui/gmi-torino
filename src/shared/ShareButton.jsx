import { useState } from 'react'
import { t, usePrefs } from './prefs'

// Condividi la pagina: foglio di condivisione del telefono, altrimenti copia il link.
export default function ShareButton({ title, label, className = '' }) {
  const { lang } = usePrefs()
  const [copied, setCopied] = useState(false)
  const url = location.origin + location.pathname

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        /* condivisione annullata */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt(t({ it: 'Copia il link', en: 'Copy the link' }, lang), url)
    }
  }

  return (
    <button type="button" className={`share ${className}`} onClick={share}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v6.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span aria-live="polite">{copied ? t({ it: 'Link copiato', en: 'Link copied' }, lang) : label}</span>
    </button>
  )
}
