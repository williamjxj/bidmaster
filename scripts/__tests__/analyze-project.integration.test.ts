/**
 * Integration tests for analyze-project.ts orchestrator
 * Tests end-to-end analysis workflow
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analyzeProject } from '../analyze-project';
import * as analyzeStructure from '../analyze-structure';
import * as analyzeDependencies from '../analyze-dependencies';
import * as analyzeUnusedFiles from '../analyze-unused-files';
import * as generateRecommendations from '../generate-recommendations';
import {
  mockProjectStructure,
  mockDependencyReport,
  mockUnusedFilesReport,
} from './fixtures/mock-project-structure';

// Mock all analysis modules
vi.mock('../analyze-structure');
vi.mock('../analyze-dependencies');
vi.mock('../analyze-unused-files');
vi.mock('../generate-recommendations');
vi.mock('../utils/fs-utils');

describe('analyzeProject Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should run full analysis workflow successfully', async () => {
    // Mock all analysis functions
    vi.spyOn(analyzeStructure, 'analyzeStructure').mockResolvedValue(mockProjectStructure);
    vi.spyOn(analyzeStructure, 'generateStructureReport').mockResolvedValue();
    vi.spyOn(analyzeDependencies, 'analyzeDependencies').mockResolvedValue(mockDependencyReport);
    vi.spyOn(analyzeDependencies, 'generateDependencyReport').mockResolvedValue();
    vi.spyOn(analyzeUnusedFiles, 'analyzeUnusedFiles').mockResolvedValue(mockUnusedFilesReport);
    vi.spyOn(analyzeUnusedFiles, 'generateUnusedFilesReport').mockResolvedValue();
    
    const mockRecommendations = {
      recommendations: [],
      summary: { total: 0, byCategory: {}, byPriority: {} },
      generatedAt: new Date().toISOString(),
    };
    vi.spyOn(generateRecommendations, 'generateRecommendations').mockResolvedValue(mockRecommendations);
    vi.spyOn(generateRecommendations, 'generateRecommendationsReport').mockResolvedValue();

    const result = await analyzeProject({
      rootDir: '/mock/project',
      outputDir: '/mock/output',
    });

    expect(result.success).toBe(true);
    expect(result.structure).toBeDefined();
    expect(result.dependencies).toBeDefined();
    expect(result.unusedFiles).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(result.duration).toBeGreaterThan(0);
    expect(result.errors).toBeUndefined();
  });

  it('should handle partial failures gracefully', async () => {
    // Mock one analysis to fail
    vi.spyOn(analyzeStructure, 'analyzeStructure').mockRejectedValue(new Error('Structure analysis failed'));
    vi.spyOn(analyzeDependencies, 'analyzeDependencies').mockResolvedValue(mockDependencyReport);
    vi.spyOn(analyzeUnusedFiles, 'analyzeUnusedFiles').mockResolvedValue(mockUnusedFilesReport);

    const result = await analyzeProject({
      rootDir: '/mock/project',
    });

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBeGreaterThan(0);
    // Other analyses should still complete
    expect(result.dependencies).toBeDefined();
    expect(result.unusedFiles).toBeDefined();
  });

  it('should skip recommendations if required analyses fail', async () => {
    vi.spyOn(analyzeStructure, 'analyzeStructure').mockResolvedValue(mockProjectStructure);
    vi.spyOn(analyzeDependencies, 'analyzeDependencies').mockResolvedValue(null as any);
    vi.spyOn(analyzeUnusedFiles, 'analyzeUnusedFiles').mockResolvedValue(mockUnusedFilesReport);

    const result = await analyzeProject({
      rootDir: '/mock/project',
    });

    expect(result.recommendations).toBeNull();
    expect(result.errors).toBeDefined();
  });

  it('should measure performance and report duration', async () => {
    vi.spyOn(analyzeStructure, 'analyzeStructure').mockResolvedValue(mockProjectStructure);
    vi.spyOn(analyzeStructure, 'generateStructureReport').mockResolvedValue();
    vi.spyOn(analyzeDependencies, 'analyzeDependencies').mockResolvedValue(mockDependencyReport);
    vi.spyOn(analyzeDependencies, 'generateDependencyReport').mockResolvedValue();
    vi.spyOn(analyzeUnusedFiles, 'analyzeUnusedFiles').mockResolvedValue(mockUnusedFilesReport);
    vi.spyOn(analyzeUnusedFiles, 'generateUnusedFilesReport').mockResolvedValue();

    const result = await analyzeProject({
      rootDir: '/mock/project',
    });

    expect(result.duration).toBeGreaterThan(0);
    expect(result.duration).toBeLessThan(300000); // Should complete in <5 minutes
  });
});

