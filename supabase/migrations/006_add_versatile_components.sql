-- Migration: Add Versatile category and components
-- Adds versatile-01 (Animated Testimonials) and versatile-02 (Card Stack)

-- ============================================
-- 1. ADD Versatile category
-- ============================================

INSERT INTO categories (id, name, description, icon, display_order) VALUES
  ('versatile', 'Versatile', 'Animated testimonials, card stacks, and multipurpose sections', 'sparkles', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order;

-- ============================================
-- 2. ADD versatile components
-- ============================================

-- Versatile-01: Animated Testimonials
INSERT INTO registry_items (
  name, type, title, description, author, category_id,
  registry_dependencies, dependencies, files, iframe_height
) VALUES (
  'versatile-01',
  'registry:block',
  'Animated Testimonials',
  'Stacked image testimonials with autoplay, smooth animations, and navigation controls',
  'athrean <https://athrean.com>',
  'versatile',
  ARRAY[]::text[],
  '["framer-motion", "lucide-react"]'::jsonb,
  '[{"path": "content/components/versatile/versatile-01.tsx", "type": "registry:block", "target": "components/legos/versatile-01.tsx"}]'::jsonb,
  '600px'
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  registry_dependencies = EXCLUDED.registry_dependencies,
  dependencies = EXCLUDED.dependencies,
  files = EXCLUDED.files,
  iframe_height = EXCLUDED.iframe_height;

-- Versatile-02: Card Stack
INSERT INTO registry_items (
  name, type, title, description, author, category_id,
  registry_dependencies, dependencies, files, iframe_height
) VALUES (
  'versatile-02',
  'registry:block',
  'Card Stack',
  'Animated card stack with progress indicator, autoplay, and vertical navigation',
  'athrean <https://athrean.com>',
  'versatile',
  ARRAY[]::text[],
  '["framer-motion", "lucide-react"]'::jsonb,
  '[{"path": "content/components/versatile/versatile-02.tsx", "type": "registry:block", "target": "components/legos/versatile-02.tsx"}]'::jsonb,
  '500px'
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  registry_dependencies = EXCLUDED.registry_dependencies,
  dependencies = EXCLUDED.dependencies,
  files = EXCLUDED.files,
  iframe_height = EXCLUDED.iframe_height;
