export default function Field({ label, error, hint, children }) {
  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-mist-500">{hint}</p>
      ) : null}
    </div>
  )
}
