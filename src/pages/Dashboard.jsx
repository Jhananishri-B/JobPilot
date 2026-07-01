import { Link } from 'react-router-dom'
import {
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,
  Target,
  CheckCircle2,
} from 'lucide-react'
import PageShell from '../components/ui/PageShell'

const stats = [
  { label: 'Applications Sent', value: '24', change: '+12%', icon: Briefcase, color: 'text-primary', to: '/applications' },
  { label: 'Resume Score', value: '87%', change: '+5%', icon: FileText, color: 'text-accent', to: '/resume-analysis' },
  { label: 'Interview Rate', value: '32%', change: '+8%', icon: TrendingUp, color: 'text-primary', to: '/interview-coach' },
  { label: 'Avg. Response Time', value: '3.2d', change: '-1.1d', icon: Clock, color: 'text-accent', to: '/recruiter-messages' },
]

const recentActivity = [
  { action: 'Resume optimized for Google SWE role', time: '2 hours ago', to: '/resume-optimizer' },
  { action: 'Application submitted to Meta', time: '5 hours ago', to: '/applications' },
  { action: 'Interview practice completed', time: '1 day ago', to: '/interview-coach' },
  { action: 'New recruiter message from Amazon', time: '2 days ago', to: '/recruiter-messages' },
]

const upcomingTasks = [
  { task: 'Follow up with Stripe recruiter', due: 'Today', priority: 'high' },
  { task: 'Complete behavioral interview prep', due: 'Tomorrow', priority: 'medium' },
  { task: 'Update resume for ML roles', due: 'In 3 days', priority: 'low' },
]

export default function Dashboard() {
  return (
    <PageShell
      title="Welcome back, Alex 👋"
      subtitle="Here's your job search overview for today"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color, to }) => (
          <Link key={label} to={to} className="card card-hover p-5 block transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg bg-white/5 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-accent">{change}</span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-muted mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Link to="/applications" className="btn-ghost text-sm flex items-center gap-1">
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
              >
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.action}</p>
                  <p className="text-xs text-muted">{item.time}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Upcoming Tasks</h2>
          <div className="space-y-3">
            {upcomingTasks.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <CheckCircle2 className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{item.task}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted">{item.due}</span>
                    <span
                      className={`badge ${
                        item.priority === 'high'
                          ? 'bg-red-500/15 text-red-400'
                          : item.priority === 'medium'
                          ? 'bg-yellow-500/15 text-yellow-400'
                          : 'bg-blue-500/15 text-blue-400'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/resume-optimizer"
          className="card card-hover p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 block transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-white">Optimize Your Resume</h3>
          </div>
          <p className="text-sm text-muted mb-4">
            AI-powered suggestions to boost your resume score by up to 30%
          </p>
          <span className="btn-primary text-sm inline-flex">Get Started</span>
        </Link>
        <Link
          to="/interview-coach"
          className="card card-hover p-6 bg-gradient-to-br from-accent/10 to-transparent border-accent/20 block transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-accent" />
            <h3 className="font-semibold text-white">Practice Interview</h3>
          </div>
          <p className="text-sm text-muted mb-4">
            Mock interviews with real-time AI feedback and scoring
          </p>
          <span className="btn-accent text-sm inline-flex">Start Practice</span>
        </Link>
      </div>
    </PageShell>
  )
}
