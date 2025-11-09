/**
 * Cleanup module for removing unused files and folders
 * Includes archival summary generation before deletion
 */

import {
  readFile,
  pathExists,
  deleteFile,
  deleteDirectory,
  readDirectory,
  isDirectory,
  getFileStats,
} from './utils/fs-utils';
import { getRelativePath } from './utils/fs-utils';
import { matchesIgnorePattern, DEFAULT_IGNORE_PATTERNS } from './utils/path-utils';
import type {
  CleanupSummary,
  TaskmasterSummary,
  TasksSummary,
  UnusedFile,
} from './types/analysis-types';
import { DEFAULT_OUTPUT_DIR, DEFAULT_ARCHIVE_DIR } from './config/constants';
import { generateMarkdownReport, formatList } from './utils/report-utils';
import { safeExecute } from './utils/error-handler';
import { join } from 'path';

/**
 * Cleanup options
 */
export interface CleanupOptions {
  rootDir?: string;
  unusedFiles?: UnusedFile[];
  dryRun?: boolean;
  archiveDir?: string;
}

/**
 * Generate taskmaster summary before deletion
 */
export async function generateTaskmasterSummary(
  rootDir: string
): Promise<TaskmasterSummary | null> {
  const taskmasterDir = join(rootDir, '.taskmaster');
  
  if (!(await pathExists(taskmasterDir))) {
    return null;
  }
  
  const summary: TaskmasterSummary = {
    config: {},
    state: {},
    templates: [],
    reports: [],
    purpose: 'Task management and project organization tool configuration',
    lastActive: undefined,
  };
  
  try {
    // Read config files
    const configFile = join(taskmasterDir, 'config.json');
    if (await pathExists(configFile)) {
      const content = await readFile(configFile);
      summary.config = JSON.parse(content);
    }
    
    // Read state files
    const stateFile = join(taskmasterDir, 'state.json');
    if (await pathExists(stateFile)) {
      const content = await readFile(stateFile);
      summary.state = JSON.parse(content);
    }
    
    // Find templates
    const templatesDir = join(taskmasterDir, 'templates');
    if (await pathExists(templatesDir)) {
      const files = await readDirectory(templatesDir);
      summary.templates = files.map(f => join('templates', f));
    }
    
    // Find reports
    const reportsDir = join(taskmasterDir, 'reports');
    if (await pathExists(reportsDir)) {
      const files = await readDirectory(reportsDir);
      summary.reports = files.map(f => join('reports', f));
    }
    
    // Try to determine last active date from file modification times
    const allFiles = await getAllFilesInDirectory(taskmasterDir);
    if (allFiles.length > 0) {
      const stats = await Promise.all(allFiles.map(f => getFileStats(f)));
      const latestMtime = stats.reduce((latest, stat) => {
        return stat.mtime > latest ? stat.mtime : latest;
      }, stats[0].mtime);
      summary.lastActive = latestMtime.toISOString();
    }
    
    // Read PRD if exists
    const prdFile = join(taskmasterDir, 'prd.md');
    if (await pathExists(prdFile)) {
      const content = await readFile(prdFile);
      summary.prdContent = content.substring(0, 500) + (content.length > 500 ? '...' : '');
    }
  } catch (error) {
    console.warn('Error generating taskmaster summary:', error);
  }
  
  return summary;
}

/**
 * Generate tasks summary before deletion
 */
