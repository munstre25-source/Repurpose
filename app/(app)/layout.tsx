import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Logo } from '@/components/logo';
import { AppNav } from './app-nav';

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo href="/dashboard" size={22} ariaLabel="Silho AI dashboard" />
            <AppNav />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">
              Home
            </Link>
            {hasClerk ? <UserButton afterSignOutUrl="/" /> : <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
