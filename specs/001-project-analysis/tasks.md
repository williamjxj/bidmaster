# Tasks: Project Analysis & Cleanup

**Input**: Design documents from `/specs/001-project-analysis/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED per Constitution Principle II. Test tasks added in Phase 9.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `scripts/` at repository root for analysis scripts
- **Reports**: `docs/analysis/` for generated reports
- **Archive**: `docs/archive/` for archival summaries

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for analysis scripts

- [x] T001 Create docs/analysis directory for generated reports in docs/analysis/
- [x] T002 [P] Create TypeScript type definitions for analysis entities in scripts/types/analysis-types.ts
- [x] T003 [P] Create utility functions for file system operations in scripts/utils/fs-utils.ts
- [x] T004 [P] Create utility functions for report generation in scripts/utils/report-utils.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create base types and interfaces from data-model.md in scripts/types/analysis-types.ts
- [x] T006 [P] Implement error handling utilities with graceful degradation in scripts/utils/error-handler.ts
- [x] T007 [P] Implement path validation and ignore pattern matching in scripts/utils/path-utils.ts
- [x] T008 Create shared configuration constants (ignore patterns, output paths) in scripts/config/constants.ts
- [x] T009 Create configuration consistency checker for TypeScript, Next.js, and ESLint configs in scripts/utils/config-checker.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate Project Structure Summary (Priority: P1) 🎯 MVP

**Goal**: Generate comprehensive project structure summary documenting directory hierarchy, file organization, and architectural patterns

**Independent Test**: Review generated structure-summary.md and verify it accurately represents codebase organization, including directory hierarchy, key files, and their purposes

### Implementation for User Story 1

- [x] T010 [US1] Implement analyzeStructure function in scripts/analyze-structure.ts with directory traversal logic
- [x] T011 [US1] Add Next.js App Router pattern detection in scripts/analyze-structure.ts
- [x] T012 [US1] Add component organization analysis (UI components vs feature components) in scripts/analyze-structure.ts
- [x] T013 [US1] Add API route structure analysis (naming patterns, authentication patterns, error handling patterns, duplicate detection) in scripts/analyze-structure.ts
- [x] T014 [US1] Add configuration inconsistency detection using config-checker in scripts/analyze-structure.ts
- [x] T015 [US1] Implement ProjectStructureSummary entity generation with all required fields in scripts/analyze-structure.ts
- [x] T016 [US1] Add report generation for structure summary in Markdown format to docs/analysis/structure-summary.md
- [x] T017 [US1] Add validation to ensure all major directories are documented in scripts/analyze-structure.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Structure summary can be generated and reviewed.

---

## Phase 4: User Story 2 - Identify Outdated Dependencies (Priority: P1)

**Goal**: Identify all outdated npm packages with current, wanted (semver range), and latest available versions, including severity assessment

**Independent Test**: Compare dependency-report.md against npm registry data and verify all outdated packages are correctly identified with accurate version information

### Implementation for User Story 2

- [x] T018 [P] [US2] Implement analyzeDependencies function in scripts/analyze-dependencies.ts with npm outdated integration
- [x] T019 [US2] Add package.json parsing and dependency extraction in scripts/analyze-dependencies.ts
- [x] T020 [US2] Add version comparison logic (current vs wanted vs latest) in scripts/analyze-dependencies.ts
- [x] T021 [US2] Add update type classification (patch, minor, major) in scripts/analyze-dependencies.ts
- [x] T022 [US2] Add breaking change detection and deprecated package detection (check npm registry for deprecated status) for major version updates in scripts/analyze-dependencies.ts
- [x] T023 [US2] Implement DependencyAnalysisReport entity generation with summary statistics in scripts/analyze-dependencies.ts
- [x] T024 [US2] Add report generation for dependency analysis in Markdown format to docs/analysis/dependency-report.md
- [x] T025 [US2] Add validation to ensure 100% package coverage from package.json in scripts/analyze-dependencies.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Dependency analysis can run in parallel with structure analysis.

---

## Phase 5: User Story 3 - Detect Unused Files and Code (Priority: P2)

**Goal**: Identify unused files including backup files, empty directories, and unreferenced code files with confidence levels

**Independent Test**: Manually verify identified unused files are not imported or referenced anywhere in codebase, and removing them doesn't break functionality

### Implementation for User Story 3

- [x] T026 [P] [US3] Implement analyzeUnusedFiles function in scripts/analyze-unused-files.ts with file discovery
- [x] T027 [US3] Add backup file pattern detection (*_backup.tsx, *.bak, *.old) in scripts/analyze-unused-files.ts
- [x] T028 [US3] Add empty directory detection in scripts/analyze-unused-files.ts
- [x] T029 [US3] Add static import analysis using TypeScript compiler API for files, types, interfaces, and utility functions in scripts/analyze-unused-files.ts
- [x] T030 [US3] Add dynamic import flagging with low confidence in scripts/analyze-unused-files.ts
- [x] T031 [US3] Add duplicate file detection (multiple test script variants) in scripts/analyze-unused-files.ts
- [x] T032 [US3] Implement confidence level assignment (high, medium, low) based on analysis method in scripts/analyze-unused-files.ts
- [x] T033 [US3] Implement UnusedFilesReport entity generation with summary statistics in scripts/analyze-unused-files.ts
- [x] T034 [US3] Add report generation for unused files in Markdown format to docs/analysis/unused-files-report.md
- [x] T035 [US3] Add safeToDelete flag based on confidence and file type in scripts/analyze-unused-files.ts

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Unused file detection can run in parallel with structure and dependency analysis.

---

## Phase 6: User Story 4 - Identify Improvement Opportunities (Priority: P2)

**Goal**: Generate actionable improvement recommendations categorized by area (performance, security, code quality, architecture, testing) with priorities and effort estimates

**Independent Test**: Review improvement-recommendations.md and verify recommendations are specific, actionable, and aligned with Next.js and Supabase best practices

### Implementation for User Story 4

- [x] T036 [US4] Implement generateRecommendations function in scripts/generate-recommendations.ts accepting all analysis results
- [x] T037 [US4] Add performance recommendations based on structure and dependency analysis in scripts/generate-recommendations.ts
- [x] T038 [US4] Add security recommendations (outdated dependencies, missing security headers) in scripts/generate-recommendations.ts
- [x] T039 [US4] Add code quality recommendations (unused files, code organization) in scripts/generate-recommendations.ts
- [x] T040 [US4] Add architecture recommendations (patterns, structure improvements) in scripts/generate-recommendations.ts
- [x] T041 [US4] Add testing recommendations (missing tests, test coverage) in scripts/generate-recommendations.ts
- [x] T042 [US4] Add categorization logic ensuring at least 4 distinct areas in scripts/generate-recommendations.ts
- [x] T043 [US4] Add priority assignment (high, medium, low) and effort estimation (small, medium, large) in scripts/generate-recommendations.ts
- [x] T044 [US4] Add migration paths for deprecated patterns in scripts/generate-recommendations.ts
- [x] T045 [US4] Implement ImprovementRecommendations entity generation with summary statistics in scripts/generate-recommendations.ts
- [x] T046 [US4] Add report generation for improvement recommendations in Markdown format to docs/analysis/improvement-recommendations.md

**Checkpoint**: At this point, all user stories should be independently functional. Improvement recommendations depend on all previous analyses.

---

## Phase 7: Orchestration & Cleanup

**Purpose**: Main orchestrator script and cleanup functionality

- [x] T047 Implement analyzeProject orchestrator function in scripts/analyze-project.ts coordinating all analyses
- [x] T048 Add parallel execution of independent analyses (US1, US2, US3) in scripts/analyze-project.ts
- [x] T049 Add sequential execution of dependent analysis (US4 after US1-3) in scripts/analyze-project.ts
- [x] T050 Add error handling with graceful degradation (continue on partial failures) in scripts/analyze-project.ts
- [x] T051 Add timing measurement and performance reporting in scripts/analyze-project.ts
- [x] T052 [P] Implement generateTaskmasterSummary function for archival in scripts/cleanup-unused.ts
- [x] T053 [P] Implement generateTasksSummary function for archival in scripts/cleanup-unused.ts
- [x] T054 Implement cleanupUnused function with dry-run mode default in scripts/cleanup-unused.ts
- [x] T055 Add file deletion logic with confirmation requirement in scripts/cleanup-unused.ts
- [x] T056 Add directory deletion logic for .taskmaster and tasks folders in scripts/cleanup-unused.ts
- [x] T057 Implement CleanupSummary entity generation in scripts/cleanup-unused.ts
- [x] T058 Add report generation for cleanup summary in Markdown format to docs/analysis/cleanup-summary.md
- [x] T059 Add npm script for analyze:project in package.json
- [x] T060 Add npm script for cleanup:dry-run in package.json
- [x] T061 Add npm script for cleanup:execute in package.json

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T062 [P] Add JSDoc comments to all exported functions in scripts/ following constitution code quality standards
- [x] T063 [P] Add TypeScript strict type annotations to all functions in scripts/
- [x] T064 Run ESLint validation on all analysis scripts and fix errors
- [x] T065 Add error logging and reporting throughout all analysis modules
- [x] T066 Update README.md with analysis script usage instructions
- [x] T067 Validate quickstart.md scenarios work with generated scripts
- [x] T068 Add performance validation (analysis completes within 5 minutes per SC-001)

---

## Phase 9: Testing (Constitution Compliance)

**Purpose**: Add tests for analysis scripts per Constitution Principle II (Testing Standards)

- [x] T069 [P] Create unit tests for analyze-structure.ts in scripts/__tests__/analyze-structure.test.ts
- [x] T070 [P] Create unit tests for analyze-dependencies.ts in scripts/__tests__/analyze-dependencies.test.ts
- [x] T071 [P] Create unit tests for analyze-unused-files.ts in scripts/__tests__/analyze-unused-files.test.ts
- [x] T072 [P] Create unit tests for generate-recommendations.ts in scripts/__tests__/generate-recommendations.test.ts
- [x] T073 [P] Create unit tests for cleanup-unused.ts in scripts/__tests__/cleanup-unused.test.ts
- [x] T074 Create integration test for analyze-project.ts orchestrator in scripts/__tests__/analyze-project.integration.test.ts
- [x] T075 Add test coverage validation (target 80% for business logic per constitution) in package.json test script
- [x] T076 [P] Create test fixtures and mock data in scripts/__tests__/fixtures/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Stories 1, 2, 3 can proceed in parallel (if staffed)
  - User Story 4 depends on User Stories 1, 2, 3 completion
- **Orchestration (Phase 7)**: Depends on all user story phases
- **Polish (Phase 8)**: Depends on all previous phases
- **Testing (Phase 9)**: Depends on all implementation phases (1-8)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories, can run parallel with US1
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories, can run parallel with US1 and US2
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US1, US2, US3 completion (needs their analysis results)

### Within Each User Story

- Core analysis logic before report generation
- Entity generation before report writing
- Validation after implementation
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004)
- All Foundational tasks marked [P] can run in parallel (T006, T007)
- User Stories 1, 2, 3 can run in parallel after Foundational phase
- All tasks within a story marked [P] can run in parallel
- Orchestration archival tasks (T050, T051) can run in parallel
- Polish documentation tasks (T060, T061, T064) can run in parallel

---

## Parallel Example: User Stories 1, 2, 3

```bash
# After Foundational phase, launch all three user stories in parallel:
# Developer A: User Story 1 (Structure Analysis)
Task: T009-T015 in scripts/analyze-structure.ts

