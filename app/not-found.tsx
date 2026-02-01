'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';

/** Paths that are subdomain-related; for these we show subdomain-specific 404. */
function isSubdomainPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith('/subdomain/')) return true;
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const rootHost = rootDomain.split(':')[0];
  return hostname.includes('.') && hostname.endsWith(rootHost) && hostname !== rootHost;
}

export default function NotFound() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/subdomain/')) {
      const extractedSubdomain = pathname.split('/')[2];
      if (extractedSubdomain) setSubdomain(extractedSubdomain);
    } else if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes(`.${rootDomain.split(':')[0]}`)) {
        setSubdomain(hostname.split('.')[0]);
      }
    }
  }, [pathname]);

  const showSubdomainMessage = isSubdomainPath(pathname) || subdomain;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {showSubdomainMessage && subdomain ? (
            <>
              <span className="text-blue-600">{subdomain}</span>.{rootDomain}{' '}
              doesn&apos;t exist
            </>
          ) : (
            'Page not found'
          )}
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          {showSubdomainMessage
            ? "This subdomain hasn't been created yet."
            : "This page doesn't exist or the link may be broken."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Silho AI
          </Link>
          {!showSubdomainMessage && (
            <Link
              href="/#features"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              See product
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
