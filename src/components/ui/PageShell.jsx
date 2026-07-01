import PageHeader from './PageHeader'

export default function PageShell({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`page-container space-y-6 animate-slide-up ${className}`}>
      <PageHeader title={title} subtitle={subtitle} action={action} />
      {children}
    </div>
  )
}
