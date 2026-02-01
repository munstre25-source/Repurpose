import OpenAI from 'openai';
import { z } from 'zod';
import type { ContentAnalysis } from '@/lib/types';

const AnalysisSchema = z.object({
  topic: z.string(),
  tone: z.string(),
  audience: z.string(),
  key_points: z.array(z.string()),
  suggested_platforms: z.array(z.enum(['twitter', 'linkedin', 'reddit', 'email', 'blog', 'youtube_shorts', 'seo'])).optional(),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey: key });
}

export async function analyzeContent(
  content: string,
  options?: { title?: string; type?: string }
): Promise<ContentAnalysis> {
  const truncated = content.slice(0, 14_000);
  const prompt = `You are a content strategist. Analyze this content and return structured data only (no preamble).

Content type: ${options?.type ?? 'general'}
${options?.title ? `Title: ${options.title}\n\n` : ''}
Content:
---
${truncated}
---

Return a JSON object with exactly these keys (no other text):
- topic: one short phrase (e.g. "SaaS product launch")
- tone: e.g. professional, casual, educational, inspirational
- audience: who this is for (e.g. "founders and indie hackers")
- key_points: array of 3-7 short bullet points (one phrase each)
- suggested_platforms: array of 2-4 platform slugs from: twitter, linkedin, reddit, email, blog, youtube_shorts, seo`;

  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error('Empty analysis response');

  const parsed = JSON.parse(raw) as unknown;
  const result = AnalysisSchema.parse(parsed);
  return {
    topic: result.topic,
    tone: result.tone,
    audience: result.audience,
    key_points: result.key_points,
    suggested_platforms: result.suggested_platforms,
  };
}
