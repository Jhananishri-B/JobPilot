JobPilot AI
About the Project

Finding internships and jobs is a challenging process for students. Preparing a resume, optimizing it for ATS systems, writing recruiter messages, preparing for interviews, and tracking applications usually requires multiple websites and tools.

JobPilot AI was built to bring these tasks into a single platform. It helps job seekers analyze and improve their resumes, prepare for interviews, generate recruiter messages, and manage job applications through one simple dashboard.

The application is built using React, deployed as a Lemma App, and uses an external AI model to generate intelligent recommendations while Lemma handles authentication and deployment.

Why We Built This

While applying for internships, we noticed that students spend a lot of time switching between different websites:

Resume scoring tools
ATS checkers
Resume builders
AI chatbots
Interview preparation websites
Application trackers

Instead of using multiple tools, we wanted to build one platform that combines all of these features.

Features
Resume Analysis

Upload or paste your resume along with a job description.

The AI analyzes both documents and provides:

ATS Score
Skill Match
Keyword Match
Experience Match
Education Match
Resume Summary
Missing Skills
Suggestions to improve the resume
Resume Optimizer

Generate an improved version of your resume that better matches the selected job description.

The optimizer:

Adds important ATS keywords
Improves wording
Suggests better content
Explains the improvements made
Recruiter Message Generator

Generate personalized recruiter outreach messages using:

Candidate name
Company
Job role
Candidate summary

Outputs include:

Email subject
Professional message
Suggested tone
Interview Coach

Prepare for interviews using AI-generated:

HR Questions
Technical Questions
Preparation Topics
Interview Plan
Interview Tips
Application Tracker

Track every application in one place.

Users can:

Add applications
Update status
Search applications
Monitor interview progress
View overall statistics
Tech Stack
Frontend
React
Vite
Tailwind CSS
React Router
TanStack Query
AI
Google Gemini API
Lemma
Lemma SDK
AuthGuard
Lemma Authentication
Lemma App Deployment
Pod-based Application
Architecture
React UI
      │
      ▼
AI Service Layer
      │
      ▼
Google Gemini API
      │
      ▼
Structured JSON Response
      │
      ▼
UI Components

Lemma is used for:

Authentication
Pod management
Application deployment
Hosting on jobpilot-ai.apps.lemma.work
Project Structure

Explain the folders in simple language instead of just listing them.

For example:

src/
 ├── pages/          Application screens
 ├── components/     Reusable UI components
 ├── services/       AI integration
 ├── lib/            Lemma configuration
 ├── hooks/          Custom React hooks
 ├── context/        Theme management
 └── utils/          Helper functions
Challenges Faced

During development we faced several challenges:

Designing structured AI outputs for different modules.
Integrating AI responses into reusable React components.
Configuring Lemma authentication and deployment.
Building prompts that consistently return structured JSON.
Creating a clean and responsive user interface.

These challenges helped improve the application's architecture and overall reliability.

Future Improvements
Resume PDF upload
Application reminders
Company insights
Job recommendation engine
Resume version management
Analytics dashboard
Email integration
Calendar integration
Deployment

The application is deployed as a Lemma App and is available through the Lemma platform.

Authentication is handled using the Lemma SDK and AuthGuard, while AI-powered features are generated using the Google Gemini API.
