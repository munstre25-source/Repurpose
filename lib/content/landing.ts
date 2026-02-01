/**
 * Single source of truth for landing page content.
 * Positioned for founders, indie hackers, and builders in public.
 */

export interface FeatureBlock {
  title: string;
  highlight: string;
  description: string;
  bullets: string[];
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  tagline: string;
  cta: string;
  href: string;
  included: string[];
  highlight: boolean;
}

export interface FAQItem {
  q: string;
  a: string;
}

/** Founder-native transformations (source → output) for social proof. */
export const FOUNDER_TRANSFORMATIONS = [
  'Changelog → X thread',
  'Founder update → LinkedIn post',
  'Launch note → Reddit post',
  'Build log → Email newsletter',
  'Ship log → SEO blog expansion',
] as const;

export const LANDING_FEATURES: FeatureBlock[] = [
  {
    title: 'Voice Lock',
    highlight: 'Sound like yourself, not generic AI',
    description:
      'Paste 5–10 of your best founder updates or build-in-public posts. We extract your voice—sentence length, tone, how you ship—and apply it to every output. No corporate-speak, no influencer fluff.',
    bullets: [
      'Consistent tone across X, LinkedIn, Reddit, email',
      'No AI-ish phrasing—your voice, scaled',
      'Built for solo founders who ship in public',
    ],
  },
  {
    title: 'Platform-native output',
    highlight: 'Format that fits each channel',
    description:
      'Each platform gets the right format and limits. We show character counts per output (e.g. 280 for X) so you stay within limits before you post. One founder update, many native formats.',
    bullets: [
      'X threads + single tweets',
      'LinkedIn posts + carousel outlines',
      'Reddit value posts, email, SEO blog expansion',
      'Per-output character counts and limit warnings',
    ],
  },
  {
    title: 'One source, many outputs',
    highlight: 'Maximum distribution leverage',
    description:
      'Paste a blog or newsletter URL and we fetch it—or paste raw text. One run gives you a full set of platform-ready outputs. No manual reformatting. Ship once, distribute everywhere.',
    bullets: [
      'Import from URL (blog/newsletter) or paste text',
      'Export as Markdown, CSV, Notion, or copy',
      'Copy or export, then edit where you like',
      'Built for weekly shipping cadence',
    ],
  },
  {
    title: 'Built for founders',
    highlight: 'No clutter, no agencies',
    description:
      'Paste or paste a URL → pick audience (optional) → select platforms → generate → export. No content calendars, no analytics dashboards. Just distribution leverage for people who build and ship.',
    bullets: [
      'Audience presets: Founder (building in public), B2B SaaS',
      'Simple workflow, fast generation',
      'Not built for influencers or content farms',
    ],
  },
];

export const LANDING_PRICING: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    tagline: 'Try it. Ship a few runs.',
    cta: 'Start for free',
    href: '/sign-up',
    included: [
      '5 generations per week',
      'All platforms',
      'Export (Markdown, CSV, Notion)',
      'History, copy & export',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    tagline: 'Unlimited repurposing + your voice.',
    cta: 'Get started',
    href: '/sign-up',
    included: [
      'Never rewrite the same update again',
      'Ship once, distribute everywhere',
      'Voice Lock — sound like yourself',
      'Unlimited generations',
    ],
    highlight: true,
  },
  {
    name: 'Founder+',
    price: '$39',
    period: '/month',
    tagline: 'Everything in Pro + batch (coming soon).',
    cta: 'Get started',
    href: '/sign-up',
    included: [
      'Everything in Pro',
      'Batch repurpose (coming soon)',
      'One update → full week of distribution',
      'Dedicated support',
    ],
    highlight: false,
  },
];

export const LANDING_FAQ: FAQItem[] = [
  {
    q: 'How does the free plan work?',
    a: 'You get 5 generations per week. Each generation is one source (e.g. a changelog or founder update) turned into outputs for all selected platforms. No credit card required. Most founders who ship weekly upgrade when they hit the limit.',
  },
  {
    q: 'What is Voice Lock?',
    a: 'Paste 5–10 of your existing posts or updates. We analyze your voice (sentence length, tone, how you write) and apply it to every generated output so you sound like you, not generic AI. Available on Pro and above.',
  },
  {
    q: 'Which platforms are supported?',
    a: 'X (Twitter) threads and single tweets, LinkedIn posts and carousel outlines, Reddit value posts, email newsletters, blog/SEO expansion, YouTube Shorts scripts. All tuned for founder and indie-hacker distribution.',
  },
  {
    q: 'Can I edit outputs before publishing?',
    a: 'Yes. Copy or export as Markdown, CSV, or Notion from each generation. Edit in your preferred editor; we show character counts per output so you stay within platform limits.',
  },
  {
    q: 'Who is Silho AI for?',
    a: 'Solo founders, indie hackers, and technical builders who ship in public. If you write updates, changelogs, or launch notes and want to turn one piece into a week of distribution without manual reformatting, Silho AI is for you. It’s not built for influencers, social media agencies, or content farms.',
  },
];

/** "Built for founders shipping in public" section. */
export const BUILT_FOR_FOUNDERS = {
  heading: 'Built for founders shipping in public',
  for: [
    'Solo founders who write weekly updates or changelogs',
    'Indie hackers building in public on X and LinkedIn',
    'Technical builders who want distribution leverage without a content team',
  ],
  notFor: [
    'Influencers or personal brands focused on viral reach',
    'Social media agencies managing many clients',
    'Content farms or high-volume repackaging',
  ],
} as const;

/** Communities where our users ship—not endorsements. Used with "Popular in communities like" copy. */
export const COMMUNITIES = [
  'Indie Hackers',
  'Product Hunt',
  'Hacker News',
  'X / Twitter',
  'LinkedIn',
  'Build in public',
];
