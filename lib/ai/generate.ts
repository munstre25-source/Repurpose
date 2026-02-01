import OpenAI from 'openai';
import { z } from 'zod';
import type { ContentAnalysis, PlatformSlug, VoiceProfileTraits } from '@/lib/types';
import { voiceInstructions, sourceContext } from './prompts';
import { threadHookPromptFragment } from '@/lib/content/hooks';
import { TWITTER_MAX, LINKEDIN_POST_MAX } from '@/lib/platforms/config';

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey: key });
}

const bodyPreview = (body: string) => body.slice(0, 6000);

// --- Twitter thread: array of tweets, each ≤280
const TwitterThreadSchema = z.object({
  tweets: z.array(z.string().max(TWITTER_MAX)),
});
// --- Twitter single
const TwitterSingleSchema = z.object({
  tweet: z.string().max(TWITTER_MAX),
});
// --- LinkedIn post
const LinkedInPostSchema = z.object({
  post: z.string().max(LINKEDIN_POST_MAX),
});
// --- LinkedIn carousel
const LinkedInCarouselSchema = z.object({
  slides: z.array(z.object({ headline: z.string(), bullets: z.array(z.string()) })),
});
// --- Reddit
const RedditPostSchema = z.object({
  title: z.string(),
  body: z.string(),
});
// --- Email
const EmailSchema = z.object({
  subject: z.string(),
  body: z.string(),
});
// --- Blog expansion
const BlogSchema = z.object({
  title: z.string(),
  content: z.string(),
});
// --- YouTube Shorts script
const YouTubeShortsSchema = z.object({
  hook: z.string(),
  script: z.string(),
});
// --- SEO
const SEOSchema = z.object({
  meta_title: z.string().max(60),
  meta_description: z.string().max(160),
  snippet: z.string().max(320),
});

type PlatformFormat = string;

function buildSystemPrompt(
  platform: PlatformSlug,
  format: PlatformFormat,
  analysis: ContentAnalysis,
  body: string,
  voice: VoiceProfileTraits | null,
  audienceOverride?: string,
  threadHook?: string
): string {
  const base = `You are a platform-native content repurposer. Output only valid JSON. No preamble. No hallucinated facts. Do not repeat the same phrasing across outputs.`;
  const voiceBlock = voiceInstructions(voice);
  const audienceLine = audienceOverride
    ? `\nTarget audience (write for this persona): ${audienceOverride}.`
    : '';
  const hookLine = threadHook ? threadHookPromptFragment(threadHook) : '';
  const source = sourceContext(analysis, bodyPreview(body)) + audienceLine + hookLine;

  const platformRules: Record<string, string> = {
    twitter_thread: `Generate a Twitter/X thread. Each tweet must be ≤${TWITTER_MAX} characters. Number tweets 1/N, 2/N... Return JSON: { "tweets": ["...", "..."] }.${hookLine ? ' Use the thread/tweet hook instruction above for the first tweet.' : ''}`,
    twitter_single_post: `Generate a single viral hook tweet for X/Twitter. Max ${TWITTER_MAX} chars. Return JSON: { "tweet": "..." }.${hookLine ? ' Use the thread/tweet hook instruction above.' : ''}`,
    linkedin_post: `Generate a LinkedIn thought-leadership post. Use native formatting (line breaks, no markdown). First ~200 chars are visible before "see more". Max ${LINKEDIN_POST_MAX} chars. Return JSON: { "post": "..." }.`,
    linkedin_carousel: `Generate a LinkedIn carousel outline: headlines + bullet points per slide. Return JSON: { "slides": [ { "headline": "...", "bullets": ["...", "..."] } ] }.`,
    reddit_value_post: `Generate a Reddit value post. Subreddit-style, helpful, no marketing speak. Return JSON: { "title": "...", "body": "..." }.`,
    email_newsletter: `Generate an email newsletter. Return JSON: { "subject": "...", "body": "..." }. Use clear sections.`,
    blog_expansion: `Generate a blog expansion with H2/H3 structure. SEO-friendly. Return JSON: { "title": "...", "content": "..." }. Use markdown.`,
    youtube_shorts_script: `Generate a YouTube Shorts script (~60s). Hook first, then beats. Return JSON: { "hook": "...", "script": "..." }.`,
    seo_meta: `Generate SEO meta: title (≤60 chars), meta description (≤160 chars), snippet (≤320 chars). Return JSON: { "meta_title": "...", "meta_description": "...", "snippet": "..." }.`,
  };

  const key = `${platform}_${format}`;
  const rule = platformRules[key] ?? `Generate ${platform} ${format} content. Return JSON.`;

  return `${base}\n${voiceBlock}\n\n${rule}\n\nContext:${source}`;
}

