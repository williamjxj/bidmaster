#!/usr/bin/env node

/**
 * Comprehensive Crawler Testing Suite
 * 
 * This script tests the web scraping functionality across different platforms
 * and validates data quality, performance, and error handling.
 * 
 * Usage: node scripts/test-crawlers.js [options]
 * Options:
 *   --platform=[upwork,freelancer,all]  Test specific platform(s)
 *   --mock                              Use mock data for testing
 *   --verbose                           Enable detailed logging
 *   --performance                       Run performance benchmarks
 *   --validate                          Run data validation tests
 */

const { scrapeAllPlatforms, saveScrapedProjects, ProjectScraper } = require('../src/lib/scraper')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Test configuration
const TEST_CONFIG = {
  searchTerms: [
    'react developer',
    'node.js backend',
    'python data science',
    'mobile app development',
    'full stack developer'
  ],
  platforms: ['upwork', 'freelancer'],
  maxResults: 5,
  timeout: 30000, // 30 seconds
  expectedFields: [
    'title',
    'description',
    'budget',
    'budgetType',
    'technologies',
    'category',
    'location',
    'postedDate',
    'sourceUrl',
    'platform'
  ]
}

// Performance metrics
const metrics = {
  startTime: null,
  endTime: null,
  totalProjects: 0,
  successfulScrapes: 0,
  failedScrapes: 0,
  averageResponseTime: 0,
  platformMetrics: {}
}

// CLI argument parsing
const args = process.argv.slice(2)
const options = {
  platform: 'all',
  mock: false,
  verbose: false,
  performance: false,
  validate: false
}

args.forEach(arg => {
  if (arg.startsWith('--platform=')) {
    options.platform = arg.split('=')[1]
  } else if (arg === '--mock') {
    options.mock = true
  } else if (arg === '--verbose') {
    options.verbose = true
  } else if (arg === '--performance') {
    options.performance = true
  } else if (arg === '--validate') {
    options.validate = true
  }
})

