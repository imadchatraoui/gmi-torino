import { useEffect } from 'react'

// Aggiunge .is-in agli elementi .reveal (e [data-reveal]) quando entrano nello schermo.
// Un solo IntersectionObserver per pagina, niente listener di scroll.
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, [data-reveal]')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// Sezione attualmente in vista (per header e barra di navigazione).
export function observeSections(ids, onChange) {
  const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
  if (!els.length || !('IntersectionObserver' in window)) return () => {}
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) onChange(e.target.id)
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  els.forEach((el) => io.observe(el))
  return () => io.disconnect()
}
