import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRepurposePageBySlug, getRepurposeSlugs, getRelatedRepurposeSlugs, EEAT_BLURB, PSEO_REPURPOSE_GENERIC_H1 } from '@/lib/pseo/config';
import { getPseoOverridesForSlug, mergePseoOverrides } from '@/lib/pseo/overrides';
import { buildMetadata } from '@/lib/seo/metadata';
import { getBaseUrl } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { PSEOStatsStrip, PSEOBenefitsGrid, PSEOSocialProof, PSEOTrustStrip } from '@/components/pseo/enterprise-sections';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render all repurpose pages at build. Unknown slugs still work via dynamicParams. */
export const dynamicParams = true;

export function generateStaticParams() {
  return getRepurposeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getRepurposePageBySlug(slug);
  const overrides = await getPseoOverridesForSlug(slug);
  const merged = mergePseoOverrides(page, overrides);
  return buildMetadata({
    title: page.title,
    description: merged.description ?? page.description,
    path: `/repurpose/${slug}`,
  });
}

export default async function PSEOPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getRepurposePageBySlug(slug);
  if (page.h1 === PSEO_REPURPOSE_GENERIC_H1) notFound();

  const overrides = await getPseoOverridesForSlug(slug);
  const pageData = mergePseoOverrides(page, overrides);

  const relatedSlugs = getRelatedRepurposeSlugs(slug, 4);
  const baseUrl = getBaseUrl();
  const pageUrl = `${baseUrl}/repurpose/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: pageData.description ?? page.description,
    url: pageUrl,
    publisher: { '@type': 'Organization', name: 'Silho AI', url: baseUrl },
    mainEntity: {
      '@type': 'Article',
      headline: pageData.h1 ?? page.h1,
      description: pageData.description ?? page.description,
      articleBody: [pageData.whyManualFails ?? page.whyManualFails, pageData.howWeSolve ?? page.howWeSolve, pageData.exampleSnippet ?? page.exampleSnippet].join(' '),
    },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background text-foreground"
      style={{ color: 'var(--foreground, #171717)', backgroundColor: 'var(--background, #fafafa)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-8">
          <Link href="/" className="font-semibold text-foreground">
            Silho AI
          </Link>
          <nav className="flex items-center gap-4" aria-label="Main">
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">
              Product
            </Link>
            <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                Get started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main
        className="flex-1 container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-3xl"
        style={{ color: 'var(--foreground, #171717)', backgroundColor: 'var(--background, #fafafa)' }}
      >
        <article>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            {pageData.h1 ?? page.h1}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {pageData.intro ?? page.intro}
          </p>

          <PSEOStatsStrip />

          <section className="mb-10 mt-10">
            <h2 className="text-xl font-semibold text-foreground mb-3">Why manual repurposing fails</h2>
            <p className="text-muted-foreground mb-4">{pageData.whyManualFails ?? page.whyManualFails}</p>
            {page.painPoints.length > 0 && (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {page.painPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-3">How Silho AI solves it</h2>
            <p className="text-muted-foreground mb-4">{pageData.howWeSolve ?? page.howWeSolve}</p>
            <p className="text-muted-foreground font-medium">What you get:</p>
            <p className="text-muted-foreground mt-1">{page.whatYouGet}</p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-3">Example</h2>
            <p className="text-muted-foreground">{pageData.exampleSnippet ?? page.exampleSnippet}</p>
          </section>

          {page.tips.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-foreground mb-3">Tips for {page.sourceLabel} → {page.targetLabel}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {page.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="mb-10">
            <p className="text-sm font-medium text-muted-foreground">
              Best for: {pageData.bestFor ?? page.bestFor}
            </p>
          </section>

          <PSEOBenefitsGrid />

          <section className="mb-10 rounded-lg border border-border/60 bg-muted/30 p-6" aria-label="About this guide">
            <h2 className="text-xl font-semibold text-foreground mb-3">About this guide</h2>
            <p className="text-muted-foreground">{EEAT_BLURB}</p>
          </section>

          <section className="mb-10" aria-label="Frequently asked questions">
            <h2 className="text-xl font-semibold text-foreground mb-4">Frequently asked questions</h2>
            <dl className="space-y-6">
              {page.faqs.map((faq, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground mb-1">{faq.question}</dt>
                  <dd className="text-muted-foreground pl-0">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <PSEOSocialProof />

          <section className="mb-12">
            <Link href="/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8">
                Repurpose your content now
              </Button>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Already have an account? <Link href="/sign-in" className="text-primary hover:underline">Log in</Link> to repurpose from your dashboard.
            </p>
          </section>

          <PSEOTrustStrip />

          {relatedSlugs.length > 0 && (
            <section className="border-t border-border/60 pt-10" aria-label="Related workflows">
              <h2 className="text-lg font-semibold text-foreground mb-4">Related workflows</h2>
              <ul className="space-y-2">
                {relatedSlugs.map((s) => {
                  const p = getRepurposePageBySlug(s);
                  if (!p) return null;
                  return (
                    <li key={s}>
                      <Link
                        href={`/repurpose/${s}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {p.h1}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4">
                <Link href="/" className="text-primary hover:underline font-medium">
                  ← Back to Silho AI
                </Link>
              </p>
            </section>
          )}
        </article>
      </main>

      <footer className="border-t border-border/60 py-8 mt-auto">
        <div className="container mx-auto px-4 md:px-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Silho AI</Link>
          {' · '}
          <Link href="/#pricing" className="hover:text-foreground">Pricing</Link>
          {' · '}
          <Link href="/sign-up" className="hover:text-foreground">Get started</Link>
        </div>
      </footer>
    </div>
  );
}
