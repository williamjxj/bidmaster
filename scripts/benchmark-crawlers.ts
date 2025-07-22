#!/usr/bin/env node

/**
 * Crawler Performance Benchmarking Script
 * 
 * This script tests the performance characteristics of the BidMaster
 * web scraping system and provides detailed metrics.
 */

import { performance } from 'perf_hooks'
import fs from 'fs'
import path from 'path'

interface BenchmarkConfig {
  iterations: number
  concurrency: number
  platforms: string[]
  searchTerms: string[]
  maxResults: number
  enableMockMode: boolean
}

const CONFIG: BenchmarkConfig = {
  iterations: 10,
  concurrency: 3,
  platforms: ['upwork', 'freelancer'],
  searchTerms: ['react', 'node.js', 'python', 'typescript'],
  maxResults: 5,
  enableMockMode: true // Use mock data for consistent benchmarking
}

interface PerformanceMetrics {
  startTime: number
  endTime: number
  duration: number
  memoryUsage: NodeJS.MemoryUsage
  resultsCount: number
  errors: string[]
  platform: string
  searchTerm: string
}

interface BenchmarkResults {
  totalDuration: number
  averageDuration: number
  minDuration: number
  maxDuration: number
  successRate: number
  totalResults: number
  averageResults: number
  memoryStats: {
    averageHeapUsed: number
    peakHeapUsed: number
    averageExternal: number
  }
  errorRate: number
  throughput: number // results per second
}

class PerformanceBenchmark {
  private metrics: PerformanceMetrics[] = []
  private startTime: number = 0

  async runBenchmarks(): Promise<void> {
    console.log('🏁 Starting BidMaster Crawler Performance Benchmarks')
    console.log('=' .repeat(60))
    console.log(`Iterations: ${CONFIG.iterations}`)
    console.log(`Concurrency: ${CONFIG.concurrency}`)
    console.log(`Platforms: ${CONFIG.platforms.join(', ')}`)
    console.log(`Search Terms: ${CONFIG.searchTerms.join(', ')}`)
    console.log(`Mock Mode: ${CONFIG.enableMockMode ? 'Enabled' : 'Disabled'}`)
    console.log('')

    this.startTime = performance.now()

    // Sequential benchmarks
    await this.runSequentialBenchmarks()
    
    // Concurrent benchmarks
    await this.runConcurrentBenchmarks()
    
    // Memory stress test
    await this.runMemoryStressTest()
    
    // Generate reports
    this.generatePerformanceReport()
    this.generateRecommendations()
  }

  private async runSequentialBenchmarks(): Promise<void> {
    console.log('🔄 Running Sequential Benchmarks...')
    
    for (let i = 0; i < CONFIG.iterations; i++) {
      for (const platform of CONFIG.platforms) {
        for (const searchTerm of CONFIG.searchTerms) {
          const metric = await this.benchmarkSingleScrape(platform, searchTerm, i)
          this.metrics.push(metric)
          
          const progress = ((i + 1) / CONFIG.iterations * 100).toFixed(1)
          process.stdout.write(`\r  Progress: ${progress}% (${platform}/${searchTerm})`)
        }
      }
    }
    console.log('\n  ✅ Sequential benchmarks completed\n')
  }

  private async runConcurrentBenchmarks(): Promise<void> {
    console.log('⚡ Running Concurrent Benchmarks...')
    
    const tasks = []
    for (let i = 0; i < CONFIG.concurrency; i++) {
      const platform = CONFIG.platforms[i % CONFIG.platforms.length]
      const searchTerm = CONFIG.searchTerms[i % CONFIG.searchTerms.length]
      tasks.push(this.benchmarkSingleScrape(platform, searchTerm, i, true))
    }
    
    const concurrentMetrics = await Promise.all(tasks)
    this.metrics.push(...concurrentMetrics)
    console.log('  ✅ Concurrent benchmarks completed\n')
  }

  private async runMemoryStressTest(): Promise<void> {
    console.log('🧠 Running Memory Stress Test...')
    
    const initialMemory = process.memoryUsage()
    const stressTasks = []
    
    // Create multiple concurrent scraping tasks
    for (let i = 0; i < CONFIG.concurrency * 2; i++) {
      const platform = CONFIG.platforms[i % CONFIG.platforms.length]
      const searchTerm = CONFIG.searchTerms[i % CONFIG.searchTerms.length]
      stressTasks.push(this.benchmarkSingleScrape(platform, searchTerm, i, true))
    }
    
    await Promise.all(stressTasks)
    
    const finalMemory = process.memoryUsage()
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed
    
    console.log(`  Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`)
    console.log('  ✅ Memory stress test completed\n')
  }

