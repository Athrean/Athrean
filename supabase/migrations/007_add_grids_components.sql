-- Migration: Add Grids category and bento grid components
-- Adds grid-01 through grid-05 with various bento grid designs

-- ============================================
-- 1. ADD Grids category
-- ============================================

INSERT INTO categories (id, name, description, icon, display_order) VALUES
  ('grids', 'Grids', 'Bento grids and dashboard layouts with stunning designs', 'layout-grid', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order;

-- ============================================
-- 2. ADD grid components
-- ============================================

-- Grid-01: Dark Infrastructure Bento
INSERT INTO registry_items (
  name, type, title, description, author, category_id,
  registry_dependencies, dependencies, files, iframe_height
) VALUES (
  'grid-01',
  'registry:block',
  'Dark Infrastructure Bento',
  'Minimal dark bento grid with analytics, stats, and feature cards',
  'athrean <https://athrean.com>',
  'grids',
  ARRAY[]::text[],
  '["framer-motion", "lucide-react"]'::jsonb,
  '[{"path": "content/components/grids/grid-01.tsx", "type": "registry:block", "target": "components/legos/grid-01.tsx"}]'::jsonb,
  '900px'
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  registry_dependencies = EXCLUDED.registry_dependencies,
  dependencies = EXCLUDED.dependencies,
  files = EXCLUDED.files,
  iframe_height = EXCLUDED.iframe_height;

-- Grid-02: Glassmorphism Workspace
INSERT INTO registry_items (
  name, type, title, description, author, category_id,
  registry_dependencies, dependencies, files, iframe_height
) VALUES (
  'grid-02',
  'registry:block',
  'Glassmorphism Workspace',
  'Light glassmorphism bento with integrations, stats, and quick actions',
  'athrean <https://athrean.com>',
  'grids',
  ARRAY[]::text[],
  '["framer-motion", "lucide-react"]'::jsonb,
  '[{"path": "content/components/grids/grid-02.tsx", "type": "registry:block", "target": "components/legos/grid-02.tsx"}]'::jsonb,
  '800px'
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  registry_dependencies = EXCLUDED.registry_dependencies,
  dependencies = EXCLUDED.dependencies,
  files = EXCLUDED.files,
  iframe_height = EXCLUDED.iframe_height;

-- Grid-03: Brutalist Agency
INSERT INTO registry_items (
  name, type, title, description, author, category_id,
  registry_dependencies, dependencies, files, iframe_height
) VALUES (
  'grid-03',
  'registry:block',
  'Brutalist Agency',
  'Bold brutalist bento with typography, projects, and audio player',
  'athrean <https://athrean.com>',
  'grids',
  ARRAY[]::text[],
  '["framer-motion", "lucide-react"]'::jsonb,
  '[{"path": "content/components/grids/grid-03.tsx", "type": "registry:block", "target": "components/legos/grid-03.tsx"}]'::jsonb,
  '900px'
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  registry_dependencies = EXCLUDED.registry_dependencies,
  dependencies = EXCLUDED.dependencies,
  files = EXCLUDED.files,
  iframe_height = EXCLUDED.iframe_height;

-- Grid-04: Neomorphic Dashboard
INSERT INTO registry_items (
  name, type, title, description, author, category_id,
  registry_dependencies, dependencies, files, iframe_height
) VALUES (
  'grid-04',
  'registry:block',
  'Neomorphic Dashboard',
  'Soft neomorphic bento with system metrics and device monitoring',
  'athrean <https://athrean.com>',
  'grids',
  ARRAY[]::text[],
  '["framer-motion", "lucide-react"]'::jsonb,
  '[{"path": "content/components/grids/grid-04.tsx", "type": "registry:block", "target": "components/legos/grid-04.tsx"}]'::jsonb,
  '850px'
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  registry_dependencies = EXCLUDED.registry_dependencies,
  dependencies = EXCLUDED.dependencies,
  files = EXCLUDED.files,
  iframe_height = EXCLUDED.iframe_height;

-- Grid-05: Social Creator
INSERT INTO registry_items (
  name, type, title, description, author, category_id,
  registry_dependencies, dependencies, files, iframe_height
) VALUES (
  'grid-05',
  'registry:block',
  'Social Creator',
  'Dark social/creative bento with posts, engagement, and trending tags',
  'athrean <https://athrean.com>',
  'grids',
  ARRAY[]::text[],
  '["framer-motion", "lucide-react"]'::jsonb,
  '[{"path": "content/components/grids/grid-05.tsx", "type": "registry:block", "target": "components/legos/grid-05.tsx"}]'::jsonb,
  '850px'
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  registry_dependencies = EXCLUDED.registry_dependencies,
  dependencies = EXCLUDED.dependencies,
  files = EXCLUDED.files,
  iframe_height = EXCLUDED.iframe_height;