function serializeOutput(platform: PlatformSlug, format: PlatformFormat, parsed: unknown): string {
  if (platform === 'twitter') {
    if (format === 'thread') {
      const t = parsed as { tweets: string[] };
      return t.tweets.map((s, i) => `${i + 1}/${t.tweets.length} ${s}`).join('\n\n');
    }
    // single_post
    return (parsed as { tweet: string }).tweet;
  }
  if (platform === 'linkedin') {
    if (format === 'carousel') {
      const s = parsed as { slides: { headline: string; bullets: string[] }[] };
      return s.slides.map((sl) => `## ${sl.headline}\n${sl.bullets.map((b) => `- ${b}`).join('\n')}`).join('\n\n');
    }
    return (parsed as { post: string }).post;
  }
  if (platform === 'reddit') {
    const r = parsed as { title: string; body: string };
    return `Title: ${r.title}\n\n${r.body}`;
  }
  if (platform === 'email') {
    const e = parsed as { subject: string; body: string };
    return `Subject: ${e.subject}\n\n${e.body}`;
  }
  if (platform === 'blog') {
    const b = parsed as { title: string; content: string };
    return `# ${b.title}\n\n${b.content}`;
  }
  if (platform === 'youtube_shorts') {
    const y = parsed as { hook: string; script: string };
    return `Hook: ${y.hook}\n\n${y.script}`;
  }
  if (platform === 'seo') {
    const s = parsed as { meta_title: string; meta_description: string; snippet: string };
    return `Title: ${s.meta_title}\nMeta: ${s.meta_description}\nSnippet: ${s.snippet}`;
  }
  return typeof parsed === 'object' && parsed !== null ? JSON.stringify(parsed) : String(parsed);
}

function parseResponse(platform: PlatformSlug, format: PlatformFormat, raw: string): unknown {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  const parsed = JSON.parse(cleaned) as unknown;

  if (platform === 'twitter') {
    if (format === 'thread') return TwitterThreadSchema.parse(parsed);
    if (format === 'single_post') return TwitterSingleSchema.parse(parsed);
    return TwitterSingleSchema.parse(parsed);
  }
  if (platform === 'linkedin') {
    if (format === 'carousel') return LinkedInCarouselSchema.parse(parsed);
    return LinkedInPostSchema.parse(parsed);
  }
  if (platform === 'reddit') return RedditPostSchema.parse(parsed);
  if (platform === 'email') return EmailSchema.parse(parsed);
  if (platform === 'blog') return BlogSchema.parse(parsed);
  if (platform === 'youtube_shorts') return YouTubeShortsSchema.parse(parsed);
  if (platform === 'seo') return SEOSchema.parse(parsed);

  return parsed;
}

export interface GenerateInput {
  platform: PlatformSlug;
  format: string;
  analysis: ContentAnalysis;
  body: string;
  voice: VoiceProfileTraits | null;
  audienceOverride?: string;
  /** Optional founder-focused hook for thread/tweet opening (from THREAD_HOOKS). */
  threadHook?: string;
}

export interface GenerateResult {
  content: string;
  meta?: { char_count?: number };
}

export async function generateForPlatform(input: GenerateInput): Promise<GenerateResult> {
  const { platform, format, analysis, body, voice, audienceOverride, threadHook } = input;
  const systemPrompt = buildSystemPrompt(platform, format, analysis, body, voice, audienceOverride, threadHook);

  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate the content now. Output only JSON.' },
    ],
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error(`Empty response for ${platform}/${format}`);

  const parsed = parseResponse(platform, format, raw);
  const content = serializeOutput(platform, format, parsed);
  return { content, meta: { char_count: content.length } };
}
