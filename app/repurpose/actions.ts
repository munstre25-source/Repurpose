'use server';

import { auth } from '@clerk/nextjs/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getOrCreateProfileId } from '@/lib/clerk-profile';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { SourceType, PlatformSlug } from '@/lib/types';
import { normalizeRawByType } from '@/lib/ingest/types';
import { chunkText } from '@/lib/ingest/chunk';
import { fetchUrlContent } from '@/lib/ingest/fetch';
import { analyzeContent } from '@/lib/ai/analyze';
import { generateForPlatform } from '@/lib/ai/generate';
import { extractVoiceFromSamples } from '@/lib/voice/extract';
import { getCurrentUsage, canGenerate, incrementUsage } from '@/lib/usage';
import { PLATFORMS, getPlatform } from '@/lib/platforms/config';
import type { VoiceProfileTraits } from '@/lib/types';

async function getProfileId(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return getOrCreateProfileId(userId);
}

// Map UI platform + format to (platform, format) for generator
const PLATFORM_FORMATS: { platform: PlatformSlug; format: string }[] = [
  { platform: 'twitter', format: 'thread' },
  { platform: 'twitter', format: 'single_post' },
  { platform: 'linkedin', format: 'post' },
  { platform: 'linkedin', format: 'carousel' },
  { platform: 'reddit', format: 'value_post' },
  { platform: 'email', format: 'newsletter' },
  { platform: 'blog', format: 'expansion' },
  { platform: 'youtube_shorts', format: 'script' },
  { platform: 'seo', format: 'meta' },
];

function resolvePlatformFormats(selected: string[]): { platform: PlatformSlug; format: string }[] {
  return PLATFORM_FORMATS.filter((pf) => selected.includes(`${pf.platform}:${pf.format}`));
}

