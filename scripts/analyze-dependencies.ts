/**
 * Dependency analysis module
 * Analyzes npm dependencies and identifies outdated packages
 */

import { readFile, pathExists } from './utils/fs-utils';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import type {
  DependencyAnalysisReport,
  DependencyInfo,
  SecurityIssue,
} from './types/analysis-types';
import { DEFAULT_OUTPUT_DIR } from './config/constants';
import { generateMarkdownReport, formatTable, formatList } from './utils/report-utils';
import { safeExecute } from './utils/error-handler';

const execAsync = promisify(exec);

/**
 * Dependency analysis options
 */
export interface DependencyAnalysisOptions {
  packageJsonPath?: string;
  includeDevDependencies?: boolean;
}

/**
 * Package.json structure
 */
interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * npm outdated output structure
 */
interface NpmOutdatedItem {
  current: string;
  wanted: string;
  latest: string;
  dependent?: string;
  location?: string;
}

/**
 * Analyze npm dependencies
 */
export async function analyzeDependencies(
  options: DependencyAnalysisOptions = {}
): Promise<DependencyAnalysisReport> {
  const {
    packageJsonPath = join(process.cwd(), 'package.json'),
    includeDevDependencies = true,
  } = options;
  
  // Parse package.json
  const packageJson = await parsePackageJson(packageJsonPath);
  
  // Get outdated packages from npm
  const outdatedData = await getNpmOutdatedData(packageJsonPath);
  
  // Build dependency info
  const dependencies = await buildDependencyInfo(
    packageJson,
    outdatedData,
    includeDevDependencies
  );
  
  // Calculate summary statistics
  const summary = {
    total: dependencies.length,
    outdated: dependencies.filter(d => d.currentVersion !== d.latestVersion).length,
    majorUpdates: dependencies.filter(d => d.updateType === 'major').length,
    securityIssues: dependencies.reduce((sum, d) => sum + d.securityIssues.length, 0),
  };
  
  return {
    dependencies,
    summary,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Parse package.json file
 */
async function parsePackageJson(path: string): Promise<PackageJson> {
  if (!(await pathExists(path))) {
    throw new Error(`package.json not found at ${path}`);
  }
  
  const content = await readFile(path);
  return JSON.parse(content);
}

/**
 * Get npm outdated data
 */
async function getNpmOutdatedData(
  packageJsonPath: string
): Promise<Record<string, NpmOutdatedItem>> {
  const result = await safeExecute(async () => {
    const { stdout, stderr } = await execAsync(
      'npm outdated --json',
      { cwd: join(packageJsonPath, '..') }
    );
    
    if (stderr && !stderr.includes('npm WARN')) {
      throw new Error(stderr);
    }
    
    if (!stdout || stdout.trim() === '') {
      return {};
    }
    
    return JSON.parse(stdout) as Record<string, NpmOutdatedItem>;
  });
  
  if (!result.success) {
    console.warn('Failed to get npm outdated data:', result.error.message);
    return {};
  }
  
  return result.data;
}

/**
 * Build dependency information
 */
async function buildDependencyInfo(
  packageJson: PackageJson,
  outdatedData: Record<string, NpmOutdatedItem>,
  includeDevDependencies: boolean
): Promise<DependencyInfo[]> {
  const dependencies: DependencyInfo[] = [];
  
  // Process dependencies
  if (packageJson.dependencies) {
    for (const [packageName, versionRange] of Object.entries(packageJson.dependencies)) {
      const outdated = outdatedData[packageName];
      dependencies.push(await buildDependencyInfoItem(
        packageName,
        versionRange,
        outdated,
        false
      ));
    }
  }
  
  // Process devDependencies
  if (includeDevDependencies && packageJson.devDependencies) {
    for (const [packageName, versionRange] of Object.entries(packageJson.devDependencies)) {
      const outdated = outdatedData[packageName];
      dependencies.push(await buildDependencyInfoItem(
        packageName,
        versionRange,
        outdated,
        true
      ));
    }
  }
  
  return dependencies;
}

/**
 * Build dependency info item
 */
async function buildDependencyInfoItem(
  packageName: string,
  versionRange: string,
  outdated: NpmOutdatedItem | undefined,
  isDev: boolean
): Promise<DependencyInfo> {
  const currentVersion = extractVersion(versionRange);
  const wantedVersion = outdated?.wanted || currentVersion;
  const latestVersion = outdated?.latest || currentVersion;
  
  // Determine update type
  const updateType = determineUpdateType(currentVersion, wantedVersion, latestVersion);
  
  // Check for breaking changes (major updates)
  const hasBreakingChanges = updateType === 'major';
  
  // Check for deprecated packages
  const isDeprecated = await checkDeprecatedPackage(packageName);
  
  // Security issues (placeholder - would need npm audit integration)
  const securityIssues: SecurityIssue[] = [];
  
  // Generate recommendation
  const recommendation = generateRecommendation(
    packageName,
    currentVersion,
    wantedVersion,
    latestVersion,
    updateType,
    hasBreakingChanges,
    isDeprecated
  );
  
  return {
    packageName,
    currentVersion,
    wantedVersion,
    latestVersion,
    updateType,
    hasBreakingChanges,
    securityIssues,
    recommendation,
    isDeprecated,
  };
}

/**
 * Extract version from version range
 */
function extractVersion(versionRange: string): string {
  // Remove range prefixes (^, ~, >=, etc.)
  return versionRange.replace(/^[\^~>=<]+/, '');
}

/**
 * Determine update type
 */
function determineUpdateType(
  current: string,
  wanted: string,
  latest: string
): 'patch' | 'minor' | 'major' {
  if (current === latest) {
    return 'patch'; // No update needed
  }
  
  const currentParts = parseVersion(current);
  const latestParts = parseVersion(latest);
  
  if (currentParts.major !== latestParts.major) {
    return 'major';
  }
  if (currentParts.minor !== latestParts.minor) {
    return 'minor';
  }
  return 'patch';
}

/**
 * Parse version string into parts
 */
function parseVersion(version: string): { major: number; minor: number; patch: number } {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
  };
}

/**
 * Check if package is deprecated (simplified - would need npm registry API)
 */
async function checkDeprecatedPackage(packageName: string): Promise<boolean> {
  // This is a simplified check - in production, would query npm registry API
  // For now, return false and let npm outdated handle it
  try {
    const result = await safeExecute(async () => {
      const { stdout } = await execAsync(`npm view ${packageName} deprecated`, {
        maxBuffer: 1024 * 1024,
      });
      return stdout.trim() !== '' && stdout.trim() !== 'null';
    });
    
    return result.success && result.data;
  } catch {
    return false;
  }
}

/**
 * Generate update recommendation
 */
function generateRecommendation(
  packageName: string,
  current: string,
  wanted: string,
  latest: string,
  updateType: 'patch' | 'minor' | 'major',
  hasBreakingChanges: boolean,
  isDeprecated: boolean
): string {
  if (current === latest) {
    return 'Package is up to date';
  }
  
  if (isDeprecated) {
    return `⚠️ Package is deprecated. Consider migrating to an alternative.`;
  }
  
  if (updateType === 'major' && hasBreakingChanges) {
    return `⚠️ Major update available (${current} → ${latest}). Review breaking changes before updating.`;
  }
  
  if (updateType === 'major') {
    return `Major update available (${current} → ${latest}). Test thoroughly before updating.`;
  }
  
  if (updateType === 'minor') {
    return `Minor update available (${current} → ${latest}). Safe to update.`;
  }
  
  return `Patch update available (${current} → ${latest}). Safe to update.`;
}

/**
 * Validate that all packages from package.json are analyzed
 */
export function validateDependencyCoverage(
  packageJson: PackageJson,
  dependencies: DependencyInfo[],
  includeDevDependencies: boolean
): {
  valid: boolean;
  missing: string[];
} {
  const allPackages = new Set<string>();
  
  if (packageJson.dependencies) {
    Object.keys(packageJson.dependencies).forEach(pkg => allPackages.add(pkg));
  }
  
  if (includeDevDependencies && packageJson.devDependencies) {
    Object.keys(packageJson.devDependencies).forEach(pkg => allPackages.add(pkg));
  }
  
  const analyzedPackages = new Set(dependencies.map(d => d.packageName));
  const missing = Array.from(allPackages).filter(pkg => !analyzedPackages.has(pkg));
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Generate dependency analysis report
 */
export async function generateDependencyReport(
  report: DependencyAnalysisReport,
  outputPath: string = join(DEFAULT_OUTPUT_DIR, 'dependency-report.md')
): Promise<void> {
  let content = `## Summary\n\n`;
  content += `- **Total Packages**: ${report.summary.total}\n`;
  content += `- **Outdated Packages**: ${report.summary.outdated}\n`;
  content += `- **Major Updates Available**: ${report.summary.majorUpdates}\n`;
  content += `- **Security Issues**: ${report.summary.securityIssues}\n\n`;
  
  // Group by update type
  const majorUpdates = report.dependencies.filter(d => d.updateType === 'major');
  const minorUpdates = report.dependencies.filter(d => d.updateType === 'minor');
  const patchUpdates = report.dependencies.filter(d => d.updateType === 'patch' && d.currentVersion !== d.latestVersion);
  const upToDate = report.dependencies.filter(d => d.currentVersion === d.latestVersion);
  
  if (majorUpdates.length > 0) {
    content += `\n## ⚠️ Major Updates (Breaking Changes Possible)\n\n`;
    const majorTable = majorUpdates.map(d => [
      d.packageName,
      d.currentVersion,
      d.latestVersion,
      d.isDeprecated ? '⚠️ Deprecated' : '',
      d.recommendation,
    ]);
    content += formatTable(
      ['Package', 'Current', 'Latest', 'Status', 'Recommendation'],
      majorTable
    );
    content += '\n';
  }
  
  if (minorUpdates.length > 0) {
    content += `\n## Minor Updates\n\n`;
    const minorTable = minorUpdates.map(d => [
      d.packageName,
      d.currentVersion,
      d.latestVersion,
      d.recommendation,
    ]);
    content += formatTable(
      ['Package', 'Current', 'Latest', 'Recommendation'],
      minorTable
    );
    content += '\n';
  }
  
  if (patchUpdates.length > 0) {
    content += `\n## Patch Updates\n\n`;
    const patchTable = patchUpdates.map(d => [
      d.packageName,
      d.currentVersion,
      d.latestVersion,
      d.recommendation,
    ]);
    content += formatTable(
      ['Package', 'Current', 'Latest', 'Recommendation'],
      patchTable
    );
    content += '\n';
  }
  
  if (upToDate.length > 0) {
    content += `\n## Up to Date Packages\n\n`;
    content += `The following ${upToDate.length} packages are up to date:\n\n`;
    content += formatList(upToDate.map(d => `${d.packageName} (${d.currentVersion})`));
    content += '\n';
  }
  
  // Security issues section
  const packagesWithSecurityIssues = report.dependencies.filter(d => d.securityIssues.length > 0);
  if (packagesWithSecurityIssues.length > 0) {
    content += `\n## 🔒 Security Issues\n\n`;
    for (const pkg of packagesWithSecurityIssues) {
      content += `### ${pkg.packageName}\n\n`;
      for (const issue of pkg.securityIssues) {
        content += `- **${issue.severity.toUpperCase()}**: ${issue.description}`;
        if (issue.cve) {
          content += ` (CVE: ${issue.cve})`;
        }
        content += '\n';
      }
      content += '\n';
    }
  }
  
  await generateMarkdownReport(
    outputPath,
    'Dependency Analysis Report',
    content,
    {
      'Generated At': report.generatedAt,
      'Total Packages': report.summary.total.toString(),
      'Outdated Packages': report.summary.outdated.toString(),
    }
  );
}

