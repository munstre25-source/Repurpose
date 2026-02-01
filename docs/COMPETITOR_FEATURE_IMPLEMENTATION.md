# Competitor Feature Implementation Plan

Map of [Typefully](https://typefully.com/), [Hypefury](https://hypefury.com/features-pricing/), and [Taplio](https://taplio.com/pricing) features to Silho AI—what we implement, adapt, or skip and why.

---

## Competitor Feature Summary

| Feature area | Typefully | Hypefury | Taplio | Silho AI (before) |
|--------------|-----------|----------|--------|----------------------|
| **Pricing** | Free–$39/mo, 4 tiers | $29–$199/mo, 4 tiers | $32–$199/mo, 3 tiers | Free $0, Pro $19, Founder+ $39 |
| **Scheduling** | Calendar, slots, AI-suggested times | 1–3 mo / unlimited, X-first | 1-click scheduling, LinkedIn | ❌ By design (paste → export) |
| **Cross-posting** | X, LinkedIn, Threads, Bluesky, Mastodon | X + LinkedIn autoplugs | LinkedIn-first, X secondary | ✅ One source → many outputs (no live post) |
| **AI generation** | Writing prompts, rewrites (Creator+) | Templates only, no AI | 250+ AI credits, repurpose viral posts | ✅ Full repurposing + Voice Lock |
| **Templates / hooks** | — | Viral thread hooks, tweet templates | 5M+ post ideas, hooks | 🔄 **Implement** (founder hooks) |
| **Multi-platform** | 5 platforms | 6–90 social (1–15 X) | LinkedIn + X | ✅ X, LinkedIn, Reddit, email, blog, Shorts, SEO |
| **Analytics** | Performance, engagement | Charts, top tweets, recurrence | Follower growth, post analytics | 🔄 **Implement** (runs + platform stats) |
| **Export** | — | CSV, recurrence | — | ✅ Markdown, CSV, Notion |
| **Trial** | Free plan | 7-day free trial all plans | 7-day Pro trial | Free 5/week; 🔄 **Implement** 7-day Pro trial CTA |
| **Pricing page** | Clear tiers | Comparison table, feature matrix | Comparison table, FAQ | 🔄 **Implement** dedicated /pricing + comparison |
| **Recurrent / reuse** | — | Recurrent posts, re-post oldest | — | History; 🔄 **Implement** “Export for scheduling” (CSV + dates) |
| **Voice / brand** | — | — | AI trained on 500M posts | ✅ Voice Lock (your samples) |
| **Carousel** | — | — | Generate carousels from AI/URL | ✅ Carousel outline in output |
| **Engagement** | — | Engagement builder, Auto-DM | Auto-reply, comment credits | ❌ Out of scope (we’re repurpose-first) |
| **Lead gen** | — | Gumroad | Lead DB, Auto-DM | ❌ Out of scope |

---

## Implementation Status

### ✅ Implemented (this pass)

1. **Dedicated pricing page** (`/pricing`)  
   - Plan comparison table (Free / Pro / Founder+).  
   - Feature matrix (generations, Voice Lock, export, support).  
   - 7-day Pro trial CTA where applicable.  
   - FAQ and “Compare plans” clarity (Hypefury/Taplio-style).

2. **Thread hooks & templates (founder-focused)**  
   - Curated “thread hooks” and “angles” for founder updates/changelogs (like Hypefury’s viral thread hooks, but founder-native).  
   - Optional “Hook / angle” in New Repurpose form; passed into generation so first tweet/thread uses that angle.  
   - No generic “viral” library—founder shipping, launch, build-in-public, etc.

3. **Dashboard analytics**  
   - “Runs this week” (already had usage).  
   - “Top platforms” from recent generations (which platforms user picks most).  
   - Kept minimal (no social engagement metrics; we don’t post).

4. **Export for scheduling**  
   - New export option: “Export for scheduling” → CSV with columns: `platform`, `format`, `content_snippet`, `suggested_date` (e.g. Mon/Wed/Fri for the week).  
   - Lets founders paste into Buffer/Hootsuite/Typefully without us building a calendar.

### 🔄 Adapted (fit our context)

- **“Scheduling”** → We don’t build a calendar. We add “Export for scheduling” (CSV + suggested dates) and optional “Send to Buffer” link (e.g. Buffer’s composer URL with prefill later).  
- **“Templates”** → Founder-only hooks/angles (no generic viral tweet library).  
- **“Analytics”** → Runs per week + platform breakdown only (no likes/impressions; we don’t post).  
- **“Trial”** → We keep Free 5/week; we add clear “Start 7-day Pro trial” CTA on pricing and sign-up (Stripe trial or manual trial flag).

### ❌ Not implementing (by design)

- **Full scheduling/calendar** – Keeps product “paste → generate → export”; founders use Buffer/Typefully for posting.  
- **Engagement builder / Auto-DM / lead DB** – Silho AI is repurpose-first, not an engagement or CRM tool.  
- **Multi-account (many X/LinkedIn accounts)** – One user, one voice; multi-workspace later if needed.  
- **Video/visual repurposing** – Stay text-first (transcript → text outputs); video is a different product.

---

## How We Win vs. Each Competitor

- **vs. Typefully:** “We don’t schedule—we repurpose. One founder update → platform-native copy for X, LinkedIn, Reddit, email, blog. Voice Lock so it sounds like you. Use Typefully (or Buffer) to schedule what we generate.”  
- **vs. Hypefury:** “We’re not X-only. One source → X, LinkedIn, Reddit, email, SEO. Founder-focused hooks and Voice Lock. No engagement automation—just distribution leverage.”  
- **vs. Taplio:** “We’re not LinkedIn-only. One source → all channels. Voice Lock from your posts; no need for 500M-post training. Cheaper Pro ($19) and clear pricing.”

---

## Files Touched (Implementation)

- `docs/COMPETITOR_FEATURE_IMPLEMENTATION.md` – This plan.  
- `app/pricing/page.tsx` – Dedicated pricing page with comparison table + trial CTA.  
- `lib/content/hooks.ts` – Founder-focused thread hooks and angles.  
- `app/(app)/new/new-repurpose-form.tsx` – Optional “Hook / angle” field.  
- `lib/ai/prompts.ts` (or generate) – Use hook/angle in thread/tweet generation.  
- `app/(app)/dashboard/page.tsx` – Platform stats from recent generations.  
- `app/(app)/history/[id]/page.tsx` or export component – “Export for scheduling” (CSV with suggested_date).

---

## References

- [Typefully – Best social media tool for creators & businesses](https://typefully.com/)  
- [Hypefury – Features & Pricing](https://hypefury.com/features-pricing/)  
- [Taplio – Pricing – Grow your personal brand on LinkedIn](https://taplio.com/pricing)  
- [Typefully vs Hypefury – Which is right for you](https://authoredup.com/blog/typefully-vs-hypefury)  
- [Typefully Pricing 2026](https://socialrails.com/blog/typefully-pricing)
