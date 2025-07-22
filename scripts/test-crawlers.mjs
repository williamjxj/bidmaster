#!/usr/bin/env node

/**
 * BidMaster Crawler Test & Validation Script
 * 
 * Tests the web scraping functionality and validates data quality
 * 
 * Usage: npm run test:crawlers
 */

import { scrapeAllPlatforms, saveScrapedProjects, ProjectScraper } from '../src/lib/scraper.js'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Test configuration
const TEST_CONFIG = {
  searchTerms: [
    'react developer',
    'python data science', 
    'mobile app development'
  ],
  platforms: ['upwork', 'freelancer'],
  maxResults: 3,
  timeout: 30000
}

// Console logging with colors
const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warning: (msg) => console.log(`\x1b[33m[WARNING]\x1b[0m ${msg}`)
}

// Data validation
function validateProject(project) {
  const requiredFields = ['title', 'description', 'platform', 'sourceUrl']
  const missing = requiredFields.filter(field => !project[field])
  
  if (missing.length > 0) {
    return { valid: false, errors: [`Missing fields: ${missing.join(', ')}`] }
  }
  
  const errors = []
  
  if (project.budget && (typeof project.budget !== 'number' || project.budget <= 0)) {
    errors.push('Invalid budget value')
  }
  
  if (project.budgetType && !['fixed', 'hourly'].includes(project.budgetType)) {
    errors.push('Invalid budget type')
  }
  
  if (!Array.isArray(project.technologies)) {
    errors.push('Technologies must be an array')
  }
  
  return { valid: errors.length === 0, errors }
}

// Test database connection
async function testDatabase() {
  log.info('Testing database connection...')
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase environment variables')
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
  
  const { error } = await supabase
    .from('projects')
    .select('id')
    .limit(1)
  
  if (error) {
    throw new Error(`Database test failed: ${error.message}`)
  }
  
  log.success('Database connection OK')
}

// Test individual platform
async function testPlatform(platform, searchTerm) {
  log.info(`Testing ${platform} with "${searchTerm}"`)
  
  const startTime = Date.now()
  
  try {
    const scraper = new ProjectScraper(platform)
    const projects = await scraper.scrapeProjects(searchTerm, TEST_CONFIG.maxResults)
    
    const duration = Date.now() - startTime
    
    if (projects && projects.length > 0) {
      log.success(`${platform}: ${projects.length} projects in ${duration}ms`)
      
      // Validate projects
      let validCount = 0
      projects.forEach((project, index) => {
        const validation = validateProject(project)
        if (validation.valid) {
          validCount++
        } else {
          log.warning(`${platform} project ${index + 1}: ${validation.errors.join(', ')}`)
        }
      })
      
      log.info(`${platform}: ${validCount}/${projects.length} projects valid`)
      return { platform, projects, duration, validCount }
      
    } else {
      log.warning(`${platform}: No projects found`)
      return { platform, projects: [], duration, validCount: 0 }
    }
    
  } catch (error) {
    log.error(`${platform} failed: ${error.message}`)
    return { platform, projects: [], duration: Date.now() - startTime, error: error.message }
  }
}

// Test mock data generation
async function testMockData() {
  log.info('Testing mock data generation...')
  
  const scraper = new ProjectScraper('upwork')
  const mockProjects = await scraper.scrapeProjects('test', 3)
  
  if (!mockProjects || mockProjects.length === 0) {
    throw new Error('Mock data generation failed')
  }
  
  // Check if projects are marked as mock
  const mockCount = mockProjects.filter(p => 
    p.sourceUrl.includes('MOCK_') || p.title.includes('Mock')
  ).length
  
  log.success(`Generated ${mockProjects.length} mock projects (${mockCount} clearly marked as mock)`)
  
  // Validate mock data quality
  let validMock = 0
  mockProjects.forEach(project => {
    const validation = validateProject(project)
    if (validation.valid) validMock++
  })
  
  log.info(`Mock data quality: ${validMock}/${mockProjects.length} valid`)
  return mockProjects
}