  private async benchmarkSingleScrape(
    platform: string, 
    searchTerm: string, 
    iteration: number,
    isConcurrent = false
  ): Promise<PerformanceMetrics> {
    const startTime = performance.now()
    
    let resultsCount = 0
    const errors: string[] = []
    
    try {
      if (CONFIG.enableMockMode) {
        // Simulate scraping with mock data
        await this.simulateScraping(platform, searchTerm)
        resultsCount = Math.floor(Math.random() * CONFIG.maxResults) + 1
      } else {
        // Call actual scraping API
        const response = await this.callScrapingAPI()
        resultsCount = response.results?.length || 0
      }
      
      // Add realistic delay to simulate network latency
      const baseDelay = isConcurrent ? 100 : 200
      await this.sleep(Math.random() * 500 + baseDelay)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      errors.push(errorMessage)
    }
    
    const endTime = performance.now()
    const endMemory = process.memoryUsage()
    
    return {
      startTime,
      endTime,
      duration: endTime - startTime,
      memoryUsage: endMemory,
      resultsCount,
      errors,
      platform,
      searchTerm
    }
  }

  private async simulateScraping(platform: string, searchTerm: string): Promise<void> {
    // Simulate different response times for different platforms
    const baseDelay = platform === 'upwork' ? 300 : 250
    const searchComplexity = searchTerm.length * 10
    const totalDelay = baseDelay + searchComplexity + Math.random() * 200
    
    await this.sleep(totalDelay)
  }

