export default function JirehLogo({ className = '', size = 'md' }) {
  const sizeClass = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-2xl'

  return (
    <div
      className={`flex items-baseline gap-0 select-none leading-none ${className}`}
      style={{ fontFamily: "'Nunito', 'Inter', sans-serif", fontWeight: 800 }}
    >
      <span className={`${sizeClass}`} style={{ color: '#8B00FF' }}>
        jireh
      </span>
      <span className={`${sizeClass}`} style={{ color: '#D4A0F5', fontWeight: 700 }}>
        health
      </span>
      <span className={`${sizeClass}`} style={{ color: '#8B00FF' }}>
        .
      </span>
    </div>
  )
}
