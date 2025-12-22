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
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      registry_items: {
        Row: {
          id: string
          name: string
          type: string
          title: string
          description: string | null
          author: string
          category_id: string | null
          registry_dependencies: string[]
          dependencies: Json
          dev_dependencies: Json
          files: Json
          iframe_height: string
          is_pro: boolean
          is_featured: boolean
          tags: string[]
          install_count: number
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: string
          title: string
          description?: string | null
          author?: string
          category_id?: string | null
          registry_dependencies?: string[]
          dependencies?: Json
          dev_dependencies?: Json
          files?: Json
          iframe_height?: string
          is_pro?: boolean
          is_featured?: boolean
          tags?: string[]
          install_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          title?: string
          description?: string | null
          author?: string
          category_id?: string | null
          registry_dependencies?: string[]
          dependencies?: Json
          dev_dependencies?: Json
          files?: Json
          iframe_height?: string
          is_pro?: boolean
          is_featured?: boolean
          tags?: string[]
          install_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'registry_items_category_id_fkey'
            columns: ['category_id']
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          registry_item_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          registry_item_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          registry_item_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_favorites_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_favorites_registry_item_id_fkey'
            columns: ['registry_item_id']
            referencedRelation: 'registry_items'
            referencedColumns: ['id']
          }
        ]
      }
      user_generations: {
        Row: {
          id: string
          user_id: string
          name: string
          prompt: string
          code: string
          model: string | null
          duration_ms: number | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          prompt: string
          code: string
          model?: string | null
          duration_ms?: number | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          prompt?: string
          code?: string
          model?: string | null
          duration_ms?: number | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_generations_user_id_fkey'
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
      increment_install_count: {
        Args: { item_name: string }
        Returns: undefined
      }
      increment_registry_view_count: {
        Args: { item_name: string }
        Returns: undefined
      }
      get_registry_item: {
        Args: { item_name: string }
        Returns: Json
      }
    }
    Enums: {
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
