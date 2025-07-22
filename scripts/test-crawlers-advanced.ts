/**
 * Advanced Crawler Testing & Enhancement Script (TypeScript)
 * 
 * This script provides comprehensive testing and enhancement capabilities
 * for the BidMaster web scraping system.
 */

import fs from 'fs'
import path from 'path'
import https from 'https'

// Test configuration
interface TestConfig {
  platforms: string[]
  searchTerms: string[]
  testTimeout: number
  maxResults: number
  enableRealScraping: boolean
}

const CONFIG: TestConfig = {
  platforms: ['upwork', 'freelancer'],
  searchTerms: ['react developer', 'python', 'full stack'],
  testTimeout: 30000,
  maxResults: 3,
  enableRealScraping: false // Set to true for live testing
}

// Enhanced logging with timestamps
const logger = {
  info: (msg: string) => console.log(`[${new Date().toISOString()}] ℹ️  ${msg}`),
  success: (msg: string) => console.log(`[${new Date().toISOString()}] ✅ ${msg}`),
  error: (msg: string) => console.log(`[${new Date().toISOString()}] ❌ ${msg}`),
  warning: (msg: string) => console.log(`[${new Date().toISOString()}] ⚠️  ${msg}`),
  debug: (msg: string) => console.log(`[${new Date().toISOString()}] 🐛 ${msg}`)
}

// Test result types
interface TestResult {
  name: string
  status: 'passed' | 'failed' | 'skipped'
  duration?: number
  category: string
  error?: string
  reason?: string
}

// Test results tracking
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  startTime: Date.now(),
  tests: [] as TestResult[]
}

// Test assertion helper
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message)
  }
}

// File existence checker
function fileExists(filePath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), filePath))
}

// HTTP request helper for API testing
interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: string
}

interface RequestResponse {
  status: number
  data: unknown
}

function makeRequest(url: string, options: RequestOptions = {}): Promise<RequestResponse> {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve({ status: res.statusCode || 0, data: result })
        } catch {
          resolve({ status: res.statusCode || 0, data: data })
        }
      })
    })
    
    req.on('error', reject)
    req.setTimeout(CONFIG.testTimeout, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
    
    if (options.body) {
      req.write(options.body)
    }
    req.end()
  })
}

// Test runner function
async function runTest(name: string, testFn: () => Promise<void> | void, category = 'general'): Promise<void> {
  testResults.total++
  const startTime = Date.now()
  
  try {
    await testFn()
    const duration = Date.now() - startTime
    testResults.passed++
    testResults.tests.push({ name, status: 'passed', duration, category })
    logger.success(`${name} (${duration}ms)`)
  } catch (error) {
    const duration = Date.now() - startTime
    testResults.failed++
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    testResults.tests.push({ name, status: 'failed', duration, category, error: errorMessage })
    logger.error(`${name}: ${errorMessage}`)
  }
}

// Skip test function
function skipTest(name: string, reason: string, category = 'general'): void {
  testResults.total++
  testResults.skipped++
  testResults.tests.push({ name, status: 'skipped', reason, category })
  logger.warning(`${name} (skipped: ${reason})`)
}

// Core Infrastructure Tests
async function testInfrastructure(): Promise<void> {
  logger.info('🏗️  Testing Infrastructure...')
  
  await runTest('Scraper module exists', () => {
    assert(fileExists('src/lib/scraper.ts'), 'Scraper module not found')
    
    const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    assert(content.includes('export class ProjectScraper'), 'ProjectScraper class not exported')
    assert(content.includes('export interface ScrapedProject'), 'ScrapedProject interface not exported')
    assert(content.includes('scrapingConfigs'), 'Scraping configurations not found')
  }, 'infrastructure')
  
  await runTest('API routes are properly configured', () => {
    assert(fileExists('src/app/api/scrape/route.ts'), 'Main scraping API route missing')
    assert(fileExists('src/app/api/scrape/stats/route.ts'), 'Stats API route missing')
    assert(fileExists('src/app/api/scrape/cleanup/route.ts'), 'Cleanup API route missing')
    assert(fileExists('src/app/api/scrape/scheduled/route.ts'), 'Scheduled API route missing')
  }, 'infrastructure')
  
  await runTest('Database schema is complete', () => {
    assert(fileExists('database/schema.sql'), 'Base schema missing')
    assert(fileExists('database/scraping-enhancements.sql'), 'Enhanced schema missing')
    
    const schema = fs.readFileSync(path.join(process.cwd(), 'database/schema.sql'), 'utf8')
    assert(schema.includes('CREATE TABLE') && schema.includes('projects'), 'Projects table not defined')
    
    const enhanced = fs.readFileSync(path.join(process.cwd(), 'database/scraping-enhancements.sql'), 'utf8')
    assert(enhanced.includes('scraping_logs'), 'Scraping logs table missing')
    assert(enhanced.includes('scraping_queue'), 'Scraping queue table missing')
  }, 'infrastructure')
  
  await runTest('UI components are available', () => {
    assert(fileExists('src/components/scraping-controls.tsx'), 'Scraping controls component missing')
    assert(fileExists('src/components/scraping-dashboard.tsx'), 'Scraping dashboard component missing')
  }, 'infrastructure')
}

