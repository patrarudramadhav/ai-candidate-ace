# Talent Scout AI Agent

A recruiter-facing dashboard for the Deccan AI Catalyst hackathon. Paste a Job Description, scout a built-in candidate pool with AI, and export a shortlist.

## Design Direction

**Commerce-Professional** aesthetic — clean, trustworthy, dashboard-grade.
- Palette: Slate (`#475569`), White (`#FFFFFF`), Navy Blue (`#0F1B3D`) as primary, with a soft slate-50 background.
- Typography: Inter — semi-bold headings, regular body. Tabular figures for scores.
- Components: cards with subtle borders, navy primary buttons, slate secondary, score badges color-coded (green ≥80, amber 60–79, slate <60).
- Fully responsive — works cleanly on laptop and mobile for the demo video.

## Pages & Layout

**Single page: `/` — Recruiter Dashboard**
1. **Header bar** — "Talent Scout AI" logo/wordmark, tagline "AI-powered candidate discovery".
2. **JD Input Card** — large textarea (8+ rows) with placeholder showing a sample JD, character counter, and a primary **"Scout Candidates"** button. Disabled while loading; shows spinner + "Analyzing candidates…" during the AI call.
3. **Candidate Pool preview** (collapsible) — small section showing the 6 hardcoded candidates so judges can see the input set.
4. **Results Table** — appears after scoring. Columns: Candidate Name, Current Role, Match Score, Interest Score, Action (**Analysis** button).
   - Sortable by Match Score (desc by default).
   - Score cells use color-coded badges.
5. **Toolbar above table**: "Export Shortlist (CSV)" button + result count.
6. **Analysis Modal** — opens on row click; shows candidate summary, both scores, and the AI's 2-sentence justification for each score.

## Hardcoded Candidate Pool (6 diverse profiles)

Stored in `src/data/candidates.ts`. Each: `id, name, currentRole, yearsExperience, skills[], seniority, location`. Mix of:
- Senior backend engineer (likely passive)
- Mid-level full-stack (open to moves)
- Junior frontend (eager)
- ML/AI engineer (in-demand, harder to move)
- Engineering manager (selective)
- DevOps/SRE (specialized)

## AI Logic (Lovable AI Gateway → Gemini 2.5 Flash)

Edge function `scout-candidates` accepts `{ jobDescription, candidates }` and returns a structured array. Uses **tool calling** for reliable JSON output (no parsing errors).

For each candidate the AI returns:
- `matchScore` (0–100) — skill/experience alignment with JD
- `matchJustification` (2 sentences) — what aligns and what's missing
- `interestScore` (0–100) — likelihood they'd move, reasoned from seniority + current role vs. JD appeal
- `interestJustification` (2 sentences) — why they would or wouldn't be interested

System prompt instructs the model to act as an experienced technical recruiter, score conservatively, and ground every justification in the candidate's actual data.

> **AI key note:** I'll use the Lovable AI Gateway (`LOVABLE_API_KEY`, auto-provisioned, free credits included) with the `google/gemini-2.5-flash` model. If you specifically need to use your own Gemini key as `GEMINI_API_KEY`, tell me and I'll switch to a direct Gemini API call instead.

## CSV Export

Client-side generation — no extra dependency. Columns: Name, Current Role, Years Experience, Match Score, Interest Score, Match Justification, Interest Justification. Filename: `talent-shortlist-YYYY-MM-DD.csv`.

## Error Handling

- Empty JD → inline validation message.
- 429 (rate limit) and 402 (credits) from the gateway → friendly toast explaining what to do.
- AI failure → toast + retry button, table not cleared.

## Technical Setup

- **Lovable Cloud** enabled for the edge function.
- Edge function `supabase/functions/scout-candidates/index.ts` — handles CORS, validates input with zod, calls AI gateway with tool-calling for structured output, returns scored array.
- Frontend uses `supabase.functions.invoke` (non-streaming — we need the full structured result before rendering).
- React Query for the scout mutation, shadcn `Table`, `Dialog`, `Button`, `Textarea`, `Badge`, `Card`, `Toaster`.

## GitHub Sync

After the build, click the **GitHub** button in the top-right of Lovable to connect a repo and push — then share the repo link with `hackathon@deccan.ai`. No code changes needed for this; it's a one-click integration.

## Out of Scope (for v1)

- Real candidate database / auth (hardcoded pool is the spec).
- Streaming responses (structured JSON output is better for table rendering).
- Multi-JD history (can be added next iteration).
