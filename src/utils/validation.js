export function required(value, label) {
  if (!value || !String(value).trim()) return `${label} is required`
  return null
}

export function minLength(value, min, label) {
  if (!value || String(value).trim().length < min) {
    return `${label} must be at least ${min} characters`
  }
  return null
}

export function email(value) {
  if (!value) return null
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!pattern.test(value.trim())) return 'Please enter a valid email address'
  return null
}

export function validateFields(rules) {
  const errors = {}
  for (const [field, checks] of Object.entries(rules)) {
    for (const check of checks) {
      const error = check()
      if (error) {
        errors[field] = error
        break
      }
    }
  }
  return errors
}
