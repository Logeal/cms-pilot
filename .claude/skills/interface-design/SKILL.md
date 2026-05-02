---
name: interface-design
description: Craft-focused interface design for dashboards, admin panels, SaaS apps — intent-first approach that rejects generic AI-generated aesthetics
---

# Interface Design Skill

Scope: dashboards, admin panels, SaaS applications. NOT marketing pages.

## The Core Problem

Defaults disguise themselves as infrastructure. Typography, navigation, data presentation, and token naming are all design decisions — not implementation details. Even following a structured process yields generic output if you don't actively reject defaults.

## Step 1: Intent First (mandatory before any code)

Answer these three questions with specifics — not vague summaries:
1. **Who is this human?** (actual job context, what they do all day)
2. **What must they accomplish?** (the verb — a concrete task, not "use the app")
3. **What should this feel like?** (concrete metaphors from the real world, not "modern" or "clean")

**If you cannot answer these with specifics, stop. Ask the user. Do not guess. Do not default.**

## Step 2: Required Exploration (before proposing any direction)

Produce all four:
- **Domain**: 5+ concepts or metaphors from the product's world
- **Color world**: 5+ colors that naturally belong to this domain
- **Signature**: One unique element for THIS product only — not reusable
- **Defaults rejected**: Name 3 obvious patterns you are deliberately NOT doing

## Step 3: Pre-Build Checkpoint (for every component)

State explicitly:
- Intent: who, task, feeling
- Palette: colors + reasoning connected to domain exploration
- Depth strategy: how borders/shadows/layers create hierarchy
- Surfaces: elevation scale + temperature (warm/cool/neutral)
- Typography: typeface + why it fits
- Spacing: base unit

## Craft Foundations

**Subtle Layering**
Use whisper-quiet surface elevation shifts (2–4% lightness difference) to establish hierarchy invisibly. Borders should blend using `rgba` at low opacity — never harsh solid lines.

**Infinite Expression**
Same sidebar width + same card grid + same metric boxes every time = AI-generated, immediately recognizable as generic. Break at least one of these per project.

**Color Lives Somewhere**
Palettes must emerge from the product's physical world. A logistics app pulls from road maps, cargo, weather. A medical app pulls from clinical environments. Never apply colors arbitrarily.

## Quality Checks Before Presenting

- **Swap test**: Would replacing with generic defaults change how it feels? If no → not distinctive enough.
- **Squint test**: Blur your eyes. Is hierarchy still readable without harshness?
- **Signature test**: Can you point to 5 elements that belong to THIS product only?
- **Token test**: Do your CSS variable names sound product-specific or generic (`--surface-primary` vs `--card-bg`)?

## What to Avoid

- Harsh borders (1px solid #e5e7eb everywhere)
- Dramatic surface jumps that create visual noise
- Inconsistent spacing (mixing 8px, 10px, 12px with no system)
- Mixed depth strategies (shadows AND borders AND background-color all at once)
- Missing interaction states (hover, active, focus, loading, error, empty)
- Thick decorative borders as "design"
- Gradient overuse
- Multiple competing accent colors

## Workflow

1. Explore domain → produce the 4 exploration outputs
2. Propose direction with explicit connections to exploration
3. Confirm direction with user
4. Build
5. Evaluate against all 4 quality checks
6. Offer to save patterns to `system.md`
