# Implementation Plan: Project Analysis & Cleanup

**Branch**: `001-project-analysis` | **Date**: 2025-01-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-project-analysis/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature performs a comprehensive analysis and cleanup of the BidMaster codebase. The analysis will generate four key deliverables: (1) project structure summary documenting architecture and organization, (2) dependency audit identifying outdated packages, (3) unused files report flagging dead code and backup files, and (4) improvement recommendations categorized by area. The cleanup phase will remove unused files and delete deprecated folders (.taskmaster, tasks) after summarizing their historical content. Duplicate file detection is included in the analysis; consolidation recommendations are provided in improvement recommendations.

## Technical Context

**Language/Version**: TypeScript 5.8.3, Node.js (via Next.js runtime)  
**Primary Dependencies**: Next.js 15.3.5, React 19.1.0, Supabase 2.50.5, Puppeteer 24.12.1  
**Storage**: Supabase (PostgreSQL), local file system for analysis reports  
**Testing**: Custom crawler test suite, npm scripts for validation  
**Target Platform**: Node.js server environment, Next.js App Router  
**Project Type**: Web application (Next.js + Supabase)  
**Performance Goals**: Analysis completes within 5 minutes, dependency check <30 seconds, unused file detection <2 minutes  
**Constraints**: Must preserve .cursor, .github, .claude, .specify, specs folders; must summarize .taskmaster and tasks before deletion  
**Scale/Scope**: ~300 files, 20+ API routes, 50+ components, 30+ dependencies to audit

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with BidMaster Constitution principles:

- **Code Quality**: Analysis scripts will use TypeScript strict mode, explicit types, ESLint compliance, JSDoc comments
- **Testing Standards**: Analysis tools will be validated against known codebase state; cleanup operations will be verified with dry-run mode
- **User Experience**: N/A (internal tooling, no user-facing UI)
- **Performance**: Analysis must complete within 5 minutes per SC-001; dependency checks optimized for npm registry queries

**Compliance Status**: ✅ All gates pass. This is an analysis/cleanup feature with no user-facing components. Code quality standards apply to the analysis scripts themselves.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-analysis/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
scripts/
├── analyze-project.ts          # Main analysis orchestrator
├── analyze-structure.ts        # Structure analysis module
├── analyze-dependencies.ts     # Dependency audit module
├── analyze-unused-files.ts     # Unused file detection
├── generate-recommendations.ts # Improvement suggestions
└── cleanup-unused.ts            # Cleanup execution script

docs/
├── analysis/
│   ├── structure-summary.md
│   ├── dependency-report.md
│   ├── unused-files-report.md
│   ├── improvement-recommendations.md
│   └── cleanup-summary.md
└── archive/
    ├── taskmaster-summary.md   # Summary before deletion
    └── tasks-summary.md        # Summary before deletion
```

**Structure Decision**: Analysis scripts will be added to `scripts/` directory alongside existing test scripts. Reports will be generated in `docs/analysis/` with archival summaries in `docs/archive/` for deleted folders. Cleanup operations will be executed after analysis reports are reviewed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - analysis and cleanup operations are straightforward file system and dependency management tasks.

---

## Phase 0: Research Summary

**Status**: ✅ Complete

All technical decisions resolved in `research.md`:
- Analysis tools: Node.js/TypeScript scripts using existing dependencies
- Dependency analysis: `npm outdated --json` with manual major version review
- Unused file detection: Multi-pass approach (static analysis + pattern matching + manual review)
- Cleanup execution: Dry-run by default with explicit confirmation
- Report generation: Markdown format in `docs/analysis/`
- Error handling: Graceful degradation with error reporting
- Performance: Parallel execution of independent analyses

**Key Decisions**:
- No external analysis tools required (use native Node.js APIs)
- TypeScript compiler API for accurate import resolution
- Safety-first approach: dry-run default, archival summaries before deletion

---

## Phase 1: Design Summary

**Status**: ✅ Complete

### Data Model

Entities defined in `data-model.md`:
- **ProjectStructureSummary**: Directory hierarchy, file organization, architectural patterns
- **DependencyAnalysisReport**: Outdated packages with version info and recommendations
- **UnusedFilesReport**: Flagged files with reasons and confidence levels
- **ImprovementRecommendations**: Categorized actionable improvements
- **CleanupSummary**: Deletion tracking and archival references
- **TaskmasterSummary** & **TasksSummary**: Archival entities for deleted folders

### Contracts

Script interfaces defined in `contracts/analysis-api.md`:
- `analyze-project.ts`: Main orchestrator
- `analyze-structure.ts`: Structure analysis
- `analyze-dependencies.ts`: Dependency audit
- `analyze-unused-files.ts`: Unused file detection
- `generate-recommendations.ts`: Improvement suggestions
- `cleanup-unused.ts`: Cleanup execution

All interfaces use TypeScript with proper error handling and validation.

### Quickstart

User guide in `quickstart.md` covers:
- Prerequisites and setup
- Running analysis and cleanup
- Report review process
- Verification steps
- Troubleshooting

### Agent Context

Agent-specific context files updated with analysis tooling patterns.

---

## Next Steps

Ready for `/speckit.tasks` to generate implementation tasks organized by user story:
- **User Story 1 (P1)**: Generate Project Structure Summary
- **User Story 2 (P1)**: Identify Outdated Dependencies  
- **User Story 3 (P2)**: Detect Unused Files and Code
- **User Story 4 (P2)**: Identify Improvement Opportunities

All design artifacts complete and ready for task generation.
