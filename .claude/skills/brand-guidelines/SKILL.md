---
name: brand-guidelines
description: Applies Anthropic brand guidelines — color palette, typography (Poppins/Lora), and accent color system
---

# Brand Guidelines Skill

## Color Palette

| Role | Value |
|------|-------|
| Dark (text, dark bg) | `#141413` |
| Light (light bg) | `#faf9f5` |
| Accent Orange | `#d97757` |
| Accent Blue | `#6a9bcc` |
| Accent Green | `#788c5d` |

Mid and light grays for secondary elements (derive from dark/light scale).

## Typography

| Role | Font | Fallback |
|------|------|---------|
| Headings (≥ 24pt) | Poppins | Arial |
| Body | Lora | Georgia |

Apply Poppins to all headings at 24px and above. Use Lora for body text and smaller headings for readability.

## Accent Color System

Cycle through orange → blue → green for non-text accent shapes to maintain visual interest. Do not use all three simultaneously in the same component — pick one accent per section or component.

## Implementation Notes

- No font installation required — use system/CDN delivery with proper fallbacks
- Prioritize system compatibility: fallbacks must look acceptable
- The dark/light palette creates natural dark mode support
- Use CSS custom properties:

```css
:root {
  --color-dark: #141413;
  --color-light: #faf9f5;
  --color-accent-orange: #d97757;
  --color-accent-blue: #6a9bcc;
  --color-accent-green: #788c5d;
  --font-heading: 'Poppins', Arial, sans-serif;
  --font-body: 'Lora', Georgia, serif;
}
```
