/**
 * Creates the dev test user in Supabase so you can use /auth/dev-login.
 * Run once (from project root): pnpm run seed:test-user
 * Loads .env.local from project root so you don't need to pass vars.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnvLocal() {
  const path = resolve(process.cwd(), '.env.local');
  if (!existsSync(path)) {
    console.error('.env.local not found in', process.cwd());
    return;
  }
  const content = readFileSync(path, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.DEV_TEST_EMAIL || 'test@example.com';
const password = process.env.DEV_TEST_PASSWORD || 'testpass123';

if (!url || !serviceRoleKey) {
  console.error('Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  if (error.message?.includes('already been registered')) {
    console.log('Test user already exists:', email);
    process.exit(0);
  }
  console.error('Error creating test user:', error.message);
  process.exit(1);
}

console.log('Test user created:', email);
console.log('Go to http://localhost:3000/auth/dev-login and click "Sign in as test user"');
