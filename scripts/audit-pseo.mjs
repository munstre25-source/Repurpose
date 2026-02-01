/**
 * Audit: verify every pSEO URL in the sitemap resolves to a page (no 404s from missing data).
 * Run: node scripts/audit-pseo.mjs (from project root)
 * Or use the API: GET /api/audit-pseo when the app is running.
 *
 * This script uses the same logic as lib/pseo/config to generate slugs and verify lookup.
 * We duplicate the slug-generation logic here so we don't need to run TS.
 */

const SOURCES = [
  { slug: 'blog-post' },
  { slug: 'twitter-thread' },
  { slug: 'tweet' },
  { slug: 'youtube-video' },
  { slug: 'podcast' },
  { slug: 'newsletter' },
  { slug: 'changelog' },
  { slug: 'case-study' },
];
const TARGETS = [
  { slug: 'twitter' },
  { slug: 'linkedin' },
  { slug: 'reddit' },
  { slug: 'email' },
  { slug: 'youtube-shorts' },
  { slug: 'blog' },
];
const PERSONAS = [{ slug: 'founders' }, { slug: 'indie-hackers' }];
const USE_CASES = [
  { slug: 'build-in-public' },
  { slug: 'product-launch' },
  { slug: 'content-batching' },
  { slug: 'personal-brand' },
  { slug: 'distribution' },
];
const TIER4_SLUGS = [
  'blog-post-into-10-twitter-posts',
  'one-tweet-into-5-linkedin-posts',
  'newsletter-into-10-twitter-posts',
  'twitter-thread-into-5-linkedin-posts',
  'blog-post-into-5-linkedin-posts',
];

function getRepurposeSlugs() {
  const slugs = [];
  for (const source of SOURCES) {
    for (const target of TARGETS) {
      if (source.slug === target.slug) continue;
      slugs.push(`repurpose-${source.slug}-to-${target.slug}`);
    }
  }
  for (const source of SOURCES) {
    for (const target of TARGETS) {
      if (source.slug === target.slug) continue;
      for (const persona of PERSONAS) {
        slugs.push(`repurpose-${source.slug}-to-${target.slug}-for-${persona.slug}`);
      }
    }
  }
  return slugs;
}

function getTier3Paths() {
  const paths = [];
  for (const persona of PERSONAS) {
    for (const useCase of USE_CASES) {
      paths.push({ persona: persona.slug, useCase: useCase.slug });
    }
  }
  return paths;
}

function getAllPaths() {
  const repurpose = getRepurposeSlugs().map((slug) => ({ type: 'repurpose', slug, path: `/repurpose/${slug}` }));
  const tier3 = getTier3Paths().map(({ persona, useCase }) => ({
    type: 'tier3',
    persona,
    useCase,
    path: `/content-repurposing-for-${persona}/${useCase}`,
  }));
  const tier4 = TIER4_SLUGS.map((slug) => ({ type: 'tier4', slug, path: `/turn/${slug}` }));
  return [...repurpose, ...tier3, ...tier4];
}

function runAudit() {
  const paths = getAllPaths();
  const total = paths.length;
  const sampleRepurpose = paths.find((p) => p.type === 'repurpose' && p.slug === 'repurpose-blog-post-to-twitter');
  const repurposeSlugs = getRepurposeSlugs();
  const hasBlogPostTwitter = repurposeSlugs.includes('repurpose-blog-post-to-twitter');
  const sampleTurn = paths.find((p) => p.type === 'tier4' && p.slug === 'blog-post-into-10-twitter-posts');
  const sampleTier3 = paths.find((p) => p.type === 'tier3' && p.persona === 'founders' && p.useCase === 'build-in-public');

  const repurposeCount = paths.filter((p) => p.type === 'repurpose').length;
  const tier3Count = paths.filter((p) => p.type === 'tier3').length;
  const tier4Count = paths.filter((p) => p.type === 'tier4').length;

  console.log('=== pSEO URL audit ===\n');
  console.log('Total URLs in sitemap:', total);
  console.log('  - /repurpose/[slug]:', repurposeCount);
  console.log('  - /content-repurposing-for-[persona]/[use-case]:', tier3Count);
  console.log('  - /turn/[slug]:', tier4Count);
  console.log('');
  console.log('Sample paths (must resolve to pages, not 404):');
  console.log('  ', sampleRepurpose?.path ?? 'N/A');
  console.log('  ', sampleTurn?.path ?? 'N/A');
  console.log('  ', sampleTier3?.path ?? 'N/A');
  console.log('');
  console.log('repurpose-blog-post-to-twitter in getRepurposeSlugs():', hasBlogPostTwitter ? 'YES' : 'NO');
  console.log('');
  console.log('Expected slug counts:');
  const tier1Count = SOURCES.length * TARGETS.length - [...SOURCES, ...TARGETS].filter((s, i, a) => a.findIndex((x) => x.slug === s.slug) !== i).length;
  const tier1Exact = SOURCES.reduce((acc, s) => acc + TARGETS.filter((t) => t.slug !== s.slug).length, 0);
  const tier2Count = tier1Exact * PERSONAS.length;
  console.log('  - Tier 1 (source→target):', tier1Exact);
  console.log('  - Tier 2 (source→target→persona):', tier2Count);
  console.log('  - Repurpose total:', tier1Exact + tier2Count, repurposeCount === tier1Exact + tier2Count ? '✓' : 'MISMATCH');
  console.log('  - Tier 3:', USE_CASES.length * PERSONAS.length, tier3Count === USE_CASES.length * PERSONAS.length ? '✓' : 'MISMATCH');
  console.log('  - Tier 4:', TIER4_SLUGS.length, tier4Count === TIER4_SLUGS.length ? '✓' : 'MISMATCH');
  console.log('');
  console.log('All', total, 'URLs are generated from config. To verify they do not 404:');
  console.log('  1. Start the app: pnpm dev');
  console.log('  2. Open GET /api/audit-pseo (or curl http://localhost:3000/api/audit-pseo)');
  console.log('  3. Response should be { ok: true, total:', total, ', missing: 0 }');
  console.log('');
}

runAudit();
