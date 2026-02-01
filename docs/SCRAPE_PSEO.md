# pSEO Web Scraper → `pseo_landing_content`

The scraper fetches **external URLs** per pSEO slug, extracts title and body text, and fills `pseo_landing_content` so each landing page can use unique, scraped copy instead of generic config text.

## 1. URL config

Edit **`config/pseo-scrape-urls.json`** and add one or more URLs per slug:

```json
{
  "repurpose-youtube-video-to-reddit": [
    "https://example.com/article-on-youtube-to-reddit"
  ],
  "repurpose-blog-post-to-twitter": [
    "https://example.com/blog-to-twitter-guide",
    "https://another.com/turn-blog-into-threads"
  ]
}
```

- Keys are **repurpose slugs** (e.g. `repurpose-youtube-video-to-reddit`). Use the same slugs as in `/repurpose/[slug]`.
- Values are **arrays of URLs** to scrape. The script fetches each URL, extracts text, and merges (first successful URL wins for title/h1; paragraphs are taken from the longest body).
- Add real article URLs (e.g. from a Google search like “repurpose youtube video to reddit”) so the scraper has content to extract.

## 2. Commands

| Command | What it does |
|--------|----------------|
| `pnpm run scrape:pseo` | Scrape all slugs in config → write **`pseo-landing-content-scraped.json`** (no DB). |
| `pnpm run scrape:pseo-db` | Same, then **upsert** into Supabase `pseo_landing_content`. |
| `pnpm run scrape:pseo-refine` | Same as scrape + DB, but first **refine** scraped text with OpenAI into `h1`, `intro`, `why_manual_fails`, `how_we_solve` (needs `OPENAI_API_KEY`). |

## 3. Behaviour

- **Rate limit**: ~1.8 s delay between requests; **User-Agent**: `SilhoAIBot/1.0`.
- **Extraction**: For each URL, the script strips HTML, takes `<title>` and first `<h1>`, and splits body into paragraphs. It maps:
  - **h1** → page `<h1>` or `<title>` or slug-derived headline
  - **intro** → first paragraph (max ~320 chars)
  - **meta_description** → first ~155 chars
  - **why_manual_fails** / **how_we_solve** → 2nd and 3rd paragraphs (optional)
- **`--refine`**: If `OPENAI_API_KEY` is set, scraped text is sent to GPT-4o-mini to produce clean `h1`, `intro`, `meta_description`, `why_manual_fails`, `how_we_solve` for the schema.

## 4. Supabase

- Table: **`public.pseo_landing_content`** (see `supabase/migrations/003_pseo_landing_content.sql`).
- For **`--seed`** / **`scrape:pseo-db`** you need:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- The app merges rows from this table over config-generated copy when rendering `/repurpose/[slug]`.

## 5. Workflow

1. Add or replace URLs in **`config/pseo-scrape-urls.json`** for the slugs you care about.
2. Run **`pnpm run scrape:pseo`** and open **`pseo-landing-content-scraped.json`** to review.
3. Optionally run **`pnpm run scrape:pseo-refine`** (with `OPENAI_API_KEY`) to refine copy, then **`pnpm run scrape:pseo-db`** to push to Supabase.
4. Reload the repurpose pages; they will use overrides from `pseo_landing_content` when present.
