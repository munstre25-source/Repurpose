import Link from 'next/link';
import { getVoiceProfile, getUsage } from '@/app/repurpose/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceLockForm } from './voice-lock-form';

export default async function SettingsPage() {
  const [voiceProfile, usage] = await Promise.all([getVoiceProfile(), getUsage()]);

  const planLabel = usage?.plan === 'agency' ? 'Founder+' : (usage?.plan ?? 'Free');

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Plan, usage, and Voice Lock
        </p>
      </div>

      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="text-base">Plan & usage</CardTitle>
          <CardDescription>
            {usage
              ? usage.plan === 'free'
                ? `${usage.count} / ${usage.limit} generations this week`
                : `Unlimited (${planLabel})`
              : '—'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Free: 5 runs/week. Pro: unlimited + Voice Lock (sound like yourself). Founder+: batch repurpose (coming soon).
          </p>
          <Link
            href="/#pricing"
            className="inline-block mt-2 text-sm text-primary hover:underline"
          >
            View plans & upgrade
          </Link>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="text-base">Voice Lock</CardTitle>
          <CardDescription>
            Paste 5–10 of your founder updates or build-in-public posts. We extract your voice and apply it to all outputs (Pro and above).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {voiceProfile ? (
            <div className="space-y-2 text-sm rounded-lg bg-muted/50 p-4 mb-4">
              <p className="font-medium text-foreground">{usage?.plan === 'free' ? 'Voice detected — upgrade to Pro to apply it to outputs' : 'Voice active'}</p>
              <p className="text-muted-foreground">Sentence length: {voiceProfile.sentence_length ?? '—'}</p>
              <p className="text-muted-foreground">Tone: {voiceProfile.tone ?? '—'}</p>
            </div>
          ) : null}
          <VoiceLockForm hasProfile={!!voiceProfile} />
        </CardContent>
      </Card>
    </div>
  );
}
