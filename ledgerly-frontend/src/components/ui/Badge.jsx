const TONES = {
  gold: 'bg-gold-500/10 text-gold-400 ring-1 ring-inset ring-gold-500/25',
  emerald: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/25',
  rose: 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/25',
  slate: 'bg-white/[0.06] text-mist-400 ring-1 ring-inset ring-white/10'
}

export default function Badge({ tone = 'slate', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${TONES[tone]} ${className}`}>
      {children}
    </span>
  )
}
