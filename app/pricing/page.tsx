import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { LANDING_PRICING, LANDING_FAQ } from '@/lib/content/landing';
import { SITE_NAME } from '@/lib/constants';

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const COMPARISON_FEATURES = [
  { name: 'Generations per week', free: '5', pro: 'Unlimited', founder: 'Unlimited' },
  { name: 'Voice Lock (sound like you)', free: '—', pro: '✓', founder: '✓' },
  { name: 'All platforms (X, LinkedIn, Reddit, email, blog, Shorts, SEO)', free: '✓', pro: '✓', founder: '✓' },
  { name: 'Export (Markdown, CSV, Notion)', free: '✓', pro: '✓', founder: '✓' },
  { name: 'Export for scheduling (CSV + dates)', free: '✓', pro: '✓', founder: '✓' },
  { name: 'Thread hooks & templates', free: '✓', pro: '✓', founder: '✓' },
  { name: 'History & edit', free: '✓', pro: '✓', founder: '✓' },
  { name: 'Batch repurpose (one update → full week)', free: '—', pro: '—', founder: 'Coming soon' },
  { name: 'Support', free: 'Email', pro: 'Email', founder: 'Dedicated' },
] as const;

export default async function PricingPage() {
  const { userId } = hasClerk ? await auth() : { userId: null };
  const signedIn = hasClerk && Boolean(userId);
  const ctaHref = signedIn ? '/new' : '/sign-up';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-8">
          <Logo href="/" size={22} ariaLabel="Silho AI home" />
          <nav className="flex items-center gap-4">
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">
              Product
            </Link>
            <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Home pricing
            </Link>
            {signedIn ? (
              <Link href="/new">
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  New repurpose
                </Button>
              </Link>
            ) : (
              <Link href={ctaHref}>
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  Get started
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-5xl">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Simple pricing for founders
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Start free. Upgrade when you ship weekly. No content calendars—just paste, generate, export.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {LANDING_PRICING.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlight
                  ? 'border-primary shadow-lg ring-2 ring-primary/20'
                  : 'border-border/80 bg-card'
              }
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription>{plan.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="block">
                  <Button
                    className={
                      plan.highlight
                        ? 'w-full bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'w-full variant-outline'
                    }
                  >
                    {plan.name === 'Pro' ? 'Start 7-day Pro trial' : plan.cta}
                  </Button>
                </Link>
                {plan.name === 'Pro' && (
                  <p className="text-xs text-center text-muted-foreground">
                    Try Pro free for 7 days. No credit card required.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compare plans table (Hypefury/Taplio-style) */}
        <section className="mb-16" aria-labelledby="compare-heading">
          <h2 id="compare-heading" className="text-2xl font-bold text-foreground mb-6">
            Compare plans
          </h2>
          <div className="rounded-lg border border-border/80 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border/80">
                  <th className="text-left font-medium text-foreground py-4 px-4">Feature</th>
                  <th className="text-center font-medium text-foreground py-4 px-4">Free</th>
                  <th className="text-center font-medium text-foreground py-4 px-4 bg-primary/5">Pro</th>
                  <th className="text-center font-medium text-foreground py-4 px-4">Founder+</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr
                    key={i}
                    className={
                      i % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }
                  >
                    <td className="py-3 px-4 text-foreground">{row.name}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{row.free}</td>
                    <td className="py-3 px-4 text-center bg-primary/5">{row.pro}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{row.founder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold text-foreground mb-6">
            Frequently asked questions
          </h2>
          <dl className="space-y-6">
            {LANDING_FAQ.map((faq, i) => (
              <div key={i}>
                <dt className="font-medium text-foreground">{faq.q}</dt>
                <dd className="text-muted-foreground mt-1">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12 text-center">
          <Link href={ctaHref}>
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-8">
              {signedIn ? 'New repurpose' : 'Get started free'}
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/60 py-6 mt-auto">
        <div className="container mx-auto px-4 md:px-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            {SITE_NAME}
          </Link>
          {' · '}
          <Link href="/#features" className="hover:text-foreground">
            Product
          </Link>
          {' · '}
          <Link href="/sign-up" className="hover:text-foreground">
            Sign up
          </Link>
        </div>
      </footer>
    </div>
  );
}
