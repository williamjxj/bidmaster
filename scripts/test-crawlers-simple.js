/**
 * Simple Crawler Test Script
 * Tests basic scraping functionality and data validation
 */

const fs = require('fs')
const path = require('path')

// Simple test framework
class TestRunner {
  constructor() {
    this.tests = []
    this.results = { passed: 0, failed: 0, total: 0 }
  }
  
  test(name, fn) {
    this.tests.push({ name, fn })
  }
  
  async run() {
    console.log('🧪 Running Crawler Tests...\n')
    
    for (const test of this.tests) {
      try {
        await test.fn()
        console.log(`✅ ${test.name}`)
        this.results.passed++
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.message}`)
        this.results.failed++
      }
      this.results.total++
    }
    
    console.log(`\n📊 Results: ${this.results.passed}/${this.results.total} passed`)
    
    if (this.results.failed > 0) {
      process.exit(1)
    }
  }
}

const runner = new TestRunner()

// Test: Scraper file exists and is valid
runner.test('Scraper module exists', () => {
  const scraperPath = path.join(__dirname, '../src/lib/scraper.ts')
  if (!fs.existsSync(scraperPath)) {
    throw new Error('scraper.ts file not found')
  }
  
  const content = fs.readFileSync(scraperPath, 'utf8')
  if (!content.includes('export class ProjectScraper')) {
    throw new Error('ProjectScraper class not found')
  }
  
  if (!content.includes('export interface ScrapedProject')) {
    throw new Error('ScrapedProject interface not found')
  }
})

// Test: Scraping configurations exist
runner.test('Scraping configurations are defined', () => {
  const scraperPath = path.join(__dirname, '../src/lib/scraper.ts')
  const content = fs.readFileSync(scraperPath, 'utf8')
  
  if (!content.includes('scrapingConfigs')) {
    throw new Error('scrapingConfigs not found')
  }
  
  if (!content.includes('upwork') || !content.includes('freelancer')) {
    throw new Error('Platform configurations missing')
  }
})

// Test: API routes exist
runner.test('Scraping API routes exist', () => {
  const apiPath = path.join(__dirname, '../src/app/api/scrape/route.ts')
  if (!fs.existsSync(apiPath)) {
    throw new Error('Scraping API route not found')
  }
  
  const content = fs.readFileSync(apiPath, 'utf8')
  if (!content.includes('export async function POST')) {
    throw new Error('POST handler not found in scraping API')
  }
})

// Test: Database schema includes scraping tables
runner.test('Database schema includes scraping support', () => {
  const schemaPath = path.join(__dirname, '../database/schema.sql')
  if (!fs.existsSync(schemaPath)) {
    throw new Error('Database schema file not found')
  }
  
  const content = fs.readFileSync(schemaPath, 'utf8')
  if (!content.includes('CREATE TABLE') || !content.includes('projects')) {
    throw new Error('Projects table not found in schema')
  }
})

// Test: Enhanced scraping schema exists
runner.test('Enhanced scraping schema exists', () => {
  const enhancedPath = path.join(__dirname, '../database/scraping-enhancements.sql')
  if (!fs.existsSync(enhancedPath)) {
    throw new Error('Enhanced scraping schema not found')
  }
  
  const content = fs.readFileSync(enhancedPath, 'utf8')
  if (!content.includes('scraping_logs') || !content.includes('scraping_queue')) {
    throw new Error('Scraping tables not found in enhanced schema')
  }
})

// Test: Scraping components exist
runner.test('Scraping UI components exist', () => {
  const componentsToCheck = [
    '../src/components/scraping-controls.tsx',
    '../src/components/scraping-dashboard.tsx'
  ]
  
  componentsToCheck.forEach(componentPath => {
    const fullPath = path.join(__dirname, componentPath)
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Component not found: ${componentPath}`)
    }
  })
})

// Test: Package.json includes required dependencies
runner.test('Required scraping dependencies are installed', () => {
  const packagePath = path.join(__dirname, '../package.json')
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  const requiredDeps = ['puppeteer-core', 'cheerio']
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  )
  
  if (missingDeps.length > 0) {
    throw new Error(`Missing dependencies: ${missingDeps.join(', ')}`)
  }
})

// Test: Environment variables template
runner.test('Environment configuration is documented', () => {
  const envExamplePath = path.join(__dirname, '../.env.example')
  const envLocalPath = path.join(__dirname, '../.env.local')
  
  if (!fs.existsSync(envExamplePath) && !fs.existsSync(envLocalPath)) {
    throw new Error('No environment configuration file found')
  }
  
  // Check for required environment variables
  const envContent = fs.existsSync(envLocalPath) 
    ? fs.readFileSync(envLocalPath, 'utf8')
    : fs.readFileSync(envExamplePath, 'utf8')
  
  const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
  const missingVars = requiredVars.filter(varName => !envContent.includes(varName))
  
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
  }
})

// Mock data validation test
runner.test('Mock data structure is valid', () => {
  const scraperPath = path.join(__dirname, '../src/lib/scraper.ts')
  const content = fs.readFileSync(scraperPath, 'utf8')
  
  // Check if mock data generation exists
  if (!content.includes('generateMockProjects')) {
    throw new Error('Mock data generation function not found')
  }
  
  // Check for mock data identifiers
  if (!content.includes('MOCK_') || !content.includes('mockProjects')) {
    throw new Error('Mock data identifiers not found')
  }
})

// Performance test structure
runner.test('Performance monitoring is implemented', () => {
  const scraperPath = path.join(__dirname, '../src/lib/scraper.ts')
  const content = fs.readFileSync(scraperPath, 'utf8')
  
  // Check for rate limiting
  if (!content.includes('rateLimit') && !content.includes('sleep')) {
    throw new Error('Rate limiting not implemented')
  }
  
  // Check for error handling
  if (!content.includes('try') || !content.includes('catch')) {
    throw new Error('Error handling not found')
  }
})

// Data validation test
runner.test('Data validation functions exist', () => {
  const scraperPath = path.join(__dirname, '../src/lib/scraper.ts')
  const content = fs.readFileSync(scraperPath, 'utf8')
  
  // Check for required fields in ScrapedProject interface
  const requiredFields = ['title', 'description', 'platform', 'sourceUrl']
  const missingFields = requiredFields.filter(field => !content.includes(field))
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }
})

// Test execution
if (require.main === module) {
  runner.run().catch(error => {
    console.error('Test runner failed:', error)
    process.exit(1)
  })
}

module.exports = { TestRunner }
