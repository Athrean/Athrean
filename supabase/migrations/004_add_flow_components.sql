-- Migration: Add Flow category and new components
-- Adds ai-05 to AI category and flow-01, flow-02 to new Flow category

-- ============================================
-- 1. ADD Flow category
-- ============================================

INSERT INTO categories (id, name, description, icon, display_order) VALUES
  ('flow', 'Flow', 'Beautiful card components for travel, booking, and more', 'plane', 2)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order;

-- ============================================
-- 2. ADD new components
-- ============================================

-- AI-05: AI Input with Model Selector
INSERT INTO registry_items (
  name, type, title, description, author, category_id,
  registry_dependencies, dependencies, files, iframe_height
) VALUES (
  'ai-05',
  'registry:block',
  'AI Input with Model Selector',
  'Modern AI input textarea with model dropdown featuring Claude and OpenAI icons',
  'athrean <https://athrean.com>',
  'ai',
  ARRAY['select'],
  '[]'::jsonb,
  '[{"path": "content/components/ai/ai-05.tsx", "type": "registry:block", "target": "components/legos/ai-05.tsx"}]'::jsonb,
  '400px'
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  registry_dependencies = EXCLUDED.registry_dependencies,
  dependencies = EXCLUDED.dependencies,
  files = EXCLUDED.files,
  iframe_height = EXCLUDED.iframe_height;

-- Flow-01: Flight Card White
INSERT INTO registry_items (
  name, type, title, description, author, category_id,
  registry_dependencies, dependencies, files, iframe_height
) VALUES (
  'flow-01',
  'registry:block',
  'Flight Card White',
  'Clean white flight card with image, pricing, and like button',
  'athrean <https://athrean.com>',
  'flow',
  ARRAY[]::text[],
  '["lucide-react"]'::jsonb,
  '[{"path": "content/components/flow/flow-01.tsx", "type": "registry:block", "target": "components/legos/flow-01.tsx"}]'::jsonb,
  '700px'
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  registry_dependencies = EXCLUDED.registry_dependencies,
  dependencies = EXCLUDED.dependencies,
  files = EXCLUDED.files,
  iframe_height = EXCLUDED.iframe_height;

-- Flow-02: Flight Card Overlay
INSERT INTO registry_items (
  name, type, title, description, author, category_id,
  registry_dependencies, dependencies, files, iframe_height
) VALUES (
  'flow-02',
  'registry:block',
  'Flight Card Overlay',
  'Stunning flight card with full-bleed background and glassmorphism effects',
  'athrean <https://athrean.com>',
  'flow',
  ARRAY[]::text[],
  '["lucide-react"]'::jsonb,
  '[{"path": "content/components/flow/flow-02.tsx", "type": "registry:block", "target": "components/legos/flow-02.tsx"}]'::jsonb,
  '700px'
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  registry_dependencies = EXCLUDED.registry_dependencies,
  dependencies = EXCLUDED.dependencies,
  files = EXCLUDED.files,
  iframe_height = EXCLUDED.iframe_height;
