'use client';

import Link from 'next/link';

const teal = '#0d9488';
const orange = '#ea580c';

/** Silho AI mark: profile silhouette curve + orange accent (inspired by human–AI hybrid). */
function SilhoMark({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Profile curve (silhouette) — single stroke suggesting head/visor */}
      <path
        d="M8 26c0-6 4-12 8-14 4-2 8 0 8 4 0 4-2 8-6 10-4 2-8 2-10 0"
        stroke={teal}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* AI accent: small glow/orange indicator */}
      <circle cx="22" cy="10" r="3" fill={orange} opacity={0.95} />
      <circle cx="22" cy="10" r="1.5" fill="white" opacity={0.8} />
    </svg>
  );
}

export interface LogoProps {
  /** Show only the mark (no text). */
  iconOnly?: boolean;
  /** Link wrapper; omit for no link. */
  href?: string;
  /** Size of the mark in pixels. */
  size?: number;
  /** Optional class for the container. */
  className?: string;
  /** Accessible label for the link. */
  ariaLabel?: string;
}

export function Logo({ iconOnly = false, href = '/', size = 24, className = '', ariaLabel = 'Silho AI home' }: LogoProps) {
  const content = (
    <>
      <SilhoMark size={size} className="shrink-0" />
      {!iconOnly && (
        <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          Silho AI
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2 font-semibold text-foreground ${className}`}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 font-semibold text-foreground ${className}`}>
      {content}
    </span>
  );
}
