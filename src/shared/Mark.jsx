// Logo GMI Torino ricolorato con il gradiente GMI (maschera CSS sul logo originale).
export default function Mark({ className = '', white = false, label }) {
  return (
    <span
      className={`mark${white ? ' mark--white' : ''} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    />
  )
}
