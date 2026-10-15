// Stato degli eventi in base alla data, calcolato nel browser di chi visita:
//   upcoming — fino al giorno dopo la fine dell'evento
//   recent   — passato da meno di 7 giorni: in Eventi resta un avviso che rimanda all'Archivio
//   past     — solo in Archivio
const DAY = 24 * 60 * 60 * 1000

export function eventStatus(ev, now = Date.now()) {
  const end = new Date(ev.end ?? ev.start).getTime()
  if (now < end + DAY) return 'upcoming'
  if (now < end + 8 * DAY) return 'recent'
  return 'past'
}

export function daysUntil(iso, now = new Date()) {
  const d = new Date(iso)
  return Math.round(
    (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / DAY,
  )
}
