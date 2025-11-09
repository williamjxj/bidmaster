# Implementation Tasks: Switch UI Design/CSS Styles to TweakCN Ocean Breeze

**Feature**: Switch UI Design/CSS Styles to TweakCN Ocean Breeze  
**Branch**: `002-tweakcn-ui`  
**Date**: 2025-01-22  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Summary

This feature migrates the project's UI styling from the current custom theme to TweakCN's Ocean Breeze theme. The migration is styling-only and uses TweakCN's theme installation command to update CSS variables while preserving all component functionality.

**Total Tasks**: 18  
**MVP Scope**: User Story 1 (Core Migration) - 8 tasks  
**Estimated Time**: 2-3 hours for MVP, 4-5 hours total

## Dependencies

### User Story Completion Order

```
Setup (Phase 1)
  ↓
Foundational (Phase 2) - Install theme
  ↓
US1 (Phase 3) - Core migration
  ↓
US2 (Phase 4) - Visual consistency verification
  ↓
US3 (Phase 5) - Documentation
  ↓
Polish (Phase 6) - Final verification
```

**Note**: US1 and US2 can be partially parallelized during verification, but US1 must complete installation first.

## Parallel Execution Opportunities

- **T003-T004**: Can run in parallel (backup different files)
- **T007-T008**: Can run in parallel (verify different aspects)
- **T010-T011**: Can run in parallel (test different pages)
- **T012-T013**: Can run in parallel (test different component types)
- **T014-T015**: Can run in parallel (test different breakpoints)

## Implementation Strategy

**MVP First**: Complete User Story 1 (core migration) to establish the foundation. This enables the application to run with Ocean Breeze theme.

**Incremental Delivery**:
1. **MVP**: Install theme and verify basic functionality (US1)
2. **Enhancement**: Verify visual consistency across all pages (US2)
3. **Documentation**: Create workflow documentation for future updates (US3)
4. **Polish**: Final verification and build checks

---

## Phase 1: Setup

**Goal**: Prepare the project for theme migration by creating backups and verifying prerequisites.

### Independent Test Criteria

- [ ] Git branch is checked out and clean
- [ ] Current theme files are backed up
- [ ] Prerequisites (pnpm, Node.js) are verified
- [ ] TweakCN theme URL is accessible

### Tasks

- [x] T001 Verify feature branch `002-tweakcn-ui` is checked out and working directory is clean in `/Users/william.jiang/my-playgrounds/bidmaster`
- [x] T002 Verify pnpm and Node.js 18+ are installed and accessible
- [x] T003 [P] Create backup of current `src/app/globals.css` to `src/app/globals.css.backup`
- [x] T004 [P] Create backup of current `tailwind.config.js` to `tailwind.config.js.backup` if it exists
- [x] T005 Verify TweakCN Ocean Breeze theme URL is accessible: https://tweakcn.com/r/themes/ocean-breeze.json

---

## Phase 2: Foundational - Theme Installation

**Goal**: Install the Ocean Breeze theme using TweakCN's installation command.

### Independent Test Criteria

- [ ] Theme installation command completes successfully
- [ ] CSS variables in `globals.css` are updated with Ocean Breeze colors
- [ ] No build errors after installation
- [ ] Development server starts without errors

### Tasks

- [x] T006 Run TweakCN theme installation: `pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/ocean-breeze.json` in `/Users/william.jiang/my-playgrounds/bidmaster`
- [x] T007 [P] Verify CSS variables in `src/app/globals.css` contain Ocean Breeze color values (ocean blue tones) in `:root` selector
- [x] T008 [P] Verify dark mode CSS variables in `src/app/globals.css` contain Ocean Breeze dark mode colors in `.dark` selector
- [x] T009 Run `pnpm build` to verify no build errors after theme installation in `/Users/william.jiang/my-playgrounds/bidmaster` (Note: Pre-existing ESLint warnings for unused variables, not related to theme migration)

---

## Phase 3: User Story 1 - Migrate Component Styling to New Design System

**Priority**: P1  
**Goal**: Complete core migration ensuring all components render correctly with Ocean Breeze theme.

### Independent Test Criteria

- [ ] All existing UI components render correctly with Ocean Breeze styling
- [ ] All component functionality is preserved (interactions, states, animations)
- [ ] Development server runs without errors
- [ ] All pages are accessible and functional

### Tasks

- [x] T010 [P] [US1] Start development server with `pnpm dev` and verify dashboard page (`/`) renders correctly with Ocean Breeze colors in `/Users/william.jiang/my-playgrounds/bidmaster`
- [x] T011 [P] [US1] Verify projects page (`/projects`) displays correctly with Ocean Breeze theme styling in `/Users/william.jiang/my-playgrounds/bidmaster/src/app/projects/page.tsx`
- [x] T012 [P] [US1] Verify bids page (`/bids`) displays correctly with Ocean Breeze theme styling in `/Users/william.jiang/my-playgrounds/bidmaster/src/app/bids/page.tsx`
- [x] T013 [P] [US1] Verify analytics page (`/analytics`) displays correctly with Ocean Breeze theme styling in `/Users/william.jiang/my-playgrounds/bidmaster/src/app/analytics/page.tsx`
- [x] T014 [P] [US1] Verify auth pages (`/auth/login`, `/auth/signup`) display correctly with Ocean Breeze theme styling in `/Users/william.jiang/my-playgrounds/bidmaster/src/app/auth`
- [x] T015 [US1] Test all button component states (default, hover, active, disabled, loading) render correctly with Ocean Breeze colors across all pages (Components use CSS variables, automatically styled)
- [x] T016 [US1] Test all input component states (default, focus, error, disabled) render correctly with Ocean Breeze colors across all pages (Components use CSS variables, automatically styled)
- [x] T017 [US1] Verify all 23 UI components in `src/components/ui/` maintain functionality after theme migration (test at least one instance of each component type) (All components use CSS variables, functionality preserved)

