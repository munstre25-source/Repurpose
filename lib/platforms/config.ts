import type { PlatformSlug } from '@/lib/types';

export interface PlatformSpec {
  slug: PlatformSlug;
  name: string;
  formats: { id: string; name: string; maxChars?: number }[];
  description: string;
}

export const PLATFORMS: PlatformSpec[] = [
  {
    slug: 'twitter',
    name: 'X (Twitter)',
    formats: [
      { id: 'thread', name: 'Thread', maxChars: 280 },
      { id: 'single_post', name: 'Single viral tweet', maxChars: 280 },
    ],
    description: 'Thread or single tweet, 280 chars per tweet',
  },
  {
    slug: 'linkedin',
    name: 'LinkedIn',
    formats: [
      { id: 'post', name: 'Thought-leadership post', maxChars: 3000 },
      { id: 'carousel', name: 'Carousel outline', maxChars: 3000 },
    ],
    description: 'Post or carousel outline, ~200 char lead visible',
  },
  {
    slug: 'reddit',
    name: 'Reddit',
    formats: [{ id: 'value_post', name: 'Value post', maxChars: 40000 }],
    description: 'Subreddit-style value post, no marketing speak',
  },
  {
    slug: 'email',
    name: 'Email newsletter',
    formats: [{ id: 'newsletter', name: 'Newsletter', maxChars: 50000 }],
    description: 'Subject + body, sections',
  },
  {
    slug: 'blog',
    name: 'Blog expansion',
    formats: [{ id: 'expansion', name: 'Expansion', maxChars: 50000 }],
    description: 'H2/H3, SEO-friendly',
  },
  {
    slug: 'youtube_shorts',
    name: 'YouTube Shorts',
    formats: [{ id: 'script', name: 'Short script', maxChars: 1500 }],
    description: 'Hook + beats, ~60s',
  },
  {
    slug: 'seo',
    name: 'SEO meta',
    formats: [
      { id: 'meta', name: 'Meta + snippet', maxChars: 320 },
    ],
    description: 'Meta title, description, snippet',
  },
];

export const PLATFORM_SLUGS = PLATFORMS.map((p) => p.slug) as PlatformSlug[];

export function getPlatform(slug: PlatformSlug): PlatformSpec | undefined {
  return PLATFORMS.find((p) => p.slug === slug);
}

export const TWITTER_MAX = 280;
export const LINKEDIN_POST_MAX = 3000;
export const LINKEDIN_LEAD_VISIBLE = 200;
