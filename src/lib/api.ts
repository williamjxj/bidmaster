import { supabase } from './supabase'
import { Database } from '@/types/database'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

type Bid = Database['public']['Tables']['bids']['Row']
type BidInsert = Database['public']['Tables']['bids']['Insert']
type BidUpdate = Database['public']['Tables']['bids']['Update']

// Projects API
export const projectsApi = {
  // Get all projects with optional filtering
  async getProjects(filters?: {
    status?: string[]
    category?: string
    technologies?: string[]
    platform?: string
    minBudget?: number
    maxBudget?: number
    searchTerm?: string
  }) {
    const params = new URLSearchParams()
    
    if (filters?.category) {
      params.append('category', filters.category)
    }
    
    if (filters?.status && filters.status.length > 0) {
      params.append('status', filters.status.join(','))
    }
    
    if (filters?.searchTerm) {
      params.append('searchTerm', filters.searchTerm)
    }
    
    if (filters?.technologies && filters.technologies.length > 0) {
      params.append('technologies', filters.technologies.join(','))
    }
    
    if (filters?.platform) {
      params.append('platform', filters.platform)
    }
    
    if (filters?.minBudget) {
      params.append('minBudget', filters.minBudget.toString())
    }
    
    if (filters?.maxBudget) {
      params.append('maxBudget', filters.maxBudget.toString())
    }

    const response = await fetch(`/api/projects?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }

    return response.json()
  },

  // Get a single project by ID
  async getProject(id: string) {
    const response = await fetch(`/api/projects/${id}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch project')
    }

    return response.json()
  },

  // Create a new project
  async createProject(project: {
    title: string
    description?: string
    budget?: number
    budgetType?: string
    sourcePlatform: string
    sourceUrl: string
    technologies?: string[]
    category?: string
    location?: string
    postedDate?: string
    deadline?: string
    status?: string
  }) {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    })

    if (!response.ok) {
      throw new Error('Failed to create project')
    }

    return response.json()
  },

  // Update a project
  async updateProject(id: string, updates: {
    title?: string
    description?: string
    budget?: number
    budgetType?: string
    sourcePlatform?: string
    sourceUrl?: string
    technologies?: string[]
    category?: string
    location?: string
    deadline?: string
    status?: string
  }) {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error('Failed to update project')
    }

    return response.json()
  },

  // Delete a project
  async deleteProject(id: string) {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete project')
    }

    return response.json()
  },

  // Get project statistics
  async getProjectStats() {
    const response = await fetch('/api/projects/stats')
    
    if (!response.ok) {
      throw new Error('Failed to fetch project statistics')
    }

    return response.json()
  }
}

// Bids API
export const bidsApi = {
  // Get all bids with optional filtering
  async getBids(filters?: {
    status?: string[]
    projectId?: string
    searchTerm?: string
  }) {
    const params = new URLSearchParams()
    
    if (filters?.status && filters.status.length > 0) {
      params.append('status', filters.status.join(','))
    }
    
    if (filters?.projectId) {
      params.append('projectId', filters.projectId)
    }
    
    if (filters?.searchTerm) {
      params.append('searchTerm', filters.searchTerm)
    }

    const response = await fetch(`/api/bids?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch bids')
    }

    return response.json()
  },

  // Get a single bid by ID
  async getBid(id: string) {
    const response = await fetch(`/api/bids/${id}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch bid')
    }

    return response.json()
  },

  // Create a new bid
  async createBid(bid: {
    projectId: string
    bidAmount: number
    bidType?: string
    status?: string
    proposalText: string
    notes?: string
  }) {
    const response = await fetch('/api/bids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bid),
    })

    if (!response.ok) {
      throw new Error('Failed to create bid')
    }

    return response.json()
  },

  // Update a bid
  async updateBid(id: string, updates: {
    bidAmount?: number
    bidType?: string
    status?: string
    proposalText?: string
    notes?: string
  }) {
    const response = await fetch(`/api/bids/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error('Failed to update bid')
    }

    return response.json()
  },

  // Delete a bid
  async deleteBid(id: string) {
    const response = await fetch(`/api/bids/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete bid')
    }

    return response.json()
  },

  // Get bid statistics
  async getBidStats() {
    const response = await fetch('/api/bids/stats')
    
    if (!response.ok) {
      throw new Error('Failed to fetch bid statistics')
    }

    return response.json()
  }
}

