import { Bell, Moon, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/5 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <NavLink to="/" className="flex items-center gap-3 group md:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <span className="text-white font-bold text-sm">JP</span>
          </div>
        </NavLink>
        <div className="hidden md:block">
          <h2 className="text-lg font-bold text-white">JobPilot AI</h2>
          <p className="text-xs text-muted">Your AI career co-pilot</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="relative p-2.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-background" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">Alex Johnson</p>
              <p className="text-xs text-muted">alex@email.com</p>
            </div>
            <NavLink
              to="/settings"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white/10 hover:ring-primary/50 transition-all duration-200"
              aria-label="Profile settings"
            >
              AJ
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}
