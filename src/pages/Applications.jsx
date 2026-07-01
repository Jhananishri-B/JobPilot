import { useMemo, useState } from 'react'
import {
  Search,
  Filter,
  Briefcase,
  Calendar,
  Building2,
  Eye,
  Pencil,
  Trash2,
  Plus,
  X,
  TrendingUp,
  Users,
  Trophy,
  XCircle,
} from 'lucide-react'
import PageShell from '../components/ui/PageShell'
import Button from '../components/ui/Button'

const INITIAL_APPLICATIONS = [
  {
    id: 1,
    company: 'Google',
    role: 'Senior Software Engineer',
    atsScore: 87,
    resumeStatus: 'Optimized',
    interviewStatus: 'Scheduled',
    appliedDate: '2026-06-20',
    status: 'interview',
  },
  {
    id: 2,
    company: 'Meta',
    role: 'Software Engineer E4',
    atsScore: 82,
    resumeStatus: 'Submitted',
    interviewStatus: 'Pending',
    appliedDate: '2026-06-18',
    status: 'applied',
  },
  {
    id: 3,
    company: 'Stripe',
    role: 'Backend Engineer',
    atsScore: 91,
    resumeStatus: 'Optimized',
    interviewStatus: 'Completed',
    appliedDate: '2026-06-15',
    status: 'offer',
  },
  {
    id: 4,
    company: 'Amazon',
    role: 'SDE II',
    atsScore: 74,
    resumeStatus: 'Needs Review',
    interviewStatus: 'N/A',
    appliedDate: '2026-06-12',
    status: 'applied',
  },
  {
    id: 5,
    company: 'Netflix',
    role: 'Senior Engineer',
    atsScore: 79,
    resumeStatus: 'Submitted',
    interviewStatus: 'Completed',
    appliedDate: '2026-06-10',
    status: 'rejected',
  },
  {
    id: 6,
    company: 'Apple',
    role: 'iOS Engineer',
    atsScore: 85,
    resumeStatus: 'Optimized',
    interviewStatus: 'Scheduled',
    appliedDate: '2026-06-08',
    status: 'interview',
  },
  {
    id: 7,
    company: 'Microsoft',
    role: 'Cloud Engineer',
    atsScore: 88,
    resumeStatus: 'Submitted',
    interviewStatus: 'Pending',
    appliedDate: '2026-05-28',
    status: 'applied',
  },
  {
    id: 8,
    company: 'Airbnb',
    role: 'Full Stack Engineer',
    atsScore: 76,
    resumeStatus: 'Draft',
    interviewStatus: 'N/A',
    appliedDate: '2026-05-22',
    status: 'rejected',
  },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
]

const DATE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
]

const resumeStatusStyle = {
  Optimized: 'bg-accent/15 text-accent',
  Submitted: 'bg-blue-500/15 text-blue-400',
  Draft: 'bg-yellow-500/15 text-yellow-400',
  'Needs Review': 'bg-red-500/15 text-red-400',
}

const interviewStatusStyle = {
  Scheduled: 'bg-primary/15 text-primary',
  Completed: 'bg-accent/15 text-accent',
  Pending: 'bg-yellow-500/15 text-yellow-400',
  'N/A': 'bg-white/5 text-muted',
}

const MONTHLY_DATA = [
  { month: 'Jan', count: 3 },
  { month: 'Feb', count: 5 },
  { month: 'Mar', count: 4 },
  { month: 'Apr', count: 7 },
  { month: 'May', count: 6 },
  { month: 'Jun', count: 8 },
]