export async function generateTasksSummary(
  rootDir: string
): Promise<TasksSummary | null> {
  const tasksDir = join(rootDir, 'tasks');
  
  if (!(await pathExists(tasksDir))) {
    return null;
  }
  
  const summary: TasksSummary = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    taskCategories: [],
    dateRange: {},
    keyMilestones: [],
    purpose: 'Task tracking and project management',
  };
  
  try {
    // Read tasks.json if exists
    const tasksFile = join(tasksDir, 'tasks.json');
    if (await pathExists(tasksFile)) {
      const content = await readFile(tasksFile);
      const tasks = JSON.parse(content);
      
      if (Array.isArray(tasks)) {
        summary.totalTasks = tasks.length;
        summary.completedTasks = tasks.filter((t: any) => t.completed || t.status === 'completed').length;
        summary.pendingTasks = summary.totalTasks - summary.completedTasks;
        
        // Extract categories
        const categories = new Set<string>();
        tasks.forEach((t: any) => {
          if (t.category) categories.add(t.category);
          if (t.tags && Array.isArray(t.tags)) {
            t.tags.forEach((tag: string) => categories.add(tag));
          }
        });
        summary.taskCategories = Array.from(categories);
        
        // Extract dates
        const dates = tasks
          .map((t: any) => t.createdAt || t.date || t.timestamp)
          .filter((d: any) => d)
          .sort();
        
        if (dates.length > 0) {
          summary.dateRange.earliest = dates[0];
          summary.dateRange.latest = dates[dates.length - 1];
        }
        
        // Extract milestones (completed important tasks)
        summary.keyMilestones = tasks
          .filter((t: any) => (t.completed || t.status === 'completed') && (t.important || t.priority === 'high'))
          .map((t: any) => t.title || t.name || t.description)
          .slice(0, 10);
      }
    }
    
    // Check for other task files
    const allFiles = await readDirectory(tasksDir);
    const taskFiles = allFiles.filter(f => f.endsWith('.json') || f.endsWith('.md'));
    
    if (taskFiles.length > 0 && summary.totalTasks === 0) {
      summary.totalTasks = taskFiles.length;
      summary.pendingTasks = taskFiles.length;
    }
  } catch (error) {
    console.warn('Error generating tasks summary:', error);
  }
  
  return summary;
}

/**
 * Get all files in directory recursively
 * @internal
 */
