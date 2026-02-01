import type { ContentAnalysis } from '@/lib/types';
import type { VoiceProfileTraits } from '@/lib/types';

export function voiceInstructions(traits: VoiceProfileTraits | null): string {
  if (!traits) return '';
  return `
Apply this author's voice consistently:
- Sentence length: ${traits.sentence_length}
- Emoji usage: ${traits.emoji_usage}
- Formatting habits: ${traits.formatting_habits}
- Tone: ${traits.tone}
Do not sound generic or AI-ish. Match this voice in the output.`;
}

export function sourceContext(analysis: ContentAnalysis, bodyPreview: string): string {
  return `
Topic: ${analysis.topic}
Tone: ${analysis.tone}
Audience: ${analysis.audience}
Key points: ${analysis.key_points.join('; ')}

Source content (excerpt):
---
${bodyPreview}
---`;
}
