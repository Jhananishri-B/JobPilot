import { useState } from 'react'
import {
  User, Mail, Phone, Linkedin, Github, Upload, Palette, Bell, Sparkles,
  Save, RotateCcw, FileText, CheckCircle2, Moon, Sun,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import PageShell from '../components/ui/PageShell'
import SectionCard from '../components/ui/SectionCard'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Toggle from '../components/ui/Toggle'
import { useFormSubmit } from '../hooks/useFormSubmit'
import { required, email } from '../utils/validation'

const DEFAULT_SETTINGS = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 123-4567',
  linkedin: 'linkedin.com/in/alexjohnson',
  github: 'github.com/alexjohnson',
  notifications: {
    applicationUpdates: true,
    recruiterMessages: true,
    interviewReminders: true,
    weeklyDigest: false,
    productUpdates: false,
  },
  aiPreferences: {
    tone: 'professional',
    detailLevel: 'balanced',
    includeMetrics: true,
    autoKeywords: true,
    interviewDifficulty: 'medium',
  },
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('jobpilot-settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
        aiPreferences: { ...DEFAULT_SETTINGS.aiPreferences, ...parsed.aiPreferences },
      }
    }
  } catch {
    /* use defaults */
  }
  return DEFAULT_SETTINGS
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme()
  const [settings, setSettings] = useState(loadSettings)
  const [resumeFileName, setResumeFileName] = useState('')
  const [saveFeedback, setSaveFeedback] = useState(null)

  const { errors, feedback, isLoading, handleSubmit, clearFieldError } = useFormSubmit({
    validationRules: (values) => ({
      name: [() => required(values.name, 'Name')],
      email: [() => required(values.email, 'Email'), () => email(values.email)],
      phone: [() => required(values.phone, 'Phone')],
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        resumeFileName,
      }
      localStorage.setItem('jobpilot-settings', JSON.stringify(payload))
      setSaveFeedback({ type: 'success', message: 'Settings saved successfully.' })
    },
    successMessage: 'Settings saved successfully.',
    errorMessage: 'Failed to save settings. Please try again.',
    successAutoDismissMs: 6000,
  })

  const updateField = (field) => (e) => {
    setSettings((prev) => ({ ...prev, [field]: e.target.value }))
    clearFieldError(field)
    setSaveFeedback(null)
  }

  const updateNotification = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
    setSaveFeedback(null)
  }

  const updateAiPref = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      aiPreferences: { ...prev.aiPreferences, [key]: value },
    }))
    setSaveFeedback(null)
  }

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFileName(file.name)
      setSaveFeedback(null)
    }
  }

  const handleSave = (e) => {
    if (isLoading) return
    handleSubmit(e, settings)
  }

  const handleReset = () => {
    if (isLoading) return
    setSettings(DEFAULT_SETTINGS)
    setResumeFileName('')
    localStorage.removeItem('jobpilot-settings')
    setSaveFeedback({ type: 'info', message: 'Settings reset to defaults. Click Save to confirm.' })
  }

  return (
    <PageShell
      title="Settings"
      subtitle="Manage your profile, preferences, and AI configuration"
      className="max-w-3xl"
    >
      <Alert type={feedback?.type || saveFeedback?.type} message={feedback?.message || saveFeedback?.message} />

      <SectionCard icon={User} title="Profile" description="Your personal information and professional links">
        <div className="space-y-4">
          <FormField label="Name" name="name" icon={User} required value={settings.name} onChange={updateField('name')} error={errors.name} placeholder="Your full name" />
          <FormField label="Email" name="email" icon={Mail} type="email" required value={settings.email} onChange={updateField('email')} error={errors.email} placeholder="you@email.com" />
          <FormField label="Phone" name="phone" icon={Phone} type="tel" required value={settings.phone} onChange={updateField('phone')} error={errors.phone} placeholder="+1 (555) 000-0000" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="LinkedIn" name="linkedin" icon={Linkedin} value={settings.linkedin} onChange={updateField('linkedin')} placeholder="linkedin.com/in/username" />
            <FormField label="GitHub" name="github" icon={Github} value={settings.github} onChange={updateField('github')} placeholder="github.com/username" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-muted mb-1.5">
              <Upload className="w-3.5 h-3.5" />
              Resume Upload
            </label>
            <label className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-border hover:border-primary/40 bg-background/30 cursor-pointer transition-all duration-200 group">
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              {resumeFileName ? (
                <>
                  <p className="text-sm font-medium text-white">{resumeFileName}</p>
                  <p className="text-xs text-muted mt-1">Click to replace — API: POST /api/user/resume</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-white">Upload your resume</p>
                  <p className="text-xs text-muted mt-1">PDF or DOCX, max 5MB</p>
                </>
              )}
            </label>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Palette} title="Theme" description="Customize the appearance of your dashboard">
        <Toggle
          enabled={isDark}
          onChange={toggleTheme}
          label={isDark ? 'Dark Mode' : 'Light Mode'}
          description={isDark ? 'Easier on the eyes in low light' : 'Bright and clean interface'}
        />
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button type="button" onClick={() => !isDark && toggleTheme()} className={`p-4 rounded-lg border-2 transition-all duration-200 ${isDark ? 'border-primary bg-primary/10 shadow-glow' : 'border-border bg-white/5 hover:border-white/10'}`}>
            <Moon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-white text-center">Dark</p>
          </button>
          <button type="button" onClick={() => isDark && toggleTheme()} className={`p-4 rounded-lg border-2 transition-all duration-200 ${!isDark ? 'border-primary bg-primary/10 shadow-glow' : 'border-border bg-white/5 hover:border-white/10'}`}>
            <Sun className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white text-center">Light</p>
          </button>
        </div>
      </SectionCard>

      <SectionCard icon={Bell} title="Notifications" description="Choose what updates you receive">
        <div className="space-y-3">
          {[
            { key: 'applicationUpdates', label: 'Application status updates', desc: 'When your application moves to a new stage' },
            { key: 'recruiterMessages', label: 'Recruiter messages', desc: 'New messages from recruiters' },
            { key: 'interviewReminders', label: 'Interview reminders', desc: 'Reminders before scheduled interviews' },
            { key: 'weeklyDigest', label: 'Weekly job digest', desc: 'Curated job recommendations every week' },
            { key: 'productUpdates', label: 'Product updates', desc: 'News about new JobPilot AI features' },
          ].map(({ key, label, desc }) => (
            <Toggle key={key} enabled={settings.notifications[key]} onChange={(v) => updateNotification(key, v)} label={label} description={desc} />
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={Sparkles} title="AI Preferences" description="Fine-tune how JobPilot AI generates content">
        <div className="space-y-5">
          <FormField label="Writing Tone" name="tone" as="select" value={settings.aiPreferences.tone} onChange={(e) => updateAiPref('tone', e.target.value)} options={[
            { value: 'professional', label: 'Professional' },
            { value: 'friendly', label: 'Friendly' },
            { value: 'concise', label: 'Concise' },
            { value: 'confident', label: 'Confident' },
          ]} />
          <FormField label="Detail Level" name="detailLevel" as="select" value={settings.aiPreferences.detailLevel} onChange={(e) => updateAiPref('detailLevel', e.target.value)} options={[
            { value: 'minimal', label: 'Minimal' },
            { value: 'balanced', label: 'Balanced' },
            { value: 'detailed', label: 'Detailed' },
          ]} />
          <FormField label="Interview Question Difficulty" name="interviewDifficulty" as="select" value={settings.aiPreferences.interviewDifficulty} onChange={(e) => updateAiPref('interviewDifficulty', e.target.value)} options={[
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' },
          ]} />
          <div className="space-y-3">
            <Toggle enabled={settings.aiPreferences.includeMetrics} onChange={(v) => updateAiPref('includeMetrics', v)} label="Include quantified metrics" description="AI adds impact data to resume suggestions" />
            <Toggle enabled={settings.aiPreferences.autoKeywords} onChange={(v) => updateAiPref('autoKeywords', v)} label="Auto-inject ATS keywords" description="Add relevant keywords from job descriptions" />
          </div>
        </div>
      </SectionCard>

      <div className="card p-5 flex flex-col sm:flex-row items-center gap-3">
        <Button type="button" onClick={handleSave} loading={isLoading} disabled={isLoading} icon={isLoading ? undefined : Save} className="w-full sm:w-auto px-8">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="ghost" onClick={handleReset} disabled={isLoading} icon={RotateCcw} className="w-full sm:w-auto px-8 border border-border">
          Reset
        </Button>
      </div>
    </PageShell>
  )
}
