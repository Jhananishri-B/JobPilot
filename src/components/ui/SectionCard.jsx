export default function SectionCard({ icon: Icon, title, description, accent = false, children, className = '' }) {
  return (
    <div className={`card p-5 md:p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-5">
        {Icon && (
          <div className={`p-2.5 rounded-lg shrink-0 ${accent ? 'bg-accent/10' : 'bg-primary/10'}`}>
            <Icon className={`w-4 h-4 ${accent ? 'text-accent' : 'text-primary'}`} />
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
