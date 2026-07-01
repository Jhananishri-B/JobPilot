import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

const variants = {
  success: {
    icon: CheckCircle2,
    className: 'bg-accent/10 border-accent/20 text-accent',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-500/10 border-red-500/20 text-red-400',
  },
  info: {
    icon: Info,
    className: 'bg-primary/10 border-primary/20 text-primary',
  },
}

export default function Alert({ type = 'info', message, className = '' }) {
  if (!message) return null

  const { icon: Icon, className: variantClass } = variants[type] || variants.info

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-lg border text-sm transition-all duration-300 animate-slide-up ${variantClass} ${className}`}
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <p className="leading-relaxed">{message}</p>
    </div>
  )
}
