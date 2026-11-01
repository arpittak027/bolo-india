# BOLO INDIA — Voice-First Computing for Bharat 🇮🇳

> **"India has a lot to say. Let's make speaking easier."**

**Bolo India** is an independent, production-grade full-stack voice-first platform tailored for the communication habits, multilingual code-switching, and everyday workflow needs of people across India.

---

## 🌟 Key Features & Modules

1. **Voice Playground (`/playground`)**
   - 4 Purposeful Workflows: **Message Mode**, **Notes Mode**, **Creator Mode**, and **Business Mode**.
   - Multilingual support across **11 Indian languages**: Hindi, Hinglish, Indian English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, and Punjabi.
   - Built on browser-native Web Speech API with real-time waveform visualization, live text editing, smart formatting presets, and one-click copy.
   - Instant manual typing fallback for unsupported browsers.

2. **India Audience Journeys (`/audiences`)**
   - 4 Dedicated Personas: **Students**, **Parents & Grandparents**, **Content Creators**, and **Small-Business Retailers**.
   - Problem-vs-solution comparisons with tailored spoken prompts and live browser capability detection.

3. **Bolo India Simulator (`/simulator`)**
   - 5-step interactive wizard customizing the user's role, natural language, everyday hurdles, and voice intent.
   - Deterministic scenario generator calculating real time saved and clean output formatting.

4. **Voice vs Typing Stopwatch (`/compare`)**
   - Real-world benchmark test measuring elapsed milliseconds, word count, and WPM difference between manual typing and vocal speech on the exact same task.
   - Honest, balanced evaluation without fabricated population metrics.

5. **Bolo Sprint Mini-Game (`/sprint`)**
   - **"Think it. Say it. Done."**
   - 3 Timed Challenges: Round 1 (Message Mission), Round 2 (Idea Catcher), and Round 3 (Shop Talk).
   - Transparent evaluation engine evaluating keyword context, length, and clarity.
   - Live score tracking out of 300 points, round breakdowns, confetti celebrations, and instant replay.

6. **Seven Days, Seven Voices (`/seven-days`)**
   - 7 Cultural voice anthologies from across India (Pune student, Lucknow grandmother, Bengaluru creator, Kanchipuram weaver, Mumbai parent, Hyderabad multilingual code-switcher, Delhi commuter).

7. **Production Backend API (`/api/`)**
   - `GET /api/health` — Application and database health monitor.
   - `POST /api/experiments` & `GET /api/experiments` — Validated session experiment logger.
   - `POST /api/game-results` — Saves completed Bolo Sprint scores and breakdowns.
   - `POST /api/simulations` — Generates custom scenario parameters with Zod schema validation.
   - `POST /api/feedback` — Anonymous community feedback and ratings.

8. **Database & Privacy Architecture**
   - Supabase PostgreSQL schema (`supabase/migrations/20261031_bolo_india_schema.sql`) with Row Level Security (RLS) policies and indexes.
   - Zero raw audio recording.
   - Anonymous sessions by design.
   - One-click local data wipe utility (`/privacy`).

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in your browser
http://localhost:3000
```

---

## 🔐 Environment Variables (`.env.local`)

Copy `.env.example` to `.env.local` to configure live Supabase database sync:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

*Note: If Supabase keys are not set, the application operates seamlessly with its built-in in-memory fallback store.*

---

## 🌐 Vercel Deployment

Deploy with a single command or GitHub integration:

```bash
vercel --prod
```

---

## ⚖️ Disclosure & Wispr Flow Relationship

Bolo India is an independent research and product demonstration. It does not claim official Wispr Flow ownership, partnership, or endorsement. To learn about Wispr Flow, visit [wisprflow.ai](https://wisprflow.ai).

