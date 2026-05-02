---
name: web-interface-guidelines
description: Reviews UI code compliance against Vercel's Web Interface Guidelines — accessibility, focus states, forms, animation, typography, performance, dark mode, i18n
---

# Web Interface Guidelines Review

Fetch the latest guidelines before each review:
```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

## Activation triggers
Use this skill when the user says: "review my UI", "check accessibility", "audit design", "review UX", "check my site against best practices".

## Process
1. Fetch the current guidelines from the URL above
2. Ask for specific files or a filename pattern to review (if not provided)
3. Analyze each file against the rules
4. Report findings in `file:line` format (VS Code compatible), terse and specific
5. Mark files with "✓ pass" if fully compliant

## Key areas to check
- Accessibility: ARIA labels, keyboard navigation, semantic HTML (prefer semantic over ARIA)
- Focus states: visible focus indicators, never remove outline
- Forms: labels, autocomplete attributes, validation UX
- Animation: respect `prefers-reduced-motion`, no broad transitions
- Typography: proper ellipsis chars, smart quotes, correct spacing
- Content: truncation handling, empty states
- Images: dimensions set, lazy loading, optimization
- Performance: virtualization for long lists, DOM batching
- Navigation and state management
- Touch: safe areas, minimum 44px targets
- Dark mode and theming via CSS custom properties
- Internationalization: no hardcoded date/number formatting
- Hydration safety (no SSR/client mismatch)
- Interactive state feedback (loading, disabled, error states)

## Anti-patterns to flag
- `user-scalable=no` (disabled zoom)
- Preventing paste on inputs
- `transition: all` (too broad)
- Removed focus styles (`outline: none` without replacement)
- `<div onClick>` instead of `<button>`
- Unlabeled inputs or icon buttons
- Hardcoded locale-specific formatting
- Unjustified `autofocus`
