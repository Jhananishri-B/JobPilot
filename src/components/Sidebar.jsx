import { NavLink } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { NAV_ITEMS } from '../config/navigation'

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 lg:w-64 glass-strong z-40 flex flex-col border-r border-white/5 hidden md:flex">
      <div className="p-6 border-b border-white/5">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-glow transition-transform duration-200 group-hover:scale-105">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight">JobPilot</h1>
            <p className="text-xs text-accent font-medium">AI Platform</p>
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/15 text-primary border border-primary/20 shadow-glow'
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="card p-4 bg-primary/10 border-primary/20">
          <p className="text-xs font-semibold text-primary mb-1">Pro Plan</p>
          <p className="text-xs text-muted mb-3">Unlock unlimited AI optimizations</p>
          <button type="button" className="w-full btn-primary text-xs py-2">Upgrade Now</button>
        </div>
      </div>
    </aside>
  )
}
