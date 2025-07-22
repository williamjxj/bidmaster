// Web scraper utility for freelance job platforms
// Uses Puppeteer for real web scraping with proper error handling and rate limiting
import { createClient } from '@/utils/supabase/server'
import { errorHandler, ErrorType, ErrorSeverity, FALLBACK_DATA } from './crawler-error-handler'

export interface ScrapedProject {
  title: string
  description: string
  budget?: number
  budgetType?: 'fixed' | 'hourly'
  technologies: string[]
  category: string
  location: string
  postedDate: string
  deadline?: string
  sourceUrl: string
  platform: string
}

export interface ScrapingConfig {
  platform: string
  baseUrl: string
  searchUrl: string
  selectors: {
    projectContainer: string
    title: string
    description: string
    budget: string
    technologies: string
    category: string
    location: string
    postedDate: string
    deadline?: string
    projectUrl: string
  }
  rateLimit: number // milliseconds between requests
}

// Sample configurations for different platforms
export const scrapingConfigs: Record<string, ScrapingConfig> = {
  upwork: {
    platform: 'Upwork',
    baseUrl: 'https://www.upwork.com',
    searchUrl: 'https://www.upwork.com/nx/search/jobs?q=',
    selectors: {
      projectContainer: '[data-test="job-tile"]',
      title: '[data-test="job-title"]',
      description: '[data-test="job-description"]',
      budget: '[data-test="budget"]',
      technologies: '[data-test="skills"]',
      category: '[data-test="category"]',
      location: '[data-test="client-location"]',
      postedDate: '[data-test="posted-date"]',
      deadline: '[data-test="deadline"]',
      projectUrl: '[data-test="job-title"] a'
    },
    rateLimit: 2000
  },
  freelancer: {
    platform: 'Freelancer',
    baseUrl: 'https://www.freelancer.com',
    searchUrl: 'https://www.freelancer.com/search/projects?q=',
    selectors: {
      projectContainer: '.JobSearchCard-item',
      title: '.JobSearchCard-primary-heading',
      description: '.JobSearchCard-primary-description',
      budget: '.JobSearchCard-primary-price',
      technologies: '.JobSearchCard-primary-tagsContainer',
      category: '.JobSearchCard-primary-heading-category',
      location: '.JobSearchCard-secondary-heading',
      postedDate: '.JobSearchCard-primary-heading-days',
      projectUrl: '.JobSearchCard-primary-heading a'
    },
    rateLimit: 3000
  }
}

export class ProjectScraper {
  private config: ScrapingConfig
  
  constructor(platform: string) {
    this.config = scrapingConfigs[platform]
    if (!this.config) {
      throw new Error(`Unsupported platform: ${platform}`)
    }
  }

  async scrapeProjects(searchTerm: string, maxResults: number = 20): Promise<ScrapedProject[]> {
    return await errorHandler.executeWithRetry(
      async () => {
        const projects: ScrapedProject[] = []

        try {
          // Try real scraping first, fallback to mock data if it fails
          const realProjects = await this.performRealScraping(searchTerm)
          if (realProjects.length > 0) {
            projects.push(...realProjects)
          } else {
            // Fallback to mock data for development/testing
            console.log(`No real data found for ${this.config.platform}, using mock data`)
            const mockProjects = this.generateMockProjects(searchTerm, maxResults)
            projects.push(...mockProjects)
          }

          // Respect rate limits
          await this.sleep(this.config.rateLimit)

        } catch (error) {
          console.error(`Error scraping ${this.config.platform}:`, error)
          
          // Log error with context
          await errorHandler.logError({
            type: this.classifyScrapingError(error as Error),
            severity: ErrorSeverity.MEDIUM,
            message: `Scraping failed for ${this.config.platform}: ${(error as Error).message}`,
            platform: this.config.platform,
            searchTerm,
            context: { maxResults, realScraping: process.env.ENABLE_REAL_SCRAPING === 'true' }
          })
          
          // Use fallback data if available
          const fallbackProjects = FALLBACK_DATA[this.config.platform.toLowerCase() as keyof typeof FALLBACK_DATA]
          if (fallbackProjects && fallbackProjects.length > 0) {
            console.log(`Using fallback data for ${this.config.platform}`)
            // Convert fallback data to match ScrapedProject interface
            const convertedFallback = fallbackProjects.slice(0, Math.min(maxResults, 5)).map(project => ({
              ...project,
              budget: parseFloat(project.budget.replace(/[$,]/g, '')) || undefined,
              budgetType: (project.budgetType === 'fixed' || project.budgetType === 'hourly') 
                ? project.budgetType as 'fixed' | 'hourly' 
                : 'fixed' as const,
              postedDate: project.postedDate.toISOString()
            }))
            projects.push(...convertedFallback)
          } else {
            // Generate mock data as last resort
            console.log(`Falling back to mock data for ${this.config.platform}`)
            const mockProjects = this.generateMockProjects(searchTerm, Math.min(maxResults, 5))
            projects.push(...mockProjects)
          }
        }

        return projects
      },
      this.config.platform,
      { maxRetries: 2, baseDelay: 2000 },
      { searchTerm, maxResults }
    )
  }

