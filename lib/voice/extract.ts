import OpenAI from 'openai';
import { z } from 'zod';
import type { VoiceProfileTraits } from '@/lib/types';

const VoiceTraitsSchema = z.object({
  sentence_length: z.string(),
  emoji_usage: z.string(),
  formatting_habits: z.string(),
  tone: z.string(),
});

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey: key });
}

export async function extractVoiceFromSamples(sampleTexts: string[]): Promise<VoiceProfileTraits> {
  const combined = sampleTexts.slice(0, 10).join('\n\n---\n\n');
  const truncated = combined.slice(0, 8000);

  const prompt = `You are a writing analyst. Analyze these sample posts from one author and extract their consistent voice traits. Output only a JSON object with these exact keys (short phrases, 1-2 sentences each):
- sentence_length: e.g. "Short punchy sentences" or "Medium, mix of short and long"
- emoji_usage: e.g. "Rare" or "Moderate, 1-2 per post" or "None"
- formatting_habits: e.g. "Line breaks between ideas" or "Bullet points, bold for emphasis"
- tone: e.g. "Direct, no-nonsense" or "Warm, conversational"

Sample posts:
---
${truncated}
---

Return only valid JSON.`;

  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You output only valid JSON. No preamble.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error('Empty voice extraction response');

  const parsed = JSON.parse(raw) as unknown;
  const result = VoiceTraitsSchema.parse(parsed);
  return {
    sentence_length: result.sentence_length,
    emoji_usage: result.emoji_usage,
    formatting_habits: result.formatting_habits,
    tone: result.tone,
  };
}
