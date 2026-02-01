# Competitive Analysis: Silho AI (AI Content Repurposing)

## How we’d compete

If this were a product we were shipping to compete in the market, we’d (1) match or beat competitors on table-stakes features, and (2) double down on a few differentiators (Voice Lock, founder positioning, simplicity). Below is a concise competitor view and a checklist of what we have vs. what we’ve added or should add.

---

## Competitors (summary)

| Competitor | Focus | Pricing | Strengths | Gaps we can exploit |
|------------|--------|---------|-----------|----------------------|
| **Repurpose.io** | Distribution automation | $35–$149/mo | Multi-platform workflows, “fetch new content” | No AI creation/rewriting; distribution only |
| **ContentRepurpose.pro** | Multi-channel AI repurposing | Free + paid | URL import, batch export, Notion/Trello | Less founder-specific; voice not central |
| **Tweet Hunter / Taplio** | Twitter → LinkedIn | Subscription | AI generation, 3M+ tweets, scheduling | Twitter-first; not “one source → all channels” |
| **Copyflow** | Brand voice + ideation | — | “Author Twins” brand voice, SEO | Heavier; not paste → platforms in one step |
| **Kapwing** | Video repurposing | — | Brand Kit, auto-resize | Video-only; no text multi-channel |
| **Hootsuite** | Scheduling + AI | Tiered | Calendar, AI captions, multi-platform | Scheduling/complexity; not “one source → many” |

---

## What we have (today)

- **Voice Lock** – 5–10 sample posts → stored voice → applied to all outputs (founder differentiator).
- **Platform-native output** – X (thread + single), LinkedIn (post + carousel), Reddit, email, blog, YouTube Shorts, SEO; limits and format per platform.
- **One source → many outputs** – Single run, multiple platforms.
- **URL fetch** – Optional blog/newsletter URL; we fetch and use body + title.
- **Export** – Markdown, CSV, copy per output.
- **Usage gating** – Free (5/week), Pro ($19), Founder+ ($39); Stripe-ready.
- **No scheduling** – Intentional: “no calendars” for founder simplicity.

---

## Gaps we’re addressing (implemented or planned)

1. **URL-first flow** – Competitors (e.g. ContentRepurpose.pro) lead with “Paste URL.” We had URL as optional; we now make “Import from URL” a first-class option so blog/newsletter users see it immediately.
2. **Character counts per platform** – Users want to see “280/280” or “450/3000” at a glance. We store `char_count` in output meta; we surface it in the output view with platform limits.
3. **Tone/audience preset** – Competitors use “who is this for?” (Founder, B2B, Coach). We add an optional preset that feeds into analysis and generation so output matches intent without relying only on voice samples.
4. **Notion-ready export** – Some tools export to Notion/Trello. We add a “Notion” export format (structured markdown) so users can paste into Notion and get clear headings/sections.

---

## What we’re not doing (by design)

- **Scheduling/calendar** – Kept out to stay “paste → generate → export”; founders can use Buffer/Hootsuite separately. We could add “Export for Buffer” (CSV with suggested dates) later without building a full calendar.
- **Visual/video repurposing** – We stay text-first (blog, tweet, transcript → text outputs). Video is a different product (e.g. Kapwing).
- **Full “content ideation”** – We focus on repurposing one existing piece; ideation/trends are a possible Phase 2.

---

## Positioning vs. competitors

- **vs. Repurpose.io:** “We don’t just distribute—we create platform-native copy from one source.”
- **vs. ContentRepurpose.pro:** “We’re built for founders: Voice Lock, no clutter, URL + paste, same price band.”
- **vs. Tweet Hunter/Taplio:** “One source → X, LinkedIn, Reddit, email, SEO in one run; not Twitter-first.”

**Tagline:** “Turn one founder update into a week of distribution. Write once. Ship everywhere. Without sounding generic.”
