/**
 * Optional pSEO landing content overrides from Supabase or scraped JSON.
 * When a row/file entry exists for a slug, merge these fields over config-generated copy.
 * Use for scraped/curated unique content per page without redeploying.
 */

import { createClient } from '@/lib/supabase/server';
import { readFile } from 'fs/promises';
import path from 'path';

export interface PseoLandingOverride {
  slug: string;
  h1: string | null;
  intro: string | null;
  meta_description: string | null;
  why_manual_fails: string | null;
  how_we_solve: string | null;
  example_snippet: string | null;
  best_for: string | null;
}

export type RepurposePagePartial = Pick<
  import('./config').RepurposePage,
  'h1' | 'intro' | 'description' | 'whyManualFails' | 'howWeSolve' | 'exampleSnippet' | 'bestFor'
>;

/** Overrides from DB/file are partial (only some fields may be set). */
export type RepurposePageOverrides = Partial<RepurposePagePartial>;

/** Generic H1s from scraped pages (reused across slugs or site nav) — don't use as override. */
const GENERIC_SCRAPED_H1 = new Set([
  'KAPWING',
  'The Best Way to Repurpose Your Content into a Twitter Thread',
  'Home Blog The Best Way to Repurpose Your Content into a Twitter Thread',
  'How to Automate Your Content Repurposing in 5 Steps (From Someone Who Has Done It!)',
]);

function rowToOverrides(row: PseoLandingOverride): RepurposePageOverrides {
  const out: RepurposePageOverrides = {};
  if (row.h1 != null && !GENERIC_SCRAPED_H1.has(row.h1.trim())) out.h1 = row.h1.trim();
  if (row.intro != null && row.intro.trim().length > 60) out.intro = row.intro.trim().slice(0, 420);
  if (row.meta_description != null && row.meta_description.trim().length > 40)
    out.description = row.meta_description.trim().slice(0, 160);
  if (row.why_manual_fails != null) out.whyManualFails = row.why_manual_fails.trim();
  if (row.how_we_solve != null) out.howWeSolve = row.how_we_solve.trim();
  if (row.example_snippet != null) out.exampleSnippet = row.example_snippet.trim();
  if (row.best_for != null) out.bestFor = row.best_for.trim();
  return out;
}

/** Fetch optional overrides for a repurpose slug from Supabase. Returns null if no row or Supabase not configured. */
export async function getPseoOverrides(slug: string): Promise<RepurposePageOverrides | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pseo_landing_content')
      .select('h1, intro, meta_description, why_manual_fails, how_we_solve, example_snippet, best_for')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) return null;

    const row: PseoLandingOverride = {
      slug,
      h1: (data as { h1: string | null }).h1 ?? null,
      intro: (data as { intro: string | null }).intro ?? null,
      meta_description: (data as { meta_description: string | null }).meta_description ?? null,
      why_manual_fails: (data as { why_manual_fails: string | null }).why_manual_fails ?? null,
      how_we_solve: (data as { how_we_solve: string | null }).how_we_solve ?? null,
      example_snippet: (data as { example_snippet: string | null }).example_snippet ?? null,
      best_for: (data as { best_for: string | null }).best_for ?? null,
    };
    const out = rowToOverrides(row);
    return Object.keys(out).length > 0 ? out : null;
  } catch {
    return null;
  }
}

const SCRAPED_JSON_PATH = path.join(process.cwd(), 'pseo-landing-content-scraped.json');

/** Load overrides from scraped JSON file (from scripts/scrape-pseo.mjs). Used when Supabase has no row. */
export async function getPseoOverridesFromFile(slug: string): Promise<RepurposePageOverrides | null> {
  try {
    const raw = await readFile(SCRAPED_JSON_PATH, 'utf8');
    const rows = JSON.parse(raw) as PseoLandingOverride[];
    const row = rows.find((r) => r.slug === slug);
    if (!row) return null;
    const out = rowToOverrides(row);
    return Object.keys(out).length > 0 ? out : null;
  } catch {
    return null;
  }
}

/** Fetch overrides: Supabase first, then scraped JSON file. Use to enrich repurpose pages with scraped high-intent content. */
export async function getPseoOverridesForSlug(slug: string): Promise<RepurposePageOverrides | null> {
  const fromDb = await getPseoOverrides(slug);
  if (fromDb && Object.keys(fromDb).length > 0) return fromDb;
  return getPseoOverridesFromFile(slug);
}

/** Merge overrides into a repurpose page. Only defined override fields replace page fields. */
export function mergePseoOverrides<T extends RepurposePagePartial>(
  page: T,
  overrides: RepurposePageOverrides | null
): T {
  if (!overrides) return page;
  return { ...page, ...overrides } as T;
}
