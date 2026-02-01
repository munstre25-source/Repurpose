'use client';

import { useActionState } from 'react';
import { saveVoiceProfile } from '@/app/repurpose/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function VoiceLockForm({ hasProfile }: { hasProfile: boolean }) {
  const [state, formAction] = useActionState(saveVoiceProfile, null);
  return (
    <form action={formAction} className="mt-4 space-y-4">
      <div>
        <Label htmlFor="samples">Sample founder updates (paste 5–10, separated by --- or blank lines)</Label>
        <textarea
          id="samples"
          name="samples"
          rows={8}
          className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Paste your best founder updates, threads, or build-in-public posts..."
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit">{hasProfile ? 'Update voice' : 'Extract my voice'}</Button>
    </form>
  );
}
