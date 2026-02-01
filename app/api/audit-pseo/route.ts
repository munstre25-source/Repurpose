import { NextResponse } from 'next/server';
import {
  getAllPSEOSlugs,
  getRepurposePageBySlug,
  getTier4PageBySlug,
  getTier3Page,
} from '@/lib/pseo/config';

/**
 * GET /api/audit-pseo
 * Verifies every pSEO URL in the sitemap resolves to a page (no 404s from missing data).
 */
export async function GET() {
  const paths = getAllPSEOSlugs();
  const missing: { path: string; reason: string }[] = [];
  let ok = 0;

  for (const { path } of paths) {
    if (path.startsWith('/repurpose/')) {
      const slug = path.replace('/repurpose/', '');
      const page = getRepurposePageBySlug(slug);
      if (!page) {
        missing.push({ path, reason: `getRepurposePageBySlug('${slug}') returned undefined` });
      } else {
        ok++;
      }
    } else if (path.startsWith('/turn/')) {
      const slug = path.replace('/turn/', '');
      const page = getTier4PageBySlug(slug);
      if (!page) {
        missing.push({ path, reason: `getTier4PageBySlug('${slug}') returned undefined` });
      } else {
        ok++;
      }
    } else if (path.startsWith('/content-repurposing/for/')) {
      const rest = path.replace('/content-repurposing/for/', '');
      const [persona, useCase] = rest.split('/');
      const page = getTier3Page(persona, useCase);
      if (!page) {
        missing.push({
          path,
          reason: `getTier3Page('${persona}', '${useCase}') returned undefined`,
        });
      } else {
        ok++;
      }
    } else {
      missing.push({ path, reason: 'Unknown path pattern' });
    }
  }

  const total = paths.length;
  const allOk = missing.length === 0;

  return NextResponse.json({
    ok: allOk,
    total,
    resolved: ok,
    missing: missing.length,
    details: missing.length > 0 ? missing : undefined,
  });
}
