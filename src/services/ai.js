export const AI_PARSE_ERROR = 'Unable to generate AI response.'

const JSON_RULES = `Return ONLY valid JSON.
Do not return markdown.
Do not wrap in code blocks.
Do not explain anything outside the JSON.
The JSON keys MUST exactly match the schema.`

const PROVIDERS = {
  OPENAI: 'openai',
  OPENROUTER: 'openrouter',
  GEMINI: 'gemini',
}

function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function maskSecret(value) {
  if (!value || typeof value !== 'string') return '(missing)'
  if (value.length <= 8) return '***'
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

function detectProvider(apiUrl, apiKey) {
  const explicit = import.meta.env.VITE_AI_PROVIDER?.trim()?.toLowerCase()
  if (explicit && Object.values(PROVIDERS).includes(explicit)) {
    return explicit
  }

  const url = (apiUrl || '').toLowerCase()
  if (url.includes('generativelanguage.googleapis.com') || url.includes('googleapis.com')) {
    return PROVIDERS.GEMINI
  }
  if (url.includes('openrouter.ai')) {
    return PROVIDERS.OPENROUTER
  }
  if (apiKey?.startsWith('sk-or-')) {
    return PROVIDERS.OPENROUTER
  }
  if (apiKey?.startsWith('AIza')) {
    return PROVIDERS.GEMINI
  }
  return PROVIDERS.OPENAI
}

function resolveConfig() {
  const apiKey = import.meta.env.VITE_AI_API_KEY?.trim() ?? ''
  let apiUrl = import.meta.env.VITE_AI_API_URL?.trim() ?? ''
  let model = import.meta.env.VITE_AI_MODEL?.trim() ?? ''

  const provider = detectProvider(apiUrl, apiKey)

  if (!apiUrl) {
    if (provider === PROVIDERS.OPENROUTER) {
      apiUrl = 'https://openrouter.ai/api/v1/chat/completions'
    } else if (provider === PROVIDERS.GEMINI) {
      model = model || 'gemini-2.0-flash'
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    } else {
      apiUrl = 'https://api.openai.com/v1/chat/completions'
    }
  }

  if (!model) {
    if (provider === PROVIDERS.OPENROUTER) {
      model = 'google/gemini-2.0-flash-001'
    } else if (provider === PROVIDERS.GEMINI) {
      model = 'gemini-2.0-flash'
    } else {
      model = 'gpt-4o-mini'
    }
  }

  return { apiKey, apiUrl, model, provider }
}

function logAIConfig(config) {
  console.group('[JobPilot AI] Environment')
  console.info('VITE_AI_API_KEY loaded:', Boolean(config.apiKey))
  console.info('VITE_AI_API_KEY preview:', maskSecret(config.apiKey))
  console.info('VITE_AI_API_URL:', config.apiUrl)
  console.info('VITE_AI_MODEL:', config.model)
  console.info('Detected provider:', config.provider)
  console.info('VITE_AI_PROVIDER override:', import.meta.env.VITE_AI_PROVIDER || '(none)')
  console.groupEnd()
}

let configLogged = false

function ensureConfigLogged(config) {
  if (configLogged) return
  configLogged = true
  logAIConfig(config)
}

function formatApiError(status, rawText, parsedBody) {
  if (isRecord(parsedBody?.error)) {
    const err = parsedBody.error
    const message = err.message || err.status || JSON.stringify(err)
    console.error('[JobPilot AI] API error object:', err)
    return `AI API error (${status}): ${message}`
  }

  if (typeof parsedBody?.message === 'string') {
    console.error('[JobPilot AI] API error message:', parsedBody.message)
    return `AI API error (${status}): ${parsedBody.message}`
  }

  if (rawText?.trim()) {
    console.error('[JobPilot AI] API raw error body:', rawText)
    return `AI API error (${status}): ${rawText.trim().slice(0, 500)}`
  }

  return `AI API error (${status}): Request failed with no response body.`
}

function pickString(source, key, fallback = '') {
  if (!isRecord(source)) return fallback
  const value = source[key]
  return typeof value === 'string' ? value : fallback
}

function pickNumber(source, key, fallback = 0) {
  if (!isRecord(source)) return fallback
  const value = source[key]
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value)
  }
  return fallback
}

function parseJsonResponse(text, context = 'model output') {
  if (!text || typeof text !== 'string') {
    console.error(`[JobPilot AI] ${context}: empty or non-string content`, text)
    throw new Error(`${context}: empty response content from model.`)
  }

  let cleaned = text.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  }

  try {
    const parsed = JSON.parse(cleaned)
    if (!isRecord(parsed)) {
      console.error(`[JobPilot AI] ${context}: parsed JSON is not an object`, parsed)
      throw new Error(`${context}: model returned JSON that is not an object.`)
    }
    return parsed
  } catch (err) {
    console.error(`[JobPilot AI] ${context}: JSON parse failed`, err)
    console.error(`[JobPilot AI] ${context}: raw text`, text)
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start !== -1 && end > start) {
      const slice = cleaned.slice(start, end + 1)
      try {
        const parsed = JSON.parse(slice)
        if (isRecord(parsed)) return parsed
      } catch (nestedErr) {
        console.error(`[JobPilot AI] ${context}: nested JSON parse failed`, nestedErr)
        console.error(`[JobPilot AI] ${context}: extracted slice`, slice)
      }
    }
    throw new Error(`${context}: JSON parse failed. Raw response: ${text.slice(0, 500)}`)
  }
}

