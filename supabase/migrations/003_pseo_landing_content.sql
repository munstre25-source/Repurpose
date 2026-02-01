-- Optional overrides for pSEO landing pages (repurpose/[slug]).
-- When a row exists for a slug, the app merges these fields over config-generated copy.
-- Use for scraped/curated unique content per page without redeploying.
create table if not exists public.pseo_landing_content (
  slug text primary key,
  h1 text,
  intro text,
  meta_description text,
  why_manual_fails text,
  how_we_solve text,
  example_snippet text,
  best_for text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.pseo_landing_content is 'Optional overrides for /repurpose/[slug] page copy. Merge at runtime; config is fallback.';

-- Allow app to read (anon or service role); restrict writes to backend/service.
alter table public.pseo_landing_content enable row level security;

create policy "Allow read for all"
  on public.pseo_landing_content for select
  using (true);

create policy "Allow insert/update/delete for service role only"
  on public.pseo_landing_content for all
  using (auth.role() = 'service_role');

create index if not exists idx_pseo_landing_content_slug on public.pseo_landing_content(slug);
