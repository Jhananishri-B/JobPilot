export default function FormField({
  label,
  name,
  icon: Icon,
  type = 'text',
  as = 'input',
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  placeholder,
  rows = 4,
  options = [],
  disabled = false,
  readOnly = false,
  className = '',
  inputClassName = '',
}) {
  const id = `field-${name}`
  const hasError = Boolean(error)

  const fieldClasses = [
    'input-field',
    as === 'textarea' ? 'resize-none leading-relaxed' : '',
    hasError ? 'input-error' : '',
    readOnly ? 'opacity-80 cursor-default' : '',
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ')

  const sharedProps = {
    id,
    name,
    value,
    onChange,
    onBlur,
    disabled,
    readOnly,
    placeholder,
    'aria-invalid': hasError,
    'aria-describedby': hasError ? `${id}-error` : hint ? `${id}-hint` : undefined,
    className: fieldClasses,
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="flex items-center gap-2 text-sm text-muted">
          {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
          <span>
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
          </span>
        </label>
      )}

      {as === 'textarea' ? (
        <textarea {...sharedProps} rows={rows} />
      ) : as === 'select' ? (
        <select {...sharedProps} className={`${fieldClasses} cursor-pointer appearance-none`}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...sharedProps} type={type} />
      )}

      {hint && !hasError && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}

      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-400 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  )
}
