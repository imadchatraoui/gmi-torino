import { useEffect, useRef, useState } from 'react'
import { toggleTheme, usePrefs } from '../shared/prefs'

// Pannello di gestione di GMI Torino (gmitorino.org/admin).
// Le modifiche vanno su /api/admin e valgono subito su tutto il sito, senza deploy.
const PASS_KEY = 'gmi-admin'
const pad = (n) => String(n).padStart(2, '0')

const PARTY = ['🎉', '❤️', '🥗', '🌙', '✨', '🤲']

// testi dell'evento modificabili: [campo, etichetta, esempio, lingua]
const EVT_FIELDS = [
  ['date', 'Data (italiano)', 'Domenica 25 ottobre 2026', 'it'],
  ['date', 'Data (inglese)', 'Sunday 25 October 2026', 'en'],
  ['dayMonth', 'Data breve', '25.10'],
  ['time', 'Orari', '10:00 – 19:30'],
  ['venue', 'Luogo', 'Casa del Quartiere di San Salvario'],
  ['city', 'Città', 'Torino'],
  ['price', 'Quota', '10 €'],
  ['signupUrl', 'Link iscrizioni', 'https://forms.gle/…'],
  ['signupNote', 'Nota iscrizioni (italiano)', 'Iscrizioni entro venerdì 23 ottobre', 'it'],
  ['signupNote', 'Nota iscrizioni (inglese)', 'Sign up by Friday 23 October', 'en'],
]

