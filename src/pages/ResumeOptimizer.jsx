import { useState } from 'react'
import {
  Sparkles, FileText, AlignLeft, Wand2, FileCheck, Tags,
  ClipboardList, Copy, Download, CheckCircle2,
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
import { AI_PARSE_ERROR, optimizeResume } from '../services/ai'

const initialForm = { resumeText: '', jobDescription: '' }

export default function ResumeOptimizer() {
  const [form, setForm] = useState(initialForm)
  const [optimizedResume, setOptimizedResume] = useState('')
  const [addedKeywords, setAddedKeywords] = useState('')
  const [improvementSummary, setImprovementSummary] = useState('')
  const [hasOptimized, setHasOptimized] = useState(false)
  const [copied, setCopied] = useState(false)
  const [actionFeedback, setActionFeedback] = useState(null)

  const { errors, feedback, isLoading, handleSubmit, clearFieldError } = useFormSubmit({
    validationRules: (values) => ({
      resumeText: [
        () => required(values.resumeText, 'Resume text'),
        () => minLength(values.resumeText, 50, 'Resume text'),
      ],
      jobDescription: [
        () => required(values.jobDescription, 'Job description'),
        () => minLength(values.jobDescription, 30, 'Job description'),
      ],
    }),
    onSubmit: async (values) => {
      const data = await optimizeResume({
        resume_text: values.resumeText.trim(),
        job_description: values.jobDescription.trim(),
      })

      setOptimizedResume(data.optimized_resume ?? '')
      setAddedKeywords(data.added_keywords ?? '')
      setImprovementSummary(data.improvement_summary ?? '')
      setHasOptimized(true)
    },
    successMessage: 'Resume optimized successfully. Review and edit the output on the right.',
    errorMessage: AI_PARSE_ERROR,
    successAutoDismissMs: 6000,
  })

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    clearFieldError(field)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedResume)
      setCopied(true)
      setActionFeedback({ type: 'success', message: 'Resume copied to clipboard.' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setActionFeedback({ type: 'error', message: 'Failed to copy. Please select and copy manually.' })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([optimizedResume], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'optimized-resume.txt'
    link.click()
    URL.revokeObjectURL(url)
    setActionFeedback({ type: 'success', message: 'Resume downloaded successfully.' })
  }

  const submitting = isLoading

  return (
    <PageShell title="Resume Optimizer" subtitle="Tailor your resume with AI-powered rewrites and ATS keyword injection">
      <SplitLayout
        left={
          <SectionCard icon={ClipboardList} title="Inputs" description="Agent: resume_optimizer">
            <form onSubmit={(e) => handleSubmit(e, form)} className="space-y-5" noValidate>
              <Alert type={feedback?.type} message={feedback?.message} />
              <FormField label="Resume Text" name="resumeText" icon={FileText} as="textarea" rows={6} required placeholder="Paste your current resume text..." hint="Minimum 50 characters" value={form.resumeText} onChange={update('resumeText')} error={errors.resumeText} inputClassName="min-h-[140px]" />
              <FormField label="Job Description" name="jobDescription" icon={AlignLeft} as="textarea" rows={6} required placeholder="Paste the target job description..." value={form.jobDescription} onChange={update('jobDescription')} error={errors.jobDescription} inputClassName="min-h-[140px]" />
              <Button type="submit" loading={submitting} disabled={submitting} icon={Sparkles} className="w-full py-3">
                {submitting ? 'Optimizing...' : 'Optimize Resume'}
              </Button>
            </form>
          </SectionCard>
        }
        right={
          <div className="space-y-4">
            <div className="panel-heading px-1">
              <div className="panel-heading-icon-accent"><FileCheck className="w-4 h-4 text-accent" /></div>
              <h2 className="text-lg font-semibold text-white">Results</h2>
            </div>
            {submitting ? (
              <LoadingState message="Optimizing your resume..." variant="optimize" />
            ) : !hasOptimized ? (
              <EmptyState icon={Wand2} title="No optimization yet" description='Fill in your resume details and click "Optimize Resume" to generate an ATS-friendly version.' />
            ) : (
              <div className="space-y-4">
                <Alert type={feedback?.type === 'success' ? feedback.type : actionFeedback?.type} message={feedback?.type === 'success' ? feedback.message : actionFeedback?.message} />
                <SectionCard icon={FileText} title="Optimized Resume">
                  <FormField label="Editable output" name="optimizedResume" as="textarea" rows={14} value={optimizedResume} onChange={(e) => setOptimizedResume(e.target.value)} inputClassName="min-h-[280px] font-mono text-sm" hint="Edit before copying or downloading" />
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button variant="ghost" onClick={handleCopy} disabled={submitting} icon={copied ? CheckCircle2 : Copy} className="flex-1 py-2.5">{copied ? 'Copied!' : 'Copy Resume'}</Button>
                    <Button onClick={handleDownload} disabled={submitting} icon={Download} className="flex-1 py-2.5">Download Resume</Button>
                  </div>
                </SectionCard>
                <SectionCard icon={Tags} title="Added Keywords">
                  {addedKeywords ? (
                    <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">{addedKeywords}</p>
                  ) : (
                    <p className="text-sm text-muted">No keywords returned.</p>
                  )}
                </SectionCard>
                <SectionCard icon={Sparkles} title="Improvement Summary" className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
                  {improvementSummary ? (
                    <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">{improvementSummary}</p>
                  ) : (
                    <p className="text-sm text-muted">No improvement summary returned.</p>
                  )}
                </SectionCard>
              </div>
            )}
          </div>
        }
      />
    </PageShell>
  )
}
