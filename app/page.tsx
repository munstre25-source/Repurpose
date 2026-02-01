import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import {
  LANDING_FEATURES,
  LANDING_PRICING,
  LANDING_FAQ,
  COMMUNITIES,
  BUILT_FOR_FOUNDERS,
} from '@/lib/content/landing';

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default async function HomePage() {
  const { userId } = hasClerk ? await auth() : { userId: null };
  const signedIn = hasClerk && Boolean(userId);
  const ctaHref = signedIn ? '/new' : '/sign-up';
  const ctaLabel = signedIn ? 'New repurpose' : 'Get started';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <Logo href="/" ariaLabel="Silho AI home" />
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Product
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Compare plans
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {signedIn ? (
              <>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
                <Link href="/new">
                  <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                    New repurpose
                  </Button>
                </Link>
                {hasClerk && <UserButton afterSignOutUrl="/" />}
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">
                  Log in
                </Link>
                <Link href={ctaHref}>
                  <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                    {ctaLabel}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1" role="main">
        <section className="relative overflow-hidden border-b border-border/60" aria-labelledby="hero-heading">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-orange-light),transparent)]" />
          <div className="container relative mx-auto px-4 md:px-8 py-20 md:py-28 lg:py-32">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <p className="text-sm font-medium text-muted-foreground">
                A distribution multiplier for founders
              </p>
              <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Turn one founder update into a week of{' '}
                <span className="text-primary">distribution.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Turn one changelog or founder update into X threads, LinkedIn posts, Reddit, email—without sounding generic. Ship once, distribute everywhere.
              </p>
              <p className="text-sm text-muted-foreground/90 max-w-xl mx-auto">
                Changelog → X thread · Founder update → LinkedIn · Launch note → Reddit · Build log → Email · Ship log → SEO
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href={ctaHref}>
                  <Button size="lg" className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 rounded-lg px-8">
                    {ctaLabel}
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-lg border-foreground/20">
                    See how it works
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">No credit card required</p>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-12 md:py-16" aria-label="Communities">
          <div className="container mx-auto px-4 md:px-8">
            <p className="text-center text-sm text-muted-foreground mb-8">
              Built for founders and indie hackers. Popular in communities like
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
              {COMMUNITIES.map((name) => (
                <span key={name} className="text-sm font-medium text-muted-foreground">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="built-for" className="border-b border-border/60 py-16 md:py-20 bg-muted/20" aria-labelledby="built-for-heading">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 id="built-for-heading" className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6">
                {BUILT_FOR_FOUNDERS.heading}
              </h2>
              <p className="text-muted-foreground mb-6">
                Silho AI is for solo founders, indie hackers, and technical builders who ship in public—not for influencers, agencies, or content farms.
              </p>
              <div className="grid gap-6 sm:grid-cols-2 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-2">For</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {BUILT_FOR_FOUNDERS.for.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">Not for</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {BUILT_FOR_FOUNDERS.notFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-border/60 py-20 md:py-28" aria-labelledby="features-heading">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 id="features-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Why founders use Silho AI
              </h2>
              <p className="text-lg text-muted-foreground">
                Distribution leverage without a content team. Sound like yourself, not generic AI.
              </p>
            </div>
            <div className="grid gap-12 md:grid-cols-2 lg:gap-16 max-w-6xl mx-auto">
              {LANDING_FEATURES.map((f) => (
                <Card key={f.title} className="border-border/80 bg-card shadow-sm overflow-hidden">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      <span className="text-primary font-bold text-lg">{f.title.charAt(0)}</span>
                    </div>
                    <CardTitle className="text-xl text-foreground">{f.title}</CardTitle>
                    <p className="text-sm font-medium text-primary">{f.highlight}</p>
                    <CardDescription className="text-base text-muted-foreground mt-2">
                      {f.description}
                    </CardDescription>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-4">
                      {f.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-b border-border/60 py-20 md:py-28 bg-muted/30" aria-labelledby="pricing-heading">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 id="pricing-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Simple pricing
              </h2>
              <p className="text-lg text-muted-foreground">
                Outcomes over features. Upgrade when weekly shipping outgrows the free tier.
              </p>
              <p className="mt-2">
                <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
                  Compare plans in detail →
                </Link>
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto" role="list">
              {LANDING_PRICING.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative overflow-hidden ${
                    plan.highlight
                      ? 'border-primary shadow-lg ring-2 ring-primary/20'
                      : 'border-border/80'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                      Recommended
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-foreground">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
                    <Link href={plan.href} className="mt-4 block">
                      <Button
                        className="w-full rounded-lg"
                        variant={plan.highlight ? 'default' : 'outline'}
                        size="sm"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs font-medium text-muted-foreground mb-3">What&apos;s included</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plan.included.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="text-primary">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-b border-border/60 py-20 md:py-28" aria-labelledby="faq-heading">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Frequently asked questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about Silho AI
              </p>
            </div>
            <dl className="max-w-2xl mx-auto space-y-6">
              {LANDING_FAQ.map((faq) => (
                <div key={faq.q} className="border border-border/80 rounded-lg p-6 bg-card">
                  <dt className="font-semibold text-foreground mb-2">{faq.q}</dt>
                  <dd className="text-sm text-muted-foreground">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="py-20 md:py-28" aria-labelledby="cta-heading">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center rounded-2xl bg-primary/10 border border-primary/20 p-12 md:p-16">
              <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                One update. A week of distribution.
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Create your free account and turn your first founder update into platform-native outputs in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={signedIn ? '/new' : '/sign-up'}>
                  <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8">
                    {signedIn ? 'New repurpose' : 'Start for free'}
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-lg">
                    See how it works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-border/60 py-12 md:py-16 bg-muted/20" role="contentinfo">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <p className="font-semibold text-foreground">Silho AI</p>
                <p className="text-sm text-muted-foreground mt-1">
                  For founders shipping in public. Ship once, distribute everywhere—without sounding generic.
                </p>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
                <Link href="#features" className="text-muted-foreground hover:text-foreground">Product</Link>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
                <Link href="#faq" className="text-muted-foreground hover:text-foreground">FAQ</Link>
                <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">Log in</Link>
                <Link href="/sign-up" className="text-muted-foreground hover:text-foreground">Sign up</Link>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-8">
              © {new Date().getFullYear()} Silho AI. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
