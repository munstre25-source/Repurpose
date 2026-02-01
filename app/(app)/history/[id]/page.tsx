import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGenerationWithOutputs, exportGeneration } from '@/app/repurpose/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/copy-button';
import { ExportButtons } from '@/components/export-buttons';
import { getPlatform } from '@/lib/platforms/config';

export default async function GenerationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gen = await getGenerationWithOutputs(id);
  if (!gen) notFound();

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li><Link href="/dashboard" className="hover:text-foreground hover:underline">Dashboard</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/history" className="hover:text-foreground hover:underline">History</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium">Generation</li>
        </ol>
      </nav>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Generation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(gen.created_at).toLocaleString()} · {gen.status}
          </p>
        </div>
        <ExportButtons generationId={id} exportAction={exportGeneration} />
      </div>

      {gen.source && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Source</CardTitle>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Type: {gen.source.type} · {gen.source.snippet?.slice(0, 100)}…
              </p>
            </CardContent>
          </CardHeader>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Outputs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {gen.outputs.map((o) => {
            const platform = getPlatform(o.platform as 'twitter' | 'linkedin' | 'reddit' | 'email' | 'blog' | 'youtube_shorts' | 'seo');
            const content = o.content ?? '';
            const charCount = content.length;
            const maxChars = platform?.formats.find((f) => f.id === o.format)?.maxChars;
            const limitLabel = maxChars != null ? `${charCount} / ${maxChars} chars` : `${charCount} chars`;
            const overLimit = maxChars != null && charCount > maxChars;
            return (
              <Card key={o.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">
                      {platform?.name ?? o.platform} · {o.format}
                    </CardTitle>
                    <span className={`text-xs font-mono tabular-nums ${overLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {limitLabel}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded-md font-sans overflow-x-auto max-h-64 overflow-y-auto">
                    {content}
                  </pre>
                  <CopyButton text={content} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

