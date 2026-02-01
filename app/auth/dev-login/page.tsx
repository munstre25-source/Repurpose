import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DevLoginForm } from './dev-login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DevLoginPage() {
  if (process.env.NODE_ENV !== 'development') {
    redirect('/auth/login');
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect('/dashboard');
  }
  const email = process.env.DEV_TEST_EMAIL || 'test@example.com';
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Dev: Test account</CardTitle>
          <CardDescription>
            One-click sign in to reach the dashboard. Test user: {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DevLoginForm />
          <p className="text-xs text-muted-foreground">
            If sign in fails, run: <code className="bg-muted px-1 rounded">pnpm run seed:test-user</code> then try again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
