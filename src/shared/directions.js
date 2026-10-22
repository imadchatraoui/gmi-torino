// indicazioni: su Android il telefono chiede con quale app aprirle (Maps, Waze…); su iPhone e computer
// Google Maps (si apre nell'app se c'è, altrimenti nel browser). iPhone non permette di far scegliere l'app.
export function directionsUrl(ev) {
  const q = encodeURIComponent(`${ev.venue}, ${ev.city}`)
  const android = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
  return android ? `geo:0,0?q=${q}` : `https://www.google.com/maps/dir/?api=1&destination=${q}`
}
