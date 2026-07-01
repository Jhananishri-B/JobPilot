import { useState } from 'react'
import {
  FileSearch,
  Briefcase,
  Building2,
  FileText,
  ClipboardList,
  Sparkles,
  Gauge,
  AlignLeft,
  Wrench,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Tag,
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
import { AI_PARSE_ERROR, analyzeResume } from '../services/ai'

function CircularProgress({ score, size = 160 }) {
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#6366F1' : '#F59E0B'

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#334155" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{score}</span>
        <span className="text-xs text-muted mt-0.5">out of 100</span>
      </div>
    </div>
  )
}

function ScoreBar({ score, label = 'Match score' }) {
  const color = score >= 80 ? 'bg-accent' : score >= 60 ? 'bg-primary' : 'bg-yellow-400'
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted">{label}</span>
        <span className="text-sm font-semibold text-white">{score}%</span>
      </div>
      <div className="h-2.5 bg-background rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function splitCommaList(value) {
  if (!value) return []
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

const initialForm = { jobRole: '', companyName: '', resumeText: '', jobDescription: '' }

export default function ResumeAnalysis() {
  const [form, setForm] = useState(initialForm)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [results, setResults] = useState(null)

  const { errors, feedback, isLoading, handleSubmit, clearFieldError } = useFormSubmit({
    validationRules: (values) => ({
      jobRole: [() => required(values.jobRole, 'Job role')],
      companyName: [() => required(values.companyName, 'Company name')],
      resumeText: [
        () => required(values.resumeText, 'Resume text'),
        () => minLength(values.resumeText, 1, 'Resume text'),
      ],
      jobDescription: [
        () => required(values.jobDescription, 'Job description'),
        () => minLength(values.jobDescription, 1, 'Job description'),
      ],
    }),
    onSubmit: async (values) => {
      const data = await analyzeResume({
        resume_text: values.resumeText.trim(),
        job_description: values.jobDescription.trim(),
        company_name: values.companyName.trim(),
        job_role: values.jobRole.trim(),
      })
      setResults(data)
      setHasAnalyzed(true)
    },
    successMessage: 'Resume analysis complete. Review your ATS insights on the right.',
    errorMessage: AI_PARSE_ERROR,
    successAutoDismissMs: 6000,
  })

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    clearFieldError(field)
  }

  const onSubmit = (e) => handleSubmit(e, form)

  const submitting = isLoading

  const requiredSkillList = splitCommaList(results?.required_skills)
  const resumeSkillList = splitCommaList(results?.resume_skills)

  return (
    <PageShell
      title="Resume Analysis"
      subtitle="Compare your resume against a specific job description and get ATS insights"
    >
      <SplitLayout
        left={
          <SectionCard icon={ClipboardList} title="Input Form" description="Workflow: job_application_pipeline">
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <Alert type={feedback?.type} message={feedback?.message} />
              <FormField label="Job Role" name="jobRole" icon={Briefcase} required placeholder="e.g. Senior Software Engineer" value={form.jobRole} onChange={update('jobRole')} error={errors.jobRole} />
              <FormField label="Company Name" name="companyName" icon={Building2} required placeholder="e.g. Google" value={form.companyName} onChange={update('companyName')} error={errors.companyName} />
              <FormField label="Resume Text" name="resumeText" icon={FileText} as="textarea" rows={7} required placeholder="Paste your full resume text here..." value={form.resumeText} onChange={update('resumeText')} error={errors.resumeText} inputClassName="min-h-[160px]" />
              <FormField label="Job Description" name="jobDescription" icon={AlignLeft} as="textarea" rows={7} required placeholder="Paste the job description you're applying for..." value={form.jobDescription} onChange={update('jobDescription')} error={errors.jobDescription} inputClassName="min-h-[160px]" />
              <Button type="submit" loading={submitting} disabled={submitting} icon={Sparkles} className="w-full py-3">
                {submitting ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
            </form>
          </SectionCard>
        }
        right={
          <div className="space-y-4">
            <div className="panel-heading px-1">
              <div className="panel-heading-icon-accent"><FileSearch className="w-4 h-4 text-accent" /></div>
              <h2 className="text-lg font-semibold text-white">Analysis Results</h2>
            </div>
            {submitting ? (
              <LoadingState message="Analyzing your resume..." variant="analysis" />
            ) : !hasAnalyzed ? (
              <EmptyState icon={FileSearch} title="No analysis yet" description='Fill in the form and click "Analyze Resume" to see your ATS score, skill matches, and improvement suggestions.' />
            ) : results ? (
              <div className="space-y-4">
                {feedback?.type === 'success' && (
                  <Alert type={feedback.type} message={feedback.message} />
                )}
                <SectionCard icon={Gauge} title="ATS Score">
                  <div className="flex flex-col items-center py-2">
                    <CircularProgress score={results.ats_score ?? 0} />
                    {results.recommendation && (
                      <p className="text-sm font-medium text-accent mt-4 text-center">{results.recommendation}</p>
                    )}
                    <p className="text-sm text-muted mt-4 text-center max-w-xs">
                      Your resume has a{' '}
                      <span className="text-accent font-medium">
                        {(results.ats_score ?? 0) >= 70 ? 'strong' : 'moderate'}
                      </span>{' '}
                      chance of passing ATS filters.
                    </p>
                  </div>
                </SectionCard>
                <SectionCard icon={AlignLeft} title="Resume Summary">
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                    {results.resume_summary || 'No summary available.'}
                  </p>
                </SectionCard>
                <SectionCard icon={Wrench} title="Skill Match"><ScoreBar score={results.skill_match ?? 0} /></SectionCard>
                <SectionCard icon={Tag} title="Keyword Match"><ScoreBar score={results.keyword_match ?? 0} label="Keyword match" /></SectionCard>
                <SectionCard icon={GraduationCap} title="Education Match"><ScoreBar score={results.education_match ?? 0} /></SectionCard>
                <SectionCard icon={Briefcase} title="Experience Match"><ScoreBar score={results.experience_match ?? 0} /></SectionCard>
                <SectionCard icon={ListChecks} title="Required Skills">
                  {requiredSkillList.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {requiredSkillList.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border bg-primary/10 text-primary border-primary/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : results.required_skills ? (
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{results.required_skills}</p>
                  ) : (
                    <p className="text-sm text-muted">No required skills data returned.</p>
                  )}
                </SectionCard>
                {resumeSkillList.length > 0 && (
                  <SectionCard icon={ListChecks} title="Resume Skills">
                    <div className="flex flex-wrap gap-2">
                      {resumeSkillList.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border bg-accent/10 text-accent border-accent/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </SectionCard>
                )}
                <SectionCard icon={Lightbulb} title="Improvement Suggestions">
                  {results.improvement_suggestions ? (
                    <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{results.improvement_suggestions}</p>
                  ) : (
                    <p className="text-sm text-muted">No improvement suggestions returned.</p>
                  )}
                </SectionCard>
              </div>
            ) : (
              <EmptyState icon={FileSearch} title="No results" description="Analysis completed but no data was returned. Please try again." />
            )}
          </div>
        }
      />
    </PageShell>
  )
}
