/**
 * Report generation utility functions
 * Provides Markdown report generation for analysis results
 */

import { writeFile, createDirectory } from './fs-utils';
import { join } from 'path';

/**
 * Generate Markdown report from structured data
 * 
 * @param outputPath - Full path where the report should be written
 * @param title - Report title (will be used as H1 heading)
 * @param content - Main report content (Markdown formatted)
 * @param metadata - Optional metadata to include at the top of the report
 * @throws {Error} If file writing fails
 */
export async function generateMarkdownReport(
  outputPath: string,
  title: string,
  content: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  // Ensure output directory exists
  const outputDir = join(outputPath, '..');
  await createDirectory(outputDir);

  // Build report content
  let report = `# ${title}\n\n`;
  
  if (metadata) {
    report += `**Generated**: ${new Date().toISOString()}\n\n`;
    for (const [key, value] of Object.entries(metadata)) {
      report += `**${key}**: ${value}\n`;
    }
    report += '\n---\n\n';
  }
  
  report += content;
  
  // Write report
  await writeFile(outputPath, report);
}

/**
 * Format table in Markdown
 * 
 * @param headers - Array of column headers
 * @param rows - Array of row arrays (each row should have same length as headers)
 * @returns Markdown-formatted table string
 */
export function formatTable(
  headers: string[],
  rows: (string | number)[][]
): string {
  let table = `| ${headers.join(' | ')} |\n`;
  table += `| ${headers.map(() => '---').join(' | ')} |\n`;
  
  for (const row of rows) {
    table += `| ${row.join(' | ')} |\n`;
  }
  
  return table;
}

/**
 * Format list in Markdown
 * 
 * @param items - Array of list items
 * @param ordered - Whether to create an ordered (numbered) list (default: false for unordered)
 * @returns Markdown-formatted list string
 */
export function formatList(items: string[], ordered = false): string {
  if (ordered) {
    return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
  }
  return items.map(item => `- ${item}`).join('\n');
}

/**
 * Format code block in Markdown
 * @internal
 */
function formatCodeBlock(code: string, language = 'text'): string {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

/**
 * Format summary statistics as a Markdown list
 * @internal
 */
function formatSummary(summary: Record<string, number | string>): string {
  let output = '## Summary\n\n';
  
  for (const [key, value] of Object.entries(summary)) {
    output += `- **${key}**: ${value}\n`;
  }
  
  return output;
}

/**
 * Format ISO timestamp string to human-readable format
 * @internal
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Escape Markdown special characters to prevent formatting
 * @internal
 */
function escapeMarkdown(text: string): string {
  return text
    .replace(/\*/g, '\\*')
    .replace(/#/g, '\\#')
    .replace(/\//g, '\\/')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

