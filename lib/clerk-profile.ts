import { createServiceClient } from '@/lib/supabase/service';

/**
 * Get or create a Supabase profile for the given Clerk user id.
 * Returns the profile's uuid (used as user_id in content_sources, generations, etc.).
 */
export async function getOrCreateProfileId(clerkUserId: string): Promise<string | null> {
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_id', clerkUserId)
    .single();

  if (existing?.id) return existing.id;

  const { data: inserted, error } = await supabase
    .from('profiles')
    .insert({
      id: crypto.randomUUID(),
      clerk_id: clerkUserId,
      plan: 'free',
    })
    .select('id')
    .single();

  if (error || !inserted?.id) return null;
  return inserted.id;
}
