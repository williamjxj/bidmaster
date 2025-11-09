/**
 * Unit tests for generate-recommendations.ts
 * Tests recommendation generation functionality
 */

import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../generate-recommendations';
import {
  mockProjectStructure,
  mockDependencyReport,
  mockUnusedFilesReport,
} from './fixtures/mock-project-structure';

describe('generateRecommendations', () => {
  it('should generate recommendations from all analyses', async () => {
    const result = await generateRecommendations({
      structure: mockProjectStructure,
      dependencies: mockDependencyReport,
      unusedFiles: mockUnusedFilesReport,
    });

    expect(result).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.summary).toBeDefined();
    expect(result.generatedAt).toBeDefined();
  });

  it('should categorize recommendations correctly', async () => {
    const result = await generateRecommendations({
      structure: mockProjectStructure,
      dependencies: mockDependencyReport,
      unusedFiles: mockUnusedFilesReport,
    });

    const categories = new Set(result.recommendations.map(r => r.category));
    expect(categories.size).toBeGreaterThanOrEqual(4); // At least 4 categories required
  });

  it('should include performance recommendations', async () => {
    const result = await generateRecommendations({
      structure: mockProjectStructure,
      dependencies: mockDependencyReport,
      unusedFiles: mockUnusedFilesReport,
    });

    const performanceRecs = result.recommendations.filter(
      r => r.category === 'performance'
    );
    expect(performanceRecs.length).toBeGreaterThan(0);
  });

  it('should include security recommendations for deprecated packages', async () => {
    const result = await generateRecommendations({
      structure: mockProjectStructure,
      dependencies: mockDependencyReport,
      unusedFiles: mockUnusedFilesReport,
    });

    const securityRecs = result.recommendations.filter(
      r => r.category === 'security'
    );
    expect(securityRecs.length).toBeGreaterThan(0);
  });

  it('should assign priorities and effort estimates', async () => {
    const result = await generateRecommendations({
      structure: mockProjectStructure,
      dependencies: mockDependencyReport,
      unusedFiles: mockUnusedFilesReport,
    });

    result.recommendations.forEach(rec => {
      expect(['high', 'medium', 'low']).toContain(rec.priority);
      expect(['small', 'medium', 'large']).toContain(rec.estimatedEffort);
    });
  });

  it('should calculate summary statistics', async () => {
    const result = await generateRecommendations({
      structure: mockProjectStructure,
      dependencies: mockDependencyReport,
      unusedFiles: mockUnusedFilesReport,
    });

    expect(result.summary.total).toBe(result.recommendations.length);
    expect(result.summary.byCategory).toBeDefined();
    expect(result.summary.byPriority).toBeDefined();
  });
});

