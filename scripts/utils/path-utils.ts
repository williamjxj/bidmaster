/**
 * Path validation and ignore pattern matching utilities
 * Provides path validation and ignore pattern checking
 */

import { relative, normalize, sep } from 'path';

/**
 * Default ignore patterns for project analysis
 */
export const DEFAULT_IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  '.env*',
  '.cursor',
  '.github',
  '.claude',
  '.specify',
  'specs',
];

/**
 * Check if a path matches any ignore pattern
 */
export function matchesIgnorePattern(
  path: string,
  ignorePatterns: string[] = DEFAULT_IGNORE_PATTERNS
): boolean {
  const normalizedPath = normalize(path);
  
  for (const pattern of ignorePatterns) {
    // Exact match
    if (normalizedPath === pattern || normalizedPath.endsWith(sep + pattern)) {
      return true;
    }
    
    // Directory match (pattern is a directory name)
    if (normalizedPath.includes(sep + pattern + sep) || normalizedPath.startsWith(pattern + sep)) {
      return true;
    }
    
    // Glob-like pattern matching (simple wildcard support)
    if (pattern.includes('*')) {
      const regex = new RegExp(
        '^' + pattern.replace(/\*/g, '.*').replace(/\//g, '\\/') + '$'
      );
      if (regex.test(normalizedPath) || regex.test(relative(process.cwd(), normalizedPath))) {
        return true;
      }
    }
    
    // Extension match
    if (pattern.startsWith('*.') && normalizedPath.endsWith(pattern.slice(1))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Validate file path
 * @internal
 */
function validateFilePath(path: string): {
  valid: boolean;
  error?: string;
} {
  if (!path || path.trim().length === 0) {
    return { valid: false, error: 'Path cannot be empty' };
  }
  
  // Check for invalid characters (OS-specific)
  const invalidChars = /[<>:"|?*\x00-\x1f]/;
  if (invalidChars.test(path)) {
    return { valid: false, error: 'Path contains invalid characters' };
  }
  
  // Check for path traversal attempts
  if (path.includes('..')) {
    return { valid: false, error: 'Path traversal detected' };
  }
  
  return { valid: true };
}

/**
 * Normalize path for comparison
 * @internal
 */
function normalizePath(path: string): string {
  return normalize(path).replace(/\\/g, '/');
}

/**
 * Check if path is within project root
 * @internal
 */
function isWithinProjectRoot(
  path: string,
  projectRoot: string
): boolean {
  const normalizedPath = normalizePath(path);
  const normalizedRoot = normalizePath(projectRoot);
  
  return normalizedPath.startsWith(normalizedRoot);
}

// Re-export normalizePath for internal use
export { normalizePath };

/**
 * Get safe relative path (prevents path traversal)
 * @internal
 */
function getSafeRelativePath(
  path: string,
  base: string
): string | null {
  try {
    const relPath = relative(base, path);
    
    // Check for path traversal
    if (relPath.startsWith('..') || relPath.includes('..')) {
      return null;
    }
    
    return normalizePath(relPath);
  } catch {
    return null;
  }
}

/**
 * Filter paths by ignore patterns
 */
export function filterIgnoredPaths(
  paths: string[],
  ignorePatterns: string[] = DEFAULT_IGNORE_PATTERNS
): string[] {
  return paths.filter(path => !matchesIgnorePattern(path, ignorePatterns));
}

