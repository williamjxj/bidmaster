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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        console.error('Error creating platform:', error)
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
        userId: '00000000-0000-0000-0000-000000000000', // Valid UUID for default user
        preferences: localPreferences
      })
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Configure your preferences and platform integrations
        </p>
      </div>

      <div className="space-y-6">
        {/* Target Technologies */}
        <Card>
          <CardHeader>
            <CardTitle>Target Technologies</CardTitle>
            <CardDescription>
              Specify the technologies you want to work with
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {localPreferences.target_technologies.map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="pr-1">
                    {tech}
                    <button
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add new technology"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                />
                <Button onClick={handleAddTechnology}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Target Categories</CardTitle>
            <CardDescription>
              Define the types of projects you&apos;re interested in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {localPreferences.target_categories.map((category: string) => (
                  <Badge key={category} variant="secondary" className="pr-1">
                    {category}
                    <button
                      onClick={() => handleRemoveCategory(category)}
                      className="ml-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <Button onClick={handleAddCategory}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
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
                <label className="block text-sm font-medium mb-1">Minimum Budget</label>
                <Input
                  type="number"
                  value={localPreferences.min_budget}
                  onChange={(e) => setLocalPreferences(prev => ({
                    ...prev,
                    min_budget: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maximum Budget</label>
                <Input
                  type="number"
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
              Manage the platforms you want to scrape for projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                {sources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{source.name}</h4>
                        <p className="text-sm text-gray-600">{source.url}</p>
                        {source.last_scraped && (
                          <p className="text-xs text-gray-500">
                            Last scraped: {new Date(source.last_scraped).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={source.is_active ? 'default' : 'secondary'}>
                        {source.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePlatform(source.id)}
                      >
                        Toggle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePlatform(source.id)}
                        className="text-red-600 hover:text-red-700"
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
              <Button onClick={handleAddPlatform}>
                <Plus className="h-4 w-4 mr-1" />
                Add Platform
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Control how you receive updates and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Projects</h4>
                    <p className="text-sm text-gray-600">Get notified when new projects match your criteria</p>
                  </div>
                  <Button
                    variant={localPreferences.notification_settings.new_projects ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLocalPreferences(prev => ({
                      ...prev,
                      notification_settings: {
                        ...prev.notification_settings,
                        new_projects: !prev.notification_settings.new_projects
                      }
                    }))}
                  >
                    {localPreferences.notification_settings.new_projects ? 'On' : 'Off'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Bid Updates</h4>
                    <p className="text-sm text-gray-600">Get notified about bid status changes</p>
                  </div>
                  <Button
                    variant={localPreferences.notification_settings.bid_updates ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLocalPreferences(prev => ({
                      ...prev,
                      notification_settings: {
                        ...prev.notification_settings,
                        bid_updates: !prev.notification_settings.bid_updates
                      }
                    }))}
                  >
                    {localPreferences.notification_settings.bid_updates ? 'On' : 'Off'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Button
                    variant={localPreferences.notification_settings.email ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLocalPreferences(prev => ({
                      ...prev,
                      notification_settings: {
                        ...prev.notification_settings,
                        email: !prev.notification_settings.email
                      }
                    }))}
                  >
                    {localPreferences.notification_settings.email ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
          </CardContent>
        </Card>

        {/* Web Scraping Controls */}
        <ScrapingControls />

        {/* Mock Data Management */}
        <MockDataManager />

        {/* Save Settings */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="px-8">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
