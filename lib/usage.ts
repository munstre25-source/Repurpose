import { createServiceClient } from '@/lib/supabase/service';
import type { PlanTier } from '@/lib/types';

const FREE_GENERATIONS_PER_WEEK = 5;

function getWeekStart(d: Date): string {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

export async function getCurrentUsage(userId: string): Promise<{
  count: number;
  limit: number;
  plan: PlanTier;
  periodStart: string;
}> {
  const supabase = createServiceClient();
  const periodStart = getWeekStart(new Date());

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single();

  const plan = (profile?.plan as PlanTier) ?? 'free';

  if (plan === 'pro' || plan === 'agency') {
    return { count: 0, limit: Number.POSITIVE_INFINITY, plan, periodStart };
  }

  const { data: usage } = await supabase
    .from('usage_limits')
    .select('count')
    .eq('user_id', userId)
    .eq('period_start', periodStart)
    .single();

  const count = usage?.count ?? 0;
  return { count, limit: FREE_GENERATIONS_PER_WEEK, plan, periodStart };
}

export async function canGenerate(userId: string): Promise<boolean> {
  const { count, limit } = await getCurrentUsage(userId);
  return count < limit;
}

export async function incrementUsage(userId: string, plan: PlanTier): Promise<void> {
  if (plan === 'pro' || plan === 'agency') return;

  const supabase = createServiceClient();
  const periodStart = getWeekStart(new Date());

  const { data: existing } = await supabase
    .from('usage_limits')
    .select('id, count')
    .eq('user_id', userId)
    .eq('period_start', periodStart)
    .single();

  if (existing) {
    await supabase
      .from('usage_limits')
      .update({ count: existing.count + 1, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    await supabase.from('usage_limits').insert({
      user_id: userId,
      period_start: periodStart,
      count: 1,
      plan,
    });
  }
}
