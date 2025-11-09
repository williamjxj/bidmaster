# Research: Project Analysis & Cleanup

## Technology Choices

### Analysis Tools

**Decision**: Use Node.js/TypeScript scripts leveraging existing project dependencies (fs, path, glob patterns) rather than external analysis tools.

**Rationale**: 
- Maintains consistency with existing codebase (TypeScript, Node.js)
- No additional dependencies required
- Full control over analysis logic and output format
- Can leverage existing npm scripts infrastructure

**Alternatives considered**:
- External tools (depcheck, unimport, madge): Would require additional dependencies and may not align with project-specific needs
- Python scripts: Would require Python runtime, inconsistent with project stack
- Online analysis tools: Privacy concerns, requires code upload

### Dependency Analysis Approach

**Decision**: Use `npm outdated --json` for dependency version checking, supplemented with manual analysis of major version updates.

**Rationale**:
- `npm outdated` provides accurate version information from npm registry
- JSON output enables programmatic processing
- Identifies current, wanted (semver range), and latest versions
- Standard npm tool, no additional dependencies

**Alternatives considered**:
- npm-check-updates: More features but requires additional dependency
- Manual package.json review: Too time-consuming and error-prone
- Dependabot/Renovate: Good for ongoing maintenance but not for one-time analysis

### Unused File Detection Strategy

**Decision**: Multi-pass approach: (1) Static import analysis using TypeScript compiler API, (2) Pattern-based detection (backup files, empty dirs), (3) Manual review flagging for dynamic imports.

**Rationale**:
- TypeScript compiler API provides accurate import resolution
- Pattern-based detection catches common unused file patterns
- Manual review flagging acknowledges limitations of static analysis
- Balances automation with accuracy (90% target per SC-003)

**Alternatives considered**:
- Pure static analysis: Misses dynamic imports and config-based references
- Pure pattern matching: Too many false positives
- Full manual review: Too time-consuming

### Cleanup Execution Strategy

**Decision**: Dry-run mode by default, with explicit confirmation required for actual deletions. Generate summary reports before cleanup.

**Rationale**:
- Safety: Prevents accidental deletion of important files
- Transparency: Users can review what will be deleted before execution
- Reversibility: Summary reports enable recovery if needed
- Constitution compliance: Aligns with quality gates requiring review

**Alternatives considered**:
- Automatic cleanup: Too risky, may delete incorrectly identified files
- Manual cleanup only: Too slow, defeats purpose of automation

## Integration Patterns

### File System Operations

**Decision**: Use Node.js `fs/promises` for async file operations, `glob` patterns for file discovery, `path` for cross-platform path handling.

**Rationale**:
- Native Node.js APIs, no additional dependencies
- Async/await pattern aligns with project conventions
- Cross-platform compatibility (Windows, macOS, Linux)
- Well-tested, reliable APIs

### Report Generation

**Decision**: Generate Markdown reports in `docs/analysis/` directory for easy review and version control.

**Rationale**:
- Markdown is human-readable and version-controllable
- Can be easily converted to other formats if needed
- Aligns with existing documentation structure
- Enables easy sharing and review

**Alternatives considered**:
- JSON reports: Less human-readable, harder to review
- HTML reports: Requires additional tooling, not version-control friendly
- Console output only: Not persistent, can't be shared or reviewed later

## Best Practices

### Analysis Script Organization

**Decision**: Modular script structure with separate modules for each analysis type (structure, dependencies, unused files, recommendations).

**Rationale**:
- Separation of concerns: Each module has single responsibility
- Testability: Each module can be tested independently
- Maintainability: Easier to update individual analysis types
- Reusability: Modules can be used independently if needed

### Error Handling

**Decision**: Graceful degradation: If one analysis fails, continue with others and report failures in summary.

**Rationale**:
- Maximizes value: Partial analysis is better than no analysis
- User experience: Users get what can be analyzed even if some parts fail
- Debugging: Failures are clearly reported for investigation

### Performance Optimization

**Decision**: Parallel execution of independent analyses (structure, dependencies, unused files can run concurrently).

**Rationale**:
- Reduces total analysis time (target: <5 minutes per SC-001)
- Better resource utilization
- User experience: Faster feedback

## Resolved Clarifications

All technical decisions resolved. No NEEDS CLARIFICATION markers remain.