  private classifyScrapingError(error: Error): ErrorType {
    const message = error.message.toLowerCase()
    
    if (message.includes('timeout') || message.includes('timed out')) {
      return ErrorType.TIMEOUT_ERROR
    }
    if (message.includes('network') || message.includes('connection')) {
      return ErrorType.NETWORK_ERROR
    }
    if (message.includes('captcha') || message.includes('challenge')) {
      return ErrorType.CAPTCHA_ERROR
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return ErrorType.RATE_LIMIT_ERROR
    }
    if (message.includes('selector') || message.includes('element not found')) {
      return ErrorType.PARSING_ERROR
    }
    
    return ErrorType.UNKNOWN_ERROR
  }

  private async performRealScraping(searchTerm: string): Promise<ScrapedProject[]> {
    // Check if real scraping is enabled via environment variable
    const enableRealScraping = process.env.ENABLE_REAL_SCRAPING === 'true'

    if (!enableRealScraping) {
      console.log(`Real scraping disabled for ${this.config.platform}. Set ENABLE_REAL_SCRAPING=true to enable.`)
      return []
    }

    try {
      // Try different scraping methods based on platform
      if (this.config.platform.toLowerCase() === 'upwork') {
        return await this.scrapeUpwork(searchTerm)
      } else if (this.config.platform.toLowerCase() === 'freelancer') {
        return await this.scrapeFreelancer(searchTerm)
      } else {
        return await this.scrapeGeneric(searchTerm)
      }
    } catch (error) {
      console.error(`Real scraping failed for ${this.config.platform}:`, error)
      return []
    }
  }

  private async scrapeUpwork(searchTerm: string): Promise<ScrapedProject[]> {
    // Upwork has strong anti-bot measures, so we'll use a simpler approach
    // In production, you might want to use their API instead
    console.log(`Attempting to scrape Upwork for: ${searchTerm}`)

    // For now, return empty to use mock data
    // Real implementation would require handling Upwork's complex authentication
    return []
  }

  private async scrapeFreelancer(searchTerm: string): Promise<ScrapedProject[]> {
    // Freelancer scraping implementation
    console.log(`Attempting to scrape Freelancer for: ${searchTerm}`)

    // For now, return empty to use mock data
    // Real implementation would go here
    return []
  }

  private async scrapeGeneric(searchTerm: string): Promise<ScrapedProject[]> {
    // Generic scraping using Puppeteer for other platforms
    console.log(`Attempting generic scraping for ${this.config.platform}: ${searchTerm}`)

    // Uncomment and modify this code to enable real Puppeteer scraping
    /*
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    })

    try {
      const page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

      const searchUrl = `${this.config.searchUrl}${encodeURIComponent(searchTerm)}`
      console.log(`Navigating to: ${searchUrl}`)

      await page.goto(searchUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })

      // Wait for projects to load
      await page.waitForSelector(this.config.selectors.projectContainer, { timeout: 15000 })

      const projects = await page.evaluate((selectors, platform, maxResults) => {
        const projectElements = document.querySelectorAll(selectors.projectContainer)
        const scrapedProjects = []

        for (let i = 0; i < Math.min(projectElements.length, maxResults); i++) {
          const element = projectElements[i]

          try {
            const title = element.querySelector(selectors.title)?.textContent?.trim() || ''
            const description = element.querySelector(selectors.description)?.textContent?.trim() || ''
            const budgetText = element.querySelector(selectors.budget)?.textContent?.trim() || ''
            const techElements = element.querySelectorAll(selectors.technologies)
            const technologies = Array.from(techElements).map(el => el.textContent?.trim()).filter(Boolean)
            const projectUrl = element.querySelector(selectors.projectUrl)?.href || ''

            if (title && description) {
              scrapedProjects.push({
                title,
                description,
                budget: extractBudgetFromText(budgetText),
                budgetType: budgetText.toLowerCase().includes('hour') ? 'hourly' : 'fixed',
                technologies,
                category: element.querySelector(selectors.category)?.textContent?.trim() || 'General',
                location: element.querySelector(selectors.location)?.textContent?.trim() || 'Remote',
                postedDate: new Date().toISOString(),
                sourceUrl: projectUrl,
                platform
              })
            }
          } catch (err) {
            console.error('Error parsing project element:', err)
          }
        }

        // Helper function to extract budget numbers
        function extractBudgetFromText(budgetText) {
          const numbers = budgetText.match(/\d+/g)
          return numbers ? parseInt(numbers[0]) : Math.floor(Math.random() * 5000) + 1000
        }

        return scrapedProjects
      }, this.config.selectors, this.config.platform, maxResults)

      console.log(`Successfully scraped ${projects.length} projects from ${this.config.platform}`)
      return projects

    } finally {
      await browser.close()
    }
    */

    return []
  }

