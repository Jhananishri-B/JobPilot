import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../config/navigation'

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/5 md:hidden">
      <div className="flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map(({ to, icon: Icon, mobileLabel }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive ? 'text-primary' : 'text-muted'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-medium truncate">{mobileLabel}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
