# Feature Specification: Project Analysis & Audit

**Feature Branch**: `001-project-analysis`  
**Created**: 2025-01-22  
**Status**: Draft  
**Input**: User description: "Analyze this Next.js + Supabase project. Summarize structure, outdated dependencies, unused files, and improvement opportunities."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Project Structure Summary (Priority: P1)

A developer or project maintainer needs to understand the overall architecture and organization of the BidMaster codebase to make informed decisions about refactoring, onboarding new team members, or planning future features.

**Why this priority**: Understanding project structure is foundational for all other analysis tasks and provides immediate value for documentation and team alignment.

**Independent Test**: Can be fully tested by reviewing the generated structure summary document and verifying it accurately represents the codebase organization, including directory hierarchy, key files, and their purposes.

**Acceptance Scenarios**:

1. **Given** the project codebase exists, **When** the analysis is run, **Then** a comprehensive structure summary is generated documenting all major directories, their purposes, and key architectural patterns
2. **Given** the structure summary is generated, **When** a developer reviews it, **Then** they can understand the separation between frontend (Next.js app router), backend (API routes), shared utilities, and database schemas
3. **Given** the analysis includes component organization, **When** reviewed, **Then** it clearly identifies reusable UI components, feature-specific components, and their relationships
4. **Given** API routes are analyzed, **When** reviewed, **Then** the analysis identifies route naming patterns, authentication patterns, error handling patterns, and flags any inconsistencies or duplicates

---

### User Story 2 - Identify Outdated Dependencies (Priority: P1)

A developer needs to know which npm packages have newer versions available to maintain security, performance, and compatibility with the latest features and bug fixes.

**Why this priority**: Outdated dependencies pose security risks and may prevent leveraging new features or bug fixes. This is critical for maintaining a healthy codebase.

**Independent Test**: Can be fully tested by comparing the dependency analysis report against npm registry data and verifying all outdated packages are correctly identified with current, wanted, and latest versions.

**Acceptance Scenarios**:

1. **Given** package.json exists with dependencies, **When** the analysis runs, **Then** all outdated packages are identified with current version, wanted version (within semver range), and latest available version
2. **Given** outdated dependencies are identified, **When** reviewed, **Then** each entry includes the package name, current version, latest version, and severity assessment (patch, minor, major updates)
3. **Given** major version updates are identified, **When** reviewed, **Then** they are flagged with potential breaking change warnings

---

### User Story 3 - Detect Unused Files and Code (Priority: P2)

A developer needs to identify files that are no longer referenced or used in the codebase to reduce maintenance burden, improve build times, and prevent confusion.

**Why this priority**: Unused files increase technical debt, slow down development, and can mislead developers. However, this is less critical than structure and dependencies.

**Independent Test**: Can be fully tested by manually verifying that identified unused files are not imported or referenced anywhere in the codebase, and that removing them doesn't break functionality.

**Acceptance Scenarios**:

1. **Given** the codebase contains files, **When** the analysis runs, **Then** backup files (e.g., `*_backup.tsx`), empty directories, and unreferenced files are identified
2. **Given** unused files are identified, **When** reviewed, **Then** each file includes its path, reason for being flagged (not imported, backup file, empty directory), and confidence level
3. **Given** duplicate or alternative script files exist, **When** reviewed, **Then** they are flagged with recommendations for consolidation
4. **Given** TypeScript types and interfaces are analyzed, **When** reviewed, **Then** unused exported types, interfaces, and utility functions are identified with confidence levels based on import analysis

---

### User Story 4 - Identify Improvement Opportunities (Priority: P2)

A developer or architect needs actionable recommendations for improving code quality, performance, maintainability, and following best practices.

**Why this priority**: Improvement opportunities help guide future refactoring efforts and ensure the codebase evolves in a healthy direction, but they are less urgent than structural understanding.

**Independent Test**: Can be fully tested by reviewing the improvement recommendations and verifying they are specific, actionable, and aligned with Next.js and Supabase best practices.

**Acceptance Scenarios**:

1. **Given** the codebase is analyzed, **When** improvement opportunities are identified, **Then** they are categorized by area (performance, security, code quality, architecture, testing)
2. **Given** improvement recommendations are provided, **When** reviewed, **Then** each includes a clear description, rationale, estimated effort, and priority level
3. **Given** deprecated patterns or packages are found, **When** reviewed, **Then** they include migration paths and alternatives

---

### Edge Cases

- What happens when a file appears unused but is dynamically imported or referenced in configuration files?
- How does the analysis handle TypeScript declaration files and their relationships to implementation files?
- What if dependencies are outdated but pinned for compatibility reasons?
- How are test files and development-only scripts categorized in the unused files analysis?
- What happens when improvement recommendations conflict with project constraints or business requirements?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate a comprehensive project structure summary documenting directory hierarchy, file organization, and architectural patterns
- **FR-002**: System MUST identify all outdated npm dependencies with current, wanted (semver range), and latest available versions
- **FR-003**: System MUST flag unused files including backup files, empty directories, and unreferenced code files
- **FR-004**: System MUST detect deprecated packages or patterns (e.g., `@supabase/auth-helpers-nextjs` if unused, old Next.js patterns)
- **FR-005**: System MUST categorize improvement opportunities by area (performance, security, code quality, architecture, testing)
- **FR-006**: System MUST provide actionable recommendations with clear descriptions, rationale, and priority levels
- **FR-007**: System MUST identify duplicate or redundant files (e.g., multiple test script variants, backup files)
- **FR-008**: System MUST analyze API route structure and identify patterns or inconsistencies (e.g., inconsistent route naming conventions, missing error handling patterns, duplicate route definitions, inconsistent authentication patterns, missing route documentation)
- **FR-009**: System MUST check for unused TypeScript types, interfaces, or utility functions using static import analysis (TypeScript compiler API) to track type/interface exports and their usage across the codebase
- **FR-010**: System MUST identify configuration inconsistencies across TypeScript (tsconfig.json strict mode, path aliases), Next.js (next.config.ts patterns), and ESLint (eslint.config.mjs rules) configurations, flagging misalignments or missing best practices

### Key Entities *(include if feature involves data)*

- **Project Structure Summary**: Document containing directory hierarchy, file organization patterns, and architectural overview
- **Dependency Analysis Report**: List of outdated packages with version information and update recommendations
- **Unused Files Report**: List of files flagged as unused with reasons and confidence levels
- **Improvement Recommendations**: Categorized list of actionable improvements with priorities and effort estimates

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Analysis completes and generates all four required reports (structure, dependencies, unused files, improvements) within 5 minutes
- **SC-002**: Dependency analysis correctly identifies 100% of outdated packages when compared against npm registry data
- **SC-003**: Unused files detection achieves at least 90% accuracy (verified by manual review of flagged files)
- **SC-004**: Improvement recommendations are categorized into at least 4 distinct areas (performance, security, code quality, architecture)
- **SC-005**: At least 80% of improvement recommendations are rated as actionable by developers reviewing the report
- **SC-006**: Project structure summary enables a new developer to understand the codebase organization within 15 minutes of reading
- **SC-007**: Analysis identifies all major architectural patterns (Next.js App Router structure, API routes, component organization, Supabase integration patterns)