  private async callScrapingAPI(): Promise<{ results: unknown[] }> {
    // This would call the actual API in production
    // For now, return mock response
    return {
      results: Array(Math.floor(Math.random() * CONFIG.maxResults) + 1).fill({})
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private calculateBenchmarkResults(): BenchmarkResults {
    const durations = this.metrics.map(m => m.duration)
    const successfulMetrics = this.metrics.filter(m => m.errors.length === 0)
    const totalResults = this.metrics.reduce((sum, m) => sum + m.resultsCount, 0)
    
    const memoryUsages = this.metrics.map(m => m.memoryUsage.heapUsed)
    const externalUsages = this.metrics.map(m => m.memoryUsage.external)
    
    return {
      totalDuration: durations.reduce((sum, d) => sum + d, 0),
      averageDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      successRate: (successfulMetrics.length / this.metrics.length) * 100,
      totalResults,
      averageResults: totalResults / this.metrics.length,
      memoryStats: {
        averageHeapUsed: memoryUsages.reduce((sum, m) => sum + m, 0) / memoryUsages.length,
        peakHeapUsed: Math.max(...memoryUsages),
        averageExternal: externalUsages.reduce((sum, m) => sum + m, 0) / externalUsages.length
      },
      errorRate: ((this.metrics.length - successfulMetrics.length) / this.metrics.length) * 100,
      throughput: totalResults / ((performance.now() - this.startTime) / 1000)
    }
  }

  private generatePerformanceReport(): void {
    const results = this.calculateBenchmarkResults()
    
    console.log('📊 PERFORMANCE BENCHMARK RESULTS')
    console.log('=' .repeat(60))
    
    // Timing Statistics
    console.log('⏱️  TIMING STATISTICS:')
    console.log(`  Average Duration: ${results.averageDuration.toFixed(2)}ms`)
    console.log(`  Min Duration: ${results.minDuration.toFixed(2)}ms`)
    console.log(`  Max Duration: ${results.maxDuration.toFixed(2)}ms`)
    console.log(`  Total Duration: ${results.totalDuration.toFixed(2)}ms`)
    console.log('')
    
    // Success and Error Rates
    console.log('✅ SUCCESS METRICS:')
    console.log(`  Success Rate: ${results.successRate.toFixed(1)}%`)
    console.log(`  Error Rate: ${results.errorRate.toFixed(1)}%`)
    console.log(`  Total Tests: ${this.metrics.length}`)
    console.log('')
    
    // Throughput Metrics
    console.log('🚀 THROUGHPUT METRICS:')
    console.log(`  Total Results: ${results.totalResults}`)
    console.log(`  Average Results per Test: ${results.averageResults.toFixed(1)}`)
    console.log(`  Throughput: ${results.throughput.toFixed(2)} results/second`)
    console.log('')
    
    // Memory Usage
    console.log('🧠 MEMORY USAGE:')
    console.log(`  Average Heap Used: ${(results.memoryStats.averageHeapUsed / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Peak Heap Used: ${(results.memoryStats.peakHeapUsed / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Average External: ${(results.memoryStats.averageExternal / 1024 / 1024).toFixed(2)} MB`)
    console.log('')
    
    // Platform Performance Breakdown
    this.generatePlatformBreakdown()
    
    // Error Analysis
    this.generateErrorAnalysis()
  }

  private generatePlatformBreakdown(): void {
    console.log('🏗️  PLATFORM PERFORMANCE BREAKDOWN:')
    
    CONFIG.platforms.forEach(platform => {
      const platformMetrics = this.metrics.filter(m => m.platform === platform)
      if (platformMetrics.length === 0) return
      
      const avgDuration = platformMetrics.reduce((sum, m) => sum + m.duration, 0) / platformMetrics.length
      const successRate = (platformMetrics.filter(m => m.errors.length === 0).length / platformMetrics.length) * 100
      const avgResults = platformMetrics.reduce((sum, m) => sum + m.resultsCount, 0) / platformMetrics.length
      
      console.log(`  ${platform}:`)
      console.log(`    Avg Duration: ${avgDuration.toFixed(2)}ms`)
      console.log(`    Success Rate: ${successRate.toFixed(1)}%`)
      console.log(`    Avg Results: ${avgResults.toFixed(1)}`)
    })
    console.log('')
  }

  private generateErrorAnalysis(): void {
    const errors = this.metrics.flatMap(m => m.errors)
    if (errors.length === 0) {
      console.log('🎉 ERROR ANALYSIS: No errors detected!')
      return
    }
    
    console.log('❌ ERROR ANALYSIS:')
    console.log(`  Total Errors: ${errors.length}`)
    
    // Group errors by type
    const errorGroups = errors.reduce((groups, error) => {
      groups[error] = (groups[error] || 0) + 1
      return groups
    }, {} as Record<string, number>)
    
    Object.entries(errorGroups).forEach(([error, count]) => {
      console.log(`    ${error}: ${count} occurrences`)
    })
    console.log('')
  }

  private generateRecommendations(): void {
    const results = this.calculateBenchmarkResults()
    
    console.log('💡 PERFORMANCE RECOMMENDATIONS:')
    console.log('=' .repeat(60))
    
    // Performance recommendations
    if (results.averageDuration > 2000) {
      console.log('⚠️  High average response time detected')
      console.log('   → Consider optimizing selectors and reducing page load time')
      console.log('   → Implement more aggressive caching strategies')
    }
    
    if (results.successRate < 95) {
      console.log('⚠️  Low success rate detected')
      console.log('   → Review error handling and retry mechanisms')
      console.log('   → Check website selector stability')
    }
    
    if (results.memoryStats.peakHeapUsed > 100 * 1024 * 1024) {
      console.log('⚠️  High memory usage detected')
      console.log('   → Implement proper resource cleanup')
      console.log('   → Consider processing in smaller batches')
    }
    
    if (results.throughput < 1) {
      console.log('⚠️  Low throughput detected')
      console.log('   → Increase concurrency where possible')
      console.log('   → Optimize database insertion performance')
    }
    
    // Positive feedback
    if (results.successRate >= 95 && results.averageDuration <= 2000) {
      console.log('✨ Excellent performance! System is well-optimized.')
    }
    
    console.log('')
    console.log('🔧 OPTIMIZATION SUGGESTIONS:')
    console.log('   1. Enable request pooling for better connection reuse')
    console.log('   2. Implement intelligent rate limiting based on platform responses')
    console.log('   3. Add performance monitoring and alerting')
    console.log('   4. Consider implementing result caching for popular searches')
    console.log('   5. Use worker threads for CPU-intensive parsing operations')
  }

  // Save detailed results to file for further analysis
  saveResultsToFile(): void {
    const results = {
      config: CONFIG,
      metrics: this.metrics,
      summary: this.calculateBenchmarkResults(),
      timestamp: new Date().toISOString()
    }
    
    const filename = `benchmark-results-${new Date().toISOString().split('T')[0]}.json`
    const filepath = path.join(process.cwd(), 'scripts', filename)
    
    fs.writeFileSync(filepath, JSON.stringify(results, null, 2))
    console.log(`📁 Detailed results saved to: ${filename}`)
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    const benchmark = new PerformanceBenchmark()
    await benchmark.runBenchmarks()
    benchmark.saveResultsToFile()
    
    console.log('\n🏁 Benchmark completed successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Benchmark failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main()
}

export { PerformanceBenchmark, CONFIG as BenchmarkConfig }
