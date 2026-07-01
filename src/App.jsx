import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Dashboard from './pages/Dashboard'
import ResumeAnalysis from './pages/ResumeAnalysis'
import ResumeOptimizer from './pages/ResumeOptimizer'
import RecruiterMessages from './pages/RecruiterMessages'
import InterviewCoach from './pages/InterviewCoach'
import Applications from './pages/Applications'
import Settings from './pages/Settings'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resume-analysis" element={<ResumeAnalysis />} />
            <Route path="/resume-optimizer" element={<ResumeOptimizer />} />
            <Route path="/recruiter-messages" element={<RecruiterMessages />} />
            <Route path="/interview-coach" element={<InterviewCoach />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}