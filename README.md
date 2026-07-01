
# 🚀 JobPilot AI

## Your Intelligent Career Copilot

Analyze resumes • Optimize ATS • Generate Recruiter Messages • Prepare for Interviews • Track Applications

---

# About

JobPilot AI is an AI-powered career assistant that helps students and job seekers throughout the job application journey. The platform combines resume analysis, ATS optimization, recruiter message generation, interview preparation, and application tracking into a single dashboard.

The application is deployed using **Lemma Apps**, while AI-powered capabilities are delivered using **Google Gemini API**.

---

# Features

## Resume Analysis
- ATS Score
- Skill Match
- Keyword Match
- Education Match
- Experience Match
- Resume Summary
- Improvement Suggestions

## Resume Optimizer
- ATS optimized resume
- Keyword optimization
- Improvement summary

## Recruiter Message Generator
- Subject generation
- Personalized recruiter messages
- Tone suggestions

## Interview Coach
- HR questions
- Technical questions
- Preparation plan
- Interview tips

## Application Tracker
- Track applications
- Search & filter
- Dashboard statistics

---

# Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Lemma SDK
- Google Gemini API

---

# Architecture

React UI
→ AI Service
→ Google Gemini API
→ JSON Response
→ UI

Lemma handles:
- Authentication
- Pod management
- Deployment
- Hosting

---

# Environment

```env
VITE_LEMMA_API_URL=https://api.lemma.work
VITE_LEMMA_AUTH_URL=https://lemma.work/auth
VITE_LEMMA_POD_ID=YOUR_POD_ID
VITE_AI_API_KEY=YOUR_GEMINI_API_KEY
```

---

# Deployment

```bash
npm run build
lemma app deploy jobpilot-ai . --pod YOUR_POD_ID --dist-dir dist --yes
```

---

# Future Scope

- Resume PDF Upload
- LinkedIn Analysis
- Job Recommendations
- Email Integration
- Calendar Integration

---

Built with React, Lemma SDK and Google Gemini.