// Logging utility
function log(message, level = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`
  
  if (level === 'verbose' && !options.verbose) return
  
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    verbose: '\x1b[90m'  // Gray
  }
  
  const color = colors[level] || '\x1b[0m'
  console.log(`${color}${prefix} ${message}\x1b[0m`)
}

// Data validation functions
function validateProject(project) {
  const errors = []
  
  TEST_CONFIG.expectedFields.forEach(field => {
    if (!project.hasOwnProperty(field)) {
      errors.push(`Missing field: ${field}`)
    } else if (project[field] === null || project[field] === undefined) {
      errors.push(`Null/undefined field: ${field}`)
    }
  })
  
  // Validate specific field types
  if (project.budget && (typeof project.budget !== 'number' || project.budget <= 0)) {
    errors.push('Invalid budget: must be a positive number')
  }
  
  if (project.budgetType && !['fixed', 'hourly'].includes(project.budgetType)) {
    errors.push('Invalid budgetType: must be "fixed" or "hourly"')
  }
  
  if (project.technologies && !Array.isArray(project.technologies)) {
    errors.push('Invalid technologies: must be an array')
  }
  
  if (project.sourceUrl && !project.sourceUrl.startsWith('http')) {
    errors.push('Invalid sourceUrl: must be a valid URL')
  }
  
  return errors
}

// Performance testing
async function measurePerformance(fn, label) {
  const start = Date.now()
  try {
    const result = await fn()
    const duration = Date.now() - start
    log(`${label} completed in ${duration}ms`, 'verbose')
    return { result, duration, success: true }
  } catch (error) {
    const duration = Date.now() - start
    log(`${label} failed after ${duration}ms: ${error.message}`, 'error')
    return { error, duration, success: false }
  }
}

// Platform-specific testing
async function testPlatform(platform, searchTerm) {
  log(`Testing ${platform} with search term: "${searchTerm}"`, 'verbose')
  
  const platformStart = Date.now()
  
  try {
    const scraper = new ProjectScraper(platform)
    const projects = await scraper.scrapeProjects(searchTerm, TEST_CONFIG.maxResults)
    
    const duration = Date.now() - platformStart
    
    // Initialize platform metrics if not exists
    if (!metrics.platformMetrics[platform]) {
      metrics.platformMetrics[platform] = {
        totalAttempts: 0,
        successfulAttempts: 0,
        totalProjects: 0,
        totalDuration: 0,
        errors: []
      }
    }
    
    const platformMetrics = metrics.platformMetrics[platform]
    platformMetrics.totalAttempts++
    platformMetrics.totalDuration += duration
    
    if (projects && projects.length > 0) {
      platformMetrics.successfulAttempts++
      platformMetrics.totalProjects += projects.length
      
      log(`✓ ${platform}: Found ${projects.length} projects in ${duration}ms`, 'success')
      
      // Validate each project if validation is enabled
      if (options.validate) {
        projects.forEach((project, index) => {
          const errors = validateProject(project)
          if (errors.length > 0) {
            log(`⚠ ${platform} project ${index + 1} validation errors: ${errors.join(', ')}`, 'warning')
          }
        })
      }
      
      return projects
    } else {
      log(`⚠ ${platform}: No projects found`, 'warning')
      return []
    }
    
  } catch (error) {
    const duration = Date.now() - platformStart
    metrics.platformMetrics[platform] = metrics.platformMetrics[platform] || {
      totalAttempts: 0,
      successfulAttempts: 0,
      totalProjects: 0,
      totalDuration: 0,
      errors: []
    }
    
    metrics.platformMetrics[platform].totalAttempts++
    metrics.platformMetrics[platform].totalDuration += duration
    metrics.platformMetrics[platform].errors.push(error.message)
    
    log(`✗ ${platform} failed: ${error.message}`, 'error')
    return []
  }
}

// Database connectivity test
async function testDatabaseConnection() {
  log('Testing database connection...', 'verbose')
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase environment variables')
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
  
  const { data, error } = await supabase
    .from('projects')
    .select('count(*)')
    .limit(1)
  
  if (error) {
    throw new Error(`Database connection failed: ${error.message}`)
  }
  
  log('✓ Database connection successful', 'success')
  return true
}

// Mock data quality test
async function testMockDataQuality() {
  log('Testing mock data quality...', 'verbose')
  
  const scraper = new ProjectScraper('upwork')
  const mockProjects = await scraper.scrapeProjects('test search', 3)
  
  if (!mockProjects || mockProjects.length === 0) {
    throw new Error('No mock projects generated')
  }
  
  let totalErrors = 0
  mockProjects.forEach((project, index) => {
    const errors = validateProject(project)
    if (errors.length > 0) {
      log(`Mock project ${index + 1} errors: ${errors.join(', ')}`, 'warning')
      totalErrors += errors.length
    }
  })
  
  if (totalErrors === 0) {
    log('✓ Mock data quality validation passed', 'success')
  } else {
    log(`⚠ Mock data has ${totalErrors} validation issues`, 'warning')
  }
  
  return { projects: mockProjects, errors: totalErrors }
}

// Main testing function
async function runCrawlerTests() {
  try {
    log('🚀 Starting BidMaster Crawler Test Suite', 'info')
    log(`Configuration: ${JSON.stringify(options, null, 2)}`, 'verbose')
    
    metrics.startTime = Date.now()
    
    // Test database connection
    await testDatabaseConnection()
    
    // Test mock data quality
    if (options.mock || options.validate) {
      await testMockDataQuality()
    }
    
    // Determine platforms to test
    let platformsToTest = TEST_CONFIG.platforms
    if (options.platform !== 'all') {
      platformsToTest = [options.platform]
    }
    
    log(`Testing platforms: ${platformsToTest.join(', ')}`, 'info')
    
    // Run tests for each search term and platform
    const allProjects = []
    
    for (const searchTerm of TEST_CONFIG.searchTerms) {
      log(`\\n--- Testing search term: "${searchTerm}" ---`, 'info')
      
      for (const platform of platformsToTest) {
        const projects = await testPlatform(platform, searchTerm)
        allProjects.push(...projects)
        
        // Add delay between platform tests
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    metrics.endTime = Date.now()
    metrics.totalProjects = allProjects.length
    
    // Test data saving if we have projects
    if (allProjects.length > 0 && !options.mock) {
      log('\\nTesting data persistence...', 'info')
      try {
        await saveScrapedProjects(allProjects.slice(0, 5)) // Save only first 5 for testing
        log('✓ Data persistence test passed', 'success')
      } catch (error) {
        log(`✗ Data persistence test failed: ${error.message}`, 'error')
      }
    }
    
    // Generate test report
    generateTestReport()
    
  } catch (error) {
    log(`❌ Test suite failed: ${error.message}`, 'error')
    process.exit(1)
  }
}

// Generate comprehensive test report
function generateTestReport() {
  const totalDuration = metrics.endTime - metrics.startTime
  
  log('\\n📊 CRAWLER TEST REPORT', 'info')
  log('='.repeat(50), 'info')
  
  log(`Total Duration: ${totalDuration}ms`, 'info')
  log(`Total Projects Found: ${metrics.totalProjects}`, 'info')
  log(`Search Terms Tested: ${TEST_CONFIG.searchTerms.length}`, 'info')
  
  // Platform-specific metrics
  Object.entries(metrics.platformMetrics).forEach(([platform, data]) => {
    const successRate = data.totalAttempts > 0 ? 
      (data.successfulAttempts / data.totalAttempts * 100).toFixed(1) : 0
    const avgDuration = data.totalAttempts > 0 ? 
      (data.totalDuration / data.totalAttempts).toFixed(0) : 0
    
    log(`\\n${platform.toUpperCase()}:`, 'info')
    log(`  Success Rate: ${successRate}% (${data.successfulAttempts}/${data.totalAttempts})`, 'info')
    log(`  Projects Found: ${data.totalProjects}`, 'info')
    log(`  Avg Response Time: ${avgDuration}ms`, 'info')
    
    if (data.errors.length > 0) {
      log(`  Errors: ${data.errors.length}`, 'warning')
      data.errors.forEach(error => log(`    - ${error}`, 'verbose'))
    }
  })
  
  // Performance analysis
  if (options.performance) {
    log('\\n⚡ PERFORMANCE ANALYSIS:', 'info')
    log(`  Projects per second: ${(metrics.totalProjects / (totalDuration / 1000)).toFixed(2)}`, 'info')
    log(`  Average time per project: ${(totalDuration / Math.max(metrics.totalProjects, 1)).toFixed(0)}ms`, 'info')
  }
  
  // Recommendations
  log('\\n💡 RECOMMENDATIONS:', 'info')
  if (metrics.totalProjects === 0) {
    log('  - No projects found. Check platform configurations and selectors.', 'warning')
  } else if (metrics.totalProjects < TEST_CONFIG.searchTerms.length * 2) {
    log('  - Low project yield. Consider optimizing search terms or selectors.', 'warning')
  } else {
    log('  - Crawler performance looks good! ✓', 'success')
  }
  
  log('\\n🎉 Test suite completed!', 'success')
}

// Enhanced error monitoring
process.on('unhandledRejection', (error) => {
  log(`Unhandled rejection: ${error.message}`, 'error')
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`, 'error')
  process.exit(1)
})

// Run the test suite
if (require.main === module) {
  runCrawlerTests()
}

module.exports = {
  runCrawlerTests,
  testPlatform,
  validateProject,
  generateTestReport
}
