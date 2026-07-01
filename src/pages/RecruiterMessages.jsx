import { useState } from 'react'
import {
  MessageSquare, User, Briefcase, Building2, FileText, AlignLeft, Sparkles,
  Mail, Copy, Download, RefreshCw, Eye, CheckCircle2, X, Send,
} from 'lucide-react'
import PageShell from '../components/ui/PageShell'
import SectionCard from '../components/ui/SectionCard'
import SplitLayout from '../components/ui/SplitLayout'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import { useFormSubmit } from '../hooks/useFormSubmit'
import { required, minLength } from '../utils/validation'
import { AI_PARSE_ERROR, generateRecruiterMessage } from '../services/ai'

function PreviewModal({ subject, message, candidateName, companyName, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl card glass-strong shadow-glass animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10"><Eye className="w-4 h-4 text-primary" /></div>
            <h3 className="font-semibold text-white">Email Preview</h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/5"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3 pb-4 border-b border-white/5 text-sm">
            <div className="flex gap-3"><span className="text-muted w-14">From:</span><span className="text-white">{candidateName || 'you@email.com'}</span></div>
            <div className="flex gap-3"><span className="text-muted w-14">To:</span><span className="text-white">recruiting@{companyName.toLowerCase().replace(/\s+/g, '') || 'company'}.com</span></div>
            <div className="flex gap-3"><span className="text-muted w-14">Subject:</span><span className="text-white font-medium">{subject}</span></div>
          </div>
          <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{message}</div>
        </div>
        <div className="p-4 border-t border-white/5 flex justify-end">
          <Button variant="ghost" onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  )
}

const initialForm = {
  candidateName: '',
  jobRole: '',
  companyName: '',
  candidateSummary: '',
}

export default function RecruiterMessages() {
  const [form, setForm] = useState(initialForm)
  const [subject, setSubject] = useState('')
  const [tone, setTone] = useState('')
  const [generatedMessage, setGeneratedMessage] = useState('')
  const [hasGenerated, setHasGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [actionFeedback, setActionFeedback] = useState(null)

  const { errors, feedback, isLoading, handleSubmit, clearFieldError } = useFormSubmit({
    validationRules: (values) => ({
      candidateName: [() => required(values.candidateName, 'Candidate name')],
      jobRole: [() => required(values.jobRole, 'Job role')],
      companyName: [() => required(values.companyName, 'Company name')],
      candidateSummary: [() => required(values.candidateSummary, 'Candidate summary'), () => minLength(values.candidateSummary, 20, 'Candidate summary')],
    }),
    onSubmit: async (values) => {
      const result = await generateRecruiterMessage({
        candidate_name: values.candidateName.trim(),
        company_name: values.companyName.trim(),
        job_role: values.jobRole.trim(),
        candidate_summary: values.candidateSummary.trim(),
      })
      setSubject(result.subject ?? '')
      setTone(result.tone ?? '')
      setGeneratedMessage(result.generated_message ?? '')
      setHasGenerated(true)
    },
    successMessage: 'Message generated successfully. Review and edit before sending.',
    errorMessage: AI_PARSE_ERROR,
    successAutoDismissMs: 6000,
  })

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    clearFieldError(field)
  }

  const runRegenerate = async () => {
    if (submitting) return
    const fakeEvent = { preventDefault: () => {} }
    await handleSubmit(fakeEvent, form)
  }

  const submitting = isLoading

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${generatedMessage}`)
      setCopied(true)
      setActionFeedback({ type: 'success', message: 'Message copied to clipboard.' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setActionFeedback({ type: 'error', message: 'Copy failed. Please copy manually.' })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([`Subject: ${subject}\n\n${generatedMessage}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `recruiter-message-${form.companyName || 'draft'}.txt`
    link.click()
    URL.revokeObjectURL(url)
    setActionFeedback({ type: 'success', message: 'Message downloaded.' })
  }

  return (
    <PageShell title="Recruiter Message Generator" subtitle="Craft personalized outreach emails tailored to your resume and target role">
      <SplitLayout
        left={
          <SectionCard icon={MessageSquare} title="Input Form" description="Agent: recruiter_message_generator">
            <form onSubmit={(e) => handleSubmit(e, form)} className="space-y-5" noValidate>
              <Alert type={feedback?.type} message={feedback?.message} />
              <FormField label="Candidate Name" name="candidateName" icon={User} required placeholder="e.g. Alex Johnson" value={form.candidateName} onChange={update('candidateName')} error={errors.candidateName} />
              <FormField label="Job Role" name="jobRole" icon={Briefcase} required placeholder="e.g. Senior Software Engineer" value={form.jobRole} onChange={update('jobRole')} error={errors.jobRole} />
              <FormField label="Company Name" name="companyName" icon={Building2} required placeholder="e.g. Google" value={form.companyName} onChange={update('companyName')} error={errors.companyName} />
              <FormField label="Candidate Summary" name="candidateSummary" icon={AlignLeft} as="textarea" rows={5} required placeholder="Brief summary of strengths and fit..." value={form.candidateSummary} onChange={update('candidateSummary')} error={errors.candidateSummary} inputClassName="min-h-[120px]" />
              <Button type="submit" loading={submitting} disabled={submitting} icon={Sparkles} className="w-full py-3">
                {submitting ? 'Generating...' : 'Generate Message'}
              </Button>
            </form>
          </SectionCard>
        }
        right={
          <div className="space-y-4">
            <div className="panel-heading px-1">
              <div className="panel-heading-icon-accent"><Send className="w-4 h-4 text-accent" /></div>
              <h2 className="text-lg font-semibold text-white">Output Panel</h2>
            </div>
            {submitting ? (
              <LoadingState message="Generating your message..." variant="message" />
            ) : !hasGenerated ? (
              <EmptyState icon={Mail} title="No message generated" description='Complete the form and click "Generate Message" to create a personalized recruiter email.' />
            ) : (
              <div className="space-y-4">
                <Alert type={feedback?.type === 'success' ? feedback.type : actionFeedback?.type} message={feedback?.type === 'success' ? feedback.message : actionFeedback?.message} />
                <SectionCard icon={Mail} title="Subject">
                  <FormField name="subject" value={subject} readOnly inputClassName="bg-background/80 cursor-default" />
                  {tone && (
                    <p className="text-xs text-muted mt-2">Tone: <span className="text-white/80">{tone}</span></p>
                  )}
                </SectionCard>
                <SectionCard icon={FileText} title="Generated Message" accent>
                  <FormField name="generatedMessage" as="textarea" rows={14} value={generatedMessage} onChange={(e) => setGeneratedMessage(e.target.value)} inputClassName="min-h-[300px] text-sm" />
                </SectionCard>
                <div className="card p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button variant="ghost" onClick={handleCopy} disabled={submitting} icon={copied ? CheckCircle2 : Copy} className="py-2.5">{copied ? 'Copied' : 'Copy'}</Button>
                    <Button variant="ghost" onClick={handleDownload} disabled={submitting} icon={Download} className="py-2.5">Download</Button>
                    <Button variant="ghost" onClick={runRegenerate} loading={submitting} disabled={submitting} icon={RefreshCw} className="py-2.5">Regenerate</Button>
                    <Button onClick={() => setShowPreview(true)} disabled={submitting} icon={Eye} className="py-2.5">Preview</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
      />
      {showPreview && (
        <PreviewModal subject={subject} message={generatedMessage} candidateName={form.candidateName} companyName={form.companyName} onClose={() => setShowPreview(false)} />
      )}
    </PageShell>
  )
}
