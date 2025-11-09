# Data Model: Project Analysis & Cleanup

## Entities

### ProjectStructureSummary

**Purpose**: Document containing comprehensive project structure analysis

**Fields**:
- `directoryHierarchy`: Tree structure of all directories with descriptions
- `fileOrganization`: Patterns and conventions for file organization
- `architecturalPatterns`: Identified patterns (Next.js App Router, API routes, component structure)
- `keyFiles`: Important files with their purposes
- `componentOrganization`: UI component structure and relationships
- `generatedAt`: Timestamp of analysis
- `projectRoot`: Absolute path to project root

**Relationships**: Referenced by ImprovementRecommendations for architecture suggestions

**Validation Rules**:
- Must include all major directories (src/, scripts/, database/, etc.)
- Must document Next.js App Router structure
- Must identify component organization patterns

### DependencyAnalysisReport

**Purpose**: List of outdated npm packages with version information

**Fields**:
- `packageName`: npm package identifier
- `currentVersion`: Currently installed version
- `wantedVersion`: Latest version within semver range
- `latestVersion`: Latest available version (may be major update)
- `updateType`: "patch" | "minor" | "major"
- `hasBreakingChanges`: Boolean indicating if major update has breaking changes
- `securityIssues`: Array of known security vulnerabilities (if any)
- `recommendation`: Update recommendation with rationale

**Relationships**: Referenced by ImprovementRecommendations for dependency updates

**Validation Rules**:
- All packages from package.json must be analyzed
- Version information must be accurate (verified against npm registry)
- Major updates must be flagged with breaking change warnings

### UnusedFilesReport

**Purpose**: List of files flagged as unused with reasons and confidence levels

**Fields**:
- `filePath`: Relative path from project root
- `reason`: Why file is flagged ("backup_file" | "not_imported" | "empty_directory" | "duplicate")
- `confidenceLevel`: "high" | "medium" | "low"
- `lastModified`: Date of last modification
- `size`: File size in bytes
- `notes`: Additional context or warnings
- `safeToDelete`: Boolean indicating if file can be safely deleted

**Relationships**: Used by CleanupSummary to track deleted files

**Validation Rules**:
- Must include file path and reason for flagging
- Confidence levels must be assigned based on analysis method
- Dynamic imports must be flagged with low confidence

### ImprovementRecommendations

**Purpose**: Categorized list of actionable improvements with priorities

**Fields**:
- `id`: Unique identifier
- `category`: "performance" | "security" | "code_quality" | "architecture" | "testing"
- `title`: Brief description of improvement
- `description`: Detailed explanation
- `rationale`: Why this improvement is valuable
- `priority`: "high" | "medium" | "low"
- `estimatedEffort`: "small" | "medium" | "large"
- `relatedFiles`: Array of file paths affected
- `migrationPath`: Steps to implement (if applicable)

**Relationships**: References other entities (DependencyAnalysisReport, ProjectStructureSummary)

**Validation Rules**:
- Must be categorized into at least 4 distinct areas
- Must include actionable descriptions
- Must have priority and effort estimates

### CleanupSummary

**Purpose**: Summary of cleanup operations performed

**Fields**:
- `deletedFiles`: Array of file paths that were deleted
- `deletedDirectories`: Array of directory paths that were deleted
- `archivedSummaries`: Array of summaries for deleted folders (.taskmaster, tasks)
- `totalFilesDeleted`: Count of deleted files
- `totalDirectoriesDeleted`: Count of deleted directories
- `spaceFreed`: Total bytes freed (if calculable)
- `executedAt`: Timestamp of cleanup execution
- `dryRun`: Boolean indicating if this was a dry run

**Relationships**: References UnusedFilesReport for deleted files

**Validation Rules**:
- Must list all deleted files and directories
- Must include archival summaries for .taskmaster and tasks folders

### TaskmasterSummary (Archival)

**Purpose**: Summary of .taskmaster folder content before deletion

**Fields**:
- `config`: Configuration settings (models, global settings)
- `state`: Current state (currentTag, branchTagMapping)
- `prdContent`: Summary of PRD document
- `templates`: List of template files
- `reports`: List of report files (if any)
- `purpose`: Historical purpose of the folder
- `lastActive`: Estimated last activity date

### TasksSummary (Archival)

**Purpose**: Summary of tasks folder content before deletion

**Fields**:
- `totalTasks`: Count of tasks in tasks.json
- `completedTasks`: Count of completed tasks
- `pendingTasks`: Count of pending tasks
- `taskCategories`: List of task categories/tags
- `dateRange`: Earliest and latest task dates
- `keyMilestones`: Important completed milestones
- `purpose`: Historical purpose of the folder

## State Transitions

### Analysis Workflow

1. **Initialization**: Load project structure, read package.json
2. **Structure Analysis**: Generate ProjectStructureSummary
3. **Dependency Analysis**: Generate DependencyAnalysisReport (can run in parallel with structure)
4. **Unused File Detection**: Generate UnusedFilesReport (can run in parallel)
5. **Recommendation Generation**: Generate ImprovementRecommendations (depends on all analyses)
6. **Report Generation**: Write all reports to docs/analysis/
7. **Cleanup Preparation**: Generate archival summaries for .taskmaster and tasks
8. **Cleanup Execution**: Delete unused files and folders (if not dry-run)

### Cleanup Workflow

1. **Dry Run**: Generate CleanupSummary without actual deletion
2. **Review**: User reviews CleanupSummary
3. **Confirmation**: User confirms cleanup execution
4. **Execution**: Delete files and directories, generate final CleanupSummary
5. **Archive**: Save archival summaries to docs/archive/

