import { useEffect, useState } from 'react'
import { toggleTheme, usePrefs } from '../shared/prefs'

// Pannello di gestione di GMI Torino (gmitorino.org/admin).
// Le modifiche vanno su /api/admin e valgono subito su tutto il sito, senza deploy.
const PASS_KEY = 'gmi-admin'
const pad = (n) => String(n).padStart(2, '0')

// ISO → valore per <input type="datetime-local"> nell'ora del telefono
function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

function left(iso, now) {
  const ms = new Date(iso).getTime() - now
  if (ms <= 0) return 'adesso'
  const m = Math.round(ms / 60000)
  if (m < 60) return `tra ${m} min`
  const h = Math.floor(m / 60)
  if (h < 48) return `tra ${h} h ${m % 60} min`
  return `tra ${Math.round(h / 24)} giorni`
}

async function call(pass, body) {
  const r = await fetch('/api/admin', {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', 'x-admin-password': pass },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.error || 'Qualcosa non ha funzionato.')
  return data
}

function Login({ onEnter, error, busy }) {
  const [pass, setPass] = useState('')
  return (
    <form
      className="adm-login"
      onSubmit={(e) => {
        e.preventDefault()
        onEnter(pass)
      }}
    >
      <span className="logo adm-login__logo" aria-hidden="true" />
      <h1>Pannello</h1>
      <p>GMI Torino · gestione del sito</p>
      <label htmlFor="adm-pass">Password</label>
      <input id="adm-pass" type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} autoFocus />
      {error && <p className="adm-error">{error}</p>}
      <button type="submit" className="adm-btn adm-btn--primary" disabled={!pass || busy}>
        {busy ? 'Controllo…' : 'Entra'}
      </button>
    </form>
  )
}

function Segmented({ value, options, onChange, label }) {
  return (
    <div className="adm-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} className={value === o.v ? 'is-on' : ''} onClick={() => onChange(o.v)}>
          {o.l}
        </button>
      ))}
    </div>
  )
}

