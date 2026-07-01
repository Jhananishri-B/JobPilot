export default function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 transition-colors duration-200">
      <div className="pr-4">
        {label && <p className="text-sm font-medium text-white">{label}</p>}
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
        className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${
          enabled ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
