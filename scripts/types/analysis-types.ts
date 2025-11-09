/**
 * Type definitions for project analysis and cleanup feature
 * Based on data-model.md entities
 */

/**
 * Project Structure Summary Entity
 * Document containing comprehensive project structure analysis
 */
export interface ProjectStructureSummary {
  /** Tree structure of all directories with descriptions */
  directoryHierarchy: DirectoryNode;
  /** Patterns and conventions for file organization */
  fileOrganization: FileOrganizationPattern;
  /** Identified patterns (Next.js App Router, API routes, component structure) */
  architecturalPatterns: ArchitecturalPattern[];
  /** Important files with their purposes */
  keyFiles: KeyFile[];
  /** UI component structure and relationships */
  componentOrganization: ComponentOrganization;
  /** Timestamp of analysis */
  generatedAt: string;
  /** Absolute path to project root */
  projectRoot: string;
}

/**
 * Directory node in the hierarchy tree
 */
export interface DirectoryNode {
  name: string;
  path: string;
  description?: string;
  children?: DirectoryNode[];
  fileCount?: number;
  purpose?: string;
}

/**
 * File organization pattern
 */
export interface FileOrganizationPattern {
  conventions: string[];
  namingPatterns: string[];
  structureType: 'app-router' | 'pages-router' | 'hybrid' | 'custom';
}

/**
 * Architectural pattern identified in the codebase
 */
export interface ArchitecturalPattern {
  name: string;
  type: 'nextjs-app-router' | 'api-routes' | 'component-structure' | 'supabase-integration' | 'other';
  description: string;
  examples: string[];
}

/**
 * Key file with purpose
 */
export interface KeyFile {
  path: string;
  purpose: string;
  category: 'config' | 'entry' | 'utility' | 'component' | 'api' | 'other';
}

/**
 * Component organization structure
 */
export interface ComponentOrganization {
  uiComponents: ComponentInfo[];
  featureComponents: ComponentInfo[];
  sharedComponents: ComponentInfo[];
  relationships: ComponentRelationship[];
}

/**
 * Component information
 */
export interface ComponentInfo {
  name: string;
  path: string;
  purpose: string;
  dependencies: string[];
}

/**
 * Component relationship
 */
export interface ComponentRelationship {
  from: string;
  to: string;
  type: 'imports' | 'extends' | 'composes';
}

/**
 * Dependency Analysis Report Entity
 * List of outdated npm packages with version information
 */
export interface DependencyAnalysisReport {
  /** List of dependency information */
  dependencies: DependencyInfo[];
  /** Summary statistics */
  summary: {
    total: number;
    outdated: number;
    majorUpdates: number;
    securityIssues: number;
  };
  /** Timestamp of analysis */
  generatedAt: string;
}

/**
 * Dependency information
 */
export interface DependencyInfo {
  /** npm package identifier */
  packageName: string;
  /** Currently installed version */
  currentVersion: string;
  /** Latest version within semver range */
  wantedVersion: string;
  /** Latest available version (may be major update) */
  latestVersion: string;
  /** Type of update available */
  updateType: 'patch' | 'minor' | 'major';
  /** Whether major update has breaking changes */
  hasBreakingChanges: boolean;
  /** Array of known security vulnerabilities */
  securityIssues: SecurityIssue[];
  /** Update recommendation with rationale */
  recommendation: string;
  /** Whether package is deprecated */
  isDeprecated?: boolean;
}

/**
 * Security issue information
 */
export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  cve?: string;
}

/**
 * Unused Files Report Entity
 * List of files flagged as unused with reasons and confidence levels
 */
export interface UnusedFilesReport {
  /** List of unused files */
  files: UnusedFile[];
  /** Summary statistics */
  summary: {
    total: number;
    highConfidence: number;
    mediumConfidence: number;
    lowConfidence: number;
    safeToDelete: number;
  };
  /** Timestamp of analysis */
  generatedAt: string;
}

/**
 * Unused file information
 */
export interface UnusedFile {
  /** Relative path from project root */
  filePath: string;
  /** Why file is flagged */
  reason: 'backup_file' | 'not_imported' | 'empty_directory' | 'duplicate' | 'unused_type' | 'unused_interface' | 'unused_utility';
  /** Confidence level of detection */
  confidenceLevel: 'high' | 'medium' | 'low';
  /** Date of last modification */
  lastModified: string;
  /** File size in bytes */
  size: number;
  /** Additional context or warnings */
  notes?: string;
  /** Whether file can be safely deleted */
  safeToDelete: boolean;
}

/**
 * Improvement Recommendations Entity
 * Categorized list of actionable improvements with priorities
 */
export interface ImprovementRecommendations {
  /** List of recommendations */
  recommendations: ImprovementRecommendation[];
  /** Summary statistics */
  summary: {
    total: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
  };
  /** Timestamp of analysis */
  generatedAt: string;
}

/**
 * Improvement recommendation
 */
export interface ImprovementRecommendation {
  /** Unique identifier */
  id: string;
  /** Category of improvement */
  category: 'performance' | 'security' | 'code_quality' | 'architecture' | 'testing';
  /** Brief description */
  title: string;
  /** Detailed explanation */
  description: string;
  /** Why this improvement is valuable */
  rationale: string;
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
  /** Estimated effort */
  estimatedEffort: 'small' | 'medium' | 'large';
  /** Array of file paths affected */
  relatedFiles: string[];
  /** Steps to implement (if applicable) */
  migrationPath?: string[];
}

/**
 * Cleanup Summary Entity
 * Summary of cleanup operations performed
 */
export interface CleanupSummary {
  /** Array of file paths that were deleted */
  deletedFiles: string[];
  /** Array of directory paths that were deleted */
  deletedDirectories: string[];
  /** Array of paths to archived summaries */
  archivedSummaries: string[];
  /** Count of deleted files */
  totalFilesDeleted: number;
  /** Count of deleted directories */
  totalDirectoriesDeleted: number;
  /** Total bytes freed (if calculable) */
  spaceFreed?: number;
  /** Timestamp of cleanup execution */
  executedAt: string;
  /** Whether this was a dry run */
  dryRun: boolean;
}

/**
 * Taskmaster Summary (Archival)
 * Summary of .taskmaster folder content before deletion
 */
export interface TaskmasterSummary {
  /** Configuration settings */
  config: {
    models?: Record<string, unknown>;
    global?: Record<string, unknown>;
  };
  /** Current state */
  state: {
    currentTag?: string;
    branchTagMapping?: Record<string, string>;
  };
  /** Summary of PRD document */
  prdContent?: string;
  /** List of template files */
  templates: string[];
  /** List of report files */
  reports: string[];
  /** Historical purpose of the folder */
  purpose: string;
  /** Estimated last activity date */
  lastActive?: string;
}

/**
 * Tasks Summary (Archival)
 * Summary of tasks folder content before deletion
 */
export interface TasksSummary {
  /** Count of tasks in tasks.json */
  totalTasks: number;
  /** Count of completed tasks */
  completedTasks: number;
  /** Count of pending tasks */
  pendingTasks: number;
  /** List of task categories/tags */
  taskCategories: string[];
  /** Earliest and latest task dates */
  dateRange: {
    earliest?: string;
    latest?: string;
  };
  /** Important completed milestones */
  keyMilestones: string[];
  /** Historical purpose of the folder */
  purpose: string;
}

