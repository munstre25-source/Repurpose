import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClerkProvider } from '@clerk/nextjs';
import { buildMetadata } from '@/lib/seo/metadata';
import { SITE_NAME, DEFAULT_DESCRIPTION } from '@/lib/constants';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

const defaultMeta = buildMetadata({
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  path: '/',
});

export const metadata: Metadata = {
  ...defaultMeta,
  applicationName: SITE_NAME,
  keywords: [
    'content repurposing',
    'AI content repurposing by Silho AI',
    'repurpose blog to twitter',
    'repurpose to LinkedIn',
    'founder content',
    'Voice Lock',
  ],
  authors: [{ name: SITE_NAME, url: '/' }],
  creator: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const body = (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
        style={{
          backgroundColor: 'var(--background, #fafafa)',
          color: 'var(--foreground, #171717)',
        }}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ClerkProvider>{body}</ClerkProvider>;
  }
  return body;
}
