# AURA
## One Mind Ahead.

---

| Status | Version | Date |
|--------|---------|------|
| Live | 2.0 | 2026-07-01 |

---

## 1. Executive Summary

AURA is an AI-powered productivity assistant built as a Next.js web app. It ingests natural language via voice or text, processes it through Gemini 2.5 Flash on Vertex AI, and presents structured results (tasks, events, notes, plans) in a polished glass-morphism UI.

---

## 2. Current Features

| Feature | Status | Details |
|---------|--------|---------|
| **Dashboard** | ✅ Live | Agent cards, schedule preview, task quick-view, floating mic |
| **Brain Dump** | ✅ Live | Voice/text input → Gemini extracts tasks/events/notes |
| **Save Me** | ✅ Live | Workload analysis → overload score + suggested actions |
| **Focus Session** | ✅ Live | Pomodoro timer with work/break/long-break cycling |
| **Calendar** | ✅ Live | Month view with client-side month navigation |
| **Tasks** | ✅ Live | Filterable list (All/Pending/In Progress/Completed) |
| **Schedule** | ✅ Live | Day schedule from mock data |
| **Settings** | ✅ Live | Toggle preferences, AI personality display |
| **Profile** | ✅ Live | Account info, menu navigation, sign out |
| **Notifications** | ✅ Live | Static alert list |
| **Timeline** | ✅ Live | Life goals and milestones display |
| **Weekly Report** | ✅ Live | Productivity digest display |
| **Chat (API)** | ✅ API only | Streaming SSE endpoint ready for frontend |
| **Planner (API)** | ✅ API only | Schedule optimization endpoint ready |
| **Research (API)** | ✅ API only | Research brief endpoint ready |

---

## 3. Architecture

```
Browser (React) → Next.js API Routes → AgentRegistry → LLMService → Vertex AI Gemini
```

- **5 agents** (BrainDump, Chat, Planner, SaveMe, Research) run in-process
- Each agent has system prompt, examples, JSON schema in `lib/backend/prompts/`
- All LLM calls go to `gemini-2.5-flash` via OAuth2/ADC
- Streaming chat via SSE on `streamGenerateContent`
- Structured JSON output validated with Zod
- Prompt caching (SHA-256, 30s TTL)
- Observability logging per call

---

## 4. Backlog

| Priority | Item | Notes |
|----------|------|-------|
| P0 | Wire Firestore reads (Repository pattern) | Replace all mock data |
| P0 | Add auth middleware to API routes | Firebase Admin SDK token verification |
| P1 | Chat frontend page | Wire to streaming SSE endpoint |
| P1 | Planner frontend integration | Call `/api/ai/planner` from schedule page |
| P1 | Research frontend integration | Call `/api/ai/research` from agent card |
| P2 | MemoryAgent | Context management, message compression |
| P2 | Dashboard agent cards → real status | Poll agent health |
| P2 | Calendar sync with Google Calendar API | Read/write events |
| P3 | Weekly report → real Gemini generation | Replace mock data |
| P3 | Timeline → real data | Firestore-backed |
| P4 | Notifications → real FCM | Push notifications |
| P4 | Opportunity detection | Gap analysis + micro-task suggestions |
| P4 | Reflection agent | Weekly analysis |
| P5 | Dev setup docs | First-time contributor guide |
| P5 | Deployment config | Cloud Run + CI/CD |

---

## 5. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + glass-morphism |
| Animation | Framer Motion |
| Auth | Firebase Authentication (Google) |
| AI | Vertex AI Gemini 2.5 Flash (OAuth2/ADC) |
| Database | Firestore (planned) |
| State | React hooks + localStorage |
| Validation | Zod |
| Voice | Web Speech API (webkitSpeechRecognition) |
| UI Components | Radix UI primitives, shadcn-style |

---

## 6. Key Constraints

1. **Only gemini-2.5-flash available** on GCP project `aura-501017` — no 2.0, 1.5, or pro models
2. **OAuth2/ADC required** for Vertex AI — API key not usable (generativelanguage.googleapis.com not enabled)
3. **Single server** — all agents run in-process in Next.js; not separate Cloud Run services
4. **Browser SpeechRecognition** — Chrome-only for voice input; fallback to mock text

---

*End of PRD*
