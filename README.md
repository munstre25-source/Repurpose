# Silho AI — AI Content Repurposer

Turn one founder update into a week of distribution. Write once. Ship everywhere. Without sounding generic.

## Features

- **Content ingestion**: Blog, tweet, thread, YouTube transcript, newsletter, podcast. Paste or URL.
- **Platform-native repurposing**: Twitter thread + single tweet, LinkedIn post + carousel, Reddit, email, blog expansion, YouTube Shorts script, SEO meta.
- **Voice Lock**: Paste 5–10 sample posts; we extract your voice and apply it to all outputs.
- **Usage gating**: Free (5 generations/week), Pro (unlimited), Agency (batch + voice lock). Stripe-ready.
- **Export**: Markdown, CSV, copy-ready blocks.

## Tech Stack

- Next.js 15 (App Router), React 19, TypeScript
- Supabase (Auth + Postgres)
- OpenAI (GPT-4o / GPT-4o-mini)
- Tailwind 4, Radix UI

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase project
- OpenAI API key

### Environment variables

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Google sign-in

1. In Supabase Dashboard: **Authentication → Providers → Google** — enable Google and add your Google OAuth client ID and secret.
2. In **Authentication → URL Configuration** add your redirect URL(s):
   - Local: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### Database

Run the Supabase migration:

```bash
# If using Supabase CLI:
supabase db push

# Or run the SQL in supabase/migrations/001_repurposer.sql in the Supabase SQL editor.
```

### Install and run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

**To reach the dashboard quickly (development):**  
1. Run once: `pnpm run seed:test-user` (creates test user from `.env.local`).  
2. Go to **http://localhost:3000/auth/dev-login** and click **Sign in as test user**.  
3. You’ll be on the dashboard. From there use **New** to paste content, select platforms, optionally set Voice Lock, and generate.

## Project structure

- `app/` — Routes: `/` (marketing), `/auth/*`, `/dashboard`, `/new`, `/history`, `/settings`
- **pSEO routes:** `/repurpose/[slug]` (source→target), `/content-repurposing/for/[persona]/[use-case]` (persona+use-case), `/turn/[slug]` (outcome-based). See `docs/PSEO_LANDING_PAGES_PLAN.md`.
- `app/repurpose/actions.ts` — Server actions: create source, create generation, voice profile, usage, export
- `lib/supabase/` — Supabase client (browser, server, middleware)
- `lib/ai/` — Analyze content, generate per-platform (prompts, schemas)
- `lib/voice/` — Voice extraction from sample posts
- `lib/usage.ts` — Usage limits and plan gating
- `lib/platforms/config.ts` — Platform specs and formats
- `supabase/migrations/001_repurposer.sql` — Tables and RLS

## Deployment

Designed for Vercel. Set the same env vars in the project. Run the migration against your Supabase project. Optional: `NEXT_PUBLIC_SITE_URL` for OAuth redirects.
