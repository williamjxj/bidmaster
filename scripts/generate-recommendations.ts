/**
 * Improvement recommendations generator
 * Generates categorized recommendations based on all analyses
 */

import type {
  ImprovementRecommendations,
  ImprovementRecommendation,
  ProjectStructureSummary,
  DependencyAnalysisReport,
  UnusedFilesReport,
} from './types/analysis-types';
import { DEFAULT_OUTPUT_DIR } from './config/constants';
import { generateMarkdownReport, formatTable, formatList } from './utils/report-utils';
import { join } from 'path';

/**
 * Recommendation input
 */
export interface RecommendationInput {
  structure: ProjectStructureSummary;
  dependencies: DependencyAnalysisReport;
  unusedFiles: UnusedFilesReport;
}

/**
 * Generate improvement recommendations
 */
export async function generateRecommendations(
  input: RecommendationInput
): Promise<ImprovementRecommendations> {
  const recommendations: ImprovementRecommendation[] = [];
  
  // Performance recommendations
  recommendations.push(...generatePerformanceRecommendations(input));
  
  // Security recommendations
  recommendations.push(...generateSecurityRecommendations(input));
  
  // Code quality recommendations
  recommendations.push(...generateCodeQualityRecommendations(input));
  
  // Architecture recommendations
  recommendations.push(...generateArchitectureRecommendations(input));
  
  // Testing recommendations
  recommendations.push(...generateTestingRecommendations(input));
  
  // Calculate summary
  const summary = {
    total: recommendations.length,
    byCategory: {
      performance: recommendations.filter(r => r.category === 'performance').length,
      security: recommendations.filter(r => r.category === 'security').length,
      code_quality: recommendations.filter(r => r.category === 'code_quality').length,
      architecture: recommendations.filter(r => r.category === 'architecture').length,
      testing: recommendations.filter(r => r.category === 'testing').length,
    },
    byPriority: {
      high: recommendations.filter(r => r.priority === 'high').length,
      medium: recommendations.filter(r => r.priority === 'medium').length,
      low: recommendations.filter(r => r.priority === 'low').length,
    },
  };
  
  return {
    recommendations,
    summary,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate performance recommendations
 */
function generatePerformanceRecommendations(
  input: RecommendationInput
): ImprovementRecommendation[] {
  const recommendations: ImprovementRecommendation[] = [];
  
  // Check for outdated dependencies that might affect performance
  const outdatedDeps = input.dependencies.dependencies.filter(
    d => d.updateType === 'major' || d.updateType === 'minor'
  );
  
  if (outdatedDeps.length > 0) {
    recommendations.push({
      id: 'perf-001',
      category: 'performance',
      title: 'Update outdated dependencies for performance improvements',
      description: `${outdatedDeps.length} dependencies have updates available that may include performance optimizations.`,
      rationale: 'Newer versions often include performance improvements and bug fixes.',
      priority: 'medium',
      estimatedEffort: 'medium',
      relatedFiles: outdatedDeps.map(d => `package.json`),
      migrationPath: [
        'Review breaking changes for major updates',
        'Update dependencies incrementally',
        'Test thoroughly after updates',
      ],
    });
  }
  
  // Check for unused files that could be removed
  const safeToDelete = input.unusedFiles.files.filter(f => f.safeToDelete);
  if (safeToDelete.length > 0) {
    const totalSize = safeToDelete.reduce((sum, f) => sum + f.size, 0);
    recommendations.push({
      id: 'perf-002',
      category: 'performance',
      title: 'Remove unused files to reduce bundle size',
      description: `${safeToDelete.length} files are safe to delete, freeing approximately ${(totalSize / 1024 / 1024).toFixed(2)} MB.`,
      rationale: 'Removing unused files reduces build time and bundle size.',
      priority: 'low',
      estimatedEffort: 'small',
      relatedFiles: safeToDelete.map(f => f.filePath),
      migrationPath: [
        'Review unused-files-report.md',
        'Delete files marked as safe to delete',
        'Verify build still works',
      ],
    });
  }
  
  return recommendations;
}

/**
 * Generate security recommendations
 */
function generateSecurityRecommendations(
  input: RecommendationInput
): ImprovementRecommendation[] {
  const recommendations: ImprovementRecommendation[] = [];
  
  // Check for security issues
  const packagesWithSecurityIssues = input.dependencies.dependencies.filter(
    d => d.securityIssues.length > 0
  );
  
  if (packagesWithSecurityIssues.length > 0) {
    recommendations.push({
      id: 'sec-001',
      category: 'security',
      title: 'Address security vulnerabilities in dependencies',
      description: `${packagesWithSecurityIssues.length} packages have known security vulnerabilities.`,
      rationale: 'Security vulnerabilities pose risks to the application and users.',
      priority: 'high',
      estimatedEffort: 'medium',
      relatedFiles: packagesWithSecurityIssues.map(d => `package.json`),
      migrationPath: [
        'Review security advisories',
        'Update to patched versions',
        'Test for breaking changes',
      ],
    });
  }
  
  // Check for deprecated packages
  const deprecatedPackages = input.dependencies.dependencies.filter(d => d.isDeprecated);
  if (deprecatedPackages.length > 0) {
    recommendations.push({
      id: 'sec-002',
      category: 'security',
      title: 'Replace deprecated packages',
      description: `${deprecatedPackages.length} packages are deprecated and may not receive security updates.`,
      rationale: 'Deprecated packages may have unpatched security vulnerabilities.',
      priority: 'high',
      estimatedEffort: 'large',
      relatedFiles: deprecatedPackages.map(d => `package.json`),
      migrationPath: [
        'Identify alternative packages',
        'Plan migration strategy',
        'Update code to use new packages',
        'Test thoroughly',
      ],
    });
  }
  
  return recommendations;
}

/**
 * Generate code quality recommendations
 */
function generateCodeQualityRecommendations(
  input: RecommendationInput
): ImprovementRecommendation[] {
  const recommendations: ImprovementRecommendation[] = [];
  
  // Check for configuration inconsistencies
  const hasConfigIssues = input.structure.architecturalPatterns.some(
    p => p.type === 'other' && p.name.includes('Configuration')
  );
  
  if (hasConfigIssues) {
    recommendations.push({
      id: 'qual-001',
      category: 'code_quality',
      title: 'Fix configuration inconsistencies',
      description: 'Configuration files have inconsistencies that may affect code quality.',
      rationale: 'Consistent configuration ensures predictable behavior and easier maintenance.',
      priority: 'medium',
      estimatedEffort: 'small',
      relatedFiles: ['tsconfig.json', 'next.config.ts', 'eslint.config.mjs'],
      migrationPath: [
        'Review configuration inconsistencies in structure-summary.md',
        'Align TypeScript, Next.js, and ESLint configurations',
        'Verify build and linting still work',
      ],
    });
  }
  
  // Check for duplicate files
  const duplicateFiles = input.unusedFiles.files.filter(f => f.reason === 'duplicate');
  if (duplicateFiles.length > 0) {
    recommendations.push({
      id: 'qual-002',
      category: 'code_quality',
      title: 'Consolidate duplicate files',
      description: `${duplicateFiles.length} duplicate files detected. Consider consolidating to reduce maintenance burden.`,
      rationale: 'Duplicate files increase maintenance complexity and risk of inconsistencies.',
      priority: 'low',
      estimatedEffort: 'small',
      relatedFiles: duplicateFiles.map(f => f.filePath),
      migrationPath: [
        'Review duplicate files in unused-files-report.md',
        'Identify which version to keep',
        'Update references if needed',
        'Delete duplicates',
      ],
    });
  }
  
  return recommendations;
}

/**
 * Generate architecture recommendations
 */
function generateArchitectureRecommendations(
  input: RecommendationInput
): ImprovementRecommendation[] {
  const recommendations: ImprovementRecommendation[] = [];
  
  // Check API route organization
  const apiRoutes = input.structure.architecturalPatterns.find(
    p => p.type === 'api-routes'
  );
  
  if (apiRoutes && apiRoutes.examples.length > 10) {
    recommendations.push({
      id: 'arch-001',
      category: 'architecture',
      title: 'Consider API route organization improvements',
      description: `Large number of API routes (${apiRoutes.examples.length}). Consider grouping related routes or using route handlers.`,
      rationale: 'Better organization improves maintainability and discoverability.',
      priority: 'low',
      estimatedEffort: 'medium',
      relatedFiles: apiRoutes.examples,
      migrationPath: [
        'Review API route structure',
        'Group related routes',
        'Update route handlers',
      ],
    });
  }
  
  // Check component organization
  const componentCount =
    input.structure.componentOrganization.uiComponents.length +
    input.structure.componentOrganization.featureComponents.length;
  
  if (componentCount > 50) {
    recommendations.push({
      id: 'arch-002',
      category: 'architecture',
      title: 'Consider component organization improvements',
      description: `Large number of components (${componentCount}). Consider better organization or splitting into packages.`,
      rationale: 'Better component organization improves maintainability.',
      priority: 'low',
      estimatedEffort: 'medium',
      relatedFiles: ['src/components'],
      migrationPath: [
        'Review component structure',
        'Group related components',
        'Consider feature-based organization',
      ],
    });
  }
  
  return recommendations;
}

/**
 * Generate testing recommendations
 */
function generateTestingRecommendations(
  input: RecommendationInput
): ImprovementRecommendation[] {
  const recommendations: ImprovementRecommendation[] = [];
  
  // Check for test directories
  const hasTestDirs = input.structure.directoryHierarchy.children?.some(
    child => child.name.toLowerCase().includes('test') || child.name.toLowerCase().includes('spec')
  );
  
  if (!hasTestDirs) {
    recommendations.push({
      id: 'test-001',
      category: 'testing',
      title: 'Add test infrastructure',
      description: 'No test directories detected. Consider adding test infrastructure.',
      rationale: 'Tests ensure code quality and prevent regressions.',
      priority: 'medium',
      estimatedEffort: 'medium',
      relatedFiles: [],
      migrationPath: [
        'Set up testing framework (Jest, Vitest, etc.)',
        'Create test directory structure',
        'Add test scripts to package.json',
      ],
    });
  }
  
  return recommendations;
}

/**
 * Generate recommendations report
 */
export async function generateRecommendationsReport(
  recommendations: ImprovementRecommendations,
  outputPath: string = join(DEFAULT_OUTPUT_DIR, 'improvement-recommendations.md')
): Promise<void> {
  let content = `## Summary\n\n`;
  content += `- **Total Recommendations**: ${recommendations.summary.total}\n`;
  content += `- **By Category**:\n`;
  for (const [category, count] of Object.entries(recommendations.summary.byCategory)) {
    content += `  - ${category}: ${count}\n`;
  }
  content += `- **By Priority**:\n`;
  for (const [priority, count] of Object.entries(recommendations.summary.byPriority)) {
    content += `  - ${priority}: ${count}\n`;
  }
  content += '\n';
  
  // Group by category
  const byCategory = new Map<string, ImprovementRecommendation[]>();
  for (const rec of recommendations.recommendations) {
    if (!byCategory.has(rec.category)) {
      byCategory.set(rec.category, []);
    }
    byCategory.get(rec.category)!.push(rec);
  }
  
  for (const [category, recs] of byCategory.entries()) {
    content += `\n## ${formatCategoryTitle(category)}\n\n`;
    
    // Sort by priority
    recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    for (const rec of recs) {
      content += `### ${rec.title} [${rec.priority.toUpperCase()}]\n\n`;
      content += `**ID**: ${rec.id}\n\n`;
      content += `**Description**: ${rec.description}\n\n`;
      content += `**Rationale**: ${rec.rationale}\n\n`;
      content += `**Estimated Effort**: ${rec.estimatedEffort}\n\n`;
      
      if (rec.relatedFiles.length > 0) {
        content += `**Related Files**:\n${formatList(rec.relatedFiles)}\n\n`;
      }
      
      if (rec.migrationPath && rec.migrationPath.length > 0) {
        content += `**Migration Path**:\n${formatList(rec.migrationPath, true)}\n\n`;
      }
    }
  }
  
  await generateMarkdownReport(
    outputPath,
    'Improvement Recommendations',
    content,
    {
      'Generated At': recommendations.generatedAt,
      'Total Recommendations': recommendations.summary.total.toString(),
    }
  );
}

/**
 * Format category title
 */
function formatCategoryTitle(category: string): string {
  const titles: Record<string, string> = {
    performance: 'Performance',
    security: 'Security',
    code_quality: 'Code Quality',
    architecture: 'Architecture',
    testing: 'Testing',
  };
  
  return titles[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

