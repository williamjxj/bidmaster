/**
 * Project structure analysis module
 * Analyzes directory hierarchy, file organization, and architectural patterns
 */

import {
  findFiles,
  findDirectories,
  readDirectory,
  isDirectory,
  getFileStats,
  pathExists,
} from './utils/fs-utils';
import {
  matchesIgnorePattern,
  filterIgnoredPaths,
  DEFAULT_IGNORE_PATTERNS,
} from './utils/path-utils';
import { checkConfigurations } from './utils/config-checker';
import type {
  ProjectStructureSummary,
  DirectoryNode,
  FileOrganizationPattern,
  ArchitecturalPattern,
  KeyFile,
  ComponentOrganization,
  ComponentInfo,
  ComponentRelationship,
} from './types/analysis-types';
import { DEFAULT_OUTPUT_DIR } from './config/constants';
import { generateMarkdownReport, formatTable, formatList } from './utils/report-utils';
import { safeExecute } from './utils/error-handler';
import { join, relative, basename, dirname } from 'path';

/**
 * Structure analysis options
 */
export interface StructureAnalysisOptions {
  rootDir: string;
  ignorePatterns?: string[];
}

/**
 * Analyze project structure
 */
export async function analyzeStructure(
  options: StructureAnalysisOptions
): Promise<ProjectStructureSummary> {
  const { rootDir, ignorePatterns = DEFAULT_IGNORE_PATTERNS } = options;
  
  // Build directory hierarchy
  const directoryHierarchy = await buildDirectoryHierarchy(rootDir, ignorePatterns);
  
  // Analyze file organization patterns
  const fileOrganization = await analyzeFileOrganization(rootDir, ignorePatterns);
  
  // Identify architectural patterns
  const architecturalPatterns = await identifyArchitecturalPatterns(rootDir, ignorePatterns);
  
  // Identify key files
  const keyFiles = await identifyKeyFiles(rootDir, ignorePatterns);
  
  // Analyze component organization
  const componentOrganization = await analyzeComponentOrganization(rootDir, ignorePatterns);
  
  return {
    directoryHierarchy,
    fileOrganization,
    architecturalPatterns,
    keyFiles,
    componentOrganization,
    generatedAt: new Date().toISOString(),
    projectRoot: rootDir,
  };
}

/**
 * Build directory hierarchy tree
 */
async function buildDirectoryHierarchy(
  rootDir: string,
  ignorePatterns: string[]
): Promise<DirectoryNode> {
  async function buildNode(currentPath: string, name: string): Promise<DirectoryNode> {
    const children: DirectoryNode[] = [];
    let fileCount = 0;
    
    try {
      const entries = await readDirectory(currentPath);
      
      for (const entry of entries) {
        const fullPath = join(currentPath, entry);
        
        // Skip ignored paths
        if (matchesIgnorePattern(fullPath, ignorePatterns)) {
          continue;
        }
        
        if (await isDirectory(fullPath)) {
          const childNode = await buildNode(fullPath, entry);
          if (childNode.children && childNode.children.length > 0) {
            children.push(childNode);
          }
        } else {
          fileCount++;
        }
      }
    } catch {
      // Skip directories we can't read
    }
    
    return {
      name,
      path: currentPath,
      children: children.length > 0 ? children : undefined,
      fileCount: fileCount > 0 ? fileCount : undefined,
      purpose: getDirectoryPurpose(currentPath, name),
    };
  }
  
  return buildNode(rootDir, basename(rootDir));
}

/**
 * Get directory purpose based on name and location
 */
function getDirectoryPurpose(path: string, name: string): string | undefined {
  const lowerName = name.toLowerCase();
  const lowerPath = path.toLowerCase();
  
  if (lowerName === 'src' || lowerPath.includes('/src')) {
    return 'Source code directory';
  }
  if (lowerName === 'app' || lowerPath.includes('/app')) {
    return 'Next.js App Router directory';
  }
  if (lowerName === 'api' || lowerPath.includes('/api')) {
    return 'API routes directory';
  }
  if (lowerName === 'components' || lowerPath.includes('/components')) {
    return 'React components directory';
  }
  if (lowerName === 'lib' || lowerPath.includes('/lib')) {
    return 'Library/utility functions directory';
  }
  if (lowerName === 'hooks' || lowerPath.includes('/hooks')) {
    return 'React hooks directory';
  }
  if (lowerName === 'utils' || lowerPath.includes('/utils')) {
    return 'Utility functions directory';
  }
  if (lowerName === 'types' || lowerPath.includes('/types')) {
    return 'TypeScript type definitions directory';
  }
  if (lowerName === 'scripts' || lowerPath.includes('/scripts')) {
    return 'Scripts and tooling directory';
  }
  if (lowerName === 'database' || lowerPath.includes('/database')) {
    return 'Database schemas and migrations directory';
  }
  if (lowerName === 'public' || lowerPath.includes('/public')) {
    return 'Public static assets directory';
  }
  if (lowerName === 'docs' || lowerPath.includes('/docs')) {
    return 'Documentation directory';
  }
  
  return undefined;
}

