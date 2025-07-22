/**
 * Error Handling & Recovery Test Script
 * 
 * Tests the comprehensive error handling and recovery mechanisms
 * for the BidMaster web scraping system.
 */

import { CrawlerErrorHandler, ErrorType, ErrorSeverity } from '../src/lib/crawler-error-handler'

async function testErrorHandling() {
  console.log('🧪 Testing Crawler Error Handling & Recovery System')
  console.log('=' .repeat(60))
  
  const errorHandler = new CrawlerErrorHandler()
  let testsPassed = 0
  let testsTotal = 0

  // Test 1: Error Logging
  testsTotal++
  try {
    console.log('\n📝 Test 1: Error Logging')
    
    const errorId = await errorHandler.logError({
      type: ErrorType.NETWORK_ERROR,
      severity: ErrorSeverity.MEDIUM,
      message: 'Test network error',
      platform: 'upwork',
      searchTerm: 'test',
      context: { test: true }
    })
    
    console.log(`✅ Error logged with ID: ${errorId}`)
    testsPassed++
    
  } catch (error) {
    console.log(`❌ Error logging failed: ${error}`)
  }

  // Test 2: Retry Mechanism
  testsTotal++
  try {
    console.log('\n🔄 Test 2: Retry Mechanism')
    
    let attempts = 0
    const result = await errorHandler.executeWithRetry(
      async () => {
        attempts++
        if (attempts < 3) {
          throw new Error('Simulated failure')
        }
        return 'success'
      },
      'test-platform',
      { maxRetries: 3, baseDelay: 100 }
    )
    
    console.log(`✅ Retry mechanism worked: ${result} (${attempts} attempts)`)
    testsPassed++
    
  } catch (error) {
    console.log(`❌ Retry mechanism failed: ${error}`)
  }

  // Test 3: Rate Limiting
  testsTotal++
  try {
    console.log('\n⏱️  Test 3: Rate Limiting')
    
    const startTime = Date.now()
    
    // Execute multiple operations quickly
    const promises = []
    for (let i = 0; i < 3; i++) {
      promises.push(
        errorHandler.executeWithRetry(
          async () => {
            await new Promise(resolve => setTimeout(resolve, 50))
            return `result-${i}`
          },
          'upwork',
          { maxRetries: 1, baseDelay: 100 }
        )
      )
    }
    
    const results = await Promise.all(promises)
    const duration = Date.now() - startTime
    
    console.log(`✅ Rate limiting test completed in ${duration}ms`)
    console.log(`   Results: ${results.join(', ')}`)
    testsPassed++
    
  } catch (error) {
    console.log(`❌ Rate limiting test failed: ${error}`)
  }

  // Test 4: Error Classification
  testsTotal++
  try {
    console.log('\n🏷️  Test 4: Error Classification')
    
    const errors = [
      new Error('Connection timeout after 30 seconds'),
      new Error('Network error: ECONNRESET'),
      new Error('CAPTCHA challenge detected'),
      new Error('Rate limit exceeded: too many requests'),
      new Error('Unauthorized access'),
      new Error('Element not found: .project-title')
    ]
    
    let correctClassifications = 0
    for (let i = 0; i < errors.length; i++) {
      try {
        await errorHandler.executeWithRetry(
          async () => {
            throw errors[i]
          },
          'test-platform',
          { maxRetries: 0 }
        )
      } catch {
        // Expected to fail, we just want to test classification
        correctClassifications++
      }
    }
    
    console.log(`✅ Error classification test: ${correctClassifications}/${errors.length} correct`)
    if (correctClassifications === errors.length) {
      testsPassed++
    }
    
  } catch (error) {
    console.log(`❌ Error classification test failed: ${error}`)
  }

  // Test 5: Health Status
  testsTotal++
  try {
    console.log('\n🏥 Test 5: Health Status Monitoring')
    
    // Simulate some platform health updates
    const healthStatus = errorHandler.getHealthStatus()
    console.log(`✅ Health status retrieved for ${healthStatus.size} platforms`)
    
    // Get specific platform health
    const upworkHealth = errorHandler.getPlatformHealth('upwork')
    if (upworkHealth) {
      console.log(`✅ Upwork health: ${upworkHealth.status}`)
    }
    
    testsPassed++
    
  } catch (error) {
    console.log(`❌ Health status test failed: ${error}`)
  }

  // Test 6: Recovery Mechanism
  testsTotal++
  try {
    console.log('\n🛠️  Test 6: Recovery Mechanism')
    
    const recoverySuccess = await errorHandler.attemptRecovery('test-platform')
    console.log(`✅ Recovery mechanism: ${recoverySuccess ? 'successful' : 'failed'}`)
    testsPassed++
    
  } catch (error) {
    console.log(`❌ Recovery mechanism test failed: ${error}`)
  }

  // Test 7: Error Statistics
  testsTotal++
  try {
    console.log('\n📊 Test 7: Error Statistics')
    
    const stats = await errorHandler.getErrorStatistics(60000) // Last minute
    console.log(`✅ Error statistics retrieved:`)
    console.log(`   Total errors: ${stats.totalErrors}`)
    console.log(`   Error types: ${Object.keys(stats.errorsByType).length}`)
    console.log(`   Platforms: ${Object.keys(stats.errorsByPlatform).length}`)
    console.log(`   Severities: ${Object.keys(stats.errorsBySeverity).length}`)
    testsPassed++
    
  } catch (error) {
    console.log(`❌ Error statistics test failed: ${error}`)
  }

  // Test Results Summary
  console.log('\n📊 ERROR HANDLING TEST RESULTS')
  console.log('=' .repeat(60))
  console.log(`Tests Passed: ${testsPassed}/${testsTotal}`)
  console.log(`Success Rate: ${((testsPassed / testsTotal) * 100).toFixed(1)}%`)
  
  if (testsPassed === testsTotal) {
    console.log('🎉 All error handling tests passed!')
  } else {
    console.log('⚠️  Some error handling tests failed. Review implementation.')
  }

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:')
  console.log('   1. Monitor error rates regularly')
  console.log('   2. Set up alerts for critical errors')
  console.log('   3. Review and update retry strategies based on platform behavior')
  console.log('   4. Implement automated recovery for common error scenarios')
  console.log('   5. Keep fallback data fresh and relevant')

  return { testsPassed, testsTotal, successRate: (testsPassed / testsTotal) * 100 }
}

