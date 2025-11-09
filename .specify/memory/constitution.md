<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0 (Initial version - new constitution)
Modified Principles: N/A (new file)
Added Sections: Core Principles (4 principles), Development Workflow, Quality Gates
Removed Sections: N/A
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section updated
  ✅ spec-template.md - No changes needed (already has testing focus)
  ✅ tasks-template.md - No changes needed (already has test-first structure)
  ⚠️ checklist-template.md - May need updates for code quality checks (pending review)
Follow-up TODOs: None
-->

# BidMaster Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

All code MUST maintain high standards for readability, maintainability, and type safety. TypeScript strict mode is mandatory; all functions and components MUST have explicit type annotations. Code MUST pass ESLint validation with zero errors before merge. Components MUST follow functional React patterns with proper separation of concerns. All exported functions and components MUST include JSDoc or TypeScript doc comments explaining purpose, parameters, and return values. Code complexity MUST be justified; if a simpler alternative exists, it MUST be preferred unless complexity is demonstrably necessary.

**Rationale**: High code quality reduces bugs, accelerates onboarding, and ensures long-term maintainability. Type safety prevents runtime errors, and clear documentation enables effective collaboration.

### II. Testing Standards (NON-NEGOTIABLE)

All new features MUST include appropriate tests before implementation. Critical paths (authentication, data persistence, API endpoints, scraping logic) MUST have integration tests. Unit tests MUST cover complex business logic and utility functions. Test coverage for new code MUST meet minimum thresholds: 80% for business logic, 60% for UI components. All tests MUST be deterministic and independent; flaky tests MUST be fixed immediately. Performance-critical code MUST include benchmark tests. Test failures MUST block merges; all tests MUST pass in CI/CD before deployment.

**Rationale**: Comprehensive testing prevents regressions, enables confident refactoring, and ensures reliability. Test-driven development catches bugs early and documents expected behavior.

### III. User Experience Consistency

All user-facing features MUST follow established design patterns and component usage from shadcn/ui. UI components MUST be accessible (WCAG 2.1 AA minimum) with proper ARIA attributes. Loading states, error messages, and empty states MUST be implemented consistently across all pages. Responsive design MUST work across mobile, tablet, and desktop breakpoints. User interactions MUST provide immediate feedback (loading indicators, success/error toasts). Navigation and information architecture MUST be consistent; users MUST be able to complete primary tasks without confusion.

**Rationale**: Consistent UX reduces cognitive load, improves usability, and builds user trust. Accessibility ensures the application is usable by all users, and responsive design supports diverse device usage.

### IV. Performance Requirements

All API endpoints MUST respond within 200ms for p95 latency in production. Page load times MUST be under 2 seconds for initial render on 3G connections. Database queries MUST be optimized with proper indexing; N+1 query patterns MUST be eliminated. Images and static assets MUST be optimized and lazy-loaded where appropriate. Client-side bundle size MUST be monitored; code splitting MUST be used for large dependencies. Scraping operations MUST respect rate limits and implement proper queuing to avoid system overload. Performance regressions MUST be identified and addressed before release.

**Rationale**: Performance directly impacts user satisfaction and business metrics. Fast response times improve user retention, and efficient resource usage reduces infrastructure costs.

## Development Workflow

All code changes MUST be reviewed through pull requests. PRs MUST include clear descriptions, link to related issues, and demonstrate compliance with all constitution principles. Code review MUST verify type safety, test coverage, accessibility, and performance implications. Breaking changes MUST be documented with migration guides. Feature flags MUST be used for risky changes to enable gradual rollouts.

## Quality Gates

Before any code is merged, it MUST pass:
- TypeScript compilation with zero errors (`npm run type-check`)
- ESLint validation with zero errors (`npm run lint`)
- All existing tests passing (`npm run scrape:validate` or equivalent)
- Manual accessibility review for UI changes
- Performance impact assessment for database or API changes

## Governance

This constitution supersedes all other development practices and guidelines. All PRs and code reviews MUST verify compliance with these principles. Amendments to this constitution require:
1. Documentation of the proposed change and rationale
2. Review and approval from the project maintainers
3. Update to version number following semantic versioning (MAJOR.MINOR.PATCH)
4. Propagation of changes to dependent templates and documentation

Complexity that violates simplicity principles MUST be justified in code comments and PR descriptions. Use `CLAUDE.md` and `.github/copilot-instructions.md` for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2025-01-22 | **Last Amended**: 2025-01-22
