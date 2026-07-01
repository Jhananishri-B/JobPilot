import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  ghost: 'btn-ghost border border-border',
  danger: 'bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98]',
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}