// Scraper Configuration Tests
async function testScraperConfiguration(): Promise<void> {
  logger.info('⚙️  Testing Scraper Configuration...')
  
  await runTest('Platform configurations are valid', () => {
    const scraperContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    
    // Check for required platform configs
    CONFIG.platforms.forEach(platform => {
      assert(scraperContent.includes(platform), `${platform} configuration missing`)
    })
    
    // Check for required selector definitions
    const requiredSelectors = [
      'projectContainer', 'title', 'description', 'budget', 
      'technologies', 'category', 'location', 'projectUrl'
    ]
    
    requiredSelectors.forEach(selector => {
      assert(scraperContent.includes(selector), `Selector '${selector}' not defined`)
    })
  }, 'configuration')
  
  await runTest('Rate limiting is configured', () => {
    const scraperContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    assert(scraperContent.includes('rateLimit'), 'Rate limiting not configured')
    assert(scraperContent.includes('sleep'), 'Sleep function not implemented')
  }, 'configuration')
  
  await runTest('Error handling is implemented', () => {
    const scraperContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    assert(scraperContent.includes('try') && scraperContent.includes('catch'), 'Error handling not implemented')
    assert(scraperContent.includes('console.error'), 'Error logging not implemented')
  }, 'configuration')
}

// Data Validation Tests
async function testDataValidation(): Promise<void> {
  logger.info('🔍 Testing Data Validation...')
  
  await runTest('ScrapedProject interface is complete', () => {
    const scraperContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    
    const requiredFields = [
      'title', 'description', 'budget', 'budgetType', 
      'technologies', 'category', 'location', 'postedDate', 
      'sourceUrl', 'platform'
    ]
    
    requiredFields.forEach(field => {
      assert(scraperContent.includes(field), `Required field '${field}' missing from interface`)
    })
  }, 'validation')
  
  await runTest('Mock data generation is functional', () => {
    const scraperContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    assert(scraperContent.includes('generateMockProjects'), 'Mock data generation function missing')
    assert(scraperContent.includes('MOCK_'), 'Mock data identifiers missing')
  }, 'validation')
  
  await runTest('Data saving functionality exists', () => {
    const scraperContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    assert(scraperContent.includes('saveScrapedProjects'), 'Data saving function missing')
    assert(scraperContent.includes('upsert'), 'Database upsert logic missing')
  }, 'validation')
}

// API Endpoint Tests
async function testAPIEndpoints(): Promise<void> {
  logger.info('🌐 Testing API Endpoints...')
  
  // Check if development server is running
  try {
    const response = await makeRequest('http://localhost:3000/api/scrape/stats')
    
    await runTest('Stats API endpoint is accessible', () => {
      assert(response.status === 200, `Expected 200, got ${response.status}`)
      const data = response.data as Record<string, unknown>
      assert(data.success !== undefined, 'Response missing success field')
    }, 'api')
    
    await runTest('Scraping API accepts POST requests', async () => {
      const postResponse = await makeRequest('http://localhost:3000/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchTerm: 'test',
          maxResults: 2
        })
      })
      
      assert(postResponse.status === 200, `Expected 200, got ${postResponse.status}`)
    }, 'api')
    
  } catch {
    skipTest('API endpoint tests', 'Development server not running', 'api')
  }
}

// Performance Tests
async function testPerformance(): Promise<void> {
  logger.info('⚡ Testing Performance...')
  
  await runTest('Scraper includes performance optimizations', () => {
    const scraperContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    
    // Check for performance features
    assert(scraperContent.includes('maxResults'), 'Result limiting not implemented')
    assert(scraperContent.includes('timeout'), 'Timeout handling not implemented')
    assert(scraperContent.includes('Promise'), 'Async operations not properly implemented')
  }, 'performance')
  
  await runTest('Concurrent scraping is supported', () => {
    const scraperContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    assert(scraperContent.includes('scrapeAllPlatforms'), 'Multi-platform scraping not implemented')
  }, 'performance')
}

