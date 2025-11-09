# Data Model: TweakCN Ocean Breeze Theme

**Feature**: Switch UI Design/CSS Styles to TweakCN Ocean Breeze  
**Date**: 2025-01-22  
**Phase**: 1 - Design

## Overview

This feature is styling-only and does not involve database entities or data structures. However, the theme configuration can be conceptualized as a data model for design tokens.

## Design Token Structure

### Theme Configuration Entity

**Entity**: `ThemeConfiguration`

**Description**: Represents the complete Ocean Breeze theme configuration exported from TweakCN, containing all design tokens used throughout the application.

**Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `primary` | HSL Color | Primary brand color | `hsl(200, 100%, 50%)` |
| `primaryForeground` | HSL Color | Text color on primary background | `hsl(0, 0%, 100%)` |
| `secondary` | HSL Color | Secondary brand color | `hsl(180, 50%, 60%)` |
| `secondaryForeground` | HSL Color | Text color on secondary background | `hsl(0, 0%, 100%)` |
| `accent` | HSL Color | Accent color for highlights | `hsl(190, 80%, 70%)` |
| `accentForeground` | HSL Color | Text color on accent background | `hsl(200, 100%, 20%)` |
| `background` | HSL Color | Main background color | `hsl(200, 30%, 98%)` |
| `foreground` | HSL Color | Main text color | `hsl(200, 50%, 10%)` |
| `card` | HSL Color | Card background color | `hsl(0, 0%, 100%)` |
| `cardForeground` | HSL Color | Card text color | `hsl(200, 50%, 10%)` |
| `popover` | HSL Color | Popover background | `hsl(0, 0%, 100%)` |
| `popoverForeground` | HSL Color | Popover text color | `hsl(200, 50%, 10%)` |
| `muted` | HSL Color | Muted background | `hsl(200, 20%, 96%)` |
| `mutedForeground` | HSL Color | Muted text color | `hsl(200, 10%, 50%)` |
| `destructive` | HSL Color | Error/destructive color | `hsl(0, 84%, 60%)` |
| `destructiveForeground` | HSL Color | Text on destructive background | `hsl(0, 0%, 100%)` |
| `border` | HSL Color | Border color | `hsl(200, 20%, 90%)` |
| `input` | HSL Color | Input border color | `hsl(200, 20%, 90%)` |
| `ring` | HSL Color | Focus ring color | `hsl(200, 100%, 50%)` |
| `radius` | CSS Value | Border radius | `0.5rem` |
| `sidebar.*` | HSL Colors | Sidebar-specific colors (8 variants) | Various |
| `chart.*` | HSL Colors | Chart color palette (5 variants) | Various |

**Storage**: Stored as CSS custom properties (CSS variables) in `src/app/globals.css`:
- Light mode: `:root { --primary: 200 100% 50%; ... }`
- Dark mode: `.dark { --primary: 200 100% 60%; ... }`

**Relationships**: 
- Referenced by all UI components via `hsl(var(--primary))` syntax
- Used by Tailwind CSS via `tailwind.config.js` color definitions
- Applied globally via CSS cascade

## Validation Rules

1. **Color Format**: All colors must be in HSL format (hue, saturation, lightness)
2. **Contrast Ratios**: Light mode foreground/background pairs must meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text)
3. **Dark Mode**: Dark mode variants must provide sufficient contrast for readability
4. **Completeness**: All required design tokens must be present (no missing variables)

## State Transitions

**Theme Application Flow**:

```
1. Theme JSON from TweakCN
   ↓
2. Parse design tokens
   ↓
3. Generate CSS variables
   ↓
4. Update globals.css
   ↓
5. Components automatically use new tokens
   ↓
6. Dark mode toggle switches token set
```

**No State Management Required**: CSS variables are static at build time. Dark mode switching is handled by `next-themes` library which toggles the `.dark` class on the root element.

## Migration Considerations

### Current State
- Custom fitness-themed colors (blue, green, purple gradients)
- Custom CSS variables in `globals.css`
- Custom utility classes referencing variables

### Target State
- Ocean Breeze theme colors (ocean blue palette)
- TweakCN-generated CSS variables
- Same utility classes (automatically adapt to new variables)

### Compatibility
- All existing components use CSS variables → automatically compatible
- Custom utility classes reference variables → automatically compatible
- Dark mode uses CSS variable switching → automatically compatible

## Notes

- This is a **styling-only** feature with no database or API changes
- Design tokens are stored as CSS variables, not in a database
- No data persistence or state management required
- Theme is applied at build time and runtime (via dark mode toggle)

