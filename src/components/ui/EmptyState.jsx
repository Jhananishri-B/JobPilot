export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div
      className={`card p-8 flex flex-col items-center justify-center text-center min-h-[320px] ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-sm text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
