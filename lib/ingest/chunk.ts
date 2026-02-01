/**
 * Safe chunking for long content. ~4 chars per token rough estimate; target ~3500 tokens (~14k chars) per chunk.
 */
const MAX_CHUNK_CHARS = 12_000;
const OVERLAP_CHARS = 200;

export function chunkText(text: string): string[] {
  if (!text.trim()) return [];
  if (text.length <= MAX_CHUNK_CHARS) return [text];

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + MAX_CHUNK_CHARS, text.length);

    if (end < text.length) {
      // Prefer breaking at paragraph or sentence
      const slice = text.slice(start, end);
      const lastPara = slice.lastIndexOf('\n\n');
      const lastSentence = Math.max(
        slice.lastIndexOf('. '),
        slice.lastIndexOf('.\n'),
        slice.lastIndexOf('! '),
        slice.lastIndexOf('? ')
      );
      const breakAt = Math.max(lastPara, lastSentence);
      if (breakAt > MAX_CHUNK_CHARS / 2) {
        end = start + breakAt + 1;
      }
    }

    chunks.push(text.slice(start, end).trim());
    start = end - (end < text.length ? OVERLAP_CHARS : 0);
    if (start >= text.length) break;
  }

  return chunks.filter(Boolean);
}
