/**
 * File system utility functions for project analysis
 * Provides async file operations, directory traversal, and file discovery
 */

import { promises as fs } from 'fs';
import { join, relative, resolve } from 'path';
import { readdir } from 'fs/promises';

/**
 * Check if a path exists
 */
export async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a path is a directory
 */
export async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await fs.stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a path is a file
 * @internal
 */
async function isFile(path: string): Promise<boolean> {
  try {
    const stats = await fs.stat(path);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Get file statistics
 */
export async function getFileStats(path: string): Promise<{
  size: number;
  mtime: Date;
  isDirectory: boolean;
}> {
  const stats = await fs.stat(path);
  return {
    size: stats.size,
    mtime: stats.mtime,
    isDirectory: stats.isDirectory(),
  };
}

/**
 * Read file contents as string
 */
export async function readFile(path: string): Promise<string> {
  return await fs.readFile(path, 'utf-8');
}

/**
 * Write file contents
 */
export async function writeFile(path: string, content: string): Promise<void> {
  await fs.mkdir(join(path, '..'), { recursive: true });
  await fs.writeFile(path, content, 'utf-8');
}

/**
 * Read directory contents
 */
export async function readDirectory(path: string): Promise<string[]> {
  return await fs.readdir(path);
}

/**
 * Create directory recursively
 */
export async function createDirectory(path: string): Promise<void> {
  await fs.mkdir(path, { recursive: true });
}

/**
 * Delete file
 */
export async function deleteFile(path: string): Promise<void> {
  await fs.unlink(path);
}

/**
 * Delete directory recursively
 */
export async function deleteDirectory(path: string): Promise<void> {
  await fs.rm(path, { recursive: true, force: true });
}

/**
 * Recursively find all files in a directory
 */
export async function findFiles(
  rootDir: string,
  options: {
    ignore?: string[];
    pattern?: RegExp;
  } = {}
): Promise<string[]> {
  const { ignore = [], pattern } = options;
  const files: string[] = [];
  
  async function walk(dir: string): Promise<void> {
    // Check if directory should be ignored
    const relativePath = relative(rootDir, dir);
    if (ignore.some(ignorePattern => relativePath.includes(ignorePattern) || dir.includes(ignorePattern))) {
      return;
    }
    
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile()) {
          if (!pattern || pattern.test(entry.name)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
      if ((error as NodeJS.ErrnoException).code !== 'EACCES') {
        throw error;
      }
    }
  }
  
  await walk(rootDir);
  return files;
}

/**
 * Recursively find all directories
 */
export async function findDirectories(
  rootDir: string,
  options: {
    ignore?: string[];
  } = {}
): Promise<string[]> {
  const { ignore = [] } = options;
  const directories: string[] = [];
  
  async function walk(dir: string): Promise<void> {
    // Check if directory should be ignored
    const relativePath = relative(rootDir, dir);
    if (ignore.some(ignorePattern => relativePath.includes(ignorePattern) || dir.includes(ignorePattern))) {
      return;
    }
    
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const fullPath = join(dir, entry.name);
          directories.push(fullPath);
          await walk(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
      if ((error as NodeJS.ErrnoException).code !== 'EACCES') {
        throw error;
      }
    }
  }
  
  await walk(rootDir);
  return directories;
}

/**
 * Get relative path from project root
 */
export function getRelativePath(filePath: string, projectRoot: string): string {
  return relative(projectRoot, filePath);
}

/**
 * Get absolute path
 * @internal
 */
function getAbsolutePath(path: string, base?: string): string {
  return resolve(base || process.cwd(), path);
}

/**
 * Check if directory is empty
 */
export async function isDirectoryEmpty(path: string): Promise<boolean> {
  try {
    const contents = await readDirectory(path);
    return contents.length === 0;
  } catch {
    return true;
  }
}

