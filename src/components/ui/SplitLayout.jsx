export default function SplitLayout({ left, right, className = '' }) {
  return (
    <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 items-start ${className}`}>
      {left}
      {right}
    </div>
  )
}