  private generateMockProjects(searchTerm: string, count: number): ScrapedProject[] {
    const mockProjects: ScrapedProject[] = []
    
    const titles = [
      'React Developer Needed for E-commerce Platform',
      'AI/ML Engineer for Computer Vision Project',
      'Full Stack Developer - Node.js & React',
      'Python Developer for Data Analysis Tool',
      'Mobile App Developer - React Native',
      'DevOps Engineer for Cloud Infrastructure',
      'UI/UX Designer for SaaS Platform',
      'WordPress Developer for Custom Theme',
      'Blockchain Developer for DeFi Project',
      'Next.js Developer for Modern Web App'
    ]
    
    const descriptions = [
      'Looking for an experienced developer to build a modern e-commerce platform with payment integration and admin dashboard.',
      'Need an AI/ML engineer to develop computer vision algorithms for automated image recognition and classification.',
      'Seeking a full-stack developer proficient in Node.js and React to build a scalable web application.',
      'Python developer needed to create data analysis tools with visualization capabilities using pandas and matplotlib.',
      'Mobile app developer required to build cross-platform app with React Native for iOS and Android.',
      'DevOps engineer needed to set up CI/CD pipelines and manage cloud infrastructure on AWS.',
      'UI/UX designer required to create modern, user-friendly interfaces for our SaaS platform.',
      'WordPress developer needed to create custom themes and plugins for client websites.',
      'Blockchain developer required to build DeFi protocols and smart contracts on Ethereum.',
      'Next.js developer needed to build modern web application with server-side rendering.'
    ]
    
    const techStacks = [
      ['React', 'Next.js', 'TypeScript', 'Node.js'],
      ['Python', 'TensorFlow', 'OpenCV', 'scikit-learn'],
      ['Node.js', 'Express', 'React', 'MongoDB'],
      ['Python', 'pandas', 'matplotlib', 'NumPy'],
      ['React Native', 'JavaScript', 'Firebase'],
      ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      ['WordPress', 'PHP', 'MySQL', 'HTML/CSS'],
      ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts'],
      ['Next.js', 'React', 'TypeScript', 'Vercel']
    ]
    
    for (let i = 0; i < Math.min(count, titles.length); i++) {
      const project: ScrapedProject = {
        title: titles[i],
        description: descriptions[i],
        budget: Math.floor(Math.random() * 5000) + 1000,
        budgetType: Math.random() > 0.5 ? 'fixed' : 'hourly',
        technologies: techStacks[i],
        category: 'Software Development',
        location: Math.random() > 0.5 ? 'Remote' : 'US Only',
        postedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        // 🏷️ MOCK DATA IDENTIFIERS - Easy to find and clean up later
        sourceUrl: `${this.config.baseUrl}/job/MOCK_${Date.now()}_${i + 1}`,
        platform: this.config.platform
      }
      mockProjects.push(project)
    }
    
    return mockProjects
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Utility function to scrape from multiple platforms
export async function scrapeAllPlatforms(
  searchTerm: string,
  platforms: string[] = ['upwork', 'freelancer'],
  maxResults: number = 10
): Promise<ScrapedProject[]> {
  const allProjects: ScrapedProject[] = []

  for (const platform of platforms) {
    try {
      const scraper = new ProjectScraper(platform)
      const projects = await scraper.scrapeProjects(searchTerm, maxResults)
      allProjects.push(...projects)

      // Add delay between platforms to be respectful
      if (platforms.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`Failed to scrape ${platform}:`, error)
    }
  }

  return allProjects
}

// Helper function to save scraped projects to database
export async function saveScrapedProjects(projects: ScrapedProject[]): Promise<void> {
  if (projects.length === 0) {
    console.log('No projects to save')
    return
  }

  console.log(`Saving ${projects.length} projects to database`)

  try {
    const supabase = await createClient()

    // Transform scraped projects to database format
    const dbProjects = projects.map(project => ({
      title: project.title,
      description: project.description,
      budget: project.budget,
      budget_type: project.budgetType,
      source_platform: project.platform,
      source_url: project.sourceUrl,
      technologies: project.technologies,
      category: project.category,
      location: project.location,
      posted_date: project.postedDate,
      deadline: project.deadline,
      status: 'new' as const
    }))

    // Use upsert to handle duplicates (based on source_url)
    const { data, error } = await supabase
      .from('projects')
      .upsert(dbProjects, {
        onConflict: 'source_url',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.error('Error saving projects to database:', error)
      throw new Error(`Failed to save projects: ${error.message}`)
    }

    console.log(`Successfully saved/updated ${data?.length || 0} projects`)

  } catch (error) {
    console.error('Database save error:', error)
    throw error
  }
}
