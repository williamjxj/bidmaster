/**
 * Main orchestrator for project analysis
 * Coordinates all analyses and generates reports
 */

import { analyzeStructure, generateStructureReport } from './analyze-structure';
import { analyzeDependencies, generateDependencyReport } from './analyze-dependencies';
import { analyzeUnusedFiles, generateUnusedFilesReport } from './analyze-unused-files';
import { generateRecommendations, generateRecommendationsReport } from './generate-recommendations';
import type {
  ProjectStructureSummary,
  DependencyAnalysisReport,
  UnusedFilesReport,
  ImprovementRecommendations,
} from './types/analysis-types';
import { DEFAULT_OUTPUT_DIR, DEFAULT_ARCHIVE_DIR } from './config/constants';
import { safeExecute, gracefulExecute } from './utils/error-handler';
import { createDirectory } from './utils/fs-utils';
import { join } from 'path';

/**
 * Analysis options
 */
export interface AnalysisOptions {
  outputDir?: string;
  archiveDir?: string;
  includeCleanup?: boolean;
  dryRun?: boolean;
  rootDir?: string;
}

/**
 * Analysis result
 */
export interface AnalysisResult {
  structure: ProjectStructureSummary | null;
  dependencies: DependencyAnalysisReport | null;
  unusedFiles: UnusedFilesReport | null;
  recommendations: ImprovementRecommendations | null;
  duration: number;
  success: boolean;
  errors?: string[];
}

/**
 * Analyze entire project
 */
