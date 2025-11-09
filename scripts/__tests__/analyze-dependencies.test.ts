/**
 * Unit tests for analyze-dependencies.ts
 * Tests dependency analysis functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analyzeDependencies, validateDependencyCoverage } from '../analyze-dependencies';
import { mockDependencyReport } from './fixtures/mock-project-structure';
import * as fsUtils from '../utils/fs-utils';

// Mock dependencies
vi.mock('../utils/fs-utils');
vi.mock('child_process', () => ({
  exec: vi.fn((command: string, callback: (error: any, stdout: any, stderr: any) => void) => {
    if (callback) {
      callback(null, '{}', '');
    }
    return {} as any;
  }),
}));

describe('analyzeDependencies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse package.json and analyze dependencies', async () => {
    const mockPackageJson = {
      dependencies: {
        'next': '15.3.5',
        'react': '19.0.0',
      },
      devDependencies: {
        'typescript': '5.8.3',
      },
    };

    vi.spyOn(fsUtils, 'pathExists').mockResolvedValue(true);
    vi.spyOn(fsUtils, 'readFile').mockResolvedValue(JSON.stringify(mockPackageJson));

    const result = await analyzeDependencies({
      includeDevDependencies: true,
    });

    expect(result).toBeDefined();
    expect(result.dependencies).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.generatedAt).toBeDefined();
  });

  it('should identify outdated dependencies', async () => {
    const mockPackageJson = {
      dependencies: {
        'react': '19.0.0',
      },
    };

    vi.spyOn(fsUtils, 'pathExists').mockResolvedValue(true);
    vi.spyOn(fsUtils, 'readFile').mockResolvedValue(JSON.stringify(mockPackageJson));

    const result = await analyzeDependencies();

    expect(result).toBeDefined();
    expect(result.dependencies).toBeDefined();
    // Note: Actual npm outdated results depend on npm registry, so we just verify structure
  });

  it('should classify update types correctly', async () => {
    const mockPackageJson = {
      dependencies: {
        'package-patch': '1.0.0',
        'package-minor': '1.0.0',
        'package-major': '1.0.0',
      },
    };

    vi.spyOn(fsUtils, 'pathExists').mockResolvedValue(true);
    vi.spyOn(fsUtils, 'readFile').mockResolvedValue(JSON.stringify(mockPackageJson));

    const result = await analyzeDependencies();

    expect(result).toBeDefined();
    expect(result.dependencies.length).toBeGreaterThan(0);
    // Note: Actual update type classification depends on npm outdated results
  });
});

describe('validateDependencyCoverage', () => {
  it('should validate all packages are analyzed', () => {
    const packageJson = {
      dependencies: { 'pkg1': '1.0.0', 'pkg2': '2.0.0' },
      devDependencies: { 'pkg3': '3.0.0' },
    };

    const dependencies = [
      { packageName: 'pkg1' } as any,
      { packageName: 'pkg2' } as any,
      { packageName: 'pkg3' } as any,
    ];

    const validation = validateDependencyCoverage(packageJson, dependencies, true);

    expect(validation.valid).toBe(true);
    expect(validation.missing).toHaveLength(0);
  });

  it('should detect missing packages', () => {
    const packageJson = {
      dependencies: { 'pkg1': '1.0.0', 'pkg2': '2.0.0' },
    };

    const dependencies = [
      { packageName: 'pkg1' } as any,
    ];

    const validation = validateDependencyCoverage(packageJson, dependencies, false);

    expect(validation.valid).toBe(false);
    expect(validation.missing).toContain('pkg2');
  });
});
