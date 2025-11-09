/**
 * Unit tests for analyze-structure.ts
 * Tests project structure analysis functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analyzeStructure, validateStructureSummary } from '../analyze-structure';
import { mockProjectStructure } from './fixtures/mock-project-structure';
import * as fsUtils from '../utils/fs-utils';
import * as pathUtils from '../utils/path-utils';

// Mock dependencies
vi.mock('../utils/fs-utils');
vi.mock('../utils/path-utils');
vi.mock('../utils/config-checker');

describe('analyzeStructure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should analyze project structure successfully', async () => {
    // Mock file system operations
    vi.spyOn(fsUtils, 'pathExists').mockResolvedValue(true);
    vi.spyOn(fsUtils, 'readDirectory').mockResolvedValue(['app', 'components']);
    vi.spyOn(fsUtils, 'isDirectory').mockResolvedValue(true);
    vi.spyOn(fsUtils, 'findFiles').mockResolvedValue([
      '/mock/project/src/app/page.tsx',
      '/mock/project/src/app/layout.tsx',
    ]);
    vi.spyOn(fsUtils, 'findDirectories').mockResolvedValue([
      '/mock/project/src/app/api',
    ]);
    vi.spyOn(pathUtils, 'matchesIgnorePattern').mockReturnValue(false);

    const result = await analyzeStructure({
      rootDir: '/mock/project',
      ignorePatterns: [],
    });

    expect(result).toBeDefined();
    expect(result.projectRoot).toBe('/mock/project');
    expect(result.directoryHierarchy).toBeDefined();
    expect(result.fileOrganization).toBeDefined();
    expect(result.architecturalPatterns).toBeDefined();
    expect(result.keyFiles).toBeDefined();
    expect(result.componentOrganization).toBeDefined();
    expect(result.generatedAt).toBeDefined();
  });

  it('should detect Next.js App Router structure', async () => {
    vi.spyOn(fsUtils, 'pathExists').mockImplementation((path: string) => {
      return Promise.resolve(path.includes('src/app'));
    });
    vi.spyOn(fsUtils, 'readDirectory').mockResolvedValue([]);
    vi.spyOn(fsUtils, 'findFiles').mockResolvedValue([]);
    vi.spyOn(pathUtils, 'matchesIgnorePattern').mockReturnValue(false);

    const result = await analyzeStructure({
      rootDir: '/mock/project',
      ignorePatterns: [],
    });

    expect(result.fileOrganization.structureType).toBe('app-router');
    expect(result.fileOrganization.conventions).toContain('Next.js App Router structure');
  });

  it('should identify architectural patterns', async () => {
    vi.spyOn(fsUtils, 'pathExists').mockImplementation((path: string) => {
      return Promise.resolve(path.includes('app') || path.includes('api'));
    });
    vi.spyOn(fsUtils, 'readDirectory').mockResolvedValue([]);
    vi.spyOn(fsUtils, 'findFiles').mockResolvedValue([]);
    vi.spyOn(fsUtils, 'findDirectories').mockResolvedValue(['/mock/project/src/app/api']);
    vi.spyOn(pathUtils, 'matchesIgnorePattern').mockReturnValue(false);

    const result = await analyzeStructure({
      rootDir: '/mock/project',
      ignorePatterns: [],
    });

    const apiPattern = result.architecturalPatterns.find(
      p => p.type === 'api-routes'
    );
    expect(apiPattern).toBeDefined();
  });
});

describe('validateStructureSummary', () => {
  it('should validate structure summary with all required directories', () => {
    const validation = validateStructureSummary(mockProjectStructure);
    
    expect(validation.valid).toBe(true);
    expect(validation.missingDirectories).toHaveLength(0);
  });

  it('should detect missing required directories', () => {
    const incompleteStructure = {
      ...mockProjectStructure,
      directoryHierarchy: {
        name: 'project',
        path: '/mock/project',
        children: [],
      },
    };

    const validation = validateStructureSummary(incompleteStructure);
    
    expect(validation.valid).toBe(false);
    expect(validation.missingDirectories.length).toBeGreaterThan(0);
  });

  it('should warn if App Router structure not detected', () => {
    const nonAppRouterStructure = {
      ...mockProjectStructure,
      fileOrganization: {
        ...mockProjectStructure.fileOrganization,
        structureType: 'pages-router' as const,
      },
    };

    const validation = validateStructureSummary(nonAppRouterStructure);
    
    expect(validation.warnings).toContain('Next.js App Router structure not detected');
  });
});

