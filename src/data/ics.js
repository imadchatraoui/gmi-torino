// File .ics ("Aggiungi al calendario") per ogni evento, generato da src/data/events.js:
// in build diventa dist/eventi/<id>.ics, in sviluppo lo serve vite.config.js.
const SITE = 'https://gmitorino.org'

const utc = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')

// righe lunghe spezzate a 75 caratteri, come vuole lo standard (RFC 5545)
const fold = (line) => {
  const out = []
  for (let i = 0; i < line.length; i += 74) out.push((i ? ' ' : '') + line.slice(i, i + 74))
  return out.join('\r\n')
}

export function eventIcs(ev) {
  const description = [
    ev.signup?.url && `Iscrizioni: ${ev.signup.url}`,
    ev.blocks?.menu && `Il menu del pranzo: ${SITE}/menu/`,
    `${SITE}/#eventi`,
  ]
    .filter(Boolean)
    .join('\n')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GMI Torino//Sito//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${ev.id}-${ev.start.slice(0, 10)}@gmitorino.org`,
    `DTSTAMP:${utc(ev.start)}`,
    `DTSTART:${utc(ev.start)}`,
    `DTEND:${utc(ev.end)}`,
    `SUMMARY:${esc(`${ev.name} · GMI Torino`)}`,
    `LOCATION:${esc(`${ev.venue}, ${ev.city}`)}`,
    `DESCRIPTION:${esc(description)}`,
    `URL:${SITE}/#eventi`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}
