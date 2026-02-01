'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Email/password sign up signs the user in immediately (no OAuth code).
  // Only OAuth flows use /auth/callback with ?code=.
  redirect('/dashboard');
}

export async function signInWithPassword(_prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = ((formData.get('next') as string) || '').trim() || '/dashboard';

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(next);
}

export async function signInWithOAuth(provider: 'google') {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback` },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.url) {
    redirect(data.url);
  }

  return { error: 'Could not start OAuth' };
}

/** Wrapper for form action: returns void so form type is satisfied; errors redirect with query. */
export async function signInWithGoogle() {
  const result = await signInWithOAuth('google');
  if (result?.error) {
    redirect(`/auth/login?error=${encodeURIComponent(result.error)}`);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

/** Dev only: sign in with test account from env. Use /auth/dev-login. */
export async function devSignIn(_prevState: unknown, _formData?: FormData): Promise<{ error?: string } | void> {
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'Only available in development' };
  }
  const email = process.env.DEV_TEST_EMAIL || 'test@example.com';
  const password = process.env.DEV_TEST_PASSWORD || 'testpass123';
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }
  redirect('/dashboard');
}
