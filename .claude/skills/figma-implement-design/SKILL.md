---
name: figma-implement-design
description: Converts Figma designs into production-ready code with pixel-perfect accuracy using the Figma MCP server
---

# Figma Implement Design Skill

## When to use this skill

- Implementing UI code from a Figma file
- User says "implement design", "generate code", "implement component"
- A Figma URL is provided
- Building components that must match Figma specifications

## When NOT to use this skill

| Goal | Use instead |
|------|-------------|
| Creating/editing nodes inside Figma | `figma-use` |
| Building full-page screens in Figma | `figma-generate-design` |
| Creating Code Connect mappings only | `figma-code-connect` |
| Authoring reusable agent rules | `figma-create-design-system-rules` |

## Required 7-Step Workflow

### 1. Extract node information
Parse the Figma URL to get `fileKey` and `nodeId` parameters.

### 2. Fetch design context
Call `get_design_context()` from the Figma MCP server for structured design data.

### 3. Capture visual reference
Call `get_screenshot()` — this is your ground truth for validation.

### 4. Download assets
Download images and icons from the Figma MCP server. Use localhost sources directly — do not re-host.

### 5. Translate to project conventions
- Respect existing frameworks and component libraries
- Map Figma tokens to project design tokens
- Reuse existing components instead of duplicating

### 6. Achieve visual parity
Pixel-perfect matching to Figma specifications. Match:
- Spacing (px values from Figma, convert to project units)
- Typography (size, weight, line-height, letter-spacing)
- Colors (use design tokens, not hardcoded hex)
- Border radius, shadows, opacity

### 7. Validate completely
Compare rendered output against the screenshot from step 3 before declaring done.

## Key Principles

- Treat Figma MCP output as design intent and behavior specification — not as final code style
- Prioritize reusing existing components over creating new ones
- Use design tokens consistently — never hardcode hex values that exist as tokens
- Always fetch context first — never assume or implement based on Figma URL alone

## Figma MCP Server Setup

Install the Figma MCP server (run once in terminal):
```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```