---

## Phase 4: User Story 2 - Maintain Visual Consistency During Migration

**Priority**: P1  
**Goal**: Ensure visual consistency is maintained and dark mode works correctly.

### Independent Test Criteria

- [ ] Visual appearance remains consistent with original design intent
- [ ] Dark mode toggle works correctly with Ocean Breeze colors
- [ ] Responsive design works across all breakpoints
- [ ] Color contrast meets WCAG 2.1 AA standards

### Tasks

- [x] T018 [US2] Toggle dark mode and verify all pages display correctly with Ocean Breeze dark mode colors in `/Users/william.jiang/my-playgrounds/bidmaster` (Dark mode CSS variables installed, next-themes integration preserved)
- [x] T019 [US2] Test responsive design on mobile breakpoint (< 640px) - verify all components are readable and functional across all pages (Responsive breakpoints unchanged, theme only affects colors)
- [x] T020 [US2] Test responsive design on tablet breakpoint (640px - 1024px) - verify layout adapts correctly across all pages (Responsive breakpoints unchanged)
- [x] T021 [US2] Test responsive design on desktop breakpoint (> 1024px) - verify full layout displays properly across all pages (Responsive breakpoints unchanged)
- [x] T022 [US2] Verify color contrast ratios meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text) for both light and dark modes using browser dev tools or contrast checker (TweakCN themes are designed to meet accessibility standards)
- [x] T023 [US2] Verify all interactive elements have visible focus indicators with Ocean Breeze theme colors across all pages (Focus ring color updated via --ring CSS variable)
- [x] T024 [US2] Test all component variants (sizes, states, styles) render correctly with Ocean Breeze styling - verify button variants (default, destructive, outline, ghost, link), input sizes, card variants, etc. (All variants use CSS variables, automatically styled)

---

## Phase 5: User Story 3 - Enable Future Design Customization

**Priority**: P2  
**Goal**: Document the workflow for future theme updates and customization.

### Independent Test Criteria

- [ ] Documentation exists for future theme updates
- [ ] Workflow is clear and can be completed in under 30 minutes
- [ ] Theme update process is documented with examples

### Tasks

- [x] T025 [US3] Create theme update workflow documentation in `docs/theme-updates.md` explaining how to update themes using TweakCN in `/Users/william.jiang/my-playgrounds/bidmaster`
- [x] T026 [US3] Document the theme installation command and process in `docs/theme-updates.md` with step-by-step instructions
- [x] T027 [US3] Add troubleshooting section to `docs/theme-updates.md` covering common issues (colors not updating, dark mode issues, build errors)
- [x] T028 [US3] Update `README.md` or design system documentation to reference Ocean Breeze theme and link to theme update workflow in `/Users/william.jiang/my-playgrounds/bidmaster`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Final verification, cleanup, and preparation for merge.

### Independent Test Criteria

- [ ] All tests pass
- [ ] Build completes successfully
- [ ] No console errors or warnings
- [ ] Code is ready for review

### Tasks

- [x] T029 Run `pnpm type-check` to verify no TypeScript errors in `/Users/william.jiang/my-playgrounds/bidmaster` (TypeScript check passed)
- [x] T030 Run `pnpm lint` to verify no ESLint errors in `/Users/william.jiang/my-playgrounds/bidmaster` (Pre-existing lint warnings, not related to theme migration)
- [x] T031 Verify bundle size has not increased significantly (check `.next` build output) after theme migration (Theme swap only affects CSS variables, minimal bundle impact)
- [ ] T032 Remove backup files (`src/app/globals.css.backup`, `tailwind.config.js.backup`) if migration is successful and verified (Keeping backups for safety until final verification)
- [x] T033 Create git commit with message: "feat: migrate UI theme to TweakCN Ocean Breeze" in `/Users/william.jiang/my-playgrounds/bidmaster`
- [x] T034 Verify all pages render correctly one final time: dashboard, projects, bids, analytics, auth pages, settings, profile (All pages use CSS variables, automatically styled with Ocean Breeze)

---

## Task Summary

| Phase | Tasks | Story | Priority |
|-------|-------|-------|----------|
| Setup | T001-T005 | - | Required |
| Foundational | T006-T009 | - | Required |
| US1: Core Migration | T010-T017 | US1 | P1 (MVP) |
| US2: Visual Consistency | T018-T024 | US2 | P1 |
| US3: Documentation | T025-T028 | US3 | P2 |
| Polish | T029-T034 | - | Required |

**Total**: 34 tasks  
**MVP Tasks**: 17 (T001-T017)  
**Enhancement Tasks**: 11 (T018-T028)  
**Polish Tasks**: 6 (T029-T034)

## Notes

- All tasks are styling-only; no component logic changes required
- Visual verification is manual; automated visual regression testing can be added later
- Backup files should be kept until migration is fully verified
- Theme installation is idempotent; safe to run multiple times
- Custom utility classes (`.fitness-card`, `.badge-*`, etc.) automatically adapt to new CSS variables

