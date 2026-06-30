# AURA · One Mind Ahead

**AURA** is an AI-powered executive assistant that redefines personal productivity. Voice-first, proactive, and deeply personalised — it learns your rhythms, predicts failure, and acts before you ask.

![AURA Dashboard](https://img.shields.io/badge/status-alpha-8B5CF6?style=flat-square)
![Tests](https://img.shields.io/badge/tests-30%2F30%20passing-22c55e?style=flat-square)

---

## Features

| Capability | Description |
|-----------|-------------|
| **Brain Dump** | Speak or type naturally — AURA extracts tasks, deadlines, and context via voice/LLM |
| **Save Me** | Panic button that compresses your schedule, cancels low-priority work, and builds a Pomodoro survival plan |
| **Focus Session** | Pomodoro timer with persistent state, phase tracking (Focus/Break/Long Break), and ambient gradient UI |
| **Autonomous Scheduling** | Planner Agent rearranges your day around real-time progress and energy levels |
| **Failure Prediction** | Every task gets a success-probability score — like a chess engine evaluation bar |
| **Deep Learning** | Behavioural model learns your work speed, procrastination patterns, and optimal energy windows |
| **5 AI Agents** | Planner, Deadline, Research, Reflection, and Focus agents collaborate via shared state |
| **Weekly Report** | Auto-generated digest of productivity trends, habit streaks, and recommendations |

---

## Tech Stack

**Frontend** · Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · shadcn/ui · Aceternity UI

**Backend** · Firebase Auth · Firestore · Gemini API (planned) · Vertex AI (planned)

**Infrastructure** · Cloud Run · Firebase Hosting · Google Calendar / Drive / Mail APIs (planned)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev        # → http://localhost:3000

# Run tests (30 tests across 3 viewports)
npm test

# Production build
npm run build
```

### Environment

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Project Structure

```
app/                       # Next.js App Router pages
├── auth/                  # Firebase Authentication
├── brain-dump/            # Voice/text input
├── calendar/              # Calendar view
├── focus-session/         # Pomodoro timer
├── onboarding/            # Welcome flow
├── save-me/               # Emergency mode
├── schedule/              # Daily schedule
├── tasks/                 # Task management
├── timeline/              # Life timeline
└── weekly-report/         # Productivity digest

components/ui/             # Reusable components (glass cards, bottom tabs, etc.)
contexts/                  # React contexts (Auth, etc.)
lib/                       # Firebase config, utils, mock data
docs/                      # Architecture, PRD, task tracking
e2e/                       # Playwright tests (3 viewports × 10 tests)
```

---

## Design System

- **Dark glass aesthetic** · frosted panels, subtle borders, backdrop blur
- **Purple/Blue primary** (`#8B5CF6` / `#3B82F6`)
- **8pt spacing** · Inter typography · mobile-first responsive (390px → 1440px)
- **Animations** under 300ms via Framer Motion
- Aceternity components: `BackgroundLines`, `FloatingDock`, `GoogleGeminiEffect`, `BackgroundGradientAnimation`

---

## Multi-Agent Architecture

```
┌──────────────┐     ┌─────────────────────────────────────┐
│   User       │◄───►│  Planner  │  Deadline  │  Research   │
│ Voice / Text │     │  Focus    │  Reflection              │
└──────────────┘     └───────────┴────────────┬─────────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │  Firestore / FCM   │
                                    │  Google APIs       │
                                    └───────────────────┘
```

Five specialised agents, each running independently on Cloud Run, orchestrated through a shared Firestore state layer.

---

## Testing

```bash
# Run all 30 tests
npm test

# Run with visible browser
npm run test:e2e

# Update snapshots
npx playwright test --update-snapshots
```

Tests cover 10 scenarios × 3 viewports (390px mobile, 768px tablet, 1440px desktop).

---

## Roadmap

- [ ] Firebase Auth (Google sign-in) — real OAuth flow
- [ ] Firestore CRUD — replace mock data with live API
- [ ] Gemini API integration — voice-to-text, NLU, reasoning
- [ ] 5 AI Agent backend services on Cloud Run
- [ ] Google Calendar / Drive / Mail integration
- [ ] Push notifications via FCM
- [ ] Weekly Premium Report generation
- [ ] Behavioural model training via Vertex AI

---

Built with Next.js · Firebase · Tailwind CSS · shadcn/ui · Aceternity UI · Framer Motion
