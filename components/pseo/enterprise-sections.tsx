'use client';

/**
 * Shared enterprise-style sections for pSEO landing pages (repurpose, Tier 3, Turn).
 * Used to elevate simple content pages into proper landing pages with social proof and trust.
 */

export function PSEOStatsStrip() {
  const stats = [
    { value: '12+', label: 'Source formats' },
    { value: '9+', label: 'Target platforms' },
    { value: '1 click', label: 'Repurpose' },
    { value: 'Voice Lock', label: 'Your tone' },
  ];
  return (
    <section
      className="border-y border-border/60 bg-muted/20 py-8"
      aria-label="Key capabilities"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BENEFITS = [
  {
    title: 'One click',
    description: 'Paste once; get platform-native content for Twitter, LinkedIn, Reddit, email, and more. No manual reformatting.',
  },
  {
    title: 'Platform-native',
    description: 'Length, tone, and format match each channel so it doesn’t look like a cross-post.',
  },
  {
    title: 'Voice Lock',
    description: 'Add 5–10 sample posts so output sounds like you—not generic AI.',
  },
  {
    title: 'No content team',
    description: 'Built for founders and indie hackers who ship weekly without a content team.',
  },
];

export function PSEOBenefitsGrid() {
  return (
    <section className="py-12 md:py-16" aria-label="Why Silho AI">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h2 className="text-xl font-semibold text-foreground mb-8 text-center">
          Why teams use Silho AI
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {BENEFITS.map(({ title, description }, i) => (
            <div
              key={i}
              className="rounded-lg border border-border/60 bg-background p-5 shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PSEOSocialProof() {
  return (
    <section
      className="py-10 border-t border-border/60 bg-muted/10"
      aria-label="Social proof"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <p className="text-sm font-medium text-muted-foreground text-center mb-4">
          Trusted by founders and indie hackers
        </p>
        <blockquote className="text-center">
          <p className="text-foreground font-medium italic">
            &ldquo;One weekly update becomes a thread, a LinkedIn post, and a Reddit post. No more copying and pasting.&rdquo;
          </p>
          <footer className="text-sm text-muted-foreground mt-2">
            — Builder shipping in public
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

export function PSEOTrustStrip() {
  const items = ['No training on your data', 'Secure paste & generate', 'Cancel anytime'];
  return (
    <section
      className="py-6 border-t border-border/60"
      aria-label="Trust and security"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60" aria-hidden />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
