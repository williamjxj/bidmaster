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
    let query = supabase
      .from('projects')
      .select('*')
      .order('posted_date', { ascending: false })

    if (filters) {
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status)
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters.platform) {
        query = query.eq('source_platform', filters.platform)
      }
      
      if (filters.minBudget) {
        query = query.gte('budget', filters.minBudget)
      }
      
      if (filters.maxBudget) {
        query = query.lte('budget', filters.maxBudget)
      }
      
      if (filters.technologies && filters.technologies.length > 0) {
        query = query.overlaps('technologies', filters.technologies)
      }
      
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching projects:', error)
      throw new Error('Failed to fetch projects')
    }

    return data as Project[]
  },

  // Get a single project by ID
  async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      throw new Error('Failed to fetch project')
    }

    return data as Project
  },

  // Create a new project
  async createProject(project: ProjectInsert) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      throw new Error('Failed to create project')
    }

    return data as Project
  },

  // Update a project
  async updateProject(id: string, updates: ProjectUpdate) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      throw new Error('Failed to update project')
    }

    return data as Project
  },

  // Delete a project
  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      throw new Error('Failed to delete project')
    }
  },

  // Get project statistics
  async getProjectStats() {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('status, budget, budget_type')

    if (error) {
      console.error('Error fetching project stats:', error)
      throw new Error('Failed to fetch project statistics')
    }

    const stats = {
      total: projects.length,
      new: projects.filter(p => p.status === 'new').length,
      bookmarked: projects.filter(p => p.status === 'bookmarked').length,
      applied: projects.filter(p => p.status === 'applied').length,
      inProgress: projects.filter(p => p.status === 'in_progress').length,
      won: projects.filter(p => p.status === 'won').length,
      lost: projects.filter(p => p.status === 'lost').length,
      avgBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0) / projects.length
    }

    return stats
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
    let query = supabase
      .from('bids')
      .select(`
        *,
        projects (
          title,
          source_platform,
          source_url
        )
      `)
      .order('created_at', { ascending: false })

    if (filters) {
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status)
      }
      
      if (filters.projectId) {
        query = query.eq('project_id', filters.projectId)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching bids:', error)
      throw new Error('Failed to fetch bids')
    }

    return data
  },

  // Get a single bid by ID
  async getBid(id: string) {
    const { data, error } = await supabase
      .from('bids')
      .select(`
        *,
        projects (
          title,
          source_platform,
          source_url
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching bid:', error)
      throw new Error('Failed to fetch bid')
    }

    return data
  },

  // Create a new bid
  async createBid(bid: BidInsert) {
    const { data, error } = await supabase
      .from('bids')
      .insert(bid)
      .select()
      .single()

    if (error) {
      console.error('Error creating bid:', error)
      throw new Error('Failed to create bid')
    }

    return data as Bid
  },

  // Update a bid
  async updateBid(id: string, updates: BidUpdate) {
    const { data, error } = await supabase
      .from('bids')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating bid:', error)
      throw new Error('Failed to update bid')
    }

    return data as Bid
  },

  // Delete a bid
  async deleteBid(id: string) {
    const { error } = await supabase
      .from('bids')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting bid:', error)
      throw new Error('Failed to delete bid')
    }
  },

  // Get bid statistics
  async getBidStats() {
    const { data: bids, error } = await supabase
      .from('bids')
      .select('status, bid_amount')

    if (error) {
      console.error('Error fetching bid stats:', error)
      throw new Error('Failed to fetch bid statistics')
    }

    const acceptedBids = bids.filter(b => b.status === 'accepted')
    const submittedBids = bids.filter(b => b.status === 'submitted' || b.status === 'accepted' || b.status === 'rejected')
    
    const stats = {
      total: bids.length,
      draft: bids.filter(b => b.status === 'draft').length,
      submitted: bids.filter(b => b.status === 'submitted').length,
      accepted: acceptedBids.length,
      rejected: bids.filter(b => b.status === 'rejected').length,
      winRate: submittedBids.length > 0 ? (acceptedBids.length / submittedBids.length) * 100 : 0,
      totalEarnings: acceptedBids.reduce((sum, b) => sum + (b.bid_amount || 0), 0),
      avgBidAmount: bids.reduce((sum, b) => sum + (b.bid_amount || 0), 0) / bids.length
    }

    return stats
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