export async function createContentSource(prev: unknown, formData: FormData): Promise<{ error?: string; sourceId?: string }> {
  const profileId = await getProfileId();
  if (!profileId) return { error: 'Not authenticated' };
  const supabase = createServiceClient();

  const type = formData.get('type') as SourceType;
  let rawInput = (formData.get('raw') as string)?.trim();
  const url = (formData.get('url') as string)?.trim();
  const audiencePreset = (formData.get('audience_preset') as string)?.trim() || undefined;

  const urlFirst = url && (type === 'blog' || type === 'newsletter');
  if (!type) return { error: 'Content type is required' };
  if (!urlFirst && !rawInput) return { error: 'Paste content or enter a blog/newsletter URL' };

  let raw = rawInput;
  let meta: Record<string, unknown> = { audience_preset: audiencePreset };
  let title: string | undefined;

  if (url && (type === 'blog' || type === 'newsletter')) {
    try {
      const fetched = await fetchUrlContent(url);
      raw = fetched.body || raw;
      title = fetched.title;
      meta = { ...meta, url, fetched_title: fetched.title };
    } catch {
      meta = { ...meta, url, fetch_error: true };
    }
  }
  if (!raw || raw.length < 20) return { error: 'No content to analyze. Paste text or use a URL that returns readable content.' };

  const normalized = normalizeRawByType(type, raw);
  const chunks = chunkText(normalized.body);
  const bodyForAnalysis = chunks[0] ?? normalized.body;

  let analysis: { topic: string; tone: string; audience: string; key_points: string[]; suggested_platforms?: PlatformSlug[] } | null = null;
  try {
    analysis = await analyzeContent(bodyForAnalysis, { title: normalized.title ?? title, type });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Analysis failed' };
  }

  const { data: source, error } = await supabase
    .from('content_sources')
    .insert({
      user_id: profileId,
      type,
      raw_content: raw,
      meta: { ...meta, title: normalized.title ?? title },
      analysis,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  return { sourceId: source.id };
}

export async function createGeneration(
  prev: unknown,
  formData: FormData
): Promise<{ error?: string; generationId?: string }> {
  const profileId = await getProfileId();
  if (!profileId) return { error: 'Not authenticated' };
  const supabase = createServiceClient();

  const sourceId = formData.get('sourceId') as string;
  const platformsRaw = formData.get('platforms') as string;
  const voiceProfileId = (formData.get('voiceProfileId') as string) || null;
  const threadHook = (formData.get('thread_hook') as string)?.trim() || undefined;

  if (!sourceId || !platformsRaw) return { error: 'Source and platforms required' };

  const selected = platformsRaw.split(',').filter(Boolean);
  const platformFormats = resolvePlatformFormats(selected);
  if (platformFormats.length === 0) return { error: 'Select at least one platform' };

  const allowed = await canGenerate(profileId);
  if (!allowed) {
    const usage = await getCurrentUsage(profileId);
    return { error: `Usage limit reached (${usage.count}/${usage.limit} this week). Upgrade for more.` };
  }

  const { data: source } = await supabase
    .from('content_sources')
    .select('raw_content, analysis, meta')
    .eq('id', sourceId)
    .eq('user_id', profileId)
    .single();

  if (!source?.analysis) return { error: 'Source not found or not analyzed' };

  const analysis = source.analysis as { topic: string; tone: string; audience: string; key_points: string[] };
  const body = (source.raw_content as string) ?? '';
  const normalized = normalizeRawByType('blog', body);
  const bodyForGen = normalized.body;
  const sourceMeta = (source.meta as Record<string, unknown>) ?? {};
  const audienceOverride = (sourceMeta.audience_preset as string) || undefined;

  let voice: VoiceProfileTraits | null = null;
  if (voiceProfileId) {
    const { data: vp } = await supabase
      .from('voice_profiles')
      .select('sentence_length, emoji_usage, formatting_habits, tone')
      .eq('id', voiceProfileId)
      .eq('user_id', profileId)
      .single();
    if (vp) {
      voice = {
        sentence_length: vp.sentence_length ?? '',
        emoji_usage: vp.emoji_usage ?? '',
        formatting_habits: vp.formatting_habits ?? '',
        tone: vp.tone ?? '',
      };
    }
  }

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', profileId).single();
  const plan = (profile?.plan as 'free' | 'pro' | 'agency') ?? 'free';

  const { data: gen, error: genError } = await supabase
    .from('generations')
    .insert({
      user_id: profileId,
      content_source_id: sourceId,
      platforms: platformFormats.map((pf) => pf.platform),
      voice_profile_id: voiceProfileId || null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (genError || !gen) return { error: genError?.message ?? 'Failed to create generation' };

  try {
    for (const { platform, format } of platformFormats) {
      const result = await generateForPlatform({
        platform,
        format,
        analysis,
        body: bodyForGen,
        voice,
        audienceOverride,
        threadHook,
      });
      await supabase.from('repurposed_outputs').insert({
        generation_id: gen.id,
        platform,
        format,
        content: result.content,
        meta: result.meta ?? {},
      });
    }
    await supabase.from('generations').update({ status: 'completed' }).eq('id', gen.id);
    await incrementUsage(profileId, plan);
  } catch (e) {
    await supabase.from('generations').update({ status: 'failed' }).eq('id', gen.id);
    return { error: e instanceof Error ? e.message : 'Generation failed' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/history');
  redirect(`/history/${gen.id}`);
}

export async function getGenerationWithOutputs(generationId: string) {
  const profileId = await getProfileId();
  if (!profileId) return null;
  const supabase = createServiceClient();

  const { data: gen } = await supabase
    .from('generations')
    .select('id, content_source_id, status, created_at')
    .eq('id', generationId)
    .eq('user_id', profileId)
    .single();

  if (!gen) return null;

  const { data: outputs } = await supabase
    .from('repurposed_outputs')
    .select('id, platform, format, content, meta')
    .eq('generation_id', gen.id)
    .order('platform');

  const { data: source } = await supabase
    .from('content_sources')
    .select('type, raw_content, meta')
    .eq('id', gen.content_source_id)
    .single();

  return {
    id: gen.id,
    status: gen.status,
    created_at: gen.created_at,
    outputs: outputs ?? [],
    source: source ? { type: source.type, snippet: (source.raw_content as string)?.slice(0, 200), meta: source.meta } : null,
  };
}

export async function saveVoiceProfile(prev: unknown, formData: FormData): Promise<{ error?: string }> {
  const profileId = await getProfileId();
  if (!profileId) return { error: 'Not authenticated' };
  const supabase = createServiceClient();

  const samplesRaw = formData.get('samples') as string;
  const samples = samplesRaw
    ?.split(/\n---\n|\n\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 10) ?? [];

  if (samples.length < 3) return { error: 'Paste at least 3 sample posts (5–10 recommended)' };

  let traits: VoiceProfileTraits;
  try {
    traits = await extractVoiceFromSamples(samples);
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Voice extraction failed' };
  }

  const { error } = await supabase.from('voice_profiles').upsert(
    {
      user_id: profileId,
      sample_texts: samples,
      sentence_length: traits.sentence_length,
      emoji_usage: traits.emoji_usage,
      formatting_habits: traits.formatting_habits,
      tone: traits.tone,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (error) return { error: error.message };
  revalidatePath('/settings');
  revalidatePath('/new');
  return {};
}

export async function getVoiceProfile(): Promise<{
  id: string;
  sentence_length: string | null;
  emoji_usage: string | null;
  formatting_habits: string | null;
  tone: string | null;
} | null> {
  const profileId = await getProfileId();
  if (!profileId) return null;
  const supabase = createServiceClient();

  const { data } = await supabase
    .from('voice_profiles')
    .select('id, sentence_length, emoji_usage, formatting_habits, tone')
    .eq('user_id', profileId)
    .single();

  return data;
}

export async function getUsage() {
  const profileId = await getProfileId();
  if (!profileId) return null;
  return getCurrentUsage(profileId);
}

export async function getRecentGenerations(limit = 20) {
  const profileId = await getProfileId();
  if (!profileId) return [];
  const supabase = createServiceClient();

  const { data } = await supabase
    .from('generations')
    .select('id, content_source_id, status, created_at, platforms')
    .eq('user_id', profileId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getContentSource(sourceId: string) {
  const profileId = await getProfileId();
  if (!profileId) return null;
  const supabase = createServiceClient();

  const { data } = await supabase
    .from('content_sources')
    .select('id, type, raw_content, meta, analysis, created_at')
    .eq('id', sourceId)
    .eq('user_id', profileId)
    .single();

  return data;
}

const SCHEDULE_DAYS = ['Monday', 'Wednesday', 'Friday'];

export async function exportGeneration(
  generationId: string,
  format: 'markdown' | 'csv' | 'copy' | 'notion' | 'schedule'
): Promise<{ error?: string; data?: string }> {
  const gen = await getGenerationWithOutputs(generationId);
  if (!gen?.outputs?.length) return { error: 'Generation not found' };

  if (format === 'schedule') {
    const header = 'platform,format,content_snippet,suggested_date\n';
    const rows = gen.outputs.map((o, i) => {
      const snippet = (o.content ?? '').replace(/"/g, '""').slice(0, 200);
      const day = SCHEDULE_DAYS[i % SCHEDULE_DAYS.length];
      return `"${o.platform}","${o.format}","${snippet}","${day}"`;
    });
    return { data: header + rows.join('\n') };
  }

  if (format === 'markdown') {
    const md = gen.outputs
      .map((o) => `## ${o.platform} (${o.format})\n\n${o.content}`)
      .join('\n\n---\n\n');
    return { data: md };
  }

  if (format === 'notion') {
    const title = `Repurposed content · ${new Date(gen.created_at).toLocaleDateString()}`;
    const body = gen.outputs
      .map((o) => `## ${o.platform} – ${o.format}\n\n${o.content}`)
      .join('\n\n---\n\n');
    const notionMd = `# ${title}\n\n${body}`;
    return { data: notionMd };
  }

  if (format === 'csv') {
    const header = 'platform,format,content\n';
    const rows = gen.outputs
      .map((o) => `"${o.platform}","${o.format}","${(o.content ?? '').replace(/"/g, '""')}"`)
      .join('\n');
    return { data: header + rows };
  }

  // copy: plain blocks
  const blocks = gen.outputs
    .map((o) => `[${o.platform} - ${o.format}]\n${o.content}`)
    .join('\n\n---\n\n');
  return { data: blocks };
}
