import Link from 'next/link';
import { getRecentGenerations } from '@/app/repurpose/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getPlatform } from '@/lib/platforms/config';
import { formatRelativeTime } from '@/lib/utils';

export default async function HistoryPage() {
  const generations = await getRecentGenerations(30);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            History
          </h1>
          <p className="text-muted-foreground mt-1">
            All your repurpose runs. Click to view, copy, or export.
          </p>
        </div>
        <Link href="/new" className="shrink-0">
          <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-6">
            New repurpose
          </Button>
        </Link>
      </div>

      {!generations?.length ? (
        <Card className="border-border/80 bg-card">
          <CardContent className="py-16 px-6 text-center">
            <p className="text-muted-foreground mb-4">
              No generations yet. Create your first repurpose from one piece of content.
            </p>
            <Link href="/new">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                New repurpose
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              <Link href="/dashboard" className="text-primary hover:underline">
                Back to dashboard
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {generations.map((g) => {
            const platformNames = (g.platforms ?? [])
              .map((slug: string) => getPlatform(slug as Parameters<typeof getPlatform>[0])?.name ?? slug)
              .join(', ') || '—';
            return (
              <li key={g.id}>
                <Link href={`/history/${g.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors border-border/80">
                    <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-medium text-foreground block truncate">
                          {formatRelativeTime(g.created_at)} · {platformNames}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {new Date(g.created_at).toLocaleString()}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                          g.status === 'completed'
                            ? 'bg-primary/10 text-primary'
                            : g.status === 'failed'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {g.status}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
