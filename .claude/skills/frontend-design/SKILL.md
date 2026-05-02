---
name: frontend-design
description: Creates distinctive, production-grade frontend interfaces that prioritize design quality and avoid generic AI aesthetics
---

# Frontend Design Skill

## Core Philosophy

Before writing a single line of code, establish a **bold aesthetic direction**:
- Understand the purpose and audience of the interface
- Choose an extreme tone: minimalist, maximalist, retro-futuristic, editorial, brutalist, etc.
- Identify what makes this interface *memorable* — the one thing someone will remember

## Critical Guidelines

**Typography**
- Never default to Inter, Arial, or system-ui for display headings
- Pair fonts intentionally: a characterful display face + a readable body face
- Use type scale with intention — extreme size contrast creates hierarchy

**Color & Theme**
- Build cohesive palettes: one dominant color, one accent, one neutral system
- Avoid predictable purple gradients and generic blue CTAs
- Consider unexpected hues that match the brand personality

**Motion**
- Use CSS animations — no JS animation libraries unless truly needed
- High-impact moments: staggered reveals on load, subtle hover lifts, scroll-triggered fades
- Motion should feel earned, not decorative

**Composition**
- Break the grid intentionally — asymmetry, overlapping elements, generous whitespace
- Avoid equal-column layouts that feel like templates
- Use negative space as a design element

**Details that elevate**
- Atmospheric backgrounds: subtle noise texture, soft gradients, grain overlays
- Micro-interactions on interactive elements
- Context-specific character: a legal site feels different from a tech startup

## Complexity Match

Match code complexity to design ambition:
- **Maximalist design** → elaborate CSS, multiple layers, rich animations
- **Minimalist design** → restraint and precision in spacing and typography, no decoration for decoration's sake

## What to Avoid

- Generic AI aesthetics (rounded cards + shadow + Inter + purple gradient)
- Cookie-cutter layouts that look like every other SaaS landing page
- Decoration without purpose
- "Safe" choices that result in forgettable interfaces

## Process

1. Define the aesthetic direction in a comment at the top of the CSS file
2. Establish the type scale and color system first
3. Build layout structure before adding decoration
4. Add motion and micro-interactions last
5. Review: does this look like it could only be this brand/product?
