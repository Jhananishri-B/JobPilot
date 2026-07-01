import { useState, useCallback, useRef, useEffect } from 'react'
import { validateFields } from '../utils/validation'

export function useFormSubmit({
  validationRules,
  onSubmit,
  successMessage,
  errorMessage,
  successAutoDismissMs = 0,
}) {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState(null)
  const isSubmittingRef = useRef(false)

  useEffect(() => {
    if (!successAutoDismissMs || feedback?.type !== 'success') return undefined

    const timer = setTimeout(() => {
      setFeedback((current) => (current?.type === 'success' ? null : current))
    }, successAutoDismissMs)

    return () => clearTimeout(timer)
  }, [feedback, successAutoDismissMs])

  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const resetFeedback = useCallback(() => {
    setFeedback(null)
    setStatus('idle')
  }, [])

  const handleSubmit = useCallback(
    async (e, values) => {
      e.preventDefault()

      if (isSubmittingRef.current) {
        return false
      }

      setFeedback(null)

      const fieldErrors = validationRules ? validateFields(validationRules(values)) : {}
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors)
        setStatus('error')
        setFeedback({
          type: 'error',
          message: 'Please fix the highlighted fields before continuing.',
        })
        return false
      }

      setErrors({})
      isSubmittingRef.current = true
      setStatus('loading')

      try {
        await onSubmit(values)
        setStatus('success')
        setFeedback({
          type: 'success',
          message: successMessage || 'Completed successfully.',
        })
        return true
      } catch (err) {
        setStatus('error')
        setFeedback({
          type: 'error',
          message: err?.message || errorMessage || 'Something went wrong. Please try again.',
        })
        return false
      } finally {
        isSubmittingRef.current = false
      }
    },
    [validationRules, onSubmit, successMessage, errorMessage]
  )

  return {
    errors,
    status,
    feedback,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    handleSubmit,
    clearFieldError,
    resetFeedback,
    setErrors,
  }
}
