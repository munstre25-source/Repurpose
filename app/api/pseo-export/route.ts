import { NextResponse } from 'next/server';
import { getRepurposePages } from '@/lib/pseo/config';

/**
 * GET /api/pseo-export
 * Returns all repurpose page copy (slug, h1, intro, description, etc.) as JSON.
 * Use for review, editing, or seeding Supabase pseo_landing_content.
 */
export async function GET() {
  const pages = getRepurposePages();
  const exportData = pages.map((p) => ({
    slug: p.slug,
    h1: p.h1,
    intro: p.intro,
    meta_description: p.description,
    why_manual_fails: p.whyManualFails,
    how_we_solve: p.howWeSolve,
    example_snippet: p.exampleSnippet,
    best_for: p.bestFor,
  }));
  return NextResponse.json(exportData);
}
