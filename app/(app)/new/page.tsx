import { getVoiceProfile, getUsage, getRecentGenerations } from '@/app/repurpose/actions';
import { NewRepurposeForm } from './new-repurpose-form';

export default async function NewPage() {
  const [voiceProfile, usage, recent] = await Promise.all([
    getVoiceProfile(),
    getUsage(),
    getRecentGenerations(1),
  ]);
  const plan = usage?.plan ?? 'free';
  const canUseVoiceLock = plan === 'pro' || plan === 'agency';
  const hasVoiceProfile = Boolean(voiceProfile?.id);
  const isFirstRun = !recent?.length;
  const usageText =
    plan === 'free'
      ? `${usage?.count ?? 0} / ${usage?.limit ?? 5} generations this week.`
      : plan
        ? `Unlimited (${plan === 'agency' ? 'Founder+' : plan} plan).`
        : '';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          New repurpose
        </h1>
        <p className="text-muted-foreground mt-1">
          {usageText || 'Paste a founder update or changelog, pick platforms, and generate.'}
        </p>
      </div>
      {isFirstRun && (
        <div className="rounded-lg border border-border/80 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Most founders start with a changelog or weekly update. Paste it below or import from a URL.
        </div>
      )}
      <NewRepurposeForm
        voiceProfileId={canUseVoiceLock ? (voiceProfile?.id ?? null) : null}
        canUseVoiceLock={canUseVoiceLock}
        hasVoiceProfile={hasVoiceProfile}
        usageText={usageText}
        usageCount={usage?.count ?? 0}
        usageLimit={usage?.limit ?? 5}
        usagePlan={plan}
      />
    </div>
  );
}
