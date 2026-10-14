import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

/**
 * Sequenza di frame (webp/avif/jpg) disegnata su canvas in base allo scroll.
 * I frame vengono scaricati solo quando la sezione si avvicina allo schermo.
 * Usare frame già alla dimensione giusta (es. 720x720) per stare leggeri.
 */
const FrameSequence = forwardRef(function FrameSequence({ frames }, ref) {
  const canvasRef = useRef(null)
  const imgs = useRef([])
  const current = useRef(-1)
  const want = useRef(0)

  const draw = (idx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    // se il frame non è ancora caricato, usa il più vicino già pronto
    let img = null
    for (let d = 0; d < frames.length && !img; d++) {
      const a = imgs.current[idx - d]
      const b = imgs.current[idx + d]
      if (a?.complete && a.naturalWidth) img = a
      else if (b?.complete && b.naturalWidth) img = b
    }
    if (!img) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth * dpr
    const h = canvas.clientHeight * dpr
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    const ctx = canvas.getContext('2d')
    const s = Math.min(w / img.naturalWidth, h / img.naturalHeight)
    const dw = img.naturalWidth * s
    const dh = img.naturalHeight * s
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
    current.current = idx
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || imgs.current.length) return
        imgs.current = frames.map((src, i) => {
          const img = new Image()
          img.decoding = 'async'
          img.onload = () => {
            if (i === want.current || current.current < 0) draw(want.current)
          }
          img.src = src
          return img
        })
        io.disconnect()
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(canvas)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames])

  useImperativeHandle(ref, () => ({
    update(p) {
      const idx = Math.round(p * (frames.length - 1))
      want.current = idx
      if (idx !== current.current) draw(idx)
    },
  }))

  return <canvas ref={canvasRef} className="poke-media" aria-hidden="true" />
})

export default FrameSequence
