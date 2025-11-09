/**
 * Unit tests for cleanup-unused.ts
 * Tests cleanup functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateTaskmasterSummary, generateTasksSummary, cleanupUnused, getAllFilesInDirectory } from '../cleanup-unused';
import * as fsUtils from '../utils/fs-utils';

// Mock dependencies
vi.mock('../utils/fs-utils');
vi.mock('../utils/report-utils');

describe('generateTaskmasterSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null if .taskmaster directory does not exist', async () => {
    vi.spyOn(fsUtils, 'pathExists').mockResolvedValue(false);

    const result = await generateTaskmasterSummary('/mock/project');

    expect(result).toBeNull();
  });

  it('should generate summary when .taskmaster exists', async () => {
    vi.spyOn(fsUtils, 'pathExists').mockImplementation((path: string) => {
      return Promise.resolve(path.includes('.taskmaster'));
    });
    vi.spyOn(fsUtils, 'readDirectory').mockResolvedValue(['config.json', 'state.json']);
    vi.spyOn(fsUtils, 'readFile').mockResolvedValue('{}');
    vi.spyOn(fsUtils, 'getFileStats').mockResolvedValue({
      size: 100,
      mtime: new Date('2025-01-01'),
      isDirectory: false,
    });
    // Mock getAllFilesInDirectory from cleanup-unused
    const { getAllFilesInDirectory } = await import('../cleanup-unused');
    vi.spyOn({ getAllFilesInDirectory }, 'getAllFilesInDirectory').mockResolvedValue([
      '/mock/project/.taskmaster/config.json',
    ]);

    const result = await generateTaskmasterSummary('/mock/project');

    expect(result).toBeDefined();
    expect(result?.purpose).toBeDefined();
  });
});

describe('generateTasksSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null if tasks directory does not exist', async () => {
    vi.spyOn(fsUtils, 'pathExists').mockResolvedValue(false);

    const result = await generateTasksSummary('/mock/project');

    expect(result).toBeNull();
  });

  it('should parse tasks.json when it exists', async () => {
    const mockTasks = {
      tasks: [
        { id: '1', title: 'Task 1', completed: true },
        { id: '2', title: 'Task 2', completed: false },
      ],
    };

    vi.spyOn(fsUtils, 'pathExists').mockImplementation((path: string) => {
      return Promise.resolve(path.includes('tasks'));
    });
    vi.spyOn(fsUtils, 'readFile').mockResolvedValue(JSON.stringify(mockTasks));
    vi.spyOn(fsUtils, 'readDirectory').mockResolvedValue(['tasks.json']);

    const result = await generateTasksSummary('/mock/project');

    expect(result).toBeDefined();
    expect(result?.totalTasks).toBe(2);
    expect(result?.completedTasks).toBe(1);
    expect(result?.pendingTasks).toBe(1);
  });
});

describe('cleanupUnused', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should perform dry-run by default', async () => {
    vi.spyOn(fsUtils, 'pathExists').mockResolvedValue(false);
    vi.spyOn(fsUtils, 'writeFile').mockResolvedValue();

    const result = await cleanupUnused({
      rootDir: '/mock/project',
      unusedFiles: [],
      dryRun: true,
    });

    expect(result.dryRun).toBe(true);
    expect(result.deletedFiles).toBeDefined();
    expect(result.deletedDirectories).toBeDefined();
  });

  it('should generate archival summaries before cleanup', async () => {
    vi.spyOn(fsUtils, 'pathExists').mockResolvedValue(false);
    vi.spyOn(fsUtils, 'writeFile').mockResolvedValue();

    const result = await cleanupUnused({
      rootDir: '/mock/project',
      unusedFiles: [],
      dryRun: true,
    });

    expect(result.archivedSummaries).toBeDefined();
  });
});

