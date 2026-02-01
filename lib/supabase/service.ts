import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using service role key.
 * Use for Clerk-backed flows where RLS (auth.uid()) is not set.
 * Never expose this client to the client bundle.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key);
}
