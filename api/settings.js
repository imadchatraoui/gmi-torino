// Impostazioni pubbliche per il sito (avviso in home, iscrizioni, ora del pranzo). Vedi server/store.js.
import { getSettings, menuRevealed, send } from '../server/store.js'

export default async function handler(req, res) {
  const s = await getSettings()
  const now = Date.now()
  return send(res, 200, {
    now,
    menuOpen: menuRevealed(s, now),
    revealAt: s.menuMode === 'closed' ? null : s.revealAt,
    signup: s.signup,
    notice: s.notice?.on ? s.notice : null,
    likesOn: s.likesOn !== false,
    party: s.party,
    event: s.event || {},
    collab: s.collab,
  }, 'public, s-maxage=1, stale-while-revalidate=1')
}