/**
 * Analyze file organization patterns
 */
async function analyzeFileOrganization(
  rootDir: string,
  ignorePatterns: string[]
): Promise<FileOrganizationPattern> {
  const conventions: string[] = [];
  const namingPatterns: string[] = [];
  let structureType: FileOrganizationPattern['structureType'] = 'custom';
  
  // Check for Next.js App Router
  const appDir = join(rootDir, 'src', 'app');
  if (await pathExists(appDir)) {
    structureType = 'app-router';
    conventions.push('Next.js App Router structure');
    namingPatterns.push('Route-based file organization (app/ directory)');
  } else {
    const pagesDir = join(rootDir, 'src', 'pages');
    if (await pathExists(pagesDir)) {
      structureType = 'pages-router';
      conventions.push('Next.js Pages Router structure');
      namingPatterns.push('File-based routing (pages/ directory)');
    }
  }
  
  // Check for kebab-case naming
  const files = await findFiles(rootDir, { ignore: ignorePatterns });
  const kebabCaseFiles = files.filter(f => /^[a-z0-9]+(-[a-z0-9]+)*\./.test(basename(f)));
  if (kebabCaseFiles.length > files.length * 0.5) {
    namingPatterns.push('kebab-case file naming');
  }
  
  // Check for TypeScript usage
  const tsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  if (tsFiles.length > files.length * 0.7) {
    conventions.push('TypeScript-first development');
  }
  
  return {
    conventions,
    namingPatterns,
    structureType,
  };
}

/**
 * Identify architectural patterns
 */
async function identifyArchitecturalPatterns(
  rootDir: string,
  ignorePatterns: string[]
): Promise<ArchitecturalPattern[]> {
  const patterns: ArchitecturalPattern[] = [];
  
  // Check for Next.js App Router
  const appDir = join(rootDir, 'src', 'app');
  if (await pathExists(appDir)) {
    const appFiles = await findFiles(appDir, { ignore: ignorePatterns });
    patterns.push({
      name: 'Next.js App Router',
      type: 'nextjs-app-router',
      description: 'Uses Next.js 13+ App Router with route-based file organization',
      examples: appFiles.slice(0, 5).map(f => relative(rootDir, f)),
    });
  }
  
  // Check for API routes
  const apiDir = join(rootDir, 'src', 'app', 'api');
  if (await pathExists(apiDir)) {
    const apiRoutes = await findDirectories(apiDir, { ignore: ignorePatterns });
    patterns.push({
      name: 'API Routes',
      type: 'api-routes',
      description: `Next.js API routes organized in app/api/ directory (${apiRoutes.length} routes)`,
      examples: apiRoutes.slice(0, 5).map(r => relative(rootDir, r)),
    });
  }
  
  // Check for component structure
  const componentsDir = join(rootDir, 'src', 'components');
  if (await pathExists(componentsDir)) {
    const uiDir = join(componentsDir, 'ui');
    const hasUIDir = await pathExists(uiDir);
    patterns.push({
      name: 'Component Organization',
      type: 'component-structure',
      description: hasUIDir
        ? 'Organized component structure with UI primitives and feature components'
        : 'Component-based architecture with reusable components',
      examples: [relative(rootDir, componentsDir)],
    });
  }
  
  // Check for Supabase integration
  const supabaseFiles = await findFiles(rootDir, {
    ignore: ignorePatterns,
    pattern: /supabase/i,
  });
  if (supabaseFiles.length > 0) {
    patterns.push({
      name: 'Supabase Integration',
      type: 'supabase-integration',
      description: 'Supabase used for database and authentication',
      examples: supabaseFiles.slice(0, 3).map(f => relative(rootDir, f)),
    });
  }
  
  return patterns;
}

