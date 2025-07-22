/**
 * Testing Suite API
 * Provides endpoints for running tests and validating crawler performance
 */

import { NextRequest, NextResponse } from 'next/server'
import { crawlerTestSuite } from '@/lib/crawler-test-suite'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'run_all':
        const allResults = await crawlerTestSuite.runAllTests()
        return NextResponse.json(allResults)

      case 'run_suite':
        const suiteName = searchParams.get('suite')
        if (!suiteName) {
          return NextResponse.json({ error: 'Suite name required' }, { status: 400 })
        }
        
        const suiteResults = await crawlerTestSuite.runTestSuite(suiteName)
        return NextResponse.json({ 
          suite: suiteName,
          results: suiteResults,
          summary: {
            total: suiteResults.length,
            passed: suiteResults.filter(r => r.passed).length,
            failed: suiteResults.filter(r => !r.passed).length
          }
        })

      case 'validate_data':
        // Get recent scraped data for validation
        const { data: recentData, error } = await supabase
          .from('scraped_projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)

        if (error) {
          return NextResponse.json({ error: 'Failed to fetch data for validation' }, { status: 500 })
        }

        const validationReport = await crawlerTestSuite.validateDataQuality(recentData || [])
        return NextResponse.json({ 
          dataQuality: validationReport,
          dataCount: recentData?.length || 0
        })

      case 'regression':
        const regressionResults = await crawlerTestSuite.runRegressionTests()
        return NextResponse.json({ regression: regressionResults })

      case 'baselines':
        const { data: baselines } = await supabase
          .from('test_baselines')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        return NextResponse.json({ baselines: baselines || [] })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Testing API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'save_baseline':
        // Run all tests and save as baseline
        const testResults = await crawlerTestSuite.runAllTests()
        await crawlerTestSuite.saveBaseline(testResults.results)
        
        return NextResponse.json({ 
          message: 'Baseline saved successfully',
          testsCount: testResults.results.length,
          timestamp: new Date().toISOString()
        })

      case 'custom_validation':
        const { data: customData, rules } = data
        
        if (!customData) {
          return NextResponse.json({ error: 'Data required for validation' }, { status: 400 })
        }

        // For now, use default validation rules
        // In future, could accept custom rules
        const customValidation = await crawlerTestSuite.validateDataQuality(customData)
        
        return NextResponse.json({ 
          validation: customValidation,
          customRules: rules ? rules.length : 0
        })

      case 'performance_test':
        const { testType = 'full', iterations = 1 } = data
        
        const performanceResults = []
        
        for (let i = 0; i < iterations; i++) {
          const startTime = Date.now()
          
          let results
          if (testType === 'performance') {
            results = await crawlerTestSuite.runTestSuite('performance')
          } else {
            results = await crawlerTestSuite.runAllTests()
          }
          
          const duration = Date.now() - startTime
          performanceResults.push({
            iteration: i + 1,
            duration,
            testsRun: Array.isArray(results) ? results.length : results.results.length,
            passed: Array.isArray(results) 
              ? results.filter(r => r.passed).length 
              : results.summary.passed
          })
        }

        const avgDuration = performanceResults.reduce((sum, r) => sum + r.duration, 0) / iterations
        
        return NextResponse.json({
          performance: {
            testType,
            iterations,
            averageDuration: avgDuration,
            results: performanceResults
          }
        })

      case 'stress_test':
        const { concurrency = 3, duration = 60000 } = data // 1 minute default
        
        const stressResults = {
          startTime: new Date().toISOString(),
          concurrency,
          duration,
          completed: 0,
          failed: 0,
          averageTime: 0,
          errors: [] as string[]
        }

        const stressPromises = []
        const startTime = Date.now()
        
        for (let i = 0; i < concurrency; i++) {
          stressPromises.push(
            (async () => {
              const workerResults = []
              
              while (Date.now() - startTime < duration) {
                try {
                  const testStart = Date.now()
                  await crawlerTestSuite.runTestSuite('queue_system')
                  const testDuration = Date.now() - testStart
                  
                  workerResults.push({
                    duration: testDuration,
                    success: true
                  })
                  stressResults.completed++
                } catch (error) {
                  stressResults.failed++
                  stressResults.errors.push(error instanceof Error ? error.message : String(error))
                  workerResults.push({
                    duration: 0,
                    success: false
                  })
                }
                
                // Small delay between tests
                await new Promise(resolve => setTimeout(resolve, 100))
              }
              
              return workerResults
            })()
          )
        }

        const allWorkerResults = await Promise.all(stressPromises)
        const allResults = allWorkerResults.flat()
        const successfulResults = allResults.filter(r => r.success)
        
        stressResults.averageTime = successfulResults.length > 0 
          ? successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length
          : 0

        stressResults.errors = stressResults.errors.slice(0, 10) // Limit error array

        return NextResponse.json({ stressTest: stressResults })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Testing API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