export async function getAllFilesInDirectory(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  async function walk(currentDir: string): Promise<void> {
    try {
      const entries = await readDirectory(currentDir);
      
      for (const entry of entries) {
        const fullPath = join(currentDir, entry);
        
        if (await isDirectory(fullPath)) {
          await walk(fullPath);
        } else {
          files.push(fullPath);
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }
  
  await walk(dir);
  return files;
}

/**
 * Cleanup unused files and directories
 */
export async function cleanupUnused(
  options: CleanupOptions = {}
): Promise<CleanupSummary> {
  const {
    rootDir = process.cwd(),
    unusedFiles = [],
    dryRun = true,
    archiveDir = DEFAULT_ARCHIVE_DIR,
  } = options;
  
  const deletedFiles: string[] = [];
  const deletedDirectories: string[] = [];
  const archivedSummaries: string[] = [];
  
  console.log(dryRun ? '🔍 DRY RUN MODE - No files will be deleted' : '🗑️  EXECUTION MODE - Files will be deleted');
  
  // Step 1: Generate archival summaries for .taskmaster and tasks
  console.log('Generating archival summaries...');
  
  const taskmasterSummary = await generateTaskmasterSummary(rootDir);
  if (taskmasterSummary) {
    const summaryPath = join(archiveDir, 'taskmaster-summary.md');
    await generateMarkdownReport(
      summaryPath,
      'Taskmaster Folder Summary',
      formatTaskmasterSummary(taskmasterSummary),
      { 'Generated At': new Date().toISOString() }
    );
    archivedSummaries.push(summaryPath);
    console.log('✓ Taskmaster summary archived');
  }
  
  const tasksSummary = await generateTasksSummary(rootDir);
  if (tasksSummary) {
    const summaryPath = join(archiveDir, 'tasks-summary.md');
    await generateMarkdownReport(
      summaryPath,
      'Tasks Folder Summary',
      formatTasksSummary(tasksSummary),
      { 'Generated At': new Date().toISOString() }
    );
    archivedSummaries.push(summaryPath);
    console.log('✓ Tasks summary archived');
  }
  
  // Step 2: Delete unused files marked as safe to delete
  const safeToDelete = unusedFiles.filter(f => f.safeToDelete);
  console.log(`\nFound ${safeToDelete.length} files safe to delete`);
  
  for (const file of safeToDelete) {
    const fullPath = join(rootDir, file.filePath);
    
    if (await pathExists(fullPath)) {
      if (dryRun) {
        console.log(`[DRY RUN] Would delete: ${file.filePath}`);
        deletedFiles.push(file.filePath);
      } else {
        const result = await safeExecute(async () => {
          await deleteFile(fullPath);
          return file.filePath;
        });
        
        if (result.success) {
          console.log(`✓ Deleted: ${file.filePath}`);
          deletedFiles.push(result.data);
        } else {
          console.error(`✗ Failed to delete ${file.filePath}: ${result.error.message}`);
        }
      }
    }
  }
  
  // Step 3: Delete .taskmaster and tasks directories (after archival)
  const directoriesToDelete = ['.taskmaster', 'tasks'];
  
  for (const dirName of directoriesToDelete) {
    const fullPath = join(rootDir, dirName);
    
    if (await pathExists(fullPath)) {
      if (dryRun) {
        console.log(`[DRY RUN] Would delete directory: ${dirName}`);
        deletedDirectories.push(dirName);
      } else {
        const result = await safeExecute(async () => {
          await deleteDirectory(fullPath);
          return dirName;
        });
        
        if (result.success) {
          console.log(`✓ Deleted directory: ${dirName}`);
          deletedDirectories.push(result.data);
        } else {
          console.error(`✗ Failed to delete ${dirName}: ${result.error.message}`);
        }
      }
    }
  }
  
  // Calculate space freed (estimate)
  let spaceFreed = 0;
  for (const filePath of deletedFiles) {
    try {
      const fullPath = join(rootDir, filePath);
      if (await pathExists(fullPath)) {
        const stats = await getFileStats(fullPath);
        spaceFreed += stats.size;
      }
    } catch {
      // Skip files we can't access
    }
  }
  
  const summary: CleanupSummary = {
    deletedFiles,
    deletedDirectories,
    archivedSummaries,
    totalFilesDeleted: deletedFiles.length,
    totalDirectoriesDeleted: deletedDirectories.length,
    spaceFreed,
    executedAt: new Date().toISOString(),
    dryRun,
  };
  
  // Generate cleanup summary report
  await generateCleanupSummaryReport(summary, join(DEFAULT_OUTPUT_DIR, 'cleanup-summary.md'));
  
  return summary;
}

/**
 * Main entry point for CLI usage
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--execute');
  
  // Get unused files from analysis if available
  const unusedFilesPath = join(DEFAULT_OUTPUT_DIR, 'unused-files-report.md');
  
  cleanupUnused({
    dryRun,
  })
    .then(summary => {
      console.log('\n' + '='.repeat(60));
      console.log(dryRun ? 'DRY RUN COMPLETE' : 'CLEANUP COMPLETE');
      console.log('='.repeat(60));
      console.log(`Files deleted: ${summary.totalFilesDeleted}`);
      console.log(`Directories deleted: ${summary.totalDirectoriesDeleted}`);
              console.log(`Space freed: ${summary.spaceFreed ? (summary.spaceFreed / 1024 / 1024).toFixed(2) : '0.00'} MB`);
      console.log(`\nReport saved to: ${join(DEFAULT_OUTPUT_DIR, 'cleanup-summary.md')}`);
      
      if (dryRun) {
        console.log('\n⚠️  This was a DRY RUN. No files were actually deleted.');
        console.log('Run with --execute flag to perform actual cleanup.');
      }
      
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Cleanup failed:', error);
      process.exit(1);
    });
}

/**
 * Format taskmaster summary
 */
function formatTaskmasterSummary(summary: TaskmasterSummary): string {
  let content = `## Purpose\n\n${summary.purpose}\n\n`;
  
  if (summary.config && Object.keys(summary.config).length > 0) {
    content += `## Configuration\n\n\`\`\`json\n${JSON.stringify(summary.config, null, 2)}\n\`\`\`\n\n`;
  }
  
  if (summary.state && Object.keys(summary.state).length > 0) {
    content += `## State\n\n\`\`\`json\n${JSON.stringify(summary.state, null, 2)}\n\`\`\`\n\n`;
  }
  
  if (summary.prdContent) {
    content += `## PRD Content (Excerpt)\n\n${summary.prdContent}\n\n`;
  }
  
  if (summary.templates && summary.templates.length > 0) {
    content += `## Templates\n\n${formatList(summary.templates)}\n\n`;
  }
  
  if (summary.reports && summary.reports.length > 0) {
    content += `## Reports\n\n${formatList(summary.reports)}\n\n`;
  }
  
  if (summary.lastActive) {
    content += `## Last Active\n\n${summary.lastActive}\n\n`;
  }
  
  return content;
}

/**
 * Format tasks summary
 */
function formatTasksSummary(summary: TasksSummary): string {
  let content = `## Purpose\n\n${summary.purpose}\n\n`;
  
  content += `## Statistics\n\n`;
  content += `- **Total Tasks**: ${summary.totalTasks}\n`;
  content += `- **Completed Tasks**: ${summary.completedTasks}\n`;
  content += `- **Pending Tasks**: ${summary.pendingTasks}\n\n`;
  
  if (summary.taskCategories && summary.taskCategories.length > 0) {
    content += `## Categories\n\n${formatList(summary.taskCategories)}\n\n`;
  }
  
  if (summary.dateRange) {
    content += `## Date Range\n\n`;
    if (summary.dateRange.earliest) {
      content += `- **Earliest**: ${summary.dateRange.earliest}\n`;
    }
    if (summary.dateRange.latest) {
      content += `- **Latest**: ${summary.dateRange.latest}\n`;
    }
    content += '\n';
  }
  
  if (summary.keyMilestones && summary.keyMilestones.length > 0) {
    content += `## Key Milestones\n\n${formatList(summary.keyMilestones)}\n\n`;
  }
  
  return content;
}

/**
 * Generate cleanup summary report
 */
async function generateCleanupSummaryReport(
  summary: CleanupSummary,
  outputPath: string
): Promise<void> {
  let content = `## Summary\n\n`;
  content += `- **Mode**: ${summary.dryRun ? 'DRY RUN' : 'EXECUTION'}\n`;
  content += `- **Files Deleted**: ${summary.totalFilesDeleted}\n`;
  content += `- **Directories Deleted**: ${summary.totalDirectoriesDeleted}\n`;
  content += `- **Space Freed**: ${summary.spaceFreed ? (summary.spaceFreed / 1024 / 1024).toFixed(2) : '0.00'} MB\n`;
  content += `- **Executed At**: ${summary.executedAt}\n\n`;
  
  if (summary.deletedFiles.length > 0) {
    content += `## Deleted Files\n\n`;
    content += formatList(summary.deletedFiles);
    content += '\n\n';
  }
  
  if (summary.deletedDirectories.length > 0) {
    content += `## Deleted Directories\n\n`;
    content += formatList(summary.deletedDirectories);
    content += '\n\n';
  }
  
  if (summary.archivedSummaries.length > 0) {
    content += `## Archived Summaries\n\n`;
    content += formatList(summary.archivedSummaries);
    content += '\n\n';
  }
  
  await generateMarkdownReport(
    outputPath,
    'Cleanup Summary',
    content,
    {
      'Executed At': summary.executedAt,
      'Mode': summary.dryRun ? 'DRY RUN' : 'EXECUTION',
    }
  );
}

