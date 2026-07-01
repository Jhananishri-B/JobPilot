export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-lg bg-white/5 animate-pulse ${className}`}
      {...props}
    />
  )
}