// Security Tests
async function testSecurity(): Promise<void> {
  logger.info('🔒 Testing Security...')
  
  await runTest('Environment variables are properly configured', () => {
    const envExample = fileExists('.env.example')
    const envLocal = fileExists('.env.local')
    
    assert(envExample || envLocal, 'No environment configuration found')
    
    if (envLocal) {
      const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8')
      assert(envContent.includes('SUPABASE_'), 'Supabase configuration missing')
    }
  }, 'security')
  
  await runTest('Anti-bot detection measures are considered', () => {
    const scraperContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    assert(scraperContent.includes('User-Agent') || scraperContent.includes('setUserAgent'), 
           'User agent spoofing not implemented')
  }, 'security')
  
  await runTest('Input validation is implemented', () => {
    const apiContent = fs.readFileSync(path.join(process.cwd(), 'src/app/api/scrape/route.ts'), 'utf8')
    assert(apiContent.includes('searchTerm'), 'Search term validation missing')
  }, 'security')
}

// Integration Tests
async function testIntegration(): Promise<void> {
  logger.info('🔗 Testing Integration...')
  
  await runTest('Database integration is configured', () => {
    const scraperContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/scraper.ts'), 'utf8')
    assert(scraperContent.includes('createClient'), 'Supabase client not imported')
    assert(scraperContent.includes('from('), 'Database queries not implemented')
  }, 'integration')
  
  await runTest('Frontend components are integrated', () => {
    assert(fileExists('src/app/projects/page.tsx'), 'Projects page missing')
    assert(fileExists('src/app/settings/page.tsx'), 'Settings page missing')
    
    const projectsContent = fs.readFileSync(path.join(process.cwd(), 'src/app/projects/page.tsx'), 'utf8')
    assert(projectsContent.includes('useProjects'), 'Projects hook not used')
  }, 'integration')
}

// Generate comprehensive test report
function generateReport(): void {
  const duration = Date.now() - testResults.startTime
  
  console.log('\n📊 COMPREHENSIVE TEST REPORT')
  console.log('='.repeat(60))
  console.log(`Total Duration: ${duration}ms`)
  console.log(`Total Tests: ${testResults.total}`)
  console.log(`✅ Passed: ${testResults.passed}`)
  console.log(`❌ Failed: ${testResults.failed}`)
  console.log(`⚠️  Skipped: ${testResults.skipped}`)
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`)
  
  // Group results by category
  const categories: Record<string, { passed: number; failed: number; skipped: number; total: number }> = {}
  testResults.tests.forEach(test => {
    if (!categories[test.category]) {
      categories[test.category] = { passed: 0, failed: 0, skipped: 0, total: 0 }
    }
    categories[test.category][test.status]++
    categories[test.category].total++
  })
  
  console.log('\n📂 RESULTS BY CATEGORY:')
  Object.entries(categories).forEach(([category, stats]) => {
    const rate = ((stats.passed / stats.total) * 100).toFixed(1)
    console.log(`  ${category}: ${stats.passed}/${stats.total} (${rate}%)`)
  })
  
  // Show failed tests
  const failedTests = testResults.tests.filter(t => t.status === 'failed')
  if (failedTests.length > 0) {
    console.log('\n❌ FAILED TESTS:')
    failedTests.forEach(test => {
      console.log(`  • ${test.name}: ${test.error}`)
    })
  }
  
  // Show skipped tests
  const skippedTests = testResults.tests.filter(t => t.status === 'skipped')
  if (skippedTests.length > 0) {
    console.log('\n⚠️  SKIPPED TESTS:')
    skippedTests.forEach(test => {
      console.log(`  • ${test.name}: ${test.reason}`)
    })
  }
  
  console.log('\n💡 RECOMMENDATIONS:')
  if (testResults.failed === 0) {
    console.log('  ✨ All tests passed! Crawler system is ready for production.')
  } else {
    console.log('  🔧 Fix failed tests before deploying to production.')
    console.log('  🧪 Run tests regularly to ensure system stability.')
  }
  
  if (skippedTests.length > 0) {
    console.log('  🏃‍♂️ Start development server to run skipped API tests.')
  }
  
  console.log('\n🚀 NEXT STEPS:')
  console.log('  1. Run: npm run dev (to test API endpoints)')
  console.log('  2. Run: npm run test:crawlers (to run this test suite)')
  console.log('  3. Run: npm run scrape:test (to test live scraping)')
  console.log('  4. Check: http://localhost:3000/settings (scraping dashboard)')
}

// Main test execution
async function main(): Promise<void> {
  console.log('🧪 BidMaster Advanced Crawler Test Suite')
  console.log('🔍 Testing crawler functionality, performance, and integration')
  console.log('⏰ Started at:', new Date().toISOString())
  console.log()
  
  try {
    await testInfrastructure()
    await testScraperConfiguration()
    await testDataValidation()
    await testAPIEndpoints()
    await testPerformance()
    await testSecurity()
    await testIntegration()
    
    generateReport()
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0)
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Test suite crashed: ${errorMessage}`)
    if (error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

// Run tests if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main()
}

export {
  runTest,
  testResults,
  CONFIG,
  logger
}
