# Quickstart: TweakCN Ocean Breeze Theme Migration

**Feature**: Switch UI Design/CSS Styles to TweakCN Ocean Breeze  
**Date**: 2025-01-22

## Prerequisites

- Node.js 18+ and pnpm installed
- Git feature branch `002-tweakcn-ui` checked out
- Access to TweakCN theme URL: https://tweakcn.com/r/themes/ocean-breeze.json

## Installation Steps

### 1. Install Ocean Breeze Theme

Run the TweakCN theme installation command:

```bash
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/ocean-breeze.json
```

This command will:
- Fetch the Ocean Breeze theme JSON from TweakCN
- Update `src/app/globals.css` with new CSS variables
- Potentially update `tailwind.config.js` if needed
- Preserve all existing component structure

### 2. Verify Installation

Check that CSS variables were updated:

```bash
# View the updated globals.css
cat src/app/globals.css | grep -A 5 ":root"
```

You should see Ocean Breeze color values (ocean blue tones) instead of the previous fitness theme colors.

### 3. Start Development Server

```bash
pnpm dev
```

Visit http://localhost:3000 and verify:
- All pages render correctly
- Colors match Ocean Breeze theme
- No console errors

### 4. Test Dark Mode

1. Toggle dark mode in the application
2. Verify dark mode colors are applied correctly
3. Check that all components maintain proper contrast

### 5. Visual Verification Checklist

Test each page for visual correctness:

- [ ] **Dashboard** (`/`) - Cards, charts, metrics display correctly
- [ ] **Projects** (`/projects`) - Table, cards, filters styled properly
- [ ] **Bids** (`/bids`) - List view, forms styled correctly
- [ ] **Analytics** (`/analytics`) - Charts, graphs use Ocean Breeze colors
- [ ] **Auth Pages** (`/auth/login`, `/auth/signup`) - Forms, buttons styled
- [ ] **Settings** (`/settings`) - All form elements styled
- [ ] **Profile** (`/profile`) - User interface elements styled

### 6. Component State Testing

For each component type, verify states:

- [ ] **Buttons**: Default, hover, active, disabled, loading states
- [ ] **Inputs**: Default, focus, error, disabled states
- [ ] **Cards**: Default, hover (if applicable) states
- [ ] **Dialogs**: Open/close animations, backdrop
- [ ] **Dropdowns**: Open/close, hover states
- [ ] **Tabs**: Active/inactive states
- [ ] **Badges**: All variant colors

### 7. Responsive Testing

Test across breakpoints:

- [ ] **Mobile** (< 640px): All components readable and functional
- [ ] **Tablet** (640px - 1024px): Layout adapts correctly
- [ ] **Desktop** (> 1024px): Full layout displays properly

### 8. Accessibility Check

Verify accessibility:

- [ ] **Color Contrast**: Text meets WCAG 2.1 AA standards (4.5:1 ratio)
- [ ] **Focus States**: All interactive elements have visible focus indicators
- [ ] **Dark Mode Contrast**: Dark mode maintains sufficient contrast

### 9. Build Verification

Ensure the build completes successfully:

```bash
pnpm build
```

Check for:
- [ ] No build errors
- [ ] No TypeScript errors
- [ ] No CSS warnings
- [ ] Bundle size is reasonable (no significant increase)

### 10. Rollback (If Needed)

If issues are found, rollback is simple:

```bash
git checkout src/app/globals.css
git checkout tailwind.config.js  # if it was modified
```

Or revert the entire commit:

```bash
git log --oneline  # Find the theme installation commit
git revert <commit-hash>
```

## Troubleshooting

### Issue: Colors not updating

**Solution**: Clear Next.js cache and restart:
```bash
rm -rf .next
pnpm dev
```

### Issue: Dark mode not working

**Solution**: Verify `next-themes` is properly configured in `src/app/layout.tsx` and the `.dark` class is being applied to the root element.

### Issue: Custom classes not adapting

**Solution**: Check that custom utility classes use CSS variables (e.g., `hsl(var(--primary))`) rather than hardcoded colors. Update any hardcoded colors to use variables.

### Issue: Build errors

**Solution**: 
1. Check TypeScript compilation: `pnpm type-check`
2. Check ESLint: `pnpm lint`
3. Verify all CSS variables are properly formatted in HSL

## Next Steps

After successful migration:

1. **Documentation**: Update any design system documentation with Ocean Breeze theme details
2. **Screenshots**: Capture before/after screenshots for documentation
3. **Team Review**: Have team members review the new theme
4. **User Testing**: If possible, gather user feedback on the new color scheme

## Success Criteria

Migration is successful when:

- ✅ All pages render correctly with Ocean Breeze colors
- ✅ Dark mode works correctly
- ✅ All component states display properly
- ✅ Responsive design works across all breakpoints
- ✅ Accessibility standards maintained
- ✅ Build completes without errors
- ✅ No visual regressions compared to original design intent

## Additional Resources

- **TweakCN Editor**: https://tweakcn.com/editor/theme
- **Ocean Breeze Theme**: https://tweakcn.com/r/themes/ocean-breeze.json
- **shadcn/ui Docs**: https://ui.shadcn.com
- **Tailwind CSS v4 Docs**: https://tailwindcss.com/docs