/**
 * Identify key files
 */
async function identifyKeyFiles(
  rootDir: string,
  ignorePatterns: string[]
): Promise<KeyFile[]> {
  const keyFiles: KeyFile[] = [];
  
  const importantFiles = [
    { path: 'package.json', category: 'config' as const, purpose: 'Project dependencies and scripts' },
    { path: 'tsconfig.json', category: 'config' as const, purpose: 'TypeScript configuration' },
    { path: 'next.config.ts', category: 'config' as const, purpose: 'Next.js configuration' },
    { path: 'eslint.config.mjs', category: 'config' as const, purpose: 'ESLint configuration' },
    { path: 'src/app/layout.tsx', category: 'entry' as const, purpose: 'Root layout component' },
    { path: 'src/app/page.tsx', category: 'entry' as const, purpose: 'Home page component' },
    { path: 'middleware.ts', category: 'utility' as const, purpose: 'Next.js middleware for auth/routing' },
  ];
  
  for (const file of importantFiles) {
    const fullPath = join(rootDir, file.path);
    if (await pathExists(fullPath) && !matchesIgnorePattern(fullPath, ignorePatterns)) {
      keyFiles.push({
        path: file.path,
        purpose: file.purpose,
        category: file.category,
      });
    }
  }
  
  return keyFiles;
}

/**
 * Analyze component organization
 */
async function analyzeComponentOrganization(
  rootDir: string,
  ignorePatterns: string[]
): Promise<ComponentOrganization> {
  const componentsDir = join(rootDir, 'src', 'components');
  
  if (!(await pathExists(componentsDir))) {
    return {
      uiComponents: [],
      featureComponents: [],
      sharedComponents: [],
      relationships: [],
    };
  }
  
  const uiComponents: ComponentInfo[] = [];
  const featureComponents: ComponentInfo[] = [];
  const sharedComponents: ComponentInfo[] = [];
  const relationships: ComponentRelationship[] = [];
  
  // Find UI components (in ui/ subdirectory)
  const uiDir = join(componentsDir, 'ui');
  if (await pathExists(uiDir)) {
    const uiFiles = await findFiles(uiDir, { ignore: ignorePatterns });
    for (const file of uiFiles) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        uiComponents.push({
          name: basename(file, '.tsx').replace('.ts', ''),
          path: relative(rootDir, file),
          purpose: 'UI primitive component',
          dependencies: await extractDependencies(file),
        });
      }
    }
  }
  
  // Find feature components (in components/ root, not in ui/)
  const componentFiles = await findFiles(componentsDir, { ignore: ignorePatterns });
  for (const file of componentFiles) {
    if (file.includes('/ui/')) continue;
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      featureComponents.push({
        name: basename(file, '.tsx').replace('.ts', ''),
        path: relative(rootDir, file),
        purpose: 'Feature-specific component',
        dependencies: await extractDependencies(file),
      });
    }
  }
  
  // Build relationships from dependencies
  for (const component of [...uiComponents, ...featureComponents]) {
    for (const dep of component.dependencies) {
      relationships.push({
        from: component.path,
        to: dep,
        type: 'imports',
      });
    }
  }
  
  return {
    uiComponents,
    featureComponents,
    sharedComponents,
    relationships,
  };
}

/**
 * Extract dependencies from a file (simple import detection)
 */
