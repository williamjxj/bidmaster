'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { useUserPreferences, useUpdateUserPreferences, useSources, useUpdateSource, useCreateSource, useDeleteSource } from '@/hooks/useApi'
import { ScrapingControls } from '@/components/scraping-controls'
import { MockDataManager } from '@/components/mock-data-manager'

interface LocalPreferences {
  target_technologies: string[]
  target_categories: string[]
  min_budget: number
  max_budget: number
  preferred_platforms: string[]
  notification_settings: {
    new_projects: boolean
    bid_updates: boolean
    email: boolean
  }
}

export default function SettingsPage() {
  const [newTechnology, setNewTechnology] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newPlatformName, setNewPlatformName] = useState('')
  const [newPlatformUrl, setNewPlatformUrl] = useState('')

  // Fetch data from API
  const { data: preferences, isLoading: preferencesLoading, error: preferencesError } = useUserPreferences()
  const { data: sources = [], isLoading: sourcesLoading, error: sourcesError } = useSources()
  
  // Mutations
  const updatePreferencesMutation = useUpdateUserPreferences()
  const updateSourceMutation = useUpdateSource()
  const createSourceMutation = useCreateSource()
  const deleteSourceMutation = useDeleteSource()

  // Local state for form values
  const [localPreferences, setLocalPreferences] = useState<LocalPreferences>({
    target_technologies: [],
    target_categories: [],
    min_budget: 0,
    max_budget: 0,
    preferred_platforms: [],
    notification_settings: {
      new_projects: false,
      bid_updates: false,
      email: false
    }
  })

  // Update local state when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        target_technologies: preferences.target_technologies || [],
        target_categories: preferences.target_categories || [],
        min_budget: preferences.min_budget || 0,
        max_budget: preferences.max_budget || 0,
        preferred_platforms: preferences.preferred_platforms || [],
        notification_settings: preferences.notification_settings || {
          new_projects: false,
          bid_updates: false,
          email: false
        }
      })
    }
  }, [preferences])

  if (preferencesError || sourcesError) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <Save className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-2">Error Loading Settings</h3>
            <p className="text-sm">
              {preferencesError instanceof Error ? preferencesError.message : sourcesError instanceof Error ? sourcesError.message : 'Failed to load settings'}
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (preferencesLoading || sourcesLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading settings...</span>
        </div>
      </div>
    )
  }

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !localPreferences.target_technologies.includes(newTechnology.trim())) {
      setLocalPreferences(prev => ({
        ...prev,
        target_technologies: [...prev.target_technologies, newTechnology.trim()]
      }))
      setNewTechnology('')
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setLocalPreferences(prev => ({
      ...prev,
      target_technologies: prev.target_technologies.filter(t => t !== tech)
    }))
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !localPreferences.target_categories.includes(newCategory.trim())) {
      setLocalPreferences(prev => ({
        ...prev,
        target_categories: [...prev.target_categories, newCategory.trim()]
      }))
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (category: string) => {
    setLocalPreferences(prev => ({
      ...prev,
      target_categories: prev.target_categories.filter(c => c !== category)
    }))
  }

  const handleAddPlatform = async () => {
    if (newPlatformName.trim() && newPlatformUrl.trim()) {
      try {
        await createSourceMutation.mutateAsync({
          name: newPlatformName.trim(),
          url: newPlatformUrl.trim(),
          is_active: true
        })
        setNewPlatformName('')
        setNewPlatformUrl('')
      } catch (error) {
        console.error('Error adding platform:', error)
      }
    }
  }

  const handleTogglePlatform = async (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId)
    if (source) {
      try {
        await updateSourceMutation.mutateAsync({
          id: sourceId,
          updates: { is_active: !source.is_active }
        })
      } catch (error) {
        console.error('Error toggling platform:', error)
      }
    }
  }

  const handleRemovePlatform = async (sourceId: string) => {
    try {
      await deleteSourceMutation.mutateAsync(sourceId)
    } catch (error) {
      console.error('Error removing platform:', error)
    }
  }

  const handleSaveSettings = async () => {
    try {
      await updatePreferencesMutation.mutateAsync({
        userId: '00000000-0000-0000-0000-000000000000',
        preferences: localPreferences
      })
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    }
  }

  return (
    <div className="flex-1 space-y-8 bg-background min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Configure your preferences and platform integrations
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-8">
          <div className="space-y-8">
            {/* Target Technologies */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">Target Technologies</CardTitle>
                <CardDescription className="text-base">
                  Specify the technologies you want to work with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {localPreferences.target_technologies.map((tech: string) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-2 px-3 py-1.5 text-sm">
                        {tech}
                        <button
                          onClick={() => handleRemoveTechnology(tech)}
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Add technology (e.g. React, Node.js)"
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                      className="flex-1"
                    />
                    <Button onClick={handleAddTechnology} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target Categories */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">Target Categories</CardTitle>
                <CardDescription className="text-base">
                  Specify the project categories you are interested in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {localPreferences.target_categories.map((category: string) => (
                      <Badge key={category} variant="secondary" className="flex items-center gap-1">
                        {category}
                        <button
                          onClick={() => handleRemoveCategory(category)}
                          className="ml-1 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add category (e.g. Web Development, Mobile App)"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button onClick={handleAddCategory} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Range */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Range</CardTitle>
                <CardDescription>
                  Set your preferred project budget range
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Minimum Budget ($)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={localPreferences.min_budget}
                      onChange={(e) => setLocalPreferences(prev => ({
                        ...prev,
                        min_budget: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Maximum Budget ($)</label>
                    <Input
                      type="number"
                      placeholder="10000"
                      value={localPreferences.max_budget}
                      onChange={(e) => setLocalPreferences(prev => ({
                        ...prev,
                        max_budget: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Sources</CardTitle>
                <CardDescription>
                  Manage the platforms to scrape for projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    {sources.map((source) => (
                      <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-sm text-muted-foreground">{source.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={source.is_active ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTogglePlatform(source.id)}
                          >
                            {source.is_active ? 'Active' : 'Inactive'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemovePlatform(source.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Platform name"
                      value={newPlatformName}
                      onChange={(e) => setNewPlatformName(e.target.value)}
                    />
                    <Input
                      placeholder="Platform URL"
                      value={newPlatformUrl}
                      onChange={(e) => setNewPlatformUrl(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddPlatform} size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Platform
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Components */}
            <Card>
              <CardHeader>
                <CardTitle>Scraping Controls</CardTitle>
                <CardDescription>
                  Manage scraping operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrapingControls />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mock Data Management</CardTitle>
                <CardDescription>
                  Manage test data for development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MockDataManager />
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-6">
              <Button onClick={handleSaveSettings} className="px-8">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}