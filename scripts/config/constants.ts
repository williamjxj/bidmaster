/**
 * Shared configuration constants for analysis scripts
 * Defines ignore patterns, output paths, and other configuration
 */

import { join } from 'path';

// Note: DEFAULT_IGNORE_PATTERNS is exported from utils/path-utils.ts to avoid duplication

/**
 * Default output directory for analysis reports
 */
export const DEFAULT_OUTPUT_DIR = join(process.cwd(), 'docs', 'analysis');

/**
 * Default archive directory for archival summaries
 */
export const DEFAULT_ARCHIVE_DIR = join(process.cwd(), 'docs', 'archive');

/**
 * Backup file patterns to detect
 */
export const BACKUP_FILE_PATTERNS = [
  /_backup\./i,
  /\.bak$/i,
  /\.old$/i,
  /\.orig$/i,
  /~$/,
];

/**
 * Empty directory patterns (directories that should be flagged if empty)
 */
export const EMPTY_DIRECTORY_PATTERNS = [
  'test',
  'tests',
  '__tests__',
  'spec',
  'specs',
];

/**
 * File extensions to analyze for TypeScript/JavaScript
 * @internal
 */
const TYPESCRIPT_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

/**
 * Configuration file names to check
 * @internal
 */
const CONFIG_FILES = {
  typescript: ['tsconfig.json', 'tsconfig.*.json'],
  nextjs: ['next.config.ts', 'next.config.js', 'next.config.mjs'],
  eslint: ['eslint.config.mjs', 'eslint.config.js', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml'],
  package: ['package.json'],
};

/**
 * Performance targets (from success criteria)
 * @internal
 */
const PERFORMANCE_TARGETS = {
  totalAnalysisTime: 5 * 60 * 1000, // 5 minutes in milliseconds
  dependencyCheckTime: 30 * 1000, // 30 seconds
  unusedFileDetectionTime: 2 * 60 * 1000, // 2 minutes
};

/**
 * Confidence level thresholds
 * @internal
 */
const CONFIDENCE_THRESHOLDS = {
  high: 0.9, // 90% confidence
  medium: 0.7, // 70% confidence
  low: 0.5, // 50% confidence
};