// disegni disponibili per gli ingredienti (src/poke/art.jsx)
const ARTS = [
  ['rice', 'Riso (base)'],
  ['a3', 'Cubetti rossi (tonno)'],
  ['a4', 'Cubetti viola (barbabietola)'],
  ['a9', 'Rondelle viola (carote)'],
  ['a1', 'Avocado con miele'],
  ['a2', 'Avocado con limone'],
  ['a5', 'Fiocchi bianchi (ricotta)'],
  ['a6', 'Striscioline viola (cavolo)'],
  ['a7', 'Crema (hummus)'],
  ['a8', 'Straccetti (pollo)'],
]

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
  const [notice, setNotice] = useState({ on: false, it: '', en: '', tone: 'brand' })
  const [evt, setEvt] = useState({})
  const [collab, setCollab] = useState({ on: true, it: '', en: '' })
  const [confirmReset, setConfirmReset] = useState(false)
  const [menu, setMenu] = useState(null)
  const [menuDirty, setMenuDirty] = useState(false)
  const menuDirtyRef = useRef(false)
  const evtDirty = useRef(false)
  menuDirtyRef.current = menuDirty

  const apply = (d) => {
    setData(d)
    setWhen(toLocalInput(d.settings.revealAt))
    setNotice(d.settings.notice)
    setCollab(d.settings.collab || { on: true, it: '', en: '' })
    setEvt((cur) => (evtDirty.current ? cur : d.settings.event || {}))
    setMenu((m) => (m && menuDirtyRef.current ? m : d.menu))
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

  const editMenu = (pi, fn) => {
    setMenuDirty(true)
    setMenu((m) => m.map((q, k) => (k === pi ? fn(q) : q)))
  }
  const editItem = (pi, ii, patch) => editMenu(pi, (q) => ({ ...q, items: q.items.map((x, k) => (k === ii ? { ...x, ...patch } : x)) }))

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
          <p className="adm-label">Striscia d’avviso in alto</p>
          <p className={`adm-pill-state ${s.notice?.on ? 'is-on' : ''}`}>{s.notice?.on ? 'Visibile ora su tutte le pagine' : 'Non visibile'}</p>
          <div className={`noticebar noticebar--${notice.tone || 'brand'} adm-preview`}>
            <span>{notice.it || 'Anteprima della striscia'}</span>
          </div>
          <Segmented
            label="Colore"
            value={notice.tone || 'brand'}
            onChange={(v) => setNotice({ ...notice, tone: v })}
            options={[
              { v: 'brand', l: 'Bordeaux' },
              { v: 'gold', l: 'Oro' },
              { v: 'sage', l: 'Salvia' },
              { v: 'tape', l: 'Cantiere' },
            ]}
          />
          <label className="adm-field" htmlFor="adm-it">
            <span>Testo (italiano)</span>
            <input id="adm-it" type="text" maxLength={220} placeholder="Es. Si inizia alle 10:30, ingresso dal cortile" value={notice.it} onChange={(e) => setNotice({ ...notice, it: e.target.value })} />
          </label>
          <label className="adm-field" htmlFor="adm-en">
            <span>Testo (inglese, facoltativo)</span>
            <input id="adm-en" type="text" maxLength={220} value={notice.en} onChange={(e) => setNotice({ ...notice, en: e.target.value })} />
          </label>
          <div className="adm-row">
            <button type="button" className="adm-btn adm-btn--primary" disabled={busy || !notice.it.trim()} onClick={() => run({ settings: { notice: { ...notice, on: true } } }, 'Avviso pubblicato')}>
              Pubblica avviso
            </button>
            {s.notice?.on && (
              <button type="button" className="adm-btn adm-btn--ghost" disabled={busy} onClick={() => run({ settings: { notice: { ...notice, on: false } } }, 'Avviso tolto')}>
                Togli avviso
              </button>
            )}
          </div>
        </section>

        <section className="adm-card adm-card--wide">
          <p className="adm-label">Il menu · piatti e ingredienti</p>
          {menu?.map((p, pi) => (
            <fieldset key={p.id} className="adm-poke">
              <legend>{p.label.it}</legend>
              <label className="adm-field">
                <span>Nome della bowl (es. La Nativa)</span>
                <input type="text" value={p.label.it} onChange={(e) => editMenu(pi, (q) => ({ ...q, label: { it: e.target.value, en: e.target.value } }))} />
              </label>
              <label className="adm-field">
                <span>Ingredienti in breve (titolo)</span>
                <input type="text" value={p.title.it} onChange={(e) => editMenu(pi, (q) => ({ ...q, title: { ...q.title, it: e.target.value } }))} />
              </label>
              <label className="adm-field">
                <span>Titolo in inglese</span>
                <input type="text" value={p.title.en} onChange={(e) => editMenu(pi, (q) => ({ ...q, title: { ...q.title, en: e.target.value } }))} />
              </label>
              <ol className="adm-items">
                {p.items.map((it, ii) => (
                  <li key={ii}>
                    <span className="adm-items__n">{ii + 1}</span>
                    <input type="text" aria-label={`Ingrediente ${ii + 1}`} value={it.name.it} onChange={(e) => editItem(pi, ii, { name: { ...it.name, it: e.target.value } })} />
                    <input type="text" aria-label={`Ingrediente ${ii + 1} in inglese`} placeholder="in inglese" value={it.name.en} onChange={(e) => editItem(pi, ii, { name: { ...it.name, en: e.target.value } })} />
                    <select aria-label="Disegno" value={it.art} onChange={(e) => editItem(pi, ii, { art: e.target.value })}>
                      {ARTS.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="adm-btn adm-btn--ghost adm-x" aria-label="Togli ingrediente" onClick={() => editMenu(pi, (q) => ({ ...q, items: q.items.filter((_, k) => k !== ii) }))}>
                      ×
                    </button>
                  </li>
                ))}
              </ol>
              {p.items.length < 5 && (
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => editMenu(pi, (q) => ({ ...q, items: [...q.items, { name: { it: '', en: '' }, art: 'a3' }] }))}>
                  + Aggiungi ingrediente
                </button>
              )}
            </fieldset>
          ))}
          <div className="adm-row">
            <button
              type="button"
              className="adm-btn adm-btn--primary"
              disabled={busy || !menuDirty}
              onClick={async () => {
                if (await run({ menu }, 'Menu aggiornato')) setMenuDirty(false)
              }}
            >
              Salva il menu
            </button>
            <button
              type="button"
              className="adm-btn adm-btn--ghost"
              disabled={busy}
              onClick={async () => {
                setMenuDirty(false)
                await run({ action: 'resetMenu' }, 'Menu originale ripristinato')
              }}
            >
              Ripristina l’originale
            </button>
          </div>
          <p className="adm-muted">Al massimo 5 ingredienti per piatto, un solo riso (senza riso la bowl resta vuota sotto). Chi ha già il menu aperto vede le modifiche entro mezzo minuto.</p>
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
          <p className="adm-label">Festa · su tutti i telefoni aperti</p>
          <p className="adm-muted">Fa piovere un’emoji per qualche secondo su chiunque abbia il sito aperto.</p>
          <div className="adm-party">
            {PARTY.map((e) => (
              <button key={e} type="button" className="adm-btn" disabled={busy} onClick={() => run({ settings: { party: { emoji: e } } }, `${e} lanciato a tutti`)}>
                {e}
              </button>
            ))}
          </div>
        </section>

        <section className="adm-card">
          <p className="adm-label">Collaborazione · Corpo e Sunnah</p>
          <Segmented
            label="Sezione collaborazione"
            value={s.collab?.on === false ? 'off' : 'on'}
            onChange={(v) => run({ settings: { collab: { ...collab, on: v === 'on' } } }, v === 'on' ? 'Sezione visibile' : 'Sezione nascosta')}
            options={[
              { v: 'on', l: 'Visibile' },
              { v: 'off', l: 'Nascosta' },
            ]}
          />
          <label className="adm-field" htmlFor="adm-cit">
            <span>Testo (italiano)</span>
            <input id="adm-cit" type="text" maxLength={220} placeholder="Il menu del pranzo è stato ideato insieme a Oumaima di Corpo e Sunnah…" value={collab.it} onChange={(e) => setCollab({ ...collab, it: e.target.value })} />
          </label>
          <label className="adm-field" htmlFor="adm-cen">
            <span>Testo (inglese, facoltativo)</span>
            <input id="adm-cen" type="text" maxLength={220} value={collab.en} onChange={(e) => setCollab({ ...collab, en: e.target.value })} />
          </label>
          <div className="adm-row">
            <button type="button" className="adm-btn adm-btn--primary" disabled={busy} onClick={() => run({ settings: { collab } }, 'Testo aggiornato')}>
              Salva testo
            </button>
            <button type="button" className="adm-btn adm-btn--ghost" disabled={busy} onClick={() => run({ settings: { collab: { on: collab.on, it: '', en: '' } } }, 'Testo originale')}>
              Testo originale
            </button>
          </div>
          <p className="adm-muted">
            Link da aprire una volta: <strong>gmitorino.org/corposunnah</strong> ·{' '}
            {data.corpoOpens ? `aperto ${Math.min(data.corpoOpens.used, data.corpoOpens.max)} volte su ${data.corpoOpens.max}` : ''}
          </p>
          {data.corpoOpens?.used > 0 && (
            <div className="adm-row">
              <button type="button" className="adm-btn adm-btn--ghost" disabled={busy} onClick={() => run({ action: 'resetCorpo' }, 'Link riattivato: di nuovo 3 aperture')}>
                Riattiva il link
              </button>
            </div>
          )}
        </section>

        <section className="adm-card">
          <p className="adm-label">Sito statico · emergenza</p>
          <Segmented
            label="Sito statico"
            value={s.staticMode ? 'on' : 'off'}
            onChange={(v) => run({ settings: { staticMode: v === 'on' } }, v === 'on' ? 'Sito statico: niente like, aggiornamenti ogni minuto' : 'Sito di nuovo dal vivo')}
            options={[
              { v: 'off', l: 'Dal vivo' },
              { v: 'on', l: 'Statico' },
            ]}
          />
          <p className="adm-muted">
            Statico: i cuori spariscono e i telefoni chiedono aggiornamenti una volta al minuto invece che ogni 5 secondi. Il menu si svela
            comunque all’ora del pranzo. Torna dal vivo quando vuoi.
          </p>
          {data.static?.on && !s.staticMode && (
            <p className="adm-muted">
              Adesso il sito è statico da solo: {data.static.why === 'env' ? 'SITE_STATIC=1 su Vercel' : 'il database non ha risposto, riprova fra un minuto'}.
            </p>
          )}
        </section>

        <section className="adm-card">
          <p className="adm-label">Mi piace</p>
          <Segmented
            label="Mi piace"
            value={s.likesOn === false ? 'off' : 'on'}
            onChange={(v) => run({ settings: { likesOn: v === 'on' } }, v === 'on' ? 'Cuori visibili' : 'Cuori nascosti')}
            options={[
              { v: 'on', l: 'Visibili' },
              { v: 'off', l: 'Nascosti' },
            ]}
          />
        </section>

        <section className="adm-card adm-card--wide">
          <p className="adm-label">L’evento · testi</p>
          <p className="adm-muted">Lascia vuoto per usare il testo originale. Vale per home e menu.</p>
          <div className="adm-evt">
            {EVT_FIELDS.map(([k, label, ph, sub]) => (
              <label key={k + (sub || '')} className="adm-field">
                <span>{label}</span>
                <input
                  type="text"
                  placeholder={ph}
                  value={(sub ? evt[k]?.[sub] : evt[k]) || ''}
                  onChange={(e) => {
                    evtDirty.current = true
                    const v = e.target.value
                    setEvt((cur) => (sub ? { ...cur, [k]: { ...(cur[k] || {}), [sub]: v } } : { ...cur, [k]: v }))
                  }}
                />
              </label>
            ))}
          </div>
          <div className="adm-row">
            <button
              type="button"
              className="adm-btn adm-btn--primary"
              disabled={busy}
              onClick={async () => {
                if (await run({ settings: { event: evt } }, 'Evento aggiornato')) evtDirty.current = false
              }}
            >
              Salva l’evento
            </button>
            <button
              type="button"
              className="adm-btn adm-btn--ghost"
              disabled={busy}
              onClick={async () => {
                evtDirty.current = false
                setEvt({})
                await run({ settings: { event: {} } }, 'Testi originali ripristinati')
              }}
            >
              Ripristina
            </button>
          </div>
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
