'use client';

import { useActionState } from 'react';
import { devSignIn } from '../actions';
import { Button } from '@/components/ui/button';

export function DevLoginForm() {
  const [state, formAction] = useActionState(devSignIn, null);

  return (
    <form action={formAction}>
      <Button type="submit" className="w-full">
        Sign in as test user
      </Button>
      {state?.error && <p className="text-sm text-destructive mt-2">{state.error}</p>}
    </form>
  );
}
