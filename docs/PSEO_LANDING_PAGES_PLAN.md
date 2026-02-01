# pSEO Landing Pages: Unique, Rich Content Plan

## pSEO route summary

| Route pattern | Example URL | Purpose |
|---------------|-------------|---------|
| `/repurpose/[slug]` | `/repurpose/repurpose-blog-post-to-twitter` | Source → target (and optional persona) |
| `/content-repurposing/for/[persona]/[use-case]` | `/content-repurposing/for/founders/build-in-public` | Persona + use case |
| `/turn/[slug]` | `/turn/blog-post-into-5-linkedin-posts` | Outcome-based (e.g. “N posts from one piece”) |

Sitemap and `getAllPSEOSlugs()` in `lib/pseo/config.ts` use these paths.

---

## Goal
Every pSEO page must be **unique, contextual, and detailed**—no thin content, no replica copy. Content is tailored to the specific page type and audience to maximize CTR and conversion.

---

## Page Types & Content Strategy

### 1. Repurpose pages (`/repurpose/[slug]`)
**Intent:** Source → Target (e.g. blog → Twitter, tweet → LinkedIn), with optional persona (founders / indie hackers).

**Content model:**
- **H1 & description:** Source- and target-specific (e.g. "Turn your YouTube video into Twitter content").
- **Why manual repurposing fails:** One paragraph + **pain points** (bullets) composed from:
  - **SOURCE_PAINS:** Per-source why this content type is hard to repurpose (e.g. YouTube: transcription, key moments; tweet: expanding without fluff).
  - **TARGET_NEEDS:** Per-target what the platform needs (e.g. Twitter: hooks, thread structure; LinkedIn: professional tone, line breaks).
- **How we solve it:** One paragraph + **What you get** (paragraph) composed from:
  - **getWhatYouGet(source, target, persona):** Target-specific outcome (e.g. "One blog becomes a Twitter thread with hook, structure, length").
- **Example:** Source→target example snippet.
- **Tips:** Combo-specific bullets from **getTipsForCombo(source, target, persona)**—key workflows (e.g. youtube→twitter, tweet→linkedin) get unique tips; others get a generic set.
- **Best for:** Persona-aware (founders vs indie hackers).

**Implementation:** `lib/pseo/config.ts` — `SOURCE_PAINS`, `TARGET_NEEDS`, `getTipsForCombo()`, `getPainPoints()`, `getWhatYouGet()`; Tier 1/2 pages and fallbacks include `painPoints`, `tips`, `whatYouGet`. Page component renders bullets and "What you get" section.

---

### 2. Tier 3 pages (`/content-repurposing/for/[persona]/[use-case]`)
**Intent:** Persona + use case (e.g. founders + build-in-public, indie hackers + product-launch).

**Note:** Tier 3 was moved from `/content-repurposing-for-X/Y` to `/content-repurposing/for/X/Y` so `/repurpose/*` is never matched by the Tier 3 route. Old URLs redirect (301) to the new path.

**Content model:**
- **H1, description, body:** Persona- and use-case-specific (unchanged).
- **The problem:** Unique paragraph per persona+useCase (why manual repurposing / distribution fails for this audience and goal).
- **How we solve it:** Unique paragraph (what Silho AI does for this persona+useCase; Voice Lock, one-click, etc.).
- **How it works:** Unique paragraph (paste → select platform → generate; voice samples).

**Implementation:** `TIER3_RICH` in `lib/pseo/config.ts` holds `problemParagraph`, `solutionParagraph`, `howItWorksParagraph` for all 10 persona+useCase combinations. Tier3 page component renders three sections: "The problem", "How we solve it", "How it works".

---

### 3. Tier 4 / Turn pages (`/turn/[slug]`)
**Intent:** Outcome-based (e.g. "Turn one blog post into 10 Twitter posts"). Curated list; already has unique title, description, body, CTA per slug. No structural change; content is already unique per page.

---

## Principles Applied
- **No thin content:** Every page has multiple sections (problem, solution, how it works, tips or what you get).
- **Unique per URL:** Copy is composed from source, target, and/or persona so two different URLs never show the same body.
- **Composable blocks:** Source pains, target needs, and combo tips are defined once and combined at build/runtime—scalable and consistent.
- **CTR/conversion:** Clear problem → solution → how it works → CTA; tips and "what you get" reduce bounce and support sign-up.

---

## Files Touched
- `lib/pseo/config.ts`: Content blocks, `RepurposePage`/`Tier3Page` extensions, Tier 1/2/3 build logic and fallbacks.
- `app/repurpose/[slug]/page.tsx`: Pain points, what you get, tips sections.
- `app/content-repurposing-for-[persona]/[use-case]/page.tsx`: Problem, solution, how it works sections.
