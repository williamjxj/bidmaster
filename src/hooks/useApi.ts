import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi, bidsApi, sourcesApi, userPreferencesApi, getDashboardData } from '@/lib/api'

// Projects hooks
export const useProjects = (filters?: Parameters<typeof projectsApi.getProjects>[0]) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.getProjects(filters),
  })
}

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof projectsApi.updateProject>[1] }) =>
      projectsApi.updateProject(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', data.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Bids hooks
export const useBids = (filters?: Parameters<typeof bidsApi.getBids>[0]) => {
  return useQuery({
    queryKey: ['bids', filters],
    queryFn: () => bidsApi.getBids(filters),
  })
}

export const useBid = (id: string) => {
  return useQuery({
    queryKey: ['bids', id],
    queryFn: () => bidsApi.getBid(id),
    enabled: !!id,
  })
}

export const useCreateBid = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: bidsApi.createBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bids'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useUpdateBid = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof bidsApi.updateBid>[1] }) =>
      bidsApi.updateBid(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bids'] })
      queryClient.invalidateQueries({ queryKey: ['bids', data.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteBid = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: bidsApi.deleteBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bids'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Sources hooks
export const useSources = () => {
  return useQuery({
    queryKey: ['sources'],
    queryFn: sourcesApi.getSources,
  })
}

export const useUpdateSource = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof sourcesApi.updateSource>[1] }) =>
      sourcesApi.updateSource(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] })
    },
  })
}

export const useCreateSource = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: sourcesApi.createSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] })
    },
  })
}

export const useDeleteSource = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: sourcesApi.deleteSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] })
    },
  })
}

// Dashboard hook
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// Statistics hooks
export const useProjectStats = () => {
  return useQuery({
    queryKey: ['project-stats'],
    queryFn: projectsApi.getProjectStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useBidStats = () => {
  return useQuery({
    queryKey: ['bid-stats'],
    queryFn: bidsApi.getBidStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// User Preferences hooks
export const useUserPreferences = (userId: string = '00000000-0000-0000-0000-000000000000') => {
  return useQuery({
    queryKey: ['user-preferences', userId],
    queryFn: () => userPreferencesApi.getUserPreferences(userId),
    enabled: !!userId,
  })
}

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, preferences }: { userId: string; preferences: Parameters<typeof userPreferencesApi.upsertUserPreferences>[1] }) =>
      userPreferencesApi.upsertUserPreferences(userId, preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
    },
  })
}
