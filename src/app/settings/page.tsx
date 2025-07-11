'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Save } from 'lucide-react'

interface UserPreferences {
  targetTechnologies: string[]
  targetCategories: string[]
  minBudget: number
  maxBudget: number
  preferredPlatforms: string[]
  notifications: {
    newProjects: boolean
    bidUpdates: boolean
    emailNotifications: boolean
  }
}

interface Platform {
  id: string
  name: string
  url: string
  isActive: boolean
  lastScraped: string | null
}

const mockPreferences: UserPreferences = {
  targetTechnologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python'],
  targetCategories: ['Web Development', 'AI Development', 'Backend Development'],
  minBudget: 1000,
  maxBudget: 5000,
  preferredPlatforms: ['Upwork', 'Freelancer', 'Toptal'],
  notifications: {
    newProjects: true,
    bidUpdates: true,
    emailNotifications: false
  }
}

const mockPlatforms: Platform[] = [
  {
    id: '1',
    name: 'Upwork',
    url: 'https://upwork.com',
    isActive: true,
    lastScraped: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Freelancer',
    url: 'https://freelancer.com',
    isActive: true,
    lastScraped: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    name: 'Toptal',
    url: 'https://toptal.com',
    isActive: false,
    lastScraped: null
  }
]

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(mockPreferences)
  const [platforms, setPlatforms] = useState<Platform[]>(mockPlatforms)
  const [newTechnology, setNewTechnology] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newPlatformName, setNewPlatformName] = useState('')
  const [newPlatformUrl, setNewPlatformUrl] = useState('')

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !preferences.targetTechnologies.includes(newTechnology.trim())) {
      setPreferences(prev => ({
        ...prev,
        targetTechnologies: [...prev.targetTechnologies, newTechnology.trim()]
      }))
      setNewTechnology('')
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setPreferences(prev => ({
      ...prev,
      targetTechnologies: prev.targetTechnologies.filter(t => t !== tech)
    }))
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !preferences.targetCategories.includes(newCategory.trim())) {
      setPreferences(prev => ({
        ...prev,
        targetCategories: [...prev.targetCategories, newCategory.trim()]
      }))
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      targetCategories: prev.targetCategories.filter(c => c !== category)
    }))
  }

  const handleAddPlatform = () => {
    if (newPlatformName.trim() && newPlatformUrl.trim()) {
      const newPlatform: Platform = {
        id: Date.now().toString(),
        name: newPlatformName.trim(),
        url: newPlatformUrl.trim(),
        isActive: true,
        lastScraped: null
      }
      setPlatforms(prev => [...prev, newPlatform])
      setNewPlatformName('')
      setNewPlatformUrl('')
    }
  }

  const handleTogglePlatform = (platformId: string) => {
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, isActive: !platform.isActive }
          : platform
      )
    )
  }

  const handleRemovePlatform = (platformId: string) => {
    setPlatforms(prev => prev.filter(p => p.id !== platformId))
  }

  const handleSaveSettings = () => {
    // TODO: Implement save to backend
    console.log('Saving settings:', preferences, platforms)
    alert('Settings saved successfully!')
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
                {preferences.targetTechnologies.map((tech) => (
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
                {preferences.targetCategories.map((category) => (
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
                  value={preferences.minBudget}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    minBudget: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maximum Budget</label>
                <Input
                  type="number"
                  value={preferences.maxBudget}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    maxBudget: parseInt(e.target.value) || 0
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
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{platform.name}</h4>
                        <p className="text-sm text-gray-600">{platform.url}</p>
                        {platform.lastScraped && (
                          <p className="text-xs text-gray-500">
                            Last scraped: {new Date(platform.lastScraped).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={platform.isActive ? 'default' : 'secondary'}>
                        {platform.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePlatform(platform.id)}
                      >
                        Toggle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePlatform(platform.id)}
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
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">New Projects</h4>
                  <p className="text-sm text-gray-600">Get notified when new projects match your criteria</p>
                </div>
                <Button
                  variant={preferences.notifications.newProjects ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      newProjects: !prev.notifications.newProjects
                    }
                  }))}
                >
                  {preferences.notifications.newProjects ? 'On' : 'Off'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Bid Updates</h4>
                  <p className="text-sm text-gray-600">Get notified about bid status changes</p>
                </div>
                <Button
                  variant={preferences.notifications.bidUpdates ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      bidUpdates: !prev.notifications.bidUpdates
                    }
                  }))}
                >
                  {preferences.notifications.bidUpdates ? 'On' : 'Off'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Button
                  variant={preferences.notifications.emailNotifications ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      emailNotifications: !prev.notifications.emailNotifications
                    }
                  }))}
                >
                  {preferences.notifications.emailNotifications ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
