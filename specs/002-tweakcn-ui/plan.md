# Implementation Plan: Switch UI Design/CSS Styles to TweakCN Ocean Breeze

**Branch**: `002-tweakcn-ui` | **Date**: 2025-01-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-tweakcn-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate the project's UI component styling from the current shadcn/ui configuration with custom Tailwind CSS to TweakCN's 'Ocean Breeze' theme. The migration will use TweakCN's theme installation command (`pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/ocean-breeze.json`) to apply the Ocean Breeze color scheme and design tokens while preserving all existing component functionality, responsive behavior, and dark mode support.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.0.0, Next.js 15.3.5  
**Primary Dependencies**: shadcn/ui, Radix UI primitives, Tailwind CSS v4, next-themes  
**Storage**: N/A (styling-only feature)  
**Testing**: Visual regression testing, manual component verification, TypeScript type checking  
**Target Platform**: Web (Next.js App Router), responsive (mobile, tablet, desktop)  
**Project Type**: Web application (Next.js single-page app)  
**Performance Goals**: No performance degradation; maintain <2s page load on 3G, <200ms API latency  
**Constraints**: Must preserve all existing component functionality; zero visual regressions; maintain dark mode support; compatible with Tailwind CSS v4  
**Scale/Scope**: ~20+ UI components across multiple pages (dashboard, projects, bids, analytics, auth)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with BidMaster Constitution principles:

- **Code Quality**: ✅ TypeScript strict mode enforced; CSS variables and Tailwind config changes maintain type safety; no new code complexity introduced
- **Testing Standards**: ⚠️ Visual regression testing required; manual component verification needed; no unit tests for styling (acceptable for CSS-only changes)
- **User Experience**: ✅ Accessibility maintained (WCAG 2.1 AA); responsive design preserved; consistent patterns via TweakCN theme; loading/error states unaffected
- **Performance**: ✅ No API changes; CSS bundle size impact minimal (theme swap); page load targets maintained

**Pre-Phase 0 Status**: ✅ PASS - Styling-only migration with minimal risk

**Post-Phase 1 Status**: ✅ PASS - Design artifacts complete; styling-only migration with no constitution violations

## Project Structure

### Documentation (this feature)

```text
specs/002-tweakcn-ui/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - N/A for styling-only feature
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css      # Main CSS file - will be updated with Ocean Breeze theme
│   ├── layout.tsx        # Root layout - may need theme provider updates
│   └── [pages]/         # All pages use UI components
├── components/
│   └── ui/              # 23 shadcn/ui components - styling updated via theme
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── [19 more components]
└── lib/
    └── utils.ts         # Utility functions (unaffected)

tailwind.config.js       # Tailwind config - may need updates for Ocean Breeze theme
components.json          # shadcn/ui config - may need updates
```

**Structure Decision**: Single Next.js web application. Styling changes primarily affect `src/app/globals.css` (CSS variables), `tailwind.config.js` (theme configuration), and component styling via TweakCN theme installation. No structural changes to source code organization required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - this is a straightforward styling migration using standard tooling (TweakCN, shadcn CLI) with no added complexity.
