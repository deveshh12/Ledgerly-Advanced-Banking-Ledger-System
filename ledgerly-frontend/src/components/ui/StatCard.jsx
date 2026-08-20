export default function StatCard({ label, value, icon: Icon, tone = 'gold', hint, loading }) {
  const toneClasses = {
    gold: 'text-gold-400 bg-gold-500/10 ring-gold-500/25',
    emerald: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/25',
    slate: 'text-mist-300 bg-white/[0.06] ring-white/10'
  }[tone]

  return (
    <div className="glass-panel p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-mist-500">{label}</p>
          {loading ? (
            <div className="skeleton mt-2 h-8 w-32" />
          ) : (
            <p className="mt-1.5 font-display text-2xl font-semibold text-white sm:text-3xl">{value}</p>
          )}
          {hint && !loading && <p className="mt-1.5 text-xs text-mist-500">{hint}</p>}
        </div>
        {Icon && (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${toneClasses}`}>
            <Icon size={18} />
          </span>
        )}
      </div>
    </div>
  )
}
