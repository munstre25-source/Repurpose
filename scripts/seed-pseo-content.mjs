#!/usr/bin/env node
/**
 * Fetch pSEO landing copy from the app (GET /api/pseo-export) and either:
 * 1. Write to pseo-landing-content.json (default)
 * 2. Upsert into Supabase pseo_landing_content (if SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set)
 *
 * Usage:
 *   node scripts/seed-pseo-content.mjs [baseUrl]
 *   BASE_URL=http://localhost:3000 node scripts/seed-pseo-content.mjs
 *
 * To seed Supabase, set env and run with --seed:
 *   SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... node scripts/seed-pseo-content.mjs --seed
 */

const baseUrl = process.env.BASE_URL || process.argv[2] || 'http://localhost:3000';
const doSeed = process.argv.includes('--seed');

async function fetchExport() {
  const url = `${baseUrl.replace(/\/$/, '')}/api/pseo-export`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function writeJson(data) {
  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.join(process.cwd(), 'pseo-landing-content.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Wrote ${data.length} rows to ${outPath}`);
}

async function seedSupabase(rows) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn('Skipping Supabase seed: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return;
  }
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const table = 'pseo_landing_content';
  let upserted = 0;
  for (const row of rows) {
    const { error } = await supabase.from(table).upsert(
      {
        slug: row.slug,
        h1: row.h1,
        intro: row.intro,
        meta_description: row.meta_description,
        why_manual_fails: row.why_manual_fails,
        how_we_solve: row.how_we_solve,
        example_snippet: row.example_snippet,
        best_for: row.best_for,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    );
    if (error) {
      console.error(`Upsert failed for ${row.slug}:`, error.message);
    } else {
      upserted++;
    }
  }
  console.log(`Upserted ${upserted}/${rows.length} rows into ${table}`);
}

(async () => {
  try {
    const data = await fetchExport();
    await writeJson(data);
    if (doSeed) await seedSupabase(data);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