function buildOpenAICompatibleBody(config, systemPrompt, userPayload) {
  const body = {
    model: config.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(userPayload) },
    ],
    temperature: 0.4,
  }

  if (config.provider === PROVIDERS.OPENAI) {
    body.response_format = { type: 'json_object' }
  }

  if (config.provider === PROVIDERS.OPENROUTER) {
    body.response_format = { type: 'json_object' }
  }

  return body
}

function buildGeminiBody(systemPrompt, userPayload) {
  return {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${systemPrompt}\n\nUser input:\n${JSON.stringify(userPayload)}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
  }
}

function buildHeaders(config) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (config.provider === PROVIDERS.GEMINI) {
    return headers
  }

  headers.Authorization = `Bearer ${config.apiKey}`

  if (config.provider === PROVIDERS.OPENROUTER) {
    if (typeof window !== 'undefined' && window.location?.origin) {
      headers['HTTP-Referer'] = window.location.origin
    }
    headers['X-Title'] = 'JobPilot AI'
  }

  return headers
}

function resolveRequestUrl(config) {
  if (config.provider === PROVIDERS.GEMINI) {
    const separator = config.apiUrl.includes('?') ? '&' : '?'
    return `${config.apiUrl}${separator}key=${encodeURIComponent(config.apiKey)}`
  }
  return config.apiUrl
}

function extractModelText(data, provider) {
  if (provider === PROVIDERS.GEMINI) {
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      console.error('[JobPilot AI] Gemini response missing text:', data)
      throw new Error(`Gemini response missing text. Full body: ${JSON.stringify(data).slice(0, 1000)}`)
    }
    return text
  }

  const content = data?.choices?.[0]?.message?.content
  if (!content) {
    console.error('[JobPilot AI] Chat completion missing content:', data)
    throw new Error(`Chat completion missing content. Full body: ${JSON.stringify(data).slice(0, 1000)}`)
  }
  return content
}

async function callLLM({ systemPrompt, userPayload }) {
  const config = resolveConfig()
  ensureConfigLogged(config)

  if (!config.apiKey) {
    const message = 'VITE_AI_API_KEY is missing. Add it to .env.local and restart the dev server, or rebuild for production.'
    console.error('[JobPilot AI]', message)
    throw new Error(message)
  }

  const requestUrl = resolveRequestUrl(config)
  const headers = buildHeaders(config)
  const body = config.provider === PROVIDERS.GEMINI
    ? buildGeminiBody(systemPrompt, userPayload)
    : buildOpenAICompatibleBody(config, systemPrompt, userPayload)

  console.group('[JobPilot AI] Outgoing request')
  console.info('Request URL:', requestUrl.replace(config.apiKey, maskSecret(config.apiKey)))
  console.info('Provider:', config.provider)
  console.info('Model:', config.model)
  console.info('Headers:', {
    ...headers,
    Authorization: headers.Authorization ? `Bearer ${maskSecret(config.apiKey)}` : undefined,
  })
  console.info('Request body:', body)
  console.groupEnd()

  let response
  let rawText = ''

  try {
    response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
  } catch (networkErr) {
    console.error('[JobPilot AI] Network/fetch error:', networkErr)
    throw new Error(`AI network error: ${networkErr.message}`)
  }

  console.info('[JobPilot AI] Response status:', response.status, response.statusText)

  try {
    rawText = await response.text()
  } catch (readErr) {
    console.error('[JobPilot AI] Failed to read response body:', readErr)
    throw new Error(`AI response read error: ${readErr.message}`)
  }

  console.info('[JobPilot AI] Response body (raw):', rawText)

  let parsedBody = null
  if (rawText) {
    try {
      parsedBody = JSON.parse(rawText)
      console.info('[JobPilot AI] Response body (parsed):', parsedBody)
    } catch (parseErr) {
      console.warn('[JobPilot AI] Response body is not JSON:', parseErr)
    }
  }

  if (!response.ok) {
    throw new Error(formatApiError(response.status, rawText, parsedBody))
  }

  if (isRecord(parsedBody?.error)) {
    console.error('[JobPilot AI] Error object in successful-status payload:', parsedBody.error)
    throw new Error(formatApiError(response.status, rawText, parsedBody))
  }

  const modelText = extractModelText(parsedBody, config.provider)
  return parseJsonResponse(modelText, 'Model JSON output')
}

