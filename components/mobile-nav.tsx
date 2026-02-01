'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface MobileNavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  /** Links shown in the drawer (and optional CTA). */
  links: MobileNavLink[];
  /** Optional primary CTA (e.g. Get started). */
  cta?: { href: string; label: string };
  /** Optional extra node (e.g. UserButton) to show at bottom of drawer. */
  extra?: React.ReactNode;
  /** Accessibility label for menu button. */
  ariaLabel?: string;
  /** Optional class for trigger button. */
  className?: string;
}

/**
 * Hamburger menu + slide-over drawer for mobile. Hidden on md and up.
 */
export function MobileNav({ links, cta, extra, ariaLabel = 'Open menu', className }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('md:hidden', className)}
          aria-label={ariaLabel}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="fixed top-0 right-0 left-auto translate-x-0 translate-y-0 h-full w-full max-w-[min(100vw-3rem,20rem)] rounded-none border-l border-r-0 border-t-0 border-b-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-200 flex flex-col"
        onPointerDownOutside={() => setOpen(false)}
        onEscapeKeyDown={() => setOpen(false)}
      >
        <DialogTitle className="sr-only">Navigation menu</DialogTitle>
        <nav className="flex flex-col gap-1 pt-14 pb-4" aria-label="Mobile navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
            >
              {label}
            </Link>
          ))}
          {cta && (
            <div className="mt-4 px-4">
              <Link href={cta.href} onClick={() => setOpen(false)} className="block">
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                  {cta.label}
                </Button>
              </Link>
            </div>
          )}
          {extra && <div className="mt-4 px-4 pt-4 border-t border-border">{extra}</div>}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
