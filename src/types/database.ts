export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string | null
          budget: number | null
          budget_type: 'fixed' | 'hourly' | null
          source_platform: string
          source_url: string
          technologies: string[] | null
          category: string | null
          location: string | null
          posted_date: string
          deadline: string | null
          status: 'new' | 'bookmarked' | 'applied' | 'in_progress' | 'won' | 'lost' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          budget?: number | null
          budget_type?: 'fixed' | 'hourly' | null
          source_platform: string
          source_url: string
          technologies?: string[] | null
          category?: string | null
          location?: string | null
          posted_date: string
          deadline?: string | null
          status?: 'new' | 'bookmarked' | 'applied' | 'in_progress' | 'won' | 'lost' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          budget?: number | null
          budget_type?: 'fixed' | 'hourly' | null
          source_platform?: string
          source_url?: string
          technologies?: string[] | null
          category?: string | null
          location?: string | null
          posted_date?: string
          deadline?: string | null
          status?: 'new' | 'bookmarked' | 'applied' | 'in_progress' | 'won' | 'lost' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          project_id: string
          user_id: string
          bid_amount: number | null
          proposal: string | null
          status: 'draft' | 'submitted' | 'accepted' | 'rejected'
          submitted_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          bid_amount?: number | null
          proposal?: string | null
          status?: 'draft' | 'submitted' | 'accepted' | 'rejected'
          submitted_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          bid_amount?: number | null
          proposal?: string | null
          status?: 'draft' | 'submitted' | 'accepted' | 'rejected'
          submitted_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sources: {
        Row: {
          id: string
          name: string
          url: string
          is_active: boolean
          last_scraped: string | null
          scraping_config: Record<string, unknown> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          is_active?: boolean
          last_scraped?: string | null
          scraping_config?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          is_active?: boolean
          last_scraped?: string | null
          scraping_config?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          target_technologies: string[] | null
          target_categories: string[] | null
          min_budget: number | null
          max_budget: number | null
          preferred_platforms: string[] | null
          notification_settings: Record<string, unknown> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_technologies?: string[] | null
          target_categories?: string[] | null
          min_budget?: number | null
          max_budget?: number | null
          preferred_platforms?: string[] | null
          notification_settings?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_technologies?: string[] | null
          target_categories?: string[] | null
          min_budget?: number | null
          max_budget?: number | null
          preferred_platforms?: string[] | null
          notification_settings?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
