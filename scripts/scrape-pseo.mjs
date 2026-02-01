#!/usr/bin/env node
/**
 * Scrape external URLs per pSEO slug and fill pseo_landing_content.
 *
 * 1. Reads config/pseo-scrape-urls.json: { "slug": ["url1", "url2"] }
 * 2. For each slug, fetches each URL (rate-limited), strips HTML, extracts title + paragraphs
 * 3. Optionally refines with OpenAI (OPENAI_API_KEY) into h1, intro, why_manual_fails, how_we_solve
 * 4. Writes pseo-landing-content-scraped.json and, with --seed, upserts to Supabase
 *
 * Usage:
 *   node scripts/scrape-pseo.mjs           # scrape, write JSON only
 *   node scripts/scrape-pseo.mjs --seed     # scrape + upsert to Supabase
 *   node scripts/scrape-pseo.mjs --refine   # use OpenAI to refine scraped text into schema fields
 *   node scripts/scrape-pseo.mjs --seed-only  # upsert from pseo-landing-content-scraped.json only (no scrape)
 *
 * Requires: config/pseo-scrape-urls.json with slug -> URLs (unless --seed-only).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Load .env.local and .env so vars are available without exporting
function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    const p = path.join(root, name);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, 'utf8');
    for (const line of content.split('\n')) {
      const idx = line.indexOf('=');
      if (idx <= 0) continue;
      const key = line.slice(0, idx).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
      if (process.env[key] != null) continue;
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      process.env[key] = val;
    }
  }
}
loadEnv();
const configPath = path.join(root, 'config', 'pseo-scrape-urls.json');

const USER_AGENT = 'SilhoAIBot/1.0 (content repurposing; +https://silho.ai)';
const DELAY_MS = 1800;

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    console.error(`Missing ${configPath}. Create it with: { "repurpose-youtube-video-to-reddit": ["https://..."] }`);
    process.exit(1);
  }
  const raw = fs.readFileSync(configPath, 'utf8');
  const data = JSON.parse(raw);
  const entries = Object.entries(data).filter(([k]) => !k.startsWith('_'));
  return Object.fromEntries(entries);
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.text();
}

function stripHtml(html) {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '');
  const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const main = bodyMatch ? bodyMatch[1] : text;
  text = main
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '\n$1\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
  return text.slice(0, 80000);
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return null;
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function getParagraphs(text, max = 6) {
  const chunks = text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);
  return chunks.slice(0, max);
}

function buildRowFromScraped(slug, title, h1, body, paragraphs) {
  const intro = paragraphs[0]?.slice(0, 320) || body.slice(0, 320);
  const meta = (paragraphs[0] || body).slice(0, 155);
  return {
    slug,
    h1: h1 || title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    intro: intro || null,
    meta_description: meta || null,
    why_manual_fails: paragraphs[1]?.slice(0, 500) || null,
    how_we_solve: paragraphs[2]?.slice(0, 500) || null,
    example_snippet: paragraphs[3]?.slice(0, 400) || null,
    best_for: null,
  };
}

async function refineWithOpenAI(slug, row) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return row;
  const text = [row.intro, row.why_manual_fails, row.how_we_solve].filter(Boolean).join('\n\n');
  if (!text || text.length < 100) return row;
  const prompt = `You are helping fill landing page copy for a pSEO page. Slug: ${slug}.
From the following scraped article text, extract and return ONLY valid JSON with these keys (no markdown, no explanation):
- h1: one short headline (max 80 chars)
- intro: 1-2 sentences for the lead paragraph (max 320 chars)
- meta_description: one sentence for meta description (max 155 chars)
- why_manual_fails: one short paragraph about the problem (max 500 chars)
- how_we_solve: one short paragraph about the solution (max 500 chars)

Scraped text:
${text.slice(0, 6000)}`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });
    if (!res.ok) {
      console.warn(`OpenAI ${res.status} for ${slug}, using raw scraped`);
      return row;
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return row;
    const parsed = JSON.parse(content.replace(/^```\w*\n?|\n?```$/g, ''));
    return {
      slug: row.slug,
      h1: parsed.h1 ?? row.h1,
      intro: parsed.intro ?? row.intro,
      meta_description: parsed.meta_description ?? row.meta_description,
      why_manual_fails: parsed.why_manual_fails ?? row.why_manual_fails,
      how_we_solve: parsed.how_we_solve ?? row.how_we_solve,
      example_snippet: row.example_snippet,
      best_for: row.best_for,
    };
  } catch (e) {
    console.warn(`OpenAI refine failed for ${slug}:`, e.message);
    return row;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function scrapeUrl(url) {
  const html = await fetchHtml(url);
  const title = extractTitle(html);
  const h1 = extractH1(html);
  const body = stripHtml(html);
  const paragraphs = getParagraphs(body);
  return { title, h1, body, paragraphs };
}

async function scrapeSlug(slug, urls, refine) {
  let merged = { title: null, h1: null, body: '', paragraphs: [] };
  for (const url of urls) {
    try {
      await sleep(DELAY_MS);
      const result = await scrapeUrl(url);
      merged.title = merged.title || result.title;
      merged.h1 = merged.h1 || result.h1;
      merged.body = merged.body ? merged.body + '\n\n' + result.body : result.body;
      if (result.paragraphs.length > merged.paragraphs.length) {
        merged.paragraphs = result.paragraphs;
      }
    } catch (e) {
      console.warn(`  Skip ${url}: ${e.message}`);
    }
  }
  const pars = merged.paragraphs.length ? merged.paragraphs : getParagraphs(merged.body);
  let row = buildRowFromScraped(slug, merged.title, merged.h1, merged.body, pars);
  if (refine) row = await refineWithOpenAI(slug, row);
  return row;
}

async function seedSupabase(rows) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn('Skipping Supabase: add NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY to .env.local');
    return;
  }
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const table = 'pseo_landing_content';
  let n = 0;
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
    if (error) console.error(`  ${row.slug}: ${error.message}`);
    else n++;
  }
  console.log(`Upserted ${n}/${rows.length} into ${table}`);
}

const SCRAPED_JSON_PATH = path.join(root, 'pseo-landing-content-scraped.json');

(async () => {
  const doSeed = process.argv.includes('--seed');
  const seedOnly = process.argv.includes('--seed-only');
  const refine = process.argv.includes('--refine');

  let rows;
  if (seedOnly) {
    if (!fs.existsSync(SCRAPED_JSON_PATH)) {
      console.error(`No ${SCRAPED_JSON_PATH}. Run scrape:pseo first.`);
      process.exit(1);
    }
    rows = JSON.parse(fs.readFileSync(SCRAPED_JSON_PATH, 'utf8'));
    console.log(`Loaded ${rows.length} rows from ${SCRAPED_JSON_PATH}`);
  } else {
    const config = loadConfig();
    const slugs = Object.keys(config);
    console.log(`Scraping ${slugs.length} slugs (${refine ? 'with OpenAI refine' : 'raw extract'})...`);

    rows = [];
    for (const slug of slugs) {
    const urls = Array.isArray(config[slug]) ? config[slug] : [config[slug]];
    const clean = urls.filter((u) => typeof u === 'string' && u.startsWith('http'));
    if (!clean.length) {
      console.warn(`  Skip ${slug}: no valid URLs`);
      continue;
    }
    process.stdout.write(`  ${slug}... `);
    try {
      const row = await scrapeSlug(slug, clean, refine);
      const hasContent = row.intro || row.why_manual_fails || row.how_we_solve;
      rows.push(row);
      console.log(hasContent ? 'ok' : 'ok (no content from URLs, add better URLs to config)');
    } catch (e) {
      console.log('fail:', e.message);
    }
  }

    const outPath = SCRAPED_JSON_PATH;
    fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf8');
    console.log(`Wrote ${rows.length} rows to ${outPath}`);
  }

  if ((doSeed || seedOnly) && rows.length) await seedSupabase(rows);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
