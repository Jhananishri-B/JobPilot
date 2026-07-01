import { useState } from 'react'
import {
  Mic,
  Briefcase,
  Building2,
  FileText,
  AlignLeft,
  Sparkles,
  Users,
  Code2,
  CalendarDays,
  Lightbulb,
  BookOpen,
  Printer,
  FileDown,
  ClipboardList,
} from 'lucide-react'
import PageShell from '../components/ui/PageShell'
import SectionCard from '../components/ui/SectionCard'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import { useFormSubmit } from '../hooks/useFormSubmit'
import { required, minLength } from '../utils/validation'
import { AI_PARSE_ERROR, generateInterviewPreparation } from '../services/ai'

const TABS = [
  { id: 'hr', label: 'HR Questions', icon: Users, field: 'hr_questions' },
  { id: 'technical', label: 'Technical Questions', icon: Code2, field: 'technical_questions' },
  { id: 'plan', label: 'Preparation Plan', icon: CalendarDays, field: 'preparation_plan' },
  { id: 'tips', label: 'Interview Tips', icon: Lightbulb, field: 'interview_tips' },
  { id: 'topics', label: 'Preparation Topics', icon: BookOpen, field: 'preparation_topics' },
]

function buildExportText(data, meta) {
  const sections = [
    ['HR QUESTIONS', data.hr_questions],
    ['TECHNICAL QUESTIONS', data.technical_questions],
    ['PREPARATION PLAN', data.preparation_plan],
    ['INTERVIEW TIPS', data.interview_tips],
    ['PREPARATION TOPICS', data.preparation_topics],
  ]

  let text = `INTERVIEW PREPARATION\n${'='.repeat(40)}\n`
  text += `Role: ${meta.jobRole}\nCompany: ${meta.companyName}\n\n`

  for (const [heading, content] of sections) {
    text += `\n${heading}\n${'-'.repeat(heading.length)}\n\n`
    text += `${content || 'No content returned.'}\n`
  }

  return text
}

