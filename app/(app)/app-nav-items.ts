/**
 * App nav links shared by AppNav (client) and layout (server) for mobile nav.
 * Kept in a plain module so layout can import during static build.
 */
export const appNavItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/new', label: 'New repurpose' },
  { href: '/history', label: 'History' },
  { href: '/settings', label: 'Settings' },
] as const;