async function extractDependencies(filePath: string): Promise<string[]> {
  try {
    const { readFile } = await import('./utils/fs-utils');
    const content = await readFile(filePath);
    const imports: string[] = [];
    
    // Match import statements
    const importRegex = /import\s+.*?\s+from\s+['"](.+?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  } catch {
    return [];
  }
}

/**
 * Analyze API route structure
 */
async function analyzeAPIRouteStructure(
  rootDir: string,
  ignorePatterns: string[]
): Promise<{
  routes: Array<{ path: string; method: string; hasAuth?: boolean }>;
  patterns: {
    naming: string[];
    auth: string[];
    errorHandling: string[];
  };
  inconsistencies: string[];
}> {
  const apiDir = join(rootDir, 'src', 'app', 'api');
  
  if (!(await pathExists(apiDir))) {
    return {
      routes: [],
      patterns: { naming: [], auth: [], errorHandling: [] },
      inconsistencies: [],
    };
  }
  
  const routes: Array<{ path: string; method: string; hasAuth?: boolean }> = [];
  const routeDirs = await findDirectories(apiDir, { ignore: ignorePatterns });
  
  for (const routeDir of routeDirs) {
    const routePath = relative(apiDir, routeDir);
    const routeFile = join(routeDir, 'route.ts');
    
    if (await pathExists(routeFile)) {
      const { readFile } = await import('./utils/fs-utils');
      const content = await readFile(routeFile);
      
      // Detect HTTP methods
      const methods: string[] = [];
      if (content.includes('export async function GET')) methods.push('GET');
      if (content.includes('export async function POST')) methods.push('POST');
      if (content.includes('export async function PUT')) methods.push('PUT');
      if (content.includes('export async function PATCH')) methods.push('PATCH');
      if (content.includes('export async function DELETE')) methods.push('DELETE');
      
      // Check for authentication
      const hasAuth = content.includes('createClient') || 
                     content.includes('getUser') ||
                     content.includes('auth');
      
      for (const method of methods) {
        routes.push({
          path: `/api/${routePath}`,
          method,
          hasAuth,
        });
      }
    }
  }
  
  // Analyze patterns
  const namingPatterns = analyzeNamingPatterns(routes.map(r => r.path));
  const authPatterns = routes.filter(r => r.hasAuth).length > 0 
    ? ['Some routes use authentication'] 
    : ['No authentication detected'];
  const errorHandlingPatterns = ['Standard Next.js error handling'];
  
  // Find inconsistencies
  const inconsistencies: string[] = [];
  const routeNames = routes.map(r => basename(dirname(r.path)));
  const namingInconsistencies = detectNamingInconsistencies(routeNames);
  if (namingInconsistencies.length > 0) {
    inconsistencies.push(...namingInconsistencies);
  }
  
  return {
    routes,
    patterns: {
      naming: namingPatterns,
      auth: authPatterns,
      errorHandling: errorHandlingPatterns,
    },
    inconsistencies,
  };
}

/**
 * Analyze naming patterns
 */
function analyzeNamingPatterns(paths: string[]): string[] {
  const patterns: string[] = [];
  
  // Check for kebab-case
  const kebabCase = paths.filter(p => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(basename(p)));
  if (kebabCase.length > paths.length * 0.7) {
    patterns.push('kebab-case naming convention');
  }
  
  // Check for camelCase
  const camelCase = paths.filter(p => /^[a-z][a-zA-Z0-9]*$/.test(basename(p)));
  if (camelCase.length > paths.length * 0.7) {
    patterns.push('camelCase naming convention');
  }
  
  return patterns;
}

/**
 * Detect naming inconsistencies
 */
function detectNamingInconsistencies(names: string[]): string[] {
  const inconsistencies: string[] = [];
  
  const hasKebab = names.some(n => /-/.test(n));
  const hasCamel = names.some(n => /^[a-z][a-zA-Z0-9]*$/.test(n) && !/-/.test(n));
  
  if (hasKebab && hasCamel) {
    inconsistencies.push('Mixed naming conventions detected (kebab-case and camelCase)');
  }
  
  return inconsistencies;
}

/**
 * Validate that all major directories are documented
 */
export function validateStructureSummary(
  summary: ProjectStructureSummary
): {
  valid: boolean;
  missingDirectories: string[];
  warnings: string[];
} {
  const requiredDirectories = [
    'src',
    'src/app',
    'src/components',
    'src/lib',
    'scripts',
    'database',
    'public',
  ];
  
  const missingDirectories: string[] = [];
  const warnings: string[] = [];
  
  // Check if required directories exist in hierarchy
  function checkDirectory(node: DirectoryNode, requiredPath: string): boolean {
    if (node.path.endsWith(requiredPath) || node.path.includes(requiredPath)) {
      return true;
    }
    if (node.children) {
      return node.children.some(child => checkDirectory(child, requiredPath));
    }
    return false;
  }
  
  for (const requiredDir of requiredDirectories) {
    if (!checkDirectory(summary.directoryHierarchy, requiredDir)) {
      missingDirectories.push(requiredDir);
    }
  }
  
  // Check for Next.js App Router structure
  if (summary.fileOrganization.structureType !== 'app-router') {
    warnings.push('Next.js App Router structure not detected');
  }
  
  // Check for component organization
  if (summary.componentOrganization.uiComponents.length === 0 &&
      summary.componentOrganization.featureComponents.length === 0) {
    warnings.push('No components detected in expected locations');
  }
  
  return {
    valid: missingDirectories.length === 0,
    missingDirectories,
    warnings,
  };
}

/**
 * Generate structure summary report
 */
export async function generateStructureReport(
  summary: ProjectStructureSummary,
  outputPath: string = join(DEFAULT_OUTPUT_DIR, 'structure-summary.md')
): Promise<void> {
  const { checkConfigurations } = await import('./utils/config-checker');
  const configCheck = await checkConfigurations(summary.projectRoot);
  
  let content = `## Directory Hierarchy\n\n`;
  content += formatDirectoryTree(summary.directoryHierarchy);
  
  content += `\n## File Organization\n\n`;
  content += `**Structure Type**: ${summary.fileOrganization.structureType}\n\n`;
  content += `**Conventions**:\n${formatList(summary.fileOrganization.conventions)}\n\n`;
  content += `**Naming Patterns**:\n${formatList(summary.fileOrganization.namingPatterns)}\n\n`;
  
  content += `\n## Architectural Patterns\n\n`;
  for (const pattern of summary.architecturalPatterns) {
    content += `### ${pattern.name}\n\n`;
    content += `**Type**: ${pattern.type}\n\n`;
    content += `**Description**: ${pattern.description}\n\n`;
    if (pattern.examples.length > 0) {
      content += `**Examples**:\n${formatList(pattern.examples)}\n\n`;
    }
  }
  
  content += `\n## Key Files\n\n`;
  const keyFilesTable = summary.keyFiles.map(f => [
    f.path,
    f.category,
    f.purpose,
  ]);
  content += formatTable(['Path', 'Category', 'Purpose'], keyFilesTable);
  
  content += `\n## Component Organization\n\n`;
  content += `**UI Components**: ${summary.componentOrganization.uiComponents.length}\n`;
  content += `**Feature Components**: ${summary.componentOrganization.featureComponents.length}\n`;
  content += `**Shared Components**: ${summary.componentOrganization.sharedComponents.length}\n`;
  content += `**Relationships**: ${summary.componentOrganization.relationships.length}\n\n`;
  
  // Add API route analysis
  const apiAnalysis = await analyzeAPIRouteStructure(summary.projectRoot, DEFAULT_IGNORE_PATTERNS);
  if (apiAnalysis.routes.length > 0) {
    content += `\n## API Route Structure\n\n`;
    content += `**Total Routes**: ${apiAnalysis.routes.length}\n\n`;
    content += `**Naming Patterns**:\n${formatList(apiAnalysis.patterns.naming)}\n\n`;
    content += `**Authentication Patterns**:\n${formatList(apiAnalysis.patterns.auth)}\n\n`;
    if (apiAnalysis.inconsistencies.length > 0) {
      content += `**Inconsistencies**:\n${formatList(apiAnalysis.inconsistencies)}\n\n`;
    }
  }
  
  // Add configuration check results
  if (configCheck.inconsistencies.length > 0) {
    content += `\n## Configuration Inconsistencies\n\n`;
    const configTable = configCheck.inconsistencies.map(i => [
      i.file,
      i.type,
      i.severity,
      i.issue,
      i.recommendation,
    ]);
    content += formatTable(
      ['File', 'Type', 'Severity', 'Issue', 'Recommendation'],
      configTable
    );
  }
  
  await generateMarkdownReport(
    outputPath,
    'Project Structure Summary',
    content,
    {
      'Generated At': summary.generatedAt,
      'Project Root': summary.projectRoot,
    }
  );
}

/**
 * Format directory tree for Markdown
 */
function formatDirectoryTree(node: DirectoryNode, indent = 0): string {
  let output = '  '.repeat(indent) + `- \`${node.name}\``;
  if (node.purpose) {
    output += ` - ${node.purpose}`;
  }
  if (node.fileCount !== undefined) {
    output += ` (${node.fileCount} files)`;
  }
  output += '\n';
  
  if (node.children) {
    for (const child of node.children) {
      output += formatDirectoryTree(child, indent + 1);
    }
  }
  
  return output;
}

