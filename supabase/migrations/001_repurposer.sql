-- Profiles: extended user (id from auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Voice profiles: sample texts + extracted traits
create table if not exists public.voice_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sample_texts jsonb not null default '[]',
  sentence_length text,
  emoji_usage text,
  formatting_habits text,
  tone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create index if not exists idx_voice_profiles_user_id on public.voice_profiles(user_id);

-- Content sources: raw content + analysis
create table if not exists public.content_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('blog', 'tweet', 'thread', 'youtube_transcript', 'newsletter', 'podcast', 'changelog', 'case_study')),
  raw_content text not null,
  meta jsonb default '{}',
  analysis jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_content_sources_user_id on public.content_sources(user_id);
create index if not exists idx_content_sources_created_at on public.content_sources(created_at desc);

-- Generations: one run per source + platforms
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_source_id uuid not null references public.content_sources(id) on delete cascade,
  platforms text[] not null default '{}',
  voice_profile_id uuid references public.voice_profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_generations_user_id on public.generations(user_id);
create index if not exists idx_generations_content_source_id on public.generations(content_source_id);
create index if not exists idx_generations_created_at on public.generations(created_at desc);

-- Repurposed outputs: per platform/format
create table if not exists public.repurposed_outputs (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid not null references public.generations(id) on delete cascade,
  platform text not null check (platform in ('twitter', 'linkedin', 'reddit', 'email', 'blog', 'youtube_shorts', 'seo')),
  format text not null,
  content text not null,
  meta jsonb default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_repurposed_outputs_generation_id on public.repurposed_outputs(generation_id);

-- Usage limits: per user per period (week)
create table if not exists public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  count int not null default 0,
  plan text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, period_start)
);

create index if not exists idx_usage_limits_user_period on public.usage_limits(user_id, period_start);

-- RLS
alter table public.profiles enable row level security;
alter table public.voice_profiles enable row level security;
alter table public.content_sources enable row level security;
alter table public.generations enable row level security;
alter table public.repurposed_outputs enable row level security;
alter table public.usage_limits enable row level security;

-- Profiles: own row only
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Voice profiles: own only
create policy "Users can manage own voice_profiles" on public.voice_profiles for all using (auth.uid() = user_id);

-- Content sources: own only
create policy "Users can manage own content_sources" on public.content_sources for all using (auth.uid() = user_id);

-- Generations: own only
create policy "Users can manage own generations" on public.generations for all using (auth.uid() = user_id);

-- Repurposed outputs: via generation ownership
create policy "Users can view repurposed_outputs for own generations"
  on public.repurposed_outputs for select
  using (exists (
    select 1 from public.generations g where g.id = repurposed_outputs.generation_id and g.user_id = auth.uid()
  ));
create policy "Users can insert repurposed_outputs for own generations"
  on public.repurposed_outputs for insert
  with check (exists (
    select 1 from public.generations g where g.id = repurposed_outputs.generation_id and g.user_id = auth.uid()
  ));
create policy "Users can update repurposed_outputs for own generations"
  on public.repurposed_outputs for update
  using (exists (
    select 1 from public.generations g where g.id = repurposed_outputs.generation_id and g.user_id = auth.uid()
  ));
create policy "Users can delete repurposed_outputs for own generations"
  on public.repurposed_outputs for delete
  using (exists (
    select 1 from public.generations g where g.id = repurposed_outputs.generation_id and g.user_id = auth.uid()
  ));

-- Usage limits: own only
create policy "Users can manage own usage_limits" on public.usage_limits for all using (auth.uid() = user_id);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, plan)
  values (new.id, 'free');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
