import { Loader2 } from 'lucide-react'
import Skeleton from './Skeleton'

function CardSkeleton({ children, className = '' }) {
  return <div className={`card p-5 space-y-3 ${className}`}>{children}</div>
}

const variants = {
  analysis: () => (
    <>
      <CardSkeleton>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-40 w-40 rounded-full mx-auto" />
        <Skeleton className="h-3 w-3/4 mx-auto" />
      </CardSkeleton>
      <CardSkeleton>
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-16 w-full" />
      </CardSkeleton>
      {[1, 2, 3].map((i) => (
        <CardSkeleton key={i}>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2.5 w-full" />
        </CardSkeleton>
      ))}
      <CardSkeleton>
        <Skeleton className="h-4 w-28" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-lg" />
          ))}
        </div>
      </CardSkeleton>
    </>
  ),
  optimize: () => (
    <>
      <CardSkeleton>
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-[280px] w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardSkeleton>
      <CardSkeleton>
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-lg" />
          ))}
        </div>
      </CardSkeleton>
      <CardSkeleton>
        <Skeleton className="h-4 w-40" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </CardSkeleton>
    </>
  ),
  message: () => (
    <>
      <CardSkeleton>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </CardSkeleton>
      <CardSkeleton>
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-[300px] w-full" />
      </CardSkeleton>
      <div className="card p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </>
  ),
  interview: () => (
    <div className="card p-4 md:p-6 space-y-4">
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-28 shrink-0 rounded-lg" />
        ))}
      </div>
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  ),
  default: () => (
    <CardSkeleton>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </CardSkeleton>
  ),
}

export default function LoadingState({
  message = 'Loading...',
  variant = 'default',
  className = '',
  minHeight = '',
}) {
  const content = variants[variant] ? variants[variant]() : variants.default()

  return (
    <div className={`space-y-4 ${className}`} role="status" aria-live="polite" aria-busy="true">
      <div className={`card p-5 flex items-center gap-3 ${minHeight}`}>
        <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" aria-hidden="true" />
        <p className="text-sm text-muted">{message}</p>
      </div>
      {content}
    </div>
  )
}