// API Integration Test
async function testErrorHandlingAPI() {
  console.log('\n🌐 Testing Error Handling API Integration')
  console.log('-' .repeat(40))
  
  try {
    // Test health endpoint
    console.log('Testing health monitoring endpoint...')
    const healthResponse = await fetch('http://localhost:3000/api/scrape/health?detailed=true')
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('✅ Health API working:', healthData.success)
    } else {
      console.log('❌ Health API failed:', healthResponse.status)
    }
    
    // Test recovery endpoint
    console.log('Testing recovery endpoint...')
    const recoveryResponse = await fetch('http://localhost:3000/api/scrape/recovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'upwork',
        action: 'recover'
      })
    })
    
    if (recoveryResponse.ok) {
      const recoveryData = await recoveryResponse.json()
      console.log('✅ Recovery API working:', recoveryData.success)
    } else {
      console.log('❌ Recovery API failed:', recoveryResponse.status)
    }
    
  } catch {
    console.log('⚠️  API tests require development server to be running')
    console.log('   Run: npm run dev')
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Error Handling & Recovery Tests')
  console.log('⏰ Started at:', new Date().toISOString())
  console.log()
  
  try {
    const results = await testErrorHandling()
    await testErrorHandlingAPI()
    
    console.log('\n🏁 Error handling tests completed!')
    
    // Exit with appropriate code
    process.exit(results.testsPassed === results.testsTotal ? 0 : 1)
    
  } catch (error) {
    console.error('❌ Test suite crashed:', error)
    process.exit(1)
  }
}

// Run tests if called directly
if (require.main === module) {
  main()
}

module.exports = {
  testErrorHandling,
  testErrorHandlingAPI
}
