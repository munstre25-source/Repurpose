import type { Metadata } from 'next';
import { getBaseUrl } from '@/lib/constants';
import { SITE_NAME, DEFAULT_DESCRIPTION } from '@/lib/constants';

export interface MetaInput {
  title: string;
  description?: string;
  /** Current page path (used for openGraph/twitter url). */
  path?: string;
  /** Canonical URL path. If set, used for alternates.canonical (e.g. to canonicalize persona pages to main). */
  canonicalPath?: string;
  noIndex?: boolean;
  image?: string;
}

/**
 * Build Next.js Metadata for a page (title, description, openGraph, twitter).
 */
export function buildMetadata(input: MetaInput): Metadata {
  const { title, description = DEFAULT_DESCRIPTION, path = '', canonicalPath, noIndex = false, image } = input;
  const baseUrl = getBaseUrl();
  const pathNorm = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${pathNorm}`;
  const canonicalUrl = canonicalPath
    ? `${baseUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
    : url;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const ogImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : undefined;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    metadataBase: new URL(baseUrl),
    ...(path && { alternates: { canonical: canonicalUrl } }),
    ...(noIndex && { robots: { index: false, follow: true } }),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };

  return metadata;
}
