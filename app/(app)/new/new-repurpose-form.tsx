'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { createContentSource, createGeneration } from '@/app/repurpose/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PLATFORMS } from '@/lib/platforms/config';
import { THREAD_HOOKS } from '@/lib/content/hooks';

const SOURCE_TYPES = [
  { value: 'blog', label: 'Blog post' },
  { value: 'tweet', label: 'Tweet' },
  { value: 'thread', label: 'Twitter thread' },
  { value: 'youtube_transcript', label: 'YouTube transcript' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'podcast', label: 'Podcast transcript' },
  { value: 'changelog', label: 'Changelog' },
  { value: 'case_study', label: 'Case study' },
] as const;

const AUDIENCE_PRESETS = [
  { value: '', label: 'Default (from content)' },
  { value: 'Founder building in public', label: 'Founder (building in public)' },
  { value: 'B2B SaaS team', label: 'B2B SaaS' },
  { value: 'Coach or creator', label: 'Coach / Creator' },
  { value: 'Agency or marketer', label: 'Agency / Marketer' },
] as const;

export function NewRepurposeForm({
  voiceProfileId,
  canUseVoiceLock,
  hasVoiceProfile,
  usageText,
  usageCount,
  usageLimit,
  usagePlan,
}: {
  voiceProfileId: string | null;
  canUseVoiceLock: boolean;
  hasVoiceProfile: boolean;
  usageText: string;
  usageCount: number;
  usageLimit: number;
  usagePlan: string;
}) {
  const [sourceState, sourceFormAction] = useActionState(createContentSource, null);
  const sourceId = sourceState?.sourceId ?? null;
  const sourceError = sourceState?.error;
  const isFree = usagePlan === 'free';
  const atLimit = isFree && usageCount >= usageLimit;
  const nearLimit = isFree && usageLimit > 0 && usageCount >= Math.ceil(usageLimit * 0.8) && !atLimit;

  return (
    <div className="space-y-8 max-w-2xl">
      {nearLimit && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
          Founders who ship weekly usually upgrade here.{' '}
          <Link href="/#pricing" className="font-medium text-primary underline hover:no-underline">
            View plans
          </Link>
        </div>
      )}
      {!sourceId ? (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Your content</CardTitle>
            <CardDescription>Import from a URL (blog/newsletter) or paste your founder update or changelog. We’ll analyze it and then you pick platforms.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {atLimit ? (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
                You've reached your weekly limit. <Link href="/#pricing" className="font-medium text-primary underline hover:no-underline">Upgrade to keep shipping without friction</Link>.
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{usageText}</p>
            )}
            <form action={sourceFormAction} className="space-y-4">
              <div>
                <Label htmlFor="type">Content type</Label>
                <select
                  id="type"
                  name="type"
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {SOURCE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="url">Import from URL (blog or newsletter)</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://your-blog.com/post or newsletter URL..."
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">We fetch the page and use it as your source. Leave blank to paste below.</p>
              </div>
              <div>
                <Label htmlFor="raw">Content (required if not using URL)</Label>
                <textarea
                  id="raw"
                  name="raw"
                  rows={10}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Paste your post, transcript, or article... Or use a URL above for blog/newsletter."
                />
              </div>
              <div>
                <Label htmlFor="audience_preset">Audience (optional)</Label>
                <select
                  id="audience_preset"
                  name="audience_preset"
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {AUDIENCE_PRESETS.map((a) => (
                    <option key={a.value || 'default'} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">We tailor tone to this persona. Default uses your content.</p>
              </div>
              {sourceError && <p className="text-sm text-destructive">{sourceError}</p>}
              <Button type="submit" disabled={atLimit}>Analyze & continue</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Step2Form
          sourceId={sourceId}
          voiceProfileId={voiceProfileId}
          canUseVoiceLock={canUseVoiceLock}
          hasVoiceProfile={hasVoiceProfile}
          usageText={usageText}
          atLimit={atLimit}
        />
      )}
    </div>
  );
}

function Step2Form({
  sourceId,
  voiceProfileId,
  canUseVoiceLock,
  hasVoiceProfile,
  usageText,
  atLimit,
}: {
  sourceId: string;
  voiceProfileId: string | null;
  canUseVoiceLock: boolean;
  hasVoiceProfile: boolean;
  usageText: string;
  atLimit: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Select platforms</CardTitle>
          <CardDescription>Choose where to repurpose this update. Each gets a native format.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              setPending(true);
              setError(null);
              const fd = new FormData();
              fd.set('sourceId', sourceId);
              if (voiceProfileId) fd.set('voiceProfileId', voiceProfileId);
              fd.set('platforms', formData.getAll('platforms').join(','));
              const hook = formData.get('thread_hook') as string;
              if (hook) fd.set('thread_hook', hook);
              try {
                const result = await createGeneration(null, fd);
                if (result?.error) setError(result.error);
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Something went wrong');
              } finally {
                setPending(false);
              }
            }}
            className="space-y-6"
          >
            <p className="text-sm text-muted-foreground">{usageText}</p>
            {canUseVoiceLock && voiceProfileId && (
              <p className="text-sm text-muted-foreground">Voice Lock active — outputs will match your voice.</p>
            )}
            <div>
              <Label htmlFor="thread_hook">Thread / tweet hook (optional)</Label>
              <select
                id="thread_hook"
                name="thread_hook"
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {THREAD_HOOKS.map((h) => (
                  <option key={h.value || 'default'} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">Shape the opening of your thread or tweet (founder-focused angles).</p>
            </div>
            {!canUseVoiceLock && (
              <div className="relative rounded-lg border border-border/80 bg-muted/30 p-4">
                <div className="absolute inset-0 rounded-lg bg-background/80 backdrop-blur-[2px] z-10 flex items-center justify-center" aria-hidden="true" />
                <div className="relative z-0 pointer-events-none select-none">
                  <p className="text-sm font-medium text-foreground">Apply your voice</p>
                  {hasVoiceProfile ? (
                    <p className="text-xs text-muted-foreground mt-1">Voice detected. Upgrade to apply your voice to outputs.</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">Add voice samples in Settings. Upgrade to Pro to apply your voice to outputs.</p>
                  )}
                </div>
                <div className="relative z-20 mt-3">
                  <Link href="/#pricing" className="text-sm font-medium text-primary hover:underline pointer-events-auto">
                    Upgrade to apply your voice to outputs
                  </Link>
                </div>
              </div>
            )}
            <div className="space-y-3">
              <Label>Platforms</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {PLATFORMS.flatMap((p) =>
                  p.formats.map((f) => (
                    <label key={`${p.slug}-${f.id}`} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="platforms"
                        value={`${p.slug}:${f.id}`}
                        className="rounded border-input"
                      />
                      <span className="text-sm">
                        {p.name} · {f.name}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={pending || atLimit}>
              {atLimit ? 'Upgrade to keep shipping without friction' : pending ? 'Generating…' : 'Generate'}
            </Button>
            {atLimit && (
              <p className="text-sm text-muted-foreground">
                <Link href="/#pricing" className="text-primary hover:underline">View plans</Link>
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="border-dashed border-border/80 bg-muted/10">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2" title="Repurpose one update into a full week or month of distribution in one click.">
            <CardTitle className="text-base">Batch repurpose</CardTitle>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Coming soon</span>
          </div>
          <CardDescription>
            Repurpose one update into a full week or month of distribution in one click. Founder+ only.
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
