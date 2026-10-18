import { CONTACTS } from '../data/site'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'
import { t, usePrefs } from '../shared/prefs'
import { ACCESSIBILITY, PRIVACY, STORAGE, UPDATED } from './content'

const PAGES = { privacy: PRIVACY, accessibilita: ACCESSIBILITY }

// {email} nel testo diventa il link all'email
function Text({ value }) {
  const parts = value.split('{email}')
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>}
    </span>
  ))
}

export default function LegalPage({ page }) {
  const { lang } = usePrefs()
  const tr = (v) => t(v, lang)
  const doc = PAGES[page]
  return (
    <>
      <SiteHeader page="legal" />
      <main id="main" className="legal" tabIndex={-1}>
        <header className="legal__head">
          <p className="legal__kicker">{tr(doc.kicker)}</p>
          <h1 className="legal__title">{tr(doc.title)}</h1>
          <p className="legal__intro">{tr(doc.intro)}</p>
          <p className="legal__updated">
            {tr({ it: 'Ultimo aggiornamento:', en: 'Last updated:' })} {tr(UPDATED)}
          </p>
        </header>
        {doc.sections.map((s) => (
          <section key={s.h.it} className="legal__sec">
            <h2>{tr(s.h)}</h2>
            {s.blocks.map((b, i) =>
              b.p ? (
                <p key={i}>
                  <Text value={tr(b.p)} />
                </p>
              ) : b.list ? (
                <ul key={i}>
                  {b.list.map((item) => (
                    <li key={item.it}>
                      <Text value={tr(item)} />
                    </li>
                  ))}
                </ul>
              ) : b.storage ? (
                <div key={i} className="legal__table" role="region" aria-label={tr({ it: 'Memoria del browser usata dal sito', en: 'Browser storage used by the site' })} tabIndex={0}>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">{tr({ it: 'Nome', en: 'Name' })}</th>
                        <th scope="col">{tr({ it: 'A cosa serve', en: 'What it is for' })}</th>
                        <th scope="col">{tr({ it: 'Tipo', en: 'Type' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STORAGE.map((r) => (
                        <tr key={r.key}>
                          <td>
                            <code>{r.key}</code>
                          </td>
                          <td>{tr(r.what)}</td>
                          <td>{tr(r.kind)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null,
            )}
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  )
}
