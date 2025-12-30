-- Migration: 008_user_projects_multi_file
-- Description: Add tables for multi-file Next.js project generation (Build Mode)
-- This enables storing complete projects with multiple files, chat history, and sync state.

-- ============================================================================
-- USER PROJECTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,

  -- Project settings
  generation_mode TEXT NOT NULL DEFAULT 'app' CHECK (generation_mode IN ('component', 'app')),
  framework TEXT DEFAULT 'nextjs',

  -- User's own Supabase integration (for generated apps)
  supabase_url TEXT,
  supabase_anon_key TEXT,

  -- Sync state for local-first storage
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'conflict')),
  local_version INTEGER DEFAULT 1,
  remote_version INTEGER DEFAULT 1,

  -- AI generation metadata
  model TEXT,
  total_tokens_used INTEGER DEFAULT 0,

  -- Visibility
  is_public BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- PROJECT FILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES user_projects(id) ON DELETE CASCADE NOT NULL,

  -- File info
  path TEXT NOT NULL,
  content TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'tsx',

  -- Versioning for sync
  version INTEGER DEFAULT 1,
  is_deleted BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Each file path must be unique within a project
  UNIQUE(project_id, path)
);

-- ============================================================================
-- PROJECT MESSAGES TABLE (Chat History)
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES user_projects(id) ON DELETE CASCADE NOT NULL,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- AI metadata (optional)
  reasoning JSONB,
  context_usage JSONB,
  tool_calls JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_projects_user ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_public ON user_projects(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_projects_updated ON user_projects(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_files_project ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_path ON project_files(project_id, path);

CREATE INDEX IF NOT EXISTS idx_project_messages_project ON project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_created ON project_messages(project_id, created_at);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;

-- User Projects Policies
CREATE POLICY "Users can view their own projects"
  ON user_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public projects"
  ON user_projects FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can insert their own projects"
  ON user_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON user_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON user_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Project Files Policies (inherit from project ownership)
CREATE POLICY "Users can view files of their projects"
  ON project_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_projects
      WHERE user_projects.id = project_files.project_id
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view files of public projects"
  ON project_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_projects
      WHERE user_projects.id = project_files.project_id
      AND user_projects.is_public = TRUE
    )
  );

CREATE POLICY "Users can insert files to their projects"
  ON project_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_projects
      WHERE user_projects.id = project_files.project_id
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update files of their projects"
  ON project_files FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_projects
      WHERE user_projects.id = project_files.project_id
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files of their projects"
  ON project_files FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_projects
      WHERE user_projects.id = project_files.project_id
      AND user_projects.user_id = auth.uid()
    )
  );

-- Project Messages Policies
CREATE POLICY "Users can view messages of their projects"
  ON project_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_projects
      WHERE user_projects.id = project_messages.project_id
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their projects"
  ON project_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_projects
      WHERE user_projects.id = project_messages.project_id
      AND user_projects.user_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at on user_projects changes
CREATE OR REPLACE FUNCTION update_user_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_projects_updated_at
  BEFORE UPDATE ON user_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_user_projects_updated_at();

-- Update updated_at on project_files changes
CREATE OR REPLACE FUNCTION update_project_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_files_updated_at
  BEFORE UPDATE ON project_files
  FOR EACH ROW
  EXECUTE FUNCTION update_project_files_updated_at();

-- Also update parent project's updated_at when files change
CREATE OR REPLACE FUNCTION update_project_on_file_change()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_projects
  SET updated_at = now()
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_on_file_change
  AFTER INSERT OR UPDATE OR DELETE ON project_files
  FOR EACH ROW
  EXECUTE FUNCTION update_project_on_file_change();
