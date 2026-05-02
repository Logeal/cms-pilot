---
name: theme-factory
description: Applies pre-configured visual themes (color palettes + font pairings) to web artifacts — 10 preset themes or custom generation on demand
---

# Theme Factory Skill

A styling toolkit for applying professional visual consistency to presentations, documents, and web pages.

## Activation

Use this skill when the user asks to apply a theme, change the visual style, or pick a color scheme.

## Process

1. Display the theme showcase so the user can see options visually
2. Ask for the user's preference
3. Get explicit confirmation before applying
4. Apply the selected theme to the artifact

## Preset Themes

Each theme includes a cohesive hex color palette and complementary font pairings for headers and body.

| # | Name | Vibe |
|---|------|------|
| 1 | Ocean Depths | Deep blues, teals, aqua accents |
| 2 | Midnight Galaxy | Dark navy, purple, star-white accents |
| 3 | Forest & Earth | Greens, warm browns, natural tones |
| 4 | Sunset Warm | Oranges, coral, warm yellows |
| 5 | Arctic Minimal | Off-whites, light grays, cool blue accent |
| 6 | Ember & Ash | Dark charcoal, ember orange, stone gray |
| 7 | Botanical | Sage green, cream, terracotta |
| 8 | Neon Noir | Near-black, electric accent (cyan or magenta) |
| 9 | Editorial | Black, white, single bold color accent |
| 10 | Sand & Stone | Warm beiges, tan, dusty rose |

## Custom Theme Generation

When no preset fits:
1. Analyze the user's description or reference images
2. Select appropriate colors and fonts
3. Present the custom theme for approval before applying

## Theme Specification Format

```
Theme: [Name]
Primary: #hex
Secondary: #hex
Accent: #hex
Background: #hex
Surface: #hex
Text: #hex
Heading font: [Font name], [fallback]
Body font: [Font name], [fallback]
```

Store approved themes in a `themes/` directory for reuse.