export async function analyzeProject(
  options: AnalysisOptions = {}
): Promise<AnalysisResult> {
  const startTime = Date.now();
  const {
    outputDir = DEFAULT_OUTPUT_DIR,
    archiveDir = DEFAULT_ARCHIVE_DIR,
    includeCleanup = false,
    dryRun = true,
    rootDir = process.cwd(),
  } = options;
  
  // Ensure output directories exist
  await createDirectory(outputDir);
  await createDirectory(archiveDir);
  
  const errors: string[] = [];
  let structure: ProjectStructureSummary | null = null;
  let dependencies: DependencyAnalysisReport | null = null;
  let unusedFiles: UnusedFilesReport | null = null;
  let recommendations: ImprovementRecommendations | null = null;
  
  // Phase 1: Parallel execution of independent analyses (US1, US2, US3)
  console.log('Starting parallel analyses (Structure, Dependencies, Unused Files)...');
  const phase1StartTime = Date.now();
  
  const parallelResults = await Promise.allSettled([
    // User Story 1: Structure Analysis
    safeExecute(async () => {
      console.log('Analyzing project structure...');
      const analysisStart = Date.now();
      try {
        const result = await analyzeStructure({
          rootDir,
          ignorePatterns: [],
        });
        structure = result;
        await generateStructureReport(result, join(outputDir, 'structure-summary.md'));
        const duration = ((Date.now() - analysisStart) / 1000).toFixed(2);
        console.log(`✓ Structure analysis complete (${duration}s)`);
        return result;
      } catch (error) {
        console.error('Structure analysis error:', error);
        throw error;
      }
    }),
    
    // User Story 2: Dependency Analysis
    safeExecute(async () => {
      console.log('Analyzing dependencies...');
      const analysisStart = Date.now();
      try {
        const result = await analyzeDependencies({
          includeDevDependencies: true,
        });
        dependencies = result;
        await generateDependencyReport(result, join(outputDir, 'dependency-report.md'));
        const duration = ((Date.now() - analysisStart) / 1000).toFixed(2);
        console.log(`✓ Dependency analysis complete (${duration}s)`);
        return result;
      } catch (error) {
        console.error('Dependency analysis error:', error);
        throw error;
      }
    }),
    
    // User Story 3: Unused Files Analysis
    safeExecute(async () => {
      console.log('Analyzing unused files...');
      const analysisStart = Date.now();
      try {
        const result = await analyzeUnusedFiles({
          rootDir,
          ignorePatterns: [],
          checkDynamicImports: true,
        });
        unusedFiles = result;
        await generateUnusedFilesReport(result, join(outputDir, 'unused-files-report.md'));
        const duration = ((Date.now() - analysisStart) / 1000).toFixed(2);
        console.log(`✓ Unused files analysis complete (${duration}s)`);
        return result;
      } catch (error) {
        console.error('Unused files analysis error:', error);
        throw error;
      }
    }),
  ]);
  
  // Check for errors in parallel execution
  parallelResults.forEach((result, index) => {
    if (result.status === 'rejected') {
      const analysisNames = ['Structure', 'Dependencies', 'Unused Files'];
      const errorMsg = `${analysisNames[index]} analysis failed: ${result.reason}`;
      errors.push(errorMsg);
      console.error(`✗ ${errorMsg}`);
    } else if (result.value && !result.value.success) {
      const errorMsg = result.value.error?.message || 'Unknown error';
      errors.push(errorMsg);
      console.error(`✗ Analysis error: ${errorMsg}`);
    }
  });
  
  const phase1Duration = ((Date.now() - phase1StartTime) / 1000).toFixed(2);
  console.log(`Phase 1 (parallel analyses) completed in ${phase1Duration}s`);
  
  // Phase 2: Sequential execution of dependent analysis (US4)
  // Recommendations depend on all previous analyses
  if (structure && dependencies && unusedFiles) {
    console.log('Generating improvement recommendations...');
    const recommendationsStart = Date.now();
    
    const recommendationsResult = await safeExecute(async () => {
      try {
        const result = await generateRecommendations({
          structure: structure!,
          dependencies: dependencies!,
          unusedFiles: unusedFiles!,
        });
        recommendations = result;
        await generateRecommendationsReport(result, join(outputDir, 'improvement-recommendations.md'));
        const duration = ((Date.now() - recommendationsStart) / 1000).toFixed(2);
        console.log(`✓ Recommendations generated (${duration}s)`);
        return result;
      } catch (error) {
        console.error('Recommendations generation error:', error);
        throw error;
      }
    });
    
    if (!recommendationsResult.success) {
      const errorMsg = `Recommendations generation failed: ${recommendationsResult.error.message}`;
      errors.push(errorMsg);
      console.error(`✗ ${errorMsg}`);
    }
  } else {
    const errorMsg = 'Cannot generate recommendations: missing required analyses';
    errors.push(errorMsg);
    console.warn(`⚠ ${errorMsg}`);
  }
  
  // Phase 3: Cleanup (if requested)
  if (includeCleanup) {
    console.log('Preparing cleanup summaries...');
    const { generateTaskmasterSummary, generateTasksSummary } = await import('./cleanup-unused');
    
    // Generate archival summaries
    const archivalResults = await Promise.allSettled([
      safeExecute(async () => {
        const summary = await generateTaskmasterSummary(rootDir);
        if (summary) {
          const { generateMarkdownReport } = await import('./utils/report-utils');
          await generateMarkdownReport(
            join(archiveDir, 'taskmaster-summary.md'),
            'Taskmaster Folder Summary',
            formatTaskmasterSummary(summary),
            { 'Generated At': new Date().toISOString() }
          );
          console.log('✓ Taskmaster summary generated');
        }
        return summary;
      }),
      safeExecute(async () => {
        const summary = await generateTasksSummary(rootDir);
        if (summary) {
          const { generateMarkdownReport } = await import('./utils/report-utils');
          await generateMarkdownReport(
            join(archiveDir, 'tasks-summary.md'),
            'Tasks Folder Summary',
            formatTasksSummary(summary),
            { 'Generated At': new Date().toISOString() }
          );
          console.log('✓ Tasks summary generated');
        }
        return summary;
      }),
    ]);
    
    archivalResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        const summaryNames = ['Taskmaster', 'Tasks'];
        errors.push(`${summaryNames[index]} summary generation failed: ${result.reason}`);
      } else if (result.value && !result.value.success) {
        errors.push(`${result.value.error?.message || 'Unknown error'}`);
      }
    });
  }
  
  const duration = Date.now() - startTime;
  const durationSeconds = (duration / 1000).toFixed(2);
  const success = errors.length === 0 && structure !== null && dependencies !== null && unusedFiles !== null;
  
  // Performance validation (SC-001: <5 minutes)
  const performanceTarget = 5 * 60 * 1000; // 5 minutes in milliseconds
  const performanceStatus = duration < performanceTarget ? '✅' : '⚠️';
  
  // Generate final summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('Analysis Summary');
  console.log('='.repeat(60));
  console.log(`Duration: ${durationSeconds}s ${performanceStatus} (target: <300s)`);
  console.log(`Structure Analysis: ${structure ? '✅' : '❌'}`);
  console.log(`Dependency Analysis: ${dependencies ? '✅' : '❌'}`);
  console.log(`Unused Files Analysis: ${unusedFiles ? '✅' : '❌'}`);
  console.log(`Recommendations: ${recommendations ? '✅' : '❌'}`);
  console.log(`Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} error(s) occurred:`);
    errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
  
  if (duration >= performanceTarget) {
    console.warn(`\n⚠️  Performance warning: Analysis took ${durationSeconds}s, exceeding target of 300s`);
  }
  
  console.log(`\nReports generated in: ${outputDir}`);
  console.log('='.repeat(60));
  
  return {
    structure,
    dependencies,
    unusedFiles,
    recommendations,
    duration,
    success,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Format taskmaster summary for report
 */
function formatTaskmasterSummary(summary: any): string {
  let content = `## Purpose\n\n${summary.purpose}\n\n`;
  
  if (summary.config) {
    content += `## Configuration\n\n\`\`\`json\n${JSON.stringify(summary.config, null, 2)}\n\`\`\`\n\n`;
  }
  
  if (summary.state) {
    content += `## State\n\n\`\`\`json\n${JSON.stringify(summary.state, null, 2)}\n\`\`\`\n\n`;
  }
  
  if (summary.templates && summary.templates.length > 0) {
    content += `## Templates\n\n${summary.templates.map((t: string) => `- ${t}`).join('\n')}\n\n`;
  }
  
  if (summary.reports && summary.reports.length > 0) {
    content += `## Reports\n\n${summary.reports.map((r: string) => `- ${r}`).join('\n')}\n\n`;
  }
  
  if (summary.lastActive) {
    content += `## Last Active\n\n${summary.lastActive}\n\n`;
  }
  
  return content;
}

/**
 * Format tasks summary for report
 */
function formatTasksSummary(summary: any): string {
  let content = `## Purpose\n\n${summary.purpose}\n\n`;
  
  content += `## Statistics\n\n`;
  content += `- **Total Tasks**: ${summary.totalTasks}\n`;
  content += `- **Completed Tasks**: ${summary.completedTasks}\n`;
  content += `- **Pending Tasks**: ${summary.pendingTasks}\n\n`;
  
  if (summary.taskCategories && summary.taskCategories.length > 0) {
    content += `## Categories\n\n${summary.taskCategories.map((c: string) => `- ${c}`).join('\n')}\n\n`;
  }
  
  if (summary.dateRange) {
    content += `## Date Range\n\n`;
    if (summary.dateRange.earliest) {
      content += `- **Earliest**: ${summary.dateRange.earliest}\n`;
    }
    if (summary.dateRange.latest) {
      content += `- **Latest**: ${summary.dateRange.latest}\n`;
    }
    content += '\n';
  }
  
  if (summary.keyMilestones && summary.keyMilestones.length > 0) {
    content += `## Key Milestones\n\n${summary.keyMilestones.map((m: string) => `- ${m}`).join('\n')}\n\n`;
  }
  
  return content;
}

/**
 * Main entry point for CLI usage
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: AnalysisOptions = {
    includeCleanup: args.includes('--cleanup'),
    dryRun: !args.includes('--execute'),
  };
  
  analyzeProject(options)
    .then(result => {
      if (result.success) {
        console.log('\n✅ Analysis completed successfully');
        process.exit(0);
      } else {
        console.error('\n❌ Analysis completed with errors');
        if (result.errors) {
          result.errors.forEach(error => console.error(`  - ${error}`));
        }
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Analysis failed:', error);
      process.exit(1);
    });
}

