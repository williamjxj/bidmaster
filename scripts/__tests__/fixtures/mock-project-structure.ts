/**
 * Mock project structure for testing
 * Provides sample data structures matching real analysis outputs
 */

import type {
  ProjectStructureSummary,
  DependencyAnalysisReport,
  UnusedFilesReport,
} from '../../types/analysis-types';

/**
 * Mock project structure summary
 */
export const mockProjectStructure: ProjectStructureSummary = {
  directoryHierarchy: {
    name: 'bidmaster',
    path: '/mock/project',
    children: [
      {
        name: 'src',
        path: '/mock/project/src',
        purpose: 'Source code directory',
        fileCount: 50,
        children: [
          {
            name: 'app',
            path: '/mock/project/src/app',
            purpose: 'Next.js App Router directory',
            fileCount: 20,
            children: [
              {
                name: 'api',
                path: '/mock/project/src/app/api',
                purpose: 'API routes directory',
                fileCount: 10,
              },
            ],
          },
          {
            name: 'components',
            path: '/mock/project/src/components',
            purpose: 'React components directory',
            fileCount: 15,
            children: [
              {
                name: 'ui',
                path: '/mock/project/src/components/ui',
                purpose: 'UI primitive component',
                fileCount: 5,
              },
            ],
          },
        ],
      },
      {
        name: 'scripts',
        path: '/mock/project/scripts',
        purpose: 'Scripts and tooling directory',
        fileCount: 10,
      },
    ],
  },
  fileOrganization: {
    conventions: ['Next.js App Router structure', 'TypeScript-first development'],
    namingPatterns: ['kebab-case file naming', 'Route-based file organization (app/ directory)'],
    structureType: 'app-router',
  },
  architecturalPatterns: [
    {
      name: 'Next.js App Router',
      type: 'nextjs-app-router',
      description: 'Uses Next.js 13+ App Router with route-based file organization',
      examples: ['src/app/page.tsx', 'src/app/layout.tsx'],
    },
    {
      name: 'API Routes',
      type: 'api-routes',
      description: 'Next.js API routes organized in app/api/ directory (5 routes)',
      examples: ['src/app/api/scrape/route.ts', 'src/app/api/projects/route.ts'],
    },
  ],
  keyFiles: [
    {
      path: 'package.json',
      purpose: 'Project dependencies and scripts',
      category: 'config',
    },
    {
      path: 'tsconfig.json',
      purpose: 'TypeScript configuration',
      category: 'config',
    },
    {
      path: 'src/app/layout.tsx',
      purpose: 'Root layout component',
      category: 'entry',
    },
  ],
  componentOrganization: {
    uiComponents: [
      {
        name: 'Button',
        path: 'src/components/ui/button.tsx',
        purpose: 'UI primitive component',
        dependencies: ['react'],
      },
    ],
    featureComponents: [
      {
        name: 'ProjectCard',
        path: 'src/components/project-card.tsx',
        purpose: 'Feature-specific component',
        dependencies: ['@/components/ui/button'],
      },
    ],
    sharedComponents: [],
    relationships: [
      {
        from: 'src/components/project-card.tsx',
        to: '@/components/ui/button',
        type: 'imports',
      },
    ],
  },
  generatedAt: '2025-01-22T10:00:00.000Z',
  projectRoot: '/mock/project',
};

/**
 * Mock dependency analysis report
 */
export const mockDependencyReport: DependencyAnalysisReport = {
  dependencies: [
    {
      packageName: 'next',
      currentVersion: '15.3.5',
      wantedVersion: '15.3.5',
      latestVersion: '15.3.5',
      updateType: 'patch',
      hasBreakingChanges: false,
      securityIssues: [],
      recommendation: 'Package is up to date',
    },
    {
      packageName: 'react',
      currentVersion: '19.0.0',
      wantedVersion: '19.1.0',
      latestVersion: '19.1.0',
      updateType: 'minor',
      hasBreakingChanges: false,
      securityIssues: [],
      recommendation: 'Minor update available (19.0.0 → 19.1.0). Safe to update.',
    },
    {
      packageName: 'deprecated-package',
      currentVersion: '1.0.0',
      wantedVersion: '1.0.0',
      latestVersion: '2.0.0',
      updateType: 'major',
      hasBreakingChanges: true,
      securityIssues: [],
      recommendation: '⚠️ Major update available (1.0.0 → 2.0.0). Review breaking changes before updating.',
      isDeprecated: true,
    },
  ],
  summary: {
    total: 3,
    outdated: 2,
    majorUpdates: 1,
    securityIssues: 0,
  },
  generatedAt: '2025-01-22T10:00:00.000Z',
};

/**
 * Mock unused files report
 */
export const mockUnusedFilesReport: UnusedFilesReport = {
  files: [
    {
      filePath: 'src/app/page_backup.tsx',
      reason: 'backup_file',
      confidenceLevel: 'high',
      lastModified: '2025-01-01T00:00:00.000Z',
      size: 1024,
      safeToDelete: true,
      notes: 'Backup file detected by naming pattern',
    },
    {
      filePath: 'src/components/unused-component.tsx',
      reason: 'not_imported',
      confidenceLevel: 'medium',
      lastModified: '2025-01-01T00:00:00.000Z',
      size: 2048,
      safeToDelete: false,
      notes: 'Not found in static imports - may be dynamically imported',
    },
    {
      filePath: 'src/app/test',
      reason: 'empty_directory',
      confidenceLevel: 'medium',
      lastModified: '2025-01-01T00:00:00.000Z',
      size: 0,
      safeToDelete: false,
      notes: 'Empty test/spec directory - may be intentional',
    },
  ],
  summary: {
    total: 3,
    highConfidence: 1,
    mediumConfidence: 2,
    lowConfidence: 0,
    safeToDelete: 1,
  },
  generatedAt: '2025-01-22T10:00:00.000Z',
};

