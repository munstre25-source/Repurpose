import Link from 'next/link';
import { getRecentGenerations, getUsage, getVoiceProfile } from '@/app/repurpose/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlatform } from '@/lib/platforms/config';
import { formatRelativeTime } from '@/lib/utils';

export default async function DashboardPage() {
  const [generations, usage, voiceProfile] = await Promise.all([
    getRecentGenerations(10),
    getUsage(),
    getVoiceProfile(),
  ]);

  const usageCount = usage?.count ?? 0;
  const usageLimit = usage?.limit ?? 5;
  const usagePlan = usage?.plan ?? 'free';
  const isFree = usagePlan === 'free';
  const atLimit = isFree && usageCount >= usageLimit;
  const nearLimit = isFree && usageLimit > 0 && usageCount >= Math.ceil(usageLimit * 0.8) && !atLimit;

  // Top platforms from recent generations (Hypefury/Taplio-style analytics)
  const platformCounts: Record<string, number> = {};
  for (const g of generations ?? []) {
    const platforms = (g.platforms as string[]) ?? [];
    for (const p of platforms) {
      platformCounts[p] = (platformCounts[p] ?? 0) + 1;
    }
  }
  const topPlatforms = Object.entries(platformCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([slug]) => getPlatform(slug as Parameters<typeof getPlatform>[0])?.name ?? slug);

  const isNewUser = !generations?.length;
  const hasDoneFirstRun = (generations?.length ?? 0) >= 1;
  const hasNoVoiceProfile = !voiceProfile?.id;

  return (
    <div className="space-y-8">
      {/* Onboarding: Get started (first-time users) */}
      {isNewUser && (
        <Card className="border-primary/30 bg-primary/5 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">Get started</CardTitle>
            <CardDescription>
              Turn your first founder update or changelog into platform-native content. Three steps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li className="text-foreground font-medium">Paste your first update</li>
              <p className="ml-6 text-muted-foreground text-xs">Changelog, weekly update, or any piece you want to repurpose.</p>
              <li className="text-foreground font-medium">Pick platforms</li>
              <p className="ml-6 text-muted-foreground text-xs">X, LinkedIn, Reddit, email, blog—we generate native copy for each.</p>
              <li className="text-foreground font-medium">Generate & export</li>
              <p className="ml-6 text-muted-foreground text-xs">Copy, export as Markdown/CSV/Notion, or use “Export for scheduling.”</p>
            </ol>
            <Link href={atLimit ? '/#pricing' : '/new'} className="inline-block">
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-6">
                {atLimit ? 'Upgrade to continue' : 'New repurpose'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Onboarding: Sound like yourself (after first run, no voice yet) */}
      {hasDoneFirstRun && hasNoVoiceProfile && (
        <Card className="border-border/80 bg-muted/20 overflow-hidden">
          <CardHeader className="py-4">
            <CardTitle className="text-base text-foreground">Sound like yourself</CardTitle>
            <CardDescription>
              Add 5–10 sample posts in Settings. We’ll apply your voice to every output so you don’t sound like generic AI. Pro and Founder+ only.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/settings" className="text-sm font-medium text-primary hover:underline">
              Add voice samples in Settings →
            </Link>
          </CardContent>
        </Card>
      )}

      {nearLimit && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
          Founders who ship weekly usually upgrade here.{' '}
          <Link href="/#pricing" className="font-medium text-primary underline hover:no-underline">
            View plans
          </Link>
        </div>
      )}
      {/* Page title + primary action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Your repurpose runs and usage
          </p>
        </div>
        {atLimit ? (
          <Link href="/#pricing" className="shrink-0">
            <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-6">
              Upgrade to keep shipping without friction
            </Button>
          </Link>
        ) : (
          <Link href="/new" className="shrink-0">
            <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-6">
              New repurpose
            </Button>
          </Link>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/80 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usage this week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {usagePlan === 'free'
                ? `${usageCount} / ${usageLimit}`
                : 'Unlimited'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {usagePlan === 'free'
                ? 'generations (Free plan)'
                : `${usagePlan} plan`}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/80 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {generations?.length ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              shown below (last 10)
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/80 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground capitalize">
              {usagePlan === 'agency' ? 'Founder+' : usagePlan}
            </div>
            <Link href="/settings" className="text-xs text-primary hover:underline mt-1 inline-block">
              Manage plan
            </Link>
          </CardContent>
        </Card>
        {topPlatforms.length > 0 && (
          <Card className="border-border/80 bg-card md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-foreground">
                {topPlatforms.join(', ')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From your recent runs
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent generations table */}
      <Card className="border-border/80 bg-card overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Recent runs
              </CardTitle>
              <CardDescription>
                Your latest repurpose runs. View, copy, or export outputs.
              </CardDescription>
            </div>
            <Link href="/new" className="shrink-0">
              <Button variant="outline" size="sm" className="rounded-lg">
                New repurpose
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!generations?.length ? (
            <div className="py-16 px-6 text-center">
              <p className="text-muted-foreground mb-4">
                No runs yet. Turn your first founder update or changelog into platform-native outputs.
              </p>
              <Link href={atLimit ? '/#pricing' : '/new'}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                  {atLimit ? 'Upgrade to keep shipping without friction' : 'New repurpose'}
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-4">
                <Link href="/" className="text-primary hover:underline">
                  Learn how it works
                </Link>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/10">
                    <th className="text-left font-medium text-muted-foreground py-4 px-6">
                      When
                    </th>
                    <th className="text-left font-medium text-muted-foreground py-4 px-6">
                      Platforms
                    </th>
                    <th className="text-left font-medium text-muted-foreground py-4 px-6">
                      Status
                    </th>
                    <th className="text-right font-medium text-muted-foreground py-4 px-6">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {generations.map((g) => {
                    const platformNames = (g.platforms ?? [])
                      .map((slug: string) => getPlatform(slug as Parameters<typeof getPlatform>[0])?.name ?? slug)
                      .join(', ') || '—';
                    return (
                      <tr
                        key={g.id}
                        className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-6 text-foreground">
                          <span className="font-medium">{formatRelativeTime(g.created_at)}</span>
                          <span className="text-muted-foreground text-xs block mt-0.5">
                            {new Date(g.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground max-w-[12rem] truncate" title={platformNames}>
                          {platformNames}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              g.status === 'completed'
                                ? 'bg-primary/10 text-primary'
                                : g.status === 'failed'
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {g.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/history/${g.id}`}
                            className="text-primary font-medium hover:underline"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