export async function analyzeResume(payload) {
  const resume_text = payload?.resume_text?.trim() ?? ''
  const job_description = payload?.job_description?.trim() ?? ''
  const company_name = payload?.company_name?.trim() ?? ''
  const job_role = payload?.job_role?.trim() ?? ''

  if (!resume_text || !job_description || !company_name || !job_role) {
    throw new Error('resume_text, job_description, company_name, and job_role are required')
  }

  const inputs = { resume_text, job_description, company_name, job_role }

  const raw = await callLLM({
    systemPrompt: `You are an expert resume analyst for JobPilot AI. Compare the candidate resume to the job description and return ATS insights.

${JSON_RULES}

Return a JSON object with exactly these keys:
{
  "ats_score": number (0-100),
  "skill_match": number (0-100),
  "keyword_match": number (0-100),
  "education_match": number (0-100),
  "experience_match": number (0-100),
  "resume_skills": string (comma-separated skills from the resume),
  "required_skills": string (comma-separated skills from the job description),
  "resume_summary": string,
  "recommendation": string (short ATS recommendation label),
  "improvement_suggestions": string (actionable suggestions as plain text)
}`,
    userPayload: inputs,
  })

  return {
    ats_score: pickNumber(raw, 'ats_score', 0),
    skill_match: pickNumber(raw, 'skill_match', 0),
    keyword_match: pickNumber(raw, 'keyword_match', 0),
    education_match: pickNumber(raw, 'education_match', 0),
    experience_match: pickNumber(raw, 'experience_match', 0),
    resume_skills: pickString(raw, 'resume_skills'),
    required_skills: pickString(raw, 'required_skills'),
    resume_summary: pickString(raw, 'resume_summary'),
    recommendation: pickString(raw, 'recommendation'),
    improvement_suggestions: pickString(raw, 'improvement_suggestions'),
  }
}

export async function optimizeResume(payload) {
  const resume_text = payload?.resume_text?.trim() ?? ''
  const job_description = payload?.job_description?.trim() ?? ''

  if (!resume_text || !job_description) {
    throw new Error('resume_text and job_description are required')
  }

  const inputs = { resume_text, job_description }

  const raw = await callLLM({
    systemPrompt: `You are an expert resume optimizer for JobPilot AI. Rewrite the resume for the target job without fabricating experience.

${JSON_RULES}

Return a JSON object with exactly these keys:
{
  "optimized_resume": string,
  "added_keywords": string (keywords added for ATS, comma-separated or plain text),
  "improvement_summary": string (summary of changes made)
}`,
    userPayload: inputs,
  })

  return {
    optimized_resume: pickString(raw, 'optimized_resume'),
    added_keywords: pickString(raw, 'added_keywords'),
    improvement_summary: pickString(raw, 'improvement_summary'),
  }
}

export async function generateRecruiterMessage(payload) {
  const candidate_name = payload?.candidate_name?.trim() ?? ''
  const company_name = payload?.company_name?.trim() ?? ''
  const job_role = payload?.job_role?.trim() ?? ''
  const candidate_summary = payload?.candidate_summary?.trim() ?? ''

  if (!candidate_name || !company_name || !job_role || !candidate_summary) {
    throw new Error('candidate_name, company_name, job_role, and candidate_summary are required')
  }

  const inputs = { candidate_name, company_name, job_role, candidate_summary }

  const raw = await callLLM({
    systemPrompt: `You are a professional recruiter outreach writer for JobPilot AI. Write a concise, authentic message.

${JSON_RULES}

Return a JSON object with exactly these keys:
{
  "subject": string,
  "generated_message": string,
  "tone": string (e.g. Professional, Friendly, Formal)
}`,
    userPayload: inputs,
  })

  return {
    subject: pickString(raw, 'subject'),
    generated_message: pickString(raw, 'generated_message'),
    tone: pickString(raw, 'tone'),
  }
}

export async function generateInterviewPreparation(payload) {
  const candidate_resume = payload?.candidate_resume?.trim() ?? ''
  const job_description = payload?.job_description?.trim() ?? ''
  const company_name = payload?.company_name?.trim() ?? ''
  const job_role = payload?.job_role?.trim() ?? ''

  if (!job_description || !company_name || !job_role) {
    throw new Error('job_description, company_name, and job_role are required')
  }

  const inputs = { candidate_resume, job_description, company_name, job_role }

  const raw = await callLLM({
    systemPrompt: `You are an interview coach for JobPilot AI. Prepare tailored interview guidance.

${JSON_RULES}

Return a JSON object with exactly these keys (each value is a plain-text string):
{
  "hr_questions": string,
  "technical_questions": string,
  "preparation_topics": string,
  "preparation_plan": string,
  "interview_tips": string
}`,
    userPayload: inputs,
  })

  return {
    hr_questions: pickString(raw, 'hr_questions'),
    technical_questions: pickString(raw, 'technical_questions'),
    preparation_topics: pickString(raw, 'preparation_topics'),
    preparation_plan: pickString(raw, 'preparation_plan'),
    interview_tips: pickString(raw, 'interview_tips'),
  }
}
