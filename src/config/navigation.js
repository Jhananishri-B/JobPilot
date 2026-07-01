import {
  LayoutDashboard,
  FileSearch,
  Sparkles,
  MessageSquare,
  Mic,
  Briefcase,
  Settings,
} from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', mobileLabel: 'Home' },
  { to: '/resume-analysis', icon: FileSearch, label: 'Resume Analysis', mobileLabel: 'Resume' },
  { to: '/resume-optimizer', icon: Sparkles, label: 'Resume Optimizer', mobileLabel: 'Optimize' },
  { to: '/recruiter-messages', icon: MessageSquare, label: 'Recruiter Messages', mobileLabel: 'Messages' },
  { to: '/interview-coach', icon: Mic, label: 'Interview Coach', mobileLabel: 'Coach' },
  { to: '/applications', icon: Briefcase, label: 'Applications', mobileLabel: 'Apps' },
  { to: '/settings', icon: Settings, label: 'Settings', mobileLabel: 'Settings' },
]
