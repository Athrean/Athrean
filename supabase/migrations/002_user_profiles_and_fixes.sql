-- Migration: User Profiles and Fixes
-- Fixes: User creation trigger RLS issue
-- Adds: User profiles table for managing user data

-- ============================================
-- 1. FIX: User creation trigger permissions
-- ============================================

-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

-- Add INSERT policy for user_credits (needed for trigger)
create policy "Allow insert for new users"
  on user_credits for insert
  with check (true);

-- Recreate the function with proper search path
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.user_credits (user_id, credits, plan)
  values (new.id, 10, 'free');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Recreate the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- 2. ADD: User profiles table
-- ============================================

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  website text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for username lookups
create index if not exists idx_user_profiles_username on user_profiles(username);

-- Apply updated_at trigger
create trigger user_profiles_updated_at
  before update on user_profiles
  for each row execute function update_updated_at();

-- ============================================
-- 3. RLS Policies for user_profiles
-- ============================================

alter table user_profiles enable row level security;

-- Anyone can view profiles (for public profile pages)
create policy "Profiles are viewable by everyone"
  on user_profiles for select
  using (true);

-- Users can insert their own profile
create policy "Users can insert their own profile"
  on user_profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
  on user_profiles for update
  to authenticated
  using (auth.uid() = id);

-- Users can delete their own profile
create policy "Users can delete their own profile"
  on user_profiles for delete
  to authenticated
  using (auth.uid() = id);

-- ============================================
-- 4. UPDATE: handle_new_user to also create profile
-- ============================================

-- Drop and recreate to include profile creation
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

create or replace function handle_new_user()
returns trigger as $$
declare
  default_username text;
begin
  -- Generate default username from email
  default_username := split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4);

  -- Create user credits
  insert into public.user_credits (user_id, credits, plan)
  values (new.id, 10, 'free');

  -- Create user profile
  insert into public.user_profiles (id, username, display_name)
  values (
    new.id,
    default_username,
    split_part(new.email, '@', 1)
  );

  return new;
exception
  when unique_violation then
    -- If username already exists, append more random chars
    default_username := split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 8);

    insert into public.user_credits (user_id, credits, plan)
    values (new.id, 10, 'free')
    on conflict (user_id) do nothing;

    insert into public.user_profiles (id, username, display_name)
    values (new.id, default_username, split_part(new.email, '@', 1))
    on conflict (id) do nothing;

    return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- 5. Helper function: Check username availability
-- ============================================

create or replace function is_username_available(check_username text)
returns boolean as $$
begin
  return not exists (
    select 1 from public.user_profiles where username = check_username
  );
end;
$$ language plpgsql security definer;

-- ============================================
-- 6. Helper function: Update username
-- ============================================

create or replace function update_username(new_username text)
returns boolean as $$
declare
  current_user_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Check if username is available
  if exists (select 1 from public.user_profiles where username = new_username and id != current_user_id) then
    raise exception 'Username already taken';
  end if;

  -- Update username
  update public.user_profiles
  set username = new_username
  where id = current_user_id;

  return true;
end;
$$ language plpgsql security definer;

-- ============================================
-- 7. Grant necessary permissions
-- ============================================

grant usage on schema public to anon, authenticated, service_role;
grant all on public.user_profiles to authenticated, service_role;
grant all on public.user_credits to authenticated, service_role;
grant select on public.user_profiles to anon;
