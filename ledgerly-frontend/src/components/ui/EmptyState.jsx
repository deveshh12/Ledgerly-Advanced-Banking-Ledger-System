export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-mist-400 ring-1 ring-inset ring-white/10">
          <Icon size={20} />
        </span>
      )}
      <p className="font-display text-base font-semibold text-white">{title}</p>
      {subtitle && <p className="max-w-xs text-sm text-mist-500">{subtitle}</p>}
      {action}
    </div>
  )
}
