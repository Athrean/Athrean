// Database types - regenerate with Supabase CLI for production:
// bunx supabase gen types typescript --project-id <your-project-id> > lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      components: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          category: string
          tags: string[]
          code: string
          dependencies: Json
          preview_url: string | null
          is_pro: boolean
          view_count: number
          copy_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          category: string
          tags?: string[]
          code: string
          dependencies?: Json
          preview_url?: string | null
          is_pro?: boolean
          view_count?: number
          copy_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          category?: string
          tags?: string[]
          code?: string
          dependencies?: Json
          preview_url?: string | null
          is_pro?: boolean
          view_count?: number
          copy_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_components: {
        Row: {
          id: string
          user_id: string
          name: string
          code: string
          prompt: string | null
          source: 'generated' | 'forked' | 'saved'
          parent_id: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          code: string
          prompt?: string | null
          source?: 'generated' | 'forked' | 'saved'
          parent_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          code?: string
          prompt?: string | null
          source?: 'generated' | 'forked' | 'saved'
          parent_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_components_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_components_parent_id_fkey'
            columns: ['parent_id']
            referencedRelation: 'components'
            referencedColumns: ['id']
          }
        ]
      }
      generations: {
        Row: {
          id: string
          user_id: string
          prompt: string
          result_code: string | null
          model: string
          duration_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          result_code?: string | null
          model: string
          duration_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          result_code?: string | null
          model?: string
          duration_ms?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'generations_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      user_credits: {
        Row: {
          user_id: string
          credits: number
          plan: 'free' | 'pro'
          updated_at: string
        }
        Insert: {
          user_id: string
          credits?: number
          plan?: 'free' | 'pro'
          updated_at?: string
        }
        Update: {
          user_id?: string
          credits?: number
          plan?: 'free' | 'pro'
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_credits_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_view_count: {
        Args: { component_slug: string }
        Returns: undefined
      }
      increment_copy_count: {
        Args: { component_slug: string }
        Returns: undefined
      }
      decrement_credits: {
        Args: { p_user_id: string }
        Returns: number
      }
      is_username_available: {
        Args: { check_username: string }
        Returns: boolean
      }
      update_username: {
        Args: { new_username: string }
        Returns: boolean
      }
    }
    Enums: {
      component_source: 'generated' | 'forked' | 'saved'
      user_plan: 'free' | 'pro'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']
