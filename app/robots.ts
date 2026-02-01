import { MetadataRoute } from 'next';
import { getBaseUrl, ROUTES_DISALLOW } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...ROUTES_DISALLOW],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
