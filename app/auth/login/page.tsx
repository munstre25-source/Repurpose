import { LoginForm } from './login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm next={next} urlError={error} />
    </div>
  );
}
