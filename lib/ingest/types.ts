import type { SourceType } from '@/lib/types';

export type { SourceType };

export interface IngestInput {
  type: SourceType;
  raw: string;
  url?: string;
  title?: string;
}

export interface NormalizedPayload {
  title?: string;
  body: string;
  chunks?: string[];
}

export function normalizeRawByType(type: SourceType, raw: string): NormalizedPayload {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { body: '' };
  }
  // Simple normalization: treat first line as title for blog/newsletter if it looks like a title
  if ((type === 'blog' || type === 'newsletter') && trimmed.includes('\n')) {
    const firstLine = trimmed.split('\n')[0]?.trim() ?? '';
    const rest = trimmed.slice(firstLine.length).trim();
    if (firstLine.length < 120 && rest.length > 100) {
      return { title: firstLine, body: rest };
    }
  }
  return { body: trimmed };
}
