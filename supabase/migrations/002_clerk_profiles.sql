-- Clerk integration: allow profiles keyed by clerk_id (no auth.users required).
-- Existing Supabase Auth users keep their profile by id; new Clerk users get profile by clerk_id.

-- Allow profiles to exist without auth.users (for Clerk users)
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles add column if not exists clerk_id text unique;

-- Point all user_id FKs to profiles(id) instead of auth.users(id)
alter table public.content_sources drop constraint if exists content_sources_user_id_fkey;
alter table public.content_sources add constraint content_sources_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.voice_profiles drop constraint if exists voice_profiles_user_id_fkey;
alter table public.voice_profiles add constraint voice_profiles_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.generations drop constraint if exists generations_user_id_fkey;
alter table public.generations add constraint generations_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.usage_limits drop constraint if exists usage_limits_user_id_fkey;
alter table public.usage_limits add constraint usage_limits_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

-- Index for lookups by clerk_id
create index if not exists idx_profiles_clerk_id on public.profiles(clerk_id) where clerk_id is not null;
