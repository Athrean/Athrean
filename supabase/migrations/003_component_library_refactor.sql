-- Migration: Component Library Refactor
-- Transforms the schema into a proper registry-based component library like shadcn/blocks.so
-- Focuses on AI components as the starting category

-- ============================================
-- 1. DROP old tables that are no longer needed
-- ============================================

-- Drop policies first
drop policy if exists "Components are viewable by everyone" on components;
drop policy if exists "Components are insertable by authenticated users" on components;
drop policy if exists "Users can view their own components" on user_components;
drop policy if exists "Users can view public components" on user_components;
drop policy if exists "Users can insert their own components" on user_components;
drop policy if exists "Users can update their own components" on user_components;
drop policy if exists "Users can delete their own components" on user_components;
drop policy if exists "Users can view their own generations" on generations;
drop policy if exists "Users can insert their own generations" on generations;

-- Drop helper functions
drop function if exists increment_view_count(text);
drop function if exists increment_copy_count(text);

-- Drop triggers
drop trigger if exists components_updated_at on components;
drop trigger if exists user_components_updated_at on user_components;

-- Drop old tables
drop table if exists user_components;
drop table if exists generations;
drop table if exists components;

-- Drop old enum
drop type if exists component_source;

-- ============================================
-- 2. CREATE new registry-based schema
-- ============================================

-- Categories table for organizing components
create table categories (
  id text primary key,
  name text not null,
  description text,
  icon text, -- icon name for display
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Registry items table (main component storage)
create table registry_items (
  id uuid primary key default gen_random_uuid(),
  name text unique not null, -- e.g., "ai-01", "ai-02"
  type text not null default 'registry:block', -- registry:block, registry:component, etc.
  title text not null, -- Human readable name
  description text,
  author text default 'athrean',
  category_id text references categories(id) on delete set null,

  -- Registry dependencies (other registry items this depends on)
  registry_dependencies text[] default '{}', -- e.g., ["button", "dropdown-menu"]

  -- NPM dependencies
  dependencies jsonb default '{}', -- e.g., {"@tabler/icons-react": "^3.0.0"}
  dev_dependencies jsonb default '{}',

  -- Component files (JSON array of file objects)
  files jsonb not null default '[]',

  -- Metadata
  iframe_height text default '400px',
  is_pro boolean default false,
  is_featured boolean default false,
  tags text[] default '{}',

  -- Analytics
  install_count integer default 0,
  view_count integer default 0,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User saved/favorited components
create table user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  registry_item_id uuid references registry_items(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, registry_item_id)
);

-- User generated components (AI generated)
create table user_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  prompt text not null,
  code text not null,

  -- Metadata
  model text, -- Which AI model was used
  duration_ms integer,
  is_public boolean default false,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 3. CREATE indexes
-- ============================================

create index idx_registry_items_name on registry_items(name);
create index idx_registry_items_category on registry_items(category_id);
create index idx_registry_items_type on registry_items(type);
create index idx_registry_items_featured on registry_items(is_featured) where is_featured = true;
create index idx_user_favorites_user on user_favorites(user_id);
create index idx_user_generations_user on user_generations(user_id);
create index idx_user_generations_public on user_generations(is_public) where is_public = true;

-- ============================================
-- 4. CREATE triggers
-- ============================================

create trigger categories_updated_at
  before update on categories
  for each row execute function update_updated_at();

create trigger registry_items_updated_at
  before update on registry_items
  for each row execute function update_updated_at();

create trigger user_generations_updated_at
  before update on user_generations
  for each row execute function update_updated_at();

-- ============================================
-- 5. CREATE helper functions
-- ============================================

-- Increment install count
create or replace function increment_install_count(item_name text)
returns void as $$
begin
  update registry_items
  set install_count = install_count + 1
  where name = item_name;
end;
$$ language plpgsql security definer;

-- Increment view count
create or replace function increment_registry_view_count(item_name text)
returns void as $$
begin
  update registry_items
  set view_count = view_count + 1
  where name = item_name;
end;
$$ language plpgsql security definer;

-- Get registry item by name (for API)
create or replace function get_registry_item(item_name text)
returns jsonb as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    '$schema', 'https://ui.shadcn.com/schema/registry-item.json',
    'name', r.name,
    'type', r.type,
    'title', r.title,
    'description', r.description,
    'author', r.author,
    'registryDependencies', r.registry_dependencies,
    'dependencies', r.dependencies,
    'devDependencies', r.dev_dependencies,
    'files', r.files,
    'categories', array[r.category_id]
  ) into result
  from registry_items r
  where r.name = item_name;

  return result;
end;
$$ language plpgsql security definer;

-- ============================================
-- 6. ROW LEVEL SECURITY
-- ============================================

-- Categories: public read
alter table categories enable row level security;

create policy "Categories are viewable by everyone"
  on categories for select
  using (true);

-- Registry items: public read
alter table registry_items enable row level security;

create policy "Registry items are viewable by everyone"
  on registry_items for select
  using (true);

-- User favorites: owner only
alter table user_favorites enable row level security;

create policy "Users can view their own favorites"
  on user_favorites for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on user_favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on user_favorites for delete
  to authenticated
  using (auth.uid() = user_id);

-- User generations: owner + public
alter table user_generations enable row level security;

create policy "Users can view their own generations"
  on user_generations for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Anyone can view public generations"
  on user_generations for select
  using (is_public = true);

create policy "Users can insert their own generations"
  on user_generations for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own generations"
  on user_generations for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own generations"
  on user_generations for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================
-- 7. SEED initial categories
-- ============================================

insert into categories (id, name, description, icon, display_order) values
  ('ai', 'AI', 'AI chat interfaces, prompts, and assistants', 'sparkles', 1);

-- Note: More categories can be added later:
-- ('file-upload', 'File Upload', 'File upload components with drag & drop', 'upload', 2),
-- ('form-layout', 'Form Layout', 'Form layouts and input components', 'form', 3),
-- ('login', 'Login', 'Authentication and login forms', 'lock', 4),
-- ('stats', 'Stats', 'Statistics and dashboard components', 'chart', 5),
-- ('dialogs', 'Dialogs', 'Modal dialogs and popups', 'square', 6),
-- ('sidebar', 'Sidebar', 'Navigation sidebars', 'layout', 7),
-- ('tables', 'Tables', 'Data tables and grids', 'table', 8);

-- ============================================
-- 8. GRANT permissions
-- ============================================

grant usage on schema public to anon, authenticated, service_role;
grant select on public.categories to anon, authenticated, service_role;
grant select on public.registry_items to anon, authenticated, service_role;
grant all on public.user_favorites to authenticated, service_role;
grant all on public.user_generations to authenticated, service_role;