export default function Admin() {
  const { theme } = usePrefs()
  const [pass, setPass] = useState(() => {
    try {
      return sessionStorage.getItem(PASS_KEY) || ''
    } catch {
      return ''
    }
  })
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const [now, setNow] = useState(Date.now())
  const [when, setWhen] = useState('')
  const [notice, setNotice] = useState({ on: false, it: '', en: '' })
  const [confirmReset, setConfirmReset] = useState(false)

  const apply = (d) => {
    setData(d)
    setWhen(toLocalInput(d.settings.revealAt))
    setNotice(d.settings.notice)
  }

  const run = async (body, msg) => {
    setBusy(true)
    setError('')
    try {
      const d = await call(pass, body)
      apply(d)
      if (msg) {
        setToast(msg)
        setTimeout(() => setToast(''), 2400)
      }
      return true
    } catch (e) {
      setError(e.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  const enter = async (p) => {
    setBusy(true)
    setError('')
    try {
      const d = await call(p)
      setPass(p)
      try {
        sessionStorage.setItem(PASS_KEY, p)
      } catch {
        /* niente */
      }
      apply(d)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (pass && !data) enter(pass)
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // i "mi piace" si aggiornano da soli
  useEffect(() => {
    if (!data) return
    const id = setInterval(() => !document.hidden && call(pass).then(apply).catch(() => {}), 15000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!data])

  if (!data) return <Login onEnter={enter} error={error} busy={busy} />

  const s = data.settings
  const revealed = s.menuMode === 'open' || (s.menuMode === 'auto' && now >= new Date(s.revealAt).getTime())
  const shift = (min) => run({ settings: { revealAt: new Date(new Date(s.revealAt).getTime() + min * 60000).toISOString(), menuMode: 'auto' } }, `Pranzo spostato a ${fmtTime(new Date(new Date(s.revealAt).getTime() + min * 60000).toISOString())}`)
  const likes = Object.entries(data.likes)
  const totalLikes = likes.reduce((n, [, l]) => n + l.count, 0)

  return (
    <div className="adm">
      <header className="adm-top">
        <span className="logo adm-top__logo" aria-hidden="true" />
        <div>
          <p className="adm-top__title">Pannello</p>
          <p className="adm-top__sub">GMI Torino · le modifiche valgono subito</p>
        </div>
        <button type="button" className="adm-icon" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Tema chiaro' : 'Tema scuro'}>
          {theme === 'dark' ? '☀︎' : '☾'}
        </button>
        <button
          type="button"
          className="adm-btn adm-btn--ghost"
          onClick={() => {
            try {
              sessionStorage.removeItem(PASS_KEY)
            } catch {
              /* niente */
            }
            location.reload()
          }}
        >
          Esci
        </button>
      </header>

      {error && <p className="adm-error adm-error--bar">{error}</p>}

      <main className="adm-grid">
        <section className="adm-card adm-card--lunch">
          <p className="adm-label">Il pranzo</p>
          <h2 className={`adm-state ${revealed ? 'is-open' : ''}`}>
            {s.menuMode === 'closed' ? 'Menu nascosto' : revealed ? 'Menu svelato' : `Si svela ${left(s.revealAt, now)}`}
          </h2>
          <p className="adm-muted">
            {s.menuMode === 'closed'
              ? 'Resta nascosto finché non scegli tu.'
              : s.menuMode === 'open'
                ? 'Tutti lo vedono già.'
                : `Ora prevista: ${fmtTime(s.revealAt)}`}
          </p>

          <div className="adm-row">
            <button type="button" className="adm-btn" disabled={busy || s.menuMode !== 'auto'} onClick={() => shift(15)}>
              +15 min
            </button>
            <button type="button" className="adm-btn" disabled={busy || s.menuMode !== 'auto'} onClick={() => shift(30)}>
              +30 min
            </button>
            <button type="button" className="adm-btn" disabled={busy || s.menuMode !== 'auto'} onClick={() => shift(-15)}>
              −15 min
            </button>
          </div>

          <label className="adm-field" htmlFor="adm-when">
            <span>Ora esatta</span>
            <span className="adm-inline">
              <input id="adm-when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
              <button
                type="button"
                className="adm-btn adm-btn--primary"
                disabled={busy || !when}
                onClick={() => run({ settings: { revealAt: new Date(when).toISOString(), menuMode: 'auto' } }, `Pranzo alle ${fmtTime(new Date(when).toISOString())}`)}
              >
                Salva
              </button>
            </span>
          </label>

          <Segmented
            label="Stato del menu"
            value={s.menuMode}
            onChange={(v) => run({ settings: { menuMode: v } }, v === 'open' ? 'Menu svelato a tutti' : v === 'closed' ? 'Menu nascosto' : 'Torna all’ora prevista')}
            options={[
              { v: 'auto', l: 'All’ora prevista' },
              { v: 'open', l: 'Svela adesso' },
              { v: 'closed', l: 'Tieni nascosto' },
            ]}
          />
        </section>

        <section className="adm-card">
          <p className="adm-label">Mi piace · in diretta</p>
          <ul className="adm-likes">
            {likes.map(([id, l]) => (
              <li key={id}>
                <span>
                  <strong>{l.label.it}</strong>
                  <small>{l.title.it}</small>
                </span>
                <span className="adm-num">{l.count}</span>
              </li>
            ))}
          </ul>
          <div className="adm-bar" aria-hidden="true">
            {likes.map(([id, l]) => (
              <span key={id} style={{ flexGrow: Math.max(l.count, totalLikes ? 0 : 1) }} />
            ))}
          </div>
          {confirmReset ? (
            <div className="adm-row">
              <span className="adm-muted">Azzerare tutti i mi piace?</span>
              <button
                type="button"
                className="adm-btn adm-btn--danger"
                disabled={busy}
                onClick={async () => {
                  if (await run({ action: 'resetLikes' }, 'Mi piace azzerati')) setConfirmReset(false)
                }}
              >
                Sì, azzera
              </button>
              <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setConfirmReset(false)}>
                No
              </button>
            </div>
          ) : (
            <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setConfirmReset(true)}>
              Azzera i mi piace
            </button>
          )}
        </section>

        <section className="adm-card">
          <p className="adm-label">Avviso in cima alla home</p>
          <label className="adm-switch">
            <input type="checkbox" checked={notice.on} onChange={(e) => setNotice({ ...notice, on: e.target.checked })} />
            <span>{notice.on ? 'Visibile' : 'Spento'}</span>
          </label>
          <label className="adm-field" htmlFor="adm-it">
            <span>Testo (italiano)</span>
            <input id="adm-it" type="text" maxLength={220} placeholder="Es. Si inizia alle 10:30, ingresso dal cortile" value={notice.it} onChange={(e) => setNotice({ ...notice, it: e.target.value })} />
          </label>
          <label className="adm-field" htmlFor="adm-en">
            <span>Testo (inglese, facoltativo)</span>
            <input id="adm-en" type="text" maxLength={220} value={notice.en} onChange={(e) => setNotice({ ...notice, en: e.target.value })} />
          </label>
          <button type="button" className="adm-btn adm-btn--primary" disabled={busy} onClick={() => run({ settings: { notice } }, notice.on ? 'Avviso pubblicato' : 'Avviso salvato (spento)')}>
            Salva avviso
          </button>
        </section>

        <section className="adm-card">
          <p className="adm-label">Iscrizioni</p>
          <Segmented
            label="Iscrizioni"
            value={s.signup}
            onChange={(v) => run({ settings: { signup: v } }, v === 'open' ? 'Iscrizioni aperte' : v === 'closed' ? 'Iscrizioni chiuse' : 'Iscrizioni automatiche')}
            options={[
              { v: 'auto', l: 'Automatico' },
              { v: 'open', l: 'Aperte' },
              { v: 'closed', l: 'Chiuse' },
            ]}
          />
          <p className="adm-muted">Automatico: il bottone Iscriviti sparisce dopo venerdì 23 ottobre.</p>
        </section>

        <section className="adm-card">
          <p className="adm-label">Link utili</p>
          <ul className="adm-links">
            <li>
              <a href="/" target="_blank" rel="noopener">Il sito</a>
            </li>
            <li>
              <a href="/menu/?chiave=ciao" target="_blank" rel="noopener">Il menu in anteprima (chiave)</a>
            </li>
            <li>
              <a href="/menu/?chiave=ciao&staff" target="_blank" rel="noopener">Il menu per lo staff, con i mi piace</a>
            </li>
            <li>
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">Vercel</a>
            </li>
          </ul>
          <p className="adm-muted">Ultima modifica: {s.updatedAt ? fmtTime(s.updatedAt) : 'mai'}</p>
        </section>
      </main>

      <p className={`adm-toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">
        {toast}
      </p>
    </div>
  )
}