function atsColor(score) {
  if (score >= 85) return 'text-accent'
  if (score >= 70) return 'text-primary'
  return 'text-yellow-400'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count))

  return (
    <div className="flex items-end justify-between gap-2 h-36 pt-4">
      {data.map((item) => (
        <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-white">{item.count}</span>
          <div className="w-full flex justify-center">
            <div
              className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-primary to-primary/60 transition-all duration-500"
              style={{ height: `${(item.count / max) * 100}px`, minHeight: '8px' }}
            />
          </div>
          <span className="text-xs text-muted">{item.month}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ segments }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const radius = 40
  const circumference = 2 * Math.PI * radius
  let accumulated = 0

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#334155" strokeWidth="12" />
          {segments.map((seg) => {
            const segmentLength = total > 0 ? (seg.value / total) * circumference : 0
            const element = (
              <circle
                key={seg.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-accumulated}
                strokeLinecap="butt"
              />
            )
            accumulated += segmentLength
            return element
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{total}</span>
          <span className="text-[10px] text-muted">Total</span>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-muted">{seg.label}</span>
            </div>
            <span className="font-medium text-white">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card glass-strong shadow-glass animate-slide-up p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function Applications() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [modal, setModal] = useState(null)

  const companies = useMemo(
    () => ['all', ...new Set(applications.map((a) => a.company))],
    [applications]
  )

  const filtered = useMemo(() => {
    const now = new Date()
    return applications.filter((app) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      const matchesCompany = companyFilter === 'all' || app.company === companyFilter

      let matchesDate = true
      if (dateFilter !== 'all') {
        const applied = new Date(app.appliedDate)
        const days = parseInt(dateFilter, 10)
        const cutoff = new Date(now)
        cutoff.setDate(cutoff.getDate() - days)
        matchesDate = applied >= cutoff
      }

      return matchesSearch && matchesStatus && matchesCompany && matchesDate
    })
  }, [applications, search, statusFilter, companyFilter, dateFilter])

  const analytics = useMemo(() => {
    const total = filtered.length
    const interviews = filtered.filter((a) => a.status === 'interview').length
    const offers = filtered.filter((a) => a.status === 'offer').length
    const rejected = filtered.filter((a) => a.status === 'rejected').length
    return { total, interviews, offers, rejected }
  }, [filtered])

  const donutSegments = [
    { label: 'Applied', value: filtered.filter((a) => a.status === 'applied').length, color: '#6366F1' },
    { label: 'Interviews', value: analytics.interviews, color: '#F59E0B' },
    { label: 'Offers', value: analytics.offers, color: '#10B981' },
    { label: 'Rejected', value: analytics.rejected, color: '#EF4444' },
  ].filter((s) => s.value > 0)

  const handleDelete = (id) => {
    setApplications((prev) => prev.filter((a) => a.id !== id))
    setModal(null)
  }

  const selectedApp = modal?.app

  return (
    <PageShell
      title="Application Tracker"
      subtitle="Track applications, interviews, and offers in one place"
      action={
        <Button icon={Plus} className="text-sm w-fit">
          Add Application
        </Button>
      }
    >

      {/* Search & Filters */}
      <div className="card p-4 md:p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              className="input-field pl-10"
              placeholder="Search by company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative min-w-[140px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <select
                className="input-field pl-10 appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-card">
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative min-w-[140px]">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <select
                className="input-field pl-10 appearance-none cursor-pointer"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              >
                {companies.map((c) => (
                  <option key={c} value={c} className="bg-card">
                    {c === 'all' ? 'All Companies' : c}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative min-w-[140px]">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <select
                className="input-field pl-10 appearance-none cursor-pointer"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                {DATE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-card">
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Applications', value: analytics.total, icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Interviews', value: analytics.interviews, icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Offers', value: analytics.offers, icon: Trophy, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Rejected', value: analytics.rejected, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-muted mt-1">{label}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-white">Applications Over Time</h3>
          </div>
          <BarChart data={MONTHLY_DATA} />
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-white">Status Distribution</h3>
          </div>
          <DonutChart segments={donutSegments.length ? donutSegments : [{ label: 'No data', value: 1, color: '#334155' }]} />
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing <span className="text-white font-medium">{filtered.length}</span> of{' '}
            {applications.length} applications
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Company', 'Role', 'ATS Score', 'Resume Status', 'Interview Status', 'Applied Date', 'Actions'].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3.5"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted text-sm">
                    No applications match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-150"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                          {app.company[0]}
                        </div>
                        <span className="text-sm font-medium text-white">{app.company}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-white/90 max-w-[200px] truncate">{app.role}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              app.atsScore >= 85 ? 'bg-accent' : app.atsScore >= 70 ? 'bg-primary' : 'bg-yellow-400'
                            }`}
                            style={{ width: `${app.atsScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${atsColor(app.atsScore)}`}>{app.atsScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${resumeStatusStyle[app.resumeStatus]}`}>{app.resumeStatus}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${interviewStatusStyle[app.interviewStatus]}`}>
                        {app.interviewStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted whitespace-nowrap">
                      {formatDate(app.appliedDate)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setModal({ type: 'view', app })}
                          className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setModal({ type: 'edit', app })}
                          className="p-2 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setModal({ type: 'delete', app })}
                          className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modal?.type === 'view' && selectedApp && (
        <Modal title="Application Details" onClose={() => setModal(null)}>
          <div className="space-y-3 text-sm">
            {[
              ['Company', selectedApp.company],
              ['Role', selectedApp.role],
              ['ATS Score', `${selectedApp.atsScore}%`],
              ['Resume Status', selectedApp.resumeStatus],
              ['Interview Status', selectedApp.interviewStatus],
              ['Applied Date', formatDate(selectedApp.appliedDate)],
              ['Pipeline Status', selectedApp.status],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-white/5">
                <span className="text-muted">{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal?.type === 'edit' && selectedApp && (
        <Modal title="Edit Application" onClose={() => setModal(null)}>
          <p className="text-sm text-muted mb-4">
            Editing <span className="text-white">{selectedApp.company}</span> — form UI only, no backend connected.
          </p>
          <div className="space-y-3">
            <input className="input-field" defaultValue={selectedApp.role} placeholder="Role" />
            <select className="input-field" defaultValue={selectedApp.status}>
              {STATUS_OPTIONS.filter((o) => o.value !== 'all').map((o) => (
                <option key={o.value} value={o.value} className="bg-card">{o.label}</option>
              ))}
            </select>
            <button onClick={() => setModal(null)} className="btn-primary w-full mt-2">
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === 'delete' && selectedApp && (
        <Modal title="Delete Application" onClose={() => setModal(null)}>
          <p className="text-sm text-muted mb-6">
            Are you sure you want to delete the application for{' '}
            <span className="text-white font-medium">{selectedApp.role}</span> at{' '}
            <span className="text-white font-medium">{selectedApp.company}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} className="btn-ghost flex-1 border border-border">
              Cancel
            </button>
            <button
              onClick={() => handleDelete(selectedApp.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </PageShell>
  )
}
