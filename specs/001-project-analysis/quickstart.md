# Quickstart: Project Analysis & Cleanup

## Prerequisites

- Node.js 18+ installed
- npm dependencies installed (`npm install`)
- TypeScript compiler available (`npm run type-check` should work)
- Git repository initialized

## Running the Analysis

### Step 1: Run Full Analysis

```bash
# From project root
npm run analyze:project
```

This will:
1. Analyze project structure
2. Check for outdated dependencies
3. Detect unused files
4. Generate improvement recommendations
5. Create archival summaries for .taskmaster and tasks folders

**Expected Duration**: <5 minutes (per SC-001)

### Step 2: Review Reports

All reports are generated in `docs/analysis/`:

- `structure-summary.md` - Project structure and architecture
- `dependency-report.md` - Outdated packages and update recommendations
- `unused-files-report.md` - Files flagged for deletion
- `improvement-recommendations.md` - Categorized improvement suggestions
- `cleanup-summary.md` - Summary of cleanup operations (dry-run)

### Step 3: Review Archival Summaries

Before cleanup, review summaries in `docs/archive/`:

- `taskmaster-summary.md` - Content summary of .taskmaster folder
- `tasks-summary.md` - Content summary of tasks folder

### Step 4: Execute Cleanup (Dry Run First)

```bash
# Dry run - shows what would be deleted without actually deleting
npm run cleanup:dry-run

# Review the cleanup-summary.md output
# Then execute actual cleanup
npm run cleanup:execute
```

## Verification

### Verify Analysis Completeness

1. **Structure Summary**: Check that all major directories are documented
   - ✅ src/app/ structure documented
   - ✅ API routes documented
   - ✅ Component organization documented

2. **Dependency Report**: Verify all packages are analyzed
   - ✅ All dependencies from package.json listed
   - ✅ Version information accurate (compare with `npm outdated`)
   - ✅ Major updates flagged

3. **Unused Files Report**: Review flagged files
   - ✅ Backup files identified (e.g., page_backup.tsx)
   - ✅ Empty directories identified (e.g., src/app/test/)
   - ✅ Confidence levels assigned

4. **Improvement Recommendations**: Check categorization
   - ✅ At least 4 categories (performance, security, code quality, architecture)
   - ✅ All recommendations are actionable
   - ✅ Priorities and effort estimates included

### Verify Cleanup Safety

Before executing cleanup:

1. **Review Unused Files Report**: Manually verify flagged files
2. **Check Archival Summaries**: Ensure important content is preserved
3. **Dry Run First**: Always run dry-run before actual cleanup
4. **Git Status**: Ensure working directory is clean or changes are committed

## Expected Outcomes

### Analysis Reports

- **Structure Summary**: ~500-1000 lines documenting project organization
- **Dependency Report**: ~20-30 outdated packages identified
- **Unused Files Report**: ~5-10 files flagged (backup files, empty dirs)
- **Improvement Recommendations**: ~15-25 actionable suggestions across 4+ categories

### Cleanup Results

- **Deleted Files**: ~5-10 files (backup files, unused scripts)
- **Deleted Directories**: 2 folders (.taskmaster, tasks) after archival
- **Space Freed**: Minimal (mostly small config/text files)

## Troubleshooting

### Analysis Fails

- **Check Node.js version**: Requires Node.js 18+
- **Verify dependencies**: Run `npm install` if missing packages
- **Check TypeScript**: Run `npm run type-check` to verify setup

### Unused File Detection Issues

- **False Positives**: Review confidence levels, low confidence = manual review needed
- **Dynamic Imports**: Manually verify files flagged with "dynamic_import" note
- **Config Files**: Some config files may be referenced indirectly

### Cleanup Concerns

- **Dry Run First**: Always review dry-run output before execution
- **Git Backup**: Ensure changes are committed or backed up
- **Archival**: Check that archival summaries capture important content

## Next Steps

After analysis and cleanup:

1. **Review Improvement Recommendations**: Prioritize high-priority items
2. **Update Dependencies**: Start with patch/minor updates, then major updates
3. **Address Unused Code**: Remove or refactor unused files/components
4. **Implement Improvements**: Follow recommendations by category and priority

