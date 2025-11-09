# Analysis API Contracts

## Overview

This feature is primarily script-based rather than API-based. The "API" here refers to the programmatic interface of the analysis scripts, not HTTP endpoints.

## Script Interfaces

### analyze-project.ts

**Purpose**: Main orchestrator that runs all analyses and generates reports

**Interface**:
```typescript
interface AnalysisOptions {
  outputDir?: string;        // Default: 'docs/analysis'
  archiveDir?: string;       // Default: 'docs/archive'
  includeCleanup?: boolean;  // Default: false
  dryRun?: boolean;          // Default: true
}

interface AnalysisResult {
  structure: ProjectStructureSummary;
  dependencies: DependencyAnalysisReport;
  unusedFiles: UnusedFilesReport;
  recommendations: ImprovementRecommendations[];
  duration: number;          // milliseconds
  success: boolean;
  errors?: string[];
}

function analyzeProject(options?: AnalysisOptions): Promise<AnalysisResult>
```

**Usage**:
```typescript
const result = await analyzeProject({
  outputDir: 'docs/analysis',
  includeCleanup: false,
  dryRun: true
});
```

### analyze-structure.ts

**Purpose**: Analyzes project structure and generates structure summary

**Interface**:
```typescript
interface StructureAnalysisOptions {
  rootDir: string;
  ignorePatterns?: string[];  // Default: ['.git', 'node_modules', '.next']
}

interface ProjectStructureSummary {
  directoryHierarchy: DirectoryNode;
  fileOrganization: FileOrganizationPattern;
  architecturalPatterns: ArchitecturalPattern[];
  keyFiles: KeyFile[];
  componentOrganization: ComponentOrganization;
  generatedAt: string;
  projectRoot: string;
}

function analyzeStructure(options: StructureAnalysisOptions): Promise<ProjectStructureSummary>
```

### analyze-dependencies.ts

**Purpose**: Analyzes npm dependencies and identifies outdated packages

**Interface**:
```typescript
interface DependencyAnalysisOptions {
  packageJsonPath?: string;  // Default: 'package.json'
  includeDevDependencies?: boolean;  // Default: true
}

interface DependencyInfo {
  packageName: string;
  currentVersion: string;
  wantedVersion: string;
  latestVersion: string;
  updateType: 'patch' | 'minor' | 'major';
  hasBreakingChanges: boolean;
  securityIssues: SecurityIssue[];
  recommendation: string;
}

interface DependencyAnalysisReport {
  dependencies: DependencyInfo[];
  summary: {
    total: number;
    outdated: number;
    majorUpdates: number;
    securityIssues: number;
  };
  generatedAt: string;
}

function analyzeDependencies(options?: DependencyAnalysisOptions): Promise<DependencyAnalysisReport>
```

### analyze-unused-files.ts

**Purpose**: Detects unused files, backup files, and empty directories

**Interface**:
```typescript
interface UnusedFileAnalysisOptions {
  rootDir: string;
  ignorePatterns?: string[];  // Default: ['.git', 'node_modules', '.next', '.cursor', '.github', '.claude', '.specify', 'specs']
  checkDynamicImports?: boolean;  // Default: true
}

interface UnusedFile {
  filePath: string;
  reason: 'backup_file' | 'not_imported' | 'empty_directory' | 'duplicate';
  confidenceLevel: 'high' | 'medium' | 'low';
  lastModified: string;
  size: number;
  notes?: string;
  safeToDelete: boolean;
}

interface UnusedFilesReport {
  files: UnusedFile[];
  summary: {
    total: number;
    highConfidence: number;
    mediumConfidence: number;
    lowConfidence: number;
    safeToDelete: number;
  };
  generatedAt: string;
}

function analyzeUnusedFiles(options: UnusedFileAnalysisOptions): Promise<UnusedFilesReport>
```

### generate-recommendations.ts

**Purpose**: Generates improvement recommendations based on all analyses

**Interface**:
```typescript
interface RecommendationInput {
  structure: ProjectStructureSummary;
  dependencies: DependencyAnalysisReport;
  unusedFiles: UnusedFilesReport;
}

interface ImprovementRecommendation {
  id: string;
  category: 'performance' | 'security' | 'code_quality' | 'architecture' | 'testing';
  title: string;
  description: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
  estimatedEffort: 'small' | 'medium' | 'large';
  relatedFiles: string[];
  migrationPath?: string[];
}

interface ImprovementRecommendations {
  recommendations: ImprovementRecommendation[];
  summary: {
    total: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
  };
  generatedAt: string;
}

function generateRecommendations(input: RecommendationInput): Promise<ImprovementRecommendations>
```

### cleanup-unused.ts

**Purpose**: Executes cleanup operations (deletion of unused files)

**Interface**:
```typescript
interface CleanupOptions {
  unusedFilesReport: UnusedFilesReport;
  archiveDir?: string;  // Default: 'docs/archive'
  dryRun?: boolean;     // Default: true
  confirmDeletion?: boolean;  // Default: false
}

interface CleanupSummary {
  deletedFiles: string[];
  deletedDirectories: string[];
  archivedSummaries: string[];  // Paths to archived summaries
  totalFilesDeleted: number;
  totalDirectoriesDeleted: number;
  spaceFreed?: number;  // bytes, if calculable
  executedAt: string;
  dryRun: boolean;
}

function cleanupUnused(options: CleanupOptions): Promise<CleanupSummary>
```

## Error Handling

All functions return results with error information rather than throwing exceptions:

```typescript
interface AnalysisResult {
  success: boolean;
  errors?: string[];
  warnings?: string[];
  // ... result data
}
```

## Validation

- All file paths are validated to exist before operations
- Dry-run mode is default for cleanup operations
- Archival summaries are generated before deletion
- Ignore patterns are respected (protected folders: .cursor, .github, .claude, .specify, specs)

