/**
 * Unused files detection module
 * Detects unused files, backup files, empty directories, and unreferenced code
 */

import {
  findFiles,
  findDirectories,
  readFile,
  pathExists,
  isDirectoryEmpty,
  getFileStats,
  getRelativePath,
} from './utils/fs-utils';
import {
  matchesIgnorePattern,
  filterIgnoredPaths,
  DEFAULT_IGNORE_PATTERNS,
} from './utils/path-utils';
import { BACKUP_FILE_PATTERNS, EMPTY_DIRECTORY_PATTERNS } from './config/constants';
import type {
  UnusedFilesReport,
  UnusedFile,
} from './types/analysis-types';
import { DEFAULT_OUTPUT_DIR } from './config/constants';
import { generateMarkdownReport, formatTable, formatList } from './utils/report-utils';
import { safeExecute } from './utils/error-handler';
import { join, basename, dirname, extname } from 'path';

/**
 * Unused file analysis options
 */
export interface UnusedFileAnalysisOptions {
  rootDir: string;
  ignorePatterns?: string[];
  checkDynamicImports?: boolean;
}

/**
 * Analyze unused files
 */
export async function analyzeUnusedFiles(
  options: UnusedFileAnalysisOptions
): Promise<UnusedFilesReport> {
  const {
    rootDir,
    ignorePatterns = DEFAULT_IGNORE_PATTERNS,
    checkDynamicImports = true,
  } = options;
  
  const unusedFiles: UnusedFile[] = [];
  
  // 1. Detect backup files
  const backupFiles = await detectBackupFiles(rootDir, ignorePatterns);
  unusedFiles.push(...backupFiles);
  
  // 2. Detect empty directories
  const emptyDirs = await detectEmptyDirectories(rootDir, ignorePatterns);
  unusedFiles.push(...emptyDirs);
  
  // 3. Detect duplicate files
  const duplicates = await detectDuplicateFiles(rootDir, ignorePatterns);
  unusedFiles.push(...duplicates);
  
  // 4. Static import analysis for unused files, types, interfaces, and utilities
  const unusedByImport = await detectUnusedByStaticAnalysis(rootDir, ignorePatterns, checkDynamicImports);
  unusedFiles.push(...unusedByImport);
  
  // Calculate summary
  const summary = {
    total: unusedFiles.length,
    highConfidence: unusedFiles.filter(f => f.confidenceLevel === 'high').length,
    mediumConfidence: unusedFiles.filter(f => f.confidenceLevel === 'medium').length,
    lowConfidence: unusedFiles.filter(f => f.confidenceLevel === 'low').length,
    safeToDelete: unusedFiles.filter(f => f.safeToDelete).length,
  };
  
  return {
    files: unusedFiles,
    summary,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Detect backup files by pattern
 */
async function detectBackupFiles(
  rootDir: string,
  ignorePatterns: string[]
): Promise<UnusedFile[]> {
  const allFiles = await findFiles(rootDir, { ignore: ignorePatterns });
  const backupFiles: UnusedFile[] = [];
  
  for (const file of allFiles) {
    const fileName = basename(file);
    
    // Check against backup patterns
    if (BACKUP_FILE_PATTERNS.some(pattern => pattern.test(fileName))) {
      const stats = await getFileStats(file);
      backupFiles.push({
        filePath: getRelativePath(file, rootDir),
        reason: 'backup_file',
        confidenceLevel: 'high',
        lastModified: stats.mtime.toISOString(),
        size: stats.size,
        safeToDelete: true,
        notes: 'Backup file detected by naming pattern',
      });
    }
  }
  
  return backupFiles;
}

/**
 * Detect empty directories
 */
async function detectEmptyDirectories(
  rootDir: string,
  ignorePatterns: string[]
): Promise<UnusedFile[]> {
  const allDirs = await findDirectories(rootDir, { ignore: ignorePatterns });
  const emptyDirs: UnusedFile[] = [];
  
  for (const dir of allDirs) {
    if (await isDirectoryEmpty(dir)) {
      const dirName = basename(dir);
      const isExpectedEmpty = EMPTY_DIRECTORY_PATTERNS.some(pattern =>
        dirName.toLowerCase().includes(pattern.toLowerCase())
      );
      
      const stats = await getFileStats(dir);
      emptyDirs.push({
        filePath: getRelativePath(dir, rootDir),
        reason: 'empty_directory',
        confidenceLevel: isExpectedEmpty ? 'medium' : 'high',
        lastModified: stats.mtime.toISOString(),
        size: 0,
        safeToDelete: !isExpectedEmpty,
        notes: isExpectedEmpty
          ? 'Empty test/spec directory - may be intentional'
          : 'Empty directory with no apparent purpose',
      });
    }
  }
  
  return emptyDirs;
}

/**
 * Detect duplicate files (multiple test script variants, etc.)
 */
async function detectDuplicateFiles(
  rootDir: string,
  ignorePatterns: string[]
): Promise<UnusedFile[]> {
  const allFiles = await findFiles(rootDir, { ignore: ignorePatterns });
  const duplicates: UnusedFile[] = [];
  
  // Group files by base name (without extension)
  const fileGroups = new Map<string, string[]>();
  
  for (const file of allFiles) {
    const baseName = basename(file, extname(file));
    const dir = dirname(file);
    
    // Look for patterns like test-crawlers.js, test-crawlers-simple.js, test-crawlers-advanced.ts
    if (baseName.includes('test') || baseName.includes('crawler')) {
      if (!fileGroups.has(baseName)) {
        fileGroups.set(baseName, []);
      }
      fileGroups.get(baseName)!.push(file);
    }
  }
  
  // Find groups with multiple files
  for (const [baseName, files] of fileGroups.entries()) {
    if (files.length > 1) {
      // Mark all but the most recent as potential duplicates
      const filesWithStats = await Promise.all(
        files.map(async (file) => ({
          file,
          stats: await getFileStats(file),
        }))
      );
      
      filesWithStats.sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());
      
      // Keep the most recent, flag others
      for (let i = 1; i < filesWithStats.length; i++) {
        const { file, stats } = filesWithStats[i];
        duplicates.push({
          filePath: getRelativePath(file, rootDir),
          reason: 'duplicate',
          confidenceLevel: 'medium',
          lastModified: stats.mtime.toISOString(),
          size: stats.size,
          safeToDelete: false,
          notes: `Potential duplicate of ${basename(filesWithStats[0].file)}. Review before deletion.`,
        });
      }
    }
  }
  
  return duplicates;
}

/**
 * Detect unused files, types, interfaces, and utilities using static import analysis
 */
async function detectUnusedByStaticAnalysis(
  rootDir: string,
  ignorePatterns: string[],
  checkDynamicImports: boolean
): Promise<UnusedFile[]> {
  const unusedFiles: UnusedFile[] = [];
  
  // Get all TypeScript/JavaScript files
  const allFiles = await findFiles(rootDir, {
    ignore: ignorePatterns,
    pattern: /\.(ts|tsx|js|jsx|mjs|cjs)$/,
  });
  
  // Build import graph
  const importGraph = await buildImportGraph(allFiles, rootDir);
  
  // Find files that are never imported
  const importedFiles = new Set<string>();
  for (const imports of importGraph.values()) {
    for (const imported of imports) {
      importedFiles.add(imported);
    }
  }
  
  // Check each file
  for (const file of allFiles) {
    const relativePath = getRelativePath(file, rootDir);
    const normalizedPath = normalizeImportPath(relativePath);
    
    // Skip entry points and config files
    if (isEntryPoint(file, rootDir) || isConfigFile(file)) {
      continue;
    }
    
    // Check if file is imported
    if (!importedFiles.has(normalizedPath) && !importedFiles.has(relativePath)) {
      const stats = await getFileStats(file);
      const isTypeFile = file.endsWith('.d.ts') || file.includes('/types/');
      
      unusedFiles.push({
        filePath: relativePath,
        reason: isTypeFile ? 'unused_type' : 'not_imported',
        confidenceLevel: checkDynamicImports ? 'medium' : 'high',
        lastModified: stats.mtime.toISOString(),
        size: stats.size,
        safeToDelete: false,
        notes: checkDynamicImports
          ? 'Not found in static imports - may be dynamically imported'
          : 'Not imported anywhere in codebase',
      });
    }
  }
  
  // Check for unused exported types and interfaces
  const unusedTypes = await detectUnusedTypes(allFiles, rootDir, importGraph);
  unusedFiles.push(...unusedTypes);
  
  return unusedFiles;
}

/**
 * Build import graph from files
 */
async function buildImportGraph(
  files: string[],
  rootDir: string
): Promise<Map<string, Set<string>>> {
  const graph = new Map<string, Set<string>>();
  
  for (const file of files) {
    const imports = new Set<string>();
    
    try {
      const content = await readFile(file);
      
      // Extract import statements
      const importRegex = /import\s+.*?\s+from\s+['"](.+?)['"]/g;
      const dynamicImportRegex = /import\s*\(['"](.+?)['"]\)/g;
      
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        const resolved = resolveImportPath(importPath, file, rootDir);
        if (resolved) {
          imports.add(resolved);
        }
      }
      
      // Check for dynamic imports
      while ((match = dynamicImportRegex.exec(content)) !== null) {
        const importPath = match[1];
        const resolved = resolveImportPath(importPath, file, rootDir);
        if (resolved) {
          imports.add(resolved);
        }
      }
    } catch {
      // Skip files we can't read
    }
    
    const relativePath = getRelativePath(file, rootDir);
    graph.set(relativePath, imports);
  }
  
  return graph;
}

/**
 * Resolve import path to actual file path
 */
function resolveImportPath(
  importPath: string,
  fromFile: string,
  rootDir: string
): string | null {
  // Handle path aliases (@/...)
  if (importPath.startsWith('@/')) {
    return join(rootDir, 'src', importPath.slice(2));
  }
  
  // Handle relative imports
  if (importPath.startsWith('.')) {
    const fromDir = dirname(fromFile);
    return join(fromDir, importPath);
  }
  
  // Handle absolute imports (node_modules)
  if (!importPath.startsWith('.')) {
    return null; // Skip node_modules imports
  }
  
  return null;
}

/**
 * Normalize import path for comparison
 */
function normalizeImportPath(path: string): string {
  // Remove extensions
  return path.replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, '');
}

/**
 * Check if file is an entry point
 */
function isEntryPoint(file: string, rootDir: string): boolean {
  const relativePath = getRelativePath(file, rootDir);
  const entryPoints = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/loading.tsx',
    'middleware.ts',
    'next.config.ts',
    'next.config.js',
  ];
  
  return entryPoints.some(ep => relativePath === ep || relativePath.endsWith(ep));
}

/**
 * Check if file is a config file
 */
function isConfigFile(file: string): boolean {
  const configPatterns = [
    /^package\.json$/,
    /^tsconfig\.json$/,
    /^next\.config\./,
    /^eslint\.config\./,
    /^\.eslintrc/,
    /^tailwind\.config\./,
    /^postcss\.config\./,
  ];
  
  const fileName = basename(file);
  return configPatterns.some(pattern => pattern.test(fileName));
}

/**
 * Detect unused TypeScript types and interfaces
 */
async function detectUnusedTypes(
  files: string[],
  rootDir: string,
  importGraph: Map<string, Set<string>>
): Promise<UnusedFile[]> {
  const unusedTypes: UnusedFile[] = [];
  
  // Find type definition files
  const typeFiles = files.filter(f =>
    f.endsWith('.d.ts') ||
    f.includes('/types/') ||
    basename(f).includes('types')
  );
  
  for (const typeFile of typeFiles) {
    try {
      const content = await readFile(typeFile);
      
      // Extract exported types and interfaces
      const exportedTypes = extractExportedTypes(content);
      
      // Check if any exported types are used
      const usedTypes = await checkTypeUsage(exportedTypes, files, rootDir);
      
      for (const type of exportedTypes) {
        if (!usedTypes.has(type.name)) {
          const stats = await getFileStats(typeFile);
          unusedTypes.push({
            filePath: getRelativePath(typeFile, rootDir),
            reason: type.kind === 'interface' ? 'unused_interface' : 'unused_type',
            confidenceLevel: 'medium',
            lastModified: stats.mtime.toISOString(),
            size: stats.size,
            safeToDelete: false,
            notes: `Unused ${type.kind}: ${type.name}`,
          });
        }
      }
    } catch {
      // Skip files we can't read
    }
  }
  
  return unusedTypes;
}

/**
 * Extract exported types and interfaces from file content
 */
function extractExportedTypes(content: string): Array<{ name: string; kind: 'type' | 'interface' }> {
  const types: Array<{ name: string; kind: 'type' | 'interface' }> = [];
  
  // Match exported interfaces
  const interfaceRegex = /export\s+(?:interface|type)\s+(\w+)/g;
  let match;
  while ((match = interfaceRegex.exec(content)) !== null) {
    types.push({ name: match[1], kind: 'interface' });
  }
  
  // Match exported type aliases
  const typeRegex = /export\s+type\s+(\w+)\s*=/g;
  while ((match = typeRegex.exec(content)) !== null) {
    types.push({ name: match[1], kind: 'type' });
  }
  
  return types;
}

/**
 * Check if types are used in other files
 */
async function checkTypeUsage(
  types: Array<{ name: string; kind: 'type' | 'interface' }>,
  allFiles: string[],
  rootDir: string
): Promise<Set<string>> {
  const usedTypes = new Set<string>();
  
  for (const file of allFiles) {
    try {
      const content = await readFile(file);
      
      for (const type of types) {
        // Simple check: look for type name in imports or usage
        const importPattern = new RegExp(`import.*\\b${type.name}\\b.*from`, 'g');
        const usagePattern = new RegExp(`\\b${type.name}\\b`, 'g');
        
        if (importPattern.test(content) || usagePattern.test(content)) {
          usedTypes.add(type.name);
        }
      }
    } catch {
      // Skip files we can't read
    }
  }
  
  return usedTypes;
}

/**
 * Generate unused files report
 */
export async function generateUnusedFilesReport(
  report: UnusedFilesReport,
  outputPath: string = join(DEFAULT_OUTPUT_DIR, 'unused-files-report.md')
): Promise<void> {
  let content = `## Summary\n\n`;
  content += `- **Total Files Flagged**: ${report.summary.total}\n`;
  content += `- **High Confidence**: ${report.summary.highConfidence}\n`;
  content += `- **Medium Confidence**: ${report.summary.mediumConfidence}\n`;
  content += `- **Low Confidence**: ${report.summary.lowConfidence}\n`;
  content += `- **Safe to Delete**: ${report.summary.safeToDelete}\n\n`;
  
  // Group by reason
  const byReason = new Map<string, UnusedFile[]>();
  for (const file of report.files) {
    if (!byReason.has(file.reason)) {
      byReason.set(file.reason, []);
    }
    byReason.get(file.reason)!.push(file);
  }
  
  for (const [reason, files] of byReason.entries()) {
    content += `\n## ${formatReasonTitle(reason)} (${files.length})\n\n`;
    
    const table = files.map(f => [
      f.filePath,
      f.confidenceLevel,
      f.size > 0 ? `${(f.size / 1024).toFixed(2)} KB` : '0 B',
      f.safeToDelete ? '✅ Yes' : '⚠️ Review',
      f.notes || '',
    ]);
    
    content += formatTable(
      ['File Path', 'Confidence', 'Size', 'Safe to Delete', 'Notes'],
      table
    );
    content += '\n';
  }
  
  // Recommendations
  content += `\n## Recommendations\n\n`;
  const safeToDelete = report.files.filter(f => f.safeToDelete);
  if (safeToDelete.length > 0) {
    content += `### Files Safe to Delete (${safeToDelete.length})\n\n`;
    content += formatList(safeToDelete.map(f => f.filePath));
    content += '\n\n';
  }
  
  const needsReview = report.files.filter(f => !f.safeToDelete && f.confidenceLevel === 'high');
  if (needsReview.length > 0) {
    content += `### Files Needing Review (${needsReview.length})\n\n`;
    content += formatList(needsReview.map(f => `${f.filePath} - ${f.notes || f.reason}`));
    content += '\n\n';
  }
  
  await generateMarkdownReport(
    outputPath,
    'Unused Files Report',
    content,
    {
      'Generated At': report.generatedAt,
      'Total Flagged': report.summary.total.toString(),
    }
  );
}

/**
 * Format reason title
 */
function formatReasonTitle(reason: string): string {
  const titles: Record<string, string> = {
    backup_file: 'Backup Files',
    not_imported: 'Unused Files (Not Imported)',
    empty_directory: 'Empty Directories',
    duplicate: 'Duplicate Files',
    unused_type: 'Unused Type Definitions',
    unused_interface: 'Unused Interfaces',
    unused_utility: 'Unused Utility Functions',
  };
  
  return titles[reason] || reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