// Sources API
export const sourcesApi = {
  // Get all sources
  async getSources() {
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching sources:', error)
      throw new Error('Failed to fetch sources')
    }

    return data
  },

  // Update source
  async updateSource(id: string, updates: { name?: string; url?: string; is_active?: boolean; scraping_config?: Record<string, unknown> }) {
    const { data, error } = await supabase
      .from('sources')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating source:', error)
      throw new Error('Failed to update source')
    }

    return data
  },

  // Create new source
  async createSource(source: { name: string; url: string; is_active?: boolean; scraping_config?: Record<string, unknown> }) {
    const { data, error } = await supabase
      .from('sources')
      .insert(source)
      .select()
      .single()

    if (error) {
      console.error('Error creating source:', error)
      throw new Error('Failed to create source')
    }

    return data
  },

  // Delete source
  async deleteSource(id: string) {
    const { error } = await supabase
      .from('sources')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting source:', error)
      throw new Error('Failed to delete source')
    }
  }
}

// User Preferences API (will need user ID when auth is implemented)
export const userPreferencesApi = {
  // Get user preferences
  async getUserPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle() // Use maybeSingle instead of single to handle no rows gracefully

      // Log the full response for debugging
      console.log('Supabase response:', { data, error, userId })

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        // Don't throw error for common "no rows" scenarios
        if (error.code === 'PGRST116' || error.message?.includes('no rows')) {
          console.log('No user preferences found, returning defaults')
          return {
            id: null,
            user_id: userId,
            target_technologies: [],
            target_categories: [],
            min_budget: 0,
            max_budget: 10000,
            preferred_platforms: [],
            notification_settings: {
              new_projects: true,
              bid_updates: true,
              email: false
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
        
        throw new Error(`Failed to fetch user preferences: ${error.message || 'Unknown error'}`)
      }

      // If no preferences exist, return default values
      if (!data) {
        console.log('No data returned, using defaults')
        return {
          id: null,
          user_id: userId,
          target_technologies: [],
          target_categories: [],
          min_budget: 0,
          max_budget: 10000,
          preferred_platforms: [],
          notification_settings: {
            new_projects: true,
            bid_updates: true,
            email: false
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }

      console.log('Successfully fetched user preferences:', data)
      return data
    } catch (err) {
      console.error('Exception in getUserPreferences:', err)
      // Return defaults instead of throwing to prevent page crashes
      return {
        id: null,
        user_id: userId,
        target_technologies: [],
        target_categories: [],
        min_budget: 0,
        max_budget: 10000,
        preferred_platforms: [],
        notification_settings: {
          new_projects: true,
          bid_updates: true,
          email: false
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  },

  // Create or update user preferences
  async upsertUserPreferences(userId: string, preferences: {
    target_technologies?: string[]
    target_categories?: string[]
    min_budget?: number
    max_budget?: number
    preferred_platforms?: string[]
    notification_settings?: Record<string, unknown>
  }) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating user preferences:', error)
      throw new Error('Failed to update user preferences')
    }

    return data
  }
}

// Utility function to get dashboard data
export async function getDashboardData() {
  try {
    const [projectStats, bidStats, recentProjects] = await Promise.all([
      projectsApi.getProjectStats(),
      bidsApi.getBidStats(),
      projectsApi.getProjects({ searchTerm: undefined })
    ])

    return {
      stats: {
        totalProjects: projectStats.total,
        activeApplications: bidStats.submitted,
        winRate: Math.round(bidStats.winRate),
        totalEarnings: bidStats.totalEarnings
      },
      recentProjects: recentProjects.slice(0, 5),
      projectStats,
      bidStats
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw new Error('Failed to fetch dashboard data')
  }
}