function downloadPdf(content) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Interview Preparation</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
          h1 { font-size: 22px; margin-bottom: 8px; }
          .meta { color: #555; margin-bottom: 24px; font-size: 14px; }
          pre { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 13px; }
        </style>
      </head>
      <body>
        <h1>Interview Preparation</h1>
        <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        <script>window.onload = () => { window.print(); }</script>
      </body>
    </html>
  `
  printWindow.document.write(html)
  printWindow.document.close()
}

export default function InterviewCoach() {
  const initialForm = { jobRole: '', companyName: '', candidateResume: '', jobDescription: '' }
  const [form, setForm] = useState(initialForm)
  const [activeTab, setActiveTab] = useState('hr')
  const [prepData, setPrepData] = useState(null)
  const [hasGenerated, setHasGenerated] = useState(false)

  const meta = {
    jobRole: form.jobRole.trim() || 'Senior Software Engineer',
    companyName: form.companyName.trim() || 'Google',
  }

  const { errors, feedback, isLoading, handleSubmit, clearFieldError } = useFormSubmit({
    validationRules: (values) => ({
      jobRole: [() => required(values.jobRole, 'Job role')],
      companyName: [() => required(values.companyName, 'Company name')],
      jobDescription: [() => required(values.jobDescription, 'Job description'), () => minLength(values.jobDescription, 30, 'Job description')],
    }),
    onSubmit: async (values) => {
      const data = await generateInterviewPreparation({
        company_name: values.companyName.trim(),
        job_role: values.jobRole.trim(),
        job_description: values.jobDescription.trim(),
        candidate_resume: values.candidateResume.trim(),
      })
      setPrepData(data)
      setHasGenerated(true)
      setActiveTab('hr')
    },
    successMessage: 'Interview preparation generated. Explore each tab below.',
    errorMessage: AI_PARSE_ERROR,
    successAutoDismissMs: 6000,
  })

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    clearFieldError(field)
  }

  const getExportContent = () => (prepData ? buildExportText(prepData, meta) : '')

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = () => {
    downloadPdf(getExportContent())
  }

  const submitting = isLoading

  const activeTabConfig = TABS.find((tab) => tab.id === activeTab)
  const activeContent = activeTabConfig && prepData ? prepData[activeTabConfig.field] : ''

  const printSections = prepData
    ? TABS.map(({ label, field }) => ({ label, content: prepData[field] }))
    : []

  return (
    <PageShell title="Interview Coach" subtitle="Generate tailored interview preparation based on your role, resume, and job description">
      <SectionCard icon={ClipboardList} title="Inputs" description="Agent: interview_coach">
        <form onSubmit={(e) => handleSubmit(e, form)} noValidate>
          <Alert type={feedback?.type} message={feedback?.message} className="mb-5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Job Role" name="jobRole" icon={Briefcase} required placeholder="e.g. Senior Software Engineer" value={form.jobRole} onChange={update('jobRole')} error={errors.jobRole} />
            <FormField label="Company Name" name="companyName" icon={Building2} required placeholder="e.g. Google" value={form.companyName} onChange={update('companyName')} error={errors.companyName} />
            <FormField label="Candidate Resume" name="candidateResume" icon={FileText} as="textarea" rows={5} placeholder="Paste your resume or profile summary..." hint="Optional — included when provided" value={form.candidateResume} onChange={update('candidateResume')} inputClassName="min-h-[120px]" />
            <FormField label="Job Description" name="jobDescription" icon={AlignLeft} as="textarea" rows={5} required placeholder="Paste the job description..." value={form.jobDescription} onChange={update('jobDescription')} error={errors.jobDescription} inputClassName="min-h-[120px]" />
          </div>
          <Button type="submit" loading={submitting} disabled={submitting} icon={Sparkles} className="mt-5 w-full md:w-auto px-8 py-3">
            {submitting ? 'Generating...' : 'Generate Interview Preparation'}
          </Button>
        </form>
      </SectionCard>

      {submitting ? (
        <LoadingState message="Generating interview preparation..." variant="interview" />
      ) : !hasGenerated ? (
        <EmptyState icon={Mic} title="No preparation generated yet" description='Fill in the details above and click "Generate Interview Preparation" to get HR questions, technical questions, study plans, and more.' />
      ) : (
        <div id="interview-prep-content" className="card p-4 md:p-6 space-y-4">
          {feedback?.type === 'success' && (
            <Alert type={feedback.type} message={feedback.message} />
          )}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                    activeTab === id
                      ? 'bg-primary text-white shadow-glow'
                      : 'text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2 shrink-0 print:hidden">
              <Button variant="ghost" onClick={handlePrint} disabled={submitting} icon={Printer} className="flex-1 lg:flex-none py-2.5 px-4">
                <span className="hidden sm:inline">Print Preparation</span>
                <span className="sm:hidden">Print</span>
              </Button>
              <Button onClick={handleDownloadPdf} disabled={submitting} icon={FileDown} className="flex-1 lg:flex-none py-2.5 px-4">
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>

          <div className="pt-2">
            {activeContent ? (
              <div className="card p-5">
                <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">{activeContent}</p>
              </div>
            ) : (
              <p className="text-sm text-muted px-1">No content returned for this section.</p>
            )}
          </div>
        </div>
      )}

      {hasGenerated && prepData && (
        <div className="hidden print:block print-prep-full">
          <h1 className="text-2xl font-bold mb-2">Interview Preparation</h1>
          <p className="text-gray-600 mb-6">
            {meta.jobRole} at {meta.companyName}
          </p>
          {printSections.map(({ label, content }) => (
            <div key={label} className="mb-8 break-inside-avoid">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">{label}</h2>
              <p className="whitespace-pre-wrap text-gray-800">{content || 'No content returned.'}</p>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
