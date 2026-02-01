/**
 * App-wide constants for SEO, pSEO, and consistency.
 */

export const SITE_NAME = 'Silho AI';
export const SITE_TAGLINE = 'Write once. Ship everywhere. Without sounding generic.';
export const DEFAULT_DESCRIPTION =
  'Turn one founder update into a week of distribution. Platform-native repurposing with Voice Lock.';

/** Routes that should not be indexed (used in robots.txt). */
export const ROUTES_DISALLOW = [
  '/dashboard',
  '/new',
  '/history',
  '/history/*',
  '/settings',
  '/auth/callback',
  '/auth/dev-login',
  '/admin',
  '/api/',
] as const;

export function getBaseUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (typeof process.env.VERCEL_URL === 'string') {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
