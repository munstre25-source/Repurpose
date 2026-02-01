'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signInWithPassword } from '../actions';
import { GoogleSignInButton } from '@/components/google-sign-in-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginForm({ next, urlError }: { next?: string; urlError?: string }) {
  const [state, formAction] = useActionState(signInWithPassword, null);
  const error = state?.error ?? urlError;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to repurpose your content</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <input type="hidden" name="next" value={next || '/dashboard'} />
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive">
              {error === 'auth_callback_error' ? 'Authentication failed.' : error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </CardFooter>
      </form>
      <CardFooter className="flex flex-col gap-3 pt-0">
        <GoogleSignInButton />
        <p className="text-center text-sm text-muted-foreground">
          No account? <Link href="/auth/signup" className="text-primary underline">Sign up</Link>
        </p>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-center text-sm">
            <Link href="/auth/dev-login" className="text-primary font-medium underline">
              Use test account (dev only) →
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
