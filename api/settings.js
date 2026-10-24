// Impostazioni pubbliche per il sito (avviso in home, iscrizioni, ora del pranzo). Vedi server/store.js.
import { getSettings, menuRevealed, send, staticState } from '../server/store.js'

export default async function handler(req, res) {
  const s = await getSettings()
  const now = Date.now()
  const still = staticState(s).on
  return send(res, 200, {
    now,
    menuOpen: menuRevealed(s, now),
    revealAt: s.menuMode === 'closed' ? null : s.revealAt,
    signup: s.signup,
    notice: s.notice?.on ? s.notice : null,
    likesOn: s.likesOn !== false && !still,
    static: still, // i telefoni chiedono aggiornamenti ogni 60 s invece che ogni 5
    party: s.party,
    event: s.event || {},
    collab: s.collab,
  }, 'public, s-maxage=1, stale-while-revalidate=1')
}
