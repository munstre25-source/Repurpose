'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signUp } from '../actions';
import { GoogleSignInButton } from '@/components/google-sign-in-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function SignupForm() {
  const [state, formAction] = useActionState(signUp, null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Get started repurposing your content</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" minLength={6} required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </CardFooter>
      </form>
      <CardFooter className="flex flex-col gap-3 pt-0">
        <GoogleSignInButton />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/auth/login" className="text-primary underline">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
