/**
 * Optional: fetch URL and extract title + text body (basic HTML strip).
 * No cheerio dependency; simple regex strip for meta and body.
 */
export async function fetchUrlContent(url: string): Promise<{ title?: string; body: string }> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SilhoAIBot/1.0' },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const html = await res.text();

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch
    ? titleMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    : undefined;

  // Remove script/style, get body-ish content
  let body = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '');

  const bodyMatch = body.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const main = bodyMatch ? bodyMatch[1] : body;
  body = main
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();

  return { title, body: body.slice(0, 100_000) };
}
