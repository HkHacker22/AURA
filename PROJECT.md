# AURA — AI Executive Assistant

AURA is an AI-powered executive assistant that listens, learns, plans, and executes autonomously. It ingests natural language via voice, builds a behavioural model from user activity, and orchestrates five specialised AI agents to manage schedules, predict failure risks, research tasks, analyse habits, and maintain deep focus.

## Status

- **Phase:** Alpha / MVP
- **Build:** Clean — 17 pages compile, 30/30 Playwright tests passing
- **Auth:** Firebase Authentication configured with real credentials
- **UI:** Dark glass aesthetic with Aceternity components, mobile-first responsive
- **Data layer:** Currently mock data; Firestore integration planned

## Architecture

A Next.js 14 PWA (App Router, TypeScript, Tailwind) frontend backed by Firebase Auth and Firestore. Five-agent architecture (Planner, Deadline, Research, Reflection, Focus) runs independently on Cloud Run, orchestrated through a shared state layer. Gemini API and Vertex AI handle NLP, reasoning, and behavioural model training.

## Key Pages

| Route | Purpose |
|-------|---------|
| `/` | Dashboard — daily overview, agent status, quick stats |
| `/brain-dump` | Voice/text input with GoogleGeminiEffect |
| `/focus-session` | Pomodoro timer with phase tracking |
| `/save-me` | Emergency panic mode with gradient animation |
| `/onboarding` | Welcome flow with animated background |
| `/tasks` | Filterable task list |
| `/schedule` | Calendar schedule view |

## Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · shadcn/ui · Aceternity UI · Firebase Auth · Firestore · Playwright