// Test scraping multiple platforms
async function testMultiPlatform() {
  log.info('Testing multi-platform scraping...')
  
  const startTime = Date.now()
  const projects = await scrapeAllPlatforms(
    'web development',
    ['upwork', 'freelancer'], 
    2
  )
  const duration = Date.now() - startTime
  
  log.success(`Multi-platform: ${projects.length} projects in ${duration}ms`)
  
  // Check platform distribution
  const platformCounts = {}
  projects.forEach(p => {
    platformCounts[p.platform] = (platformCounts[p.platform] || 0) + 1
  })
  
  Object.entries(platformCounts).forEach(([platform, count]) => {
    log.info(`  ${platform}: ${count} projects`)
  })
  
  return projects
}

// Test data persistence
async function testDataPersistence(projects) {
  if (projects.length === 0) {
    log.warning('No projects to test persistence')
    return
  }
  
  log.info('Testing data persistence...')
  
  // Test with a small subset
  const testProjects = projects.slice(0, 2)
  
  try {
    await saveScrapedProjects(testProjects)
    log.success('Data persistence test passed')
  } catch (error) {
    log.error(`Data persistence failed: ${error.message}`)
    throw error
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  log.info('Testing scraping API endpoints...')
  
  try {
    // Test manual scraping endpoint
    const response = await fetch('http://localhost:3000/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchTerm: 'react developer',
        maxResults: 2
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      log.success(`API test: ${data.projects?.length || 0} projects returned`)
    } else {
      log.warning('API endpoint not available (app not running?)')
    }
  } catch (error) {
    log.warning('API test skipped (server not running)')
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 BidMaster Crawler Test Suite')
  console.log('=' .repeat(40))
  
  const results = {
    startTime: Date.now(),
    totalProjects: 0,
    platformResults: [],
    errors: []
  }
  
  try {
    // Test database connection
    await testDatabase()
    
    // Test mock data generation
    const mockProjects = await testMockData()
    results.totalProjects += mockProjects.length
    
    // Test individual platforms
    console.log('\n--- Platform Tests ---')
    for (const searchTerm of TEST_CONFIG.searchTerms) {
      for (const platform of TEST_CONFIG.platforms) {
        const result = await testPlatform(platform, searchTerm)
        results.platformResults.push(result)
        results.totalProjects += result.projects.length
        
        if (result.error) {
          results.errors.push(`${platform}: ${result.error}`)
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    // Test multi-platform scraping
    console.log('\n--- Multi-Platform Test ---')
    const multiProjects = await testMultiPlatform()
    
    // Test data persistence
    console.log('\n--- Persistence Test ---')
    await testDataPersistence(multiProjects)
    
    // Test API endpoints
    console.log('\n--- API Test ---')
    await testAPIEndpoints()
    
    // Generate report
    generateReport(results)
    
  } catch (error) {
    log.error(`Test suite failed: ${error.message}`)
    process.exit(1)
  }
}

// Generate test report
function generateReport(results) {
  const duration = Date.now() - results.startTime
  
  console.log('\n📊 TEST REPORT')
  console.log('=' .repeat(40))
  console.log(`Duration: ${duration}ms`)
  console.log(`Total Projects: ${results.totalProjects}`)
  console.log(`Errors: ${results.errors.length}`)
  
  // Platform summary
  const platformSummary = {}
  results.platformResults.forEach(result => {
    if (!platformSummary[result.platform]) {
      platformSummary[result.platform] = { attempts: 0, projects: 0, errors: 0 }
    }
    platformSummary[result.platform].attempts++
    platformSummary[result.platform].projects += result.projects.length
    if (result.error) platformSummary[result.platform].errors++
  })
  
  console.log('\nPlatform Summary:')
  Object.entries(platformSummary).forEach(([platform, stats]) => {
    const successRate = ((stats.attempts - stats.errors) / stats.attempts * 100).toFixed(1)
    console.log(`  ${platform}: ${stats.projects} projects, ${successRate}% success rate`)
  })
  
  if (results.errors.length > 0) {
    console.log('\nErrors:')
    results.errors.forEach(error => console.log(`  - ${error}`))
  }
  
  console.log('\n✅ Test suite completed!')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
}

export {
  runTests,
  testPlatform,
  validateProject,
  testMockData
}
