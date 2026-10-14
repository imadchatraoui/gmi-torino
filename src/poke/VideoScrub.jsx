import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

/**
 * Video muto scrubbato dallo scroll (currentTime = progresso * durata).
 * Per uno scrub fluido il video va codificato con tutti keyframe — vedi README.
 */
const VideoScrub = forwardRef(function VideoScrub({ src, poster }, ref) {
  const videoRef = useRef(null)
  const target = useRef(0)

  useEffect(() => {
    const v = videoRef.current
    // iOS Safari: serve un play() dopo un gesto per poter fare seek fluidi
    const unlock = () => {
      v.play().then(() => v.pause()).catch(() => {})
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('touchstart', unlock, { passive: true })
    const onSeeked = () => {
      if (Math.abs(v.currentTime - target.current) > 0.04) v.currentTime = target.current
    }
    v.addEventListener('seeked', onSeeked)
    return () => {
      window.removeEventListener('touchstart', unlock)
      v.removeEventListener('seeked', onSeeked)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    update(p) {
      const v = videoRef.current
      if (!v || !v.duration) return
      target.current = p * (v.duration - 0.05)
      if (!v.seeking && Math.abs(v.currentTime - target.current) > 0.03) v.currentTime = target.current
    },
  }))

  return (
    <video
      ref={videoRef}
      className="poke-media"
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  )
})

export default VideoScrub
