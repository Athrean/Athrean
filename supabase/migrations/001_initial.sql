-- Athrean Database Schema
-- Component Library Platform

-- Enums
create type component_source as enum ('generated', 'forked', 'saved');
create type user_plan as enum ('free', 'pro');

-- Components table (curated library)
create table components (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category text not null,
  tags text[] default '{}',
  code text not null,
  dependencies jsonb default '{}',
  preview_url text,
  is_pro boolean default false,
  view_count integer default 0,
  copy_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User components (saved/generated)
create table user_components (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  code text not null,
  prompt text,
  source component_source not null default 'saved',
  parent_id uuid references components(id) on delete set null,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Generations (AI generation log)
create table generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  prompt text not null,
  result_code text,
  model text not null,
  duration_ms integer,
  created_at timestamptz default now()
);

-- User credits
create table user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credits integer default 10,
  plan user_plan default 'free',
  updated_at timestamptz default now()
);

-- Indexes
create index idx_components_slug on components(slug);
create index idx_components_category on components(category);
create index idx_user_components_user_id on user_components(user_id);
create index idx_generations_user_id on generations(user_id);

-- Updated at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger components_updated_at
  before update on components
  for each row execute function update_updated_at();

create trigger user_components_updated_at
  before update on user_components
  for each row execute function update_updated_at();

create trigger user_credits_updated_at
  before update on user_credits
  for each row execute function update_updated_at();

-- Auto-create user_credits on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into user_credits (user_id, credits, plan)
  values (new.id, 10, 'free');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Helper functions
create or replace function increment_view_count(component_slug text)
returns void as $$
begin
  update components
  set view_count = view_count + 1
  where slug = component_slug;
end;
$$ language plpgsql security definer;

create or replace function increment_copy_count(component_slug text)
returns void as $$
begin
  update components
  set copy_count = copy_count + 1
  where slug = component_slug;
end;
$$ language plpgsql security definer;

create or replace function decrement_credits(p_user_id uuid)
returns integer as $$
declare
  remaining integer;
begin
  update user_credits
  set credits = greatest(credits - 1, 0)
  where user_id = p_user_id
  returning credits into remaining;
  
  return remaining;
end;
$$ language plpgsql security definer;

-- Row Level Security Policies

-- Components: public read
alter table components enable row level security;

create policy "Components are viewable by everyone"
  on components for select
  using (true);

create policy "Components are insertable by authenticated users"
  on components for insert
  to authenticated
  with check (true);

-- User components: owner only
alter table user_components enable row level security;

create policy "Users can view their own components"
  on user_components for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can view public components"
  on user_components for select
  using (is_public = true);

create policy "Users can insert their own components"
  on user_components for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own components"
  on user_components for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own components"
  on user_components for delete
  to authenticated
  using (auth.uid() = user_id);

-- Generations: owner only
alter table generations enable row level security;

create policy "Users can view their own generations"
  on generations for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own generations"
  on generations for insert
  to authenticated
  with check (auth.uid() = user_id);

-- User credits: owner only
alter table user_credits enable row level security;

create policy "Users can view their own credits"
  on user_credits for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own credits"
  on user_credits for update
  to authenticated
  using (auth.uid() = user_id);