# Developer B: User Story 2 (Dependency Analysis)  
Task: T016-T023 in scripts/analyze-dependencies.ts

# Developer C: User Story 3 (Unused Files Detection)
Task: T024-T033 in scripts/analyze-unused-files.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Structure Analysis)
4. **STOP and VALIDATE**: Test User Story 1 independently - generate structure summary and verify accuracy
5. Review structure-summary.md output

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Review structure-summary.md (MVP!)
3. Add User Story 2 → Test independently → Review dependency-report.md
4. Add User Story 3 → Test independently → Review unused-files-report.md
5. Add User Story 4 → Test independently → Review improvement-recommendations.md (depends on 1-3)
6. Add Orchestration → Test full analysis workflow
7. Add Cleanup → Test cleanup operations (dry-run first)
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Structure Analysis)
   - Developer B: User Story 2 (Dependency Analysis)
   - Developer C: User Story 3 (Unused Files Detection)
3. After US1, US2, US3 complete:
   - Developer A: User Story 4 (Recommendations)
   - Developer B: Orchestration script
   - Developer C: Cleanup functionality
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All scripts must follow TypeScript strict mode and include JSDoc comments per constitution
- Reports are generated in Markdown format in docs/analysis/
- Cleanup operations default to dry-run mode for safety
- Archival summaries for .taskmaster and tasks folders are already created in docs/archive/
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

