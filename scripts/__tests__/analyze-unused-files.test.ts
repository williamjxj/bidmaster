/**
 * Unit tests for analyze-unused-files.ts
 * Tests unused file detection functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analyzeUnusedFiles } from '../analyze-unused-files';
import { mockUnusedFilesReport } from './fixtures/mock-project-structure';
import * as fsUtils from '../utils/fs-utils';
import * as pathUtils from '../utils/path-utils';

// Mock dependencies
vi.mock('../utils/fs-utils');
vi.mock('../utils/path-utils');

describe('analyzeUnusedFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect backup files', async () => {
    vi.spyOn(fsUtils, 'findFiles').mockResolvedValue([
      '/mock/project/src/app/page_backup.tsx',
      '/mock/project/src/app/page.tsx',
    ]);
    vi.spyOn(fsUtils, 'findDirectories').mockResolvedValue([]);
    vi.spyOn(fsUtils, 'getFileStats').mockResolvedValue({
      size: 1024,
      mtime: new Date('2025-01-01'),
      isDirectory: false,
    });
    vi.spyOn(fsUtils, 'getRelativePath').mockImplementation((path, root) => {
      return path.replace(root + '/', '');
    });
    vi.spyOn(pathUtils, 'matchesIgnorePattern').mockReturnValue(false);

    const result = await analyzeUnusedFiles({
      rootDir: '/mock/project',
      ignorePatterns: [],
    });

    const backupFiles = result.files.filter(f => f.reason === 'backup_file');
    expect(backupFiles.length).toBeGreaterThan(0);
    expect(backupFiles[0].confidenceLevel).toBe('high');
    expect(backupFiles[0].safeToDelete).toBe(true);
  });

  it('should detect empty directories', async () => {
    vi.spyOn(fsUtils, 'findFiles').mockResolvedValue([]);
    vi.spyOn(fsUtils, 'findDirectories').mockResolvedValue([
      '/mock/project/src/app/test',
    ]);
    vi.spyOn(fsUtils, 'isDirectoryEmpty').mockResolvedValue(true);
    vi.spyOn(fsUtils, 'getFileStats').mockResolvedValue({
      size: 0,
      mtime: new Date('2025-01-01'),
      isDirectory: true,
    });
    vi.spyOn(fsUtils, 'getRelativePath').mockImplementation((path, root) => {
      return path.replace(root + '/', '');
    });
    vi.spyOn(pathUtils, 'matchesIgnorePattern').mockReturnValue(false);

    const result = await analyzeUnusedFiles({
      rootDir: '/mock/project',
      ignorePatterns: [],
    });

    const emptyDirs = result.files.filter(f => f.reason === 'empty_directory');
    expect(emptyDirs.length).toBeGreaterThan(0);
  });

  it('should assign confidence levels correctly', async () => {
    vi.spyOn(fsUtils, 'findFiles').mockResolvedValue([
      '/mock/project/src/app/page_backup.tsx', // High confidence
      '/mock/project/src/components/unused.tsx', // Medium confidence
    ]);
    vi.spyOn(fsUtils, 'findDirectories').mockResolvedValue([]);
    vi.spyOn(fsUtils, 'getFileStats').mockResolvedValue({
      size: 1024,
      mtime: new Date('2025-01-01'),
      isDirectory: false,
    });
    vi.spyOn(fsUtils, 'getRelativePath').mockImplementation((path, root) => {
      return path.replace(root + '/', '');
    });
    vi.spyOn(fsUtils, 'readFile').mockResolvedValue('export const Component = () => null;');
    vi.spyOn(pathUtils, 'matchesIgnorePattern').mockReturnValue(false);

    const result = await analyzeUnusedFiles({
      rootDir: '/mock/project',
      ignorePatterns: [],
      checkDynamicImports: true,
    });

    expect(result.summary.highConfidence).toBeGreaterThan(0);
    expect(result.summary.mediumConfidence).toBeGreaterThan(0);
  });

  it('should calculate summary statistics', async () => {
    vi.spyOn(fsUtils, 'findFiles').mockResolvedValue([]);
    vi.spyOn(fsUtils, 'findDirectories').mockResolvedValue([]);
    vi.spyOn(pathUtils, 'matchesIgnorePattern').mockReturnValue(false);

    const result = await analyzeUnusedFiles({
      rootDir: '/mock/project',
      ignorePatterns: [],
    });

    expect(result.summary).toBeDefined();
    expect(result.summary.total).toBeGreaterThanOrEqual(0);
    expect(result.summary.highConfidence).toBeGreaterThanOrEqual(0);
    expect(result.summary.mediumConfidence).toBeGreaterThanOrEqual(0);
    expect(result.summary.lowConfidence).toBeGreaterThanOrEqual(0);
    expect(result.summary.safeToDelete).toBeGreaterThanOrEqual(0);
  });
});

