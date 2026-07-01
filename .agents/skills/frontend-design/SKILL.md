---
name: frontend-design
description: Guidelines and workflows for crafting premium, highly animated, and responsive frontend experiences using Tailwind CSS, Framer Motion, and Aceternity UI components.
---

# Frontend Design Skill

This skill guides the design and implementation of highly premium frontend user interfaces for AURA, ensuring consistent aesthetics, layouts, and animations.

## Core Design Principles

1. **AI-First & Living Aesthetics**: Use animated, glowing elements (e.g., Background Lines, Gemini Effect orbs, shifting background gradients) to signify AI activity.
2. **Glassmorphic Depth**: Prefer translucent overlays, backdrop blurs, and thin borders over solid cards and heavy outlines.
   - Example class: `bg-white/5 backdrop-blur-xl border border-white/10`
3. **Curated Dark Color System**:
   - Primary: `#7C3AED` (Purple)
   - Secondary / Accent: `#6366F1` (Indigo), `#06B6D4` (Cyan), `#EC4899` (Pink Glow)
   - Backgrounds: Deep space `#0A0A0F` or `#09090B` with layered radial glows
   - Surfaces: Glass Cards with `#111827` base color at low opacity
4. **Fluid Micro-Animations**: Rely on framer-motion transitions with durations between 150ms and 400ms. Avoid bouncy, elastic, or distracting animations.

## Component Layout & Guidelines

- **Typography**: Inter/Plus Jakarta Sans. Maintain hierarchy:
  - Display titles: `56px` (Bold)
  - Headings: `32px` / `24px`
  - Body: `16px`
  - Small: `14px`
- **Spacing**: Multiple of `8px` (`8px`, `16px`, `24px`, `32px`, `40px`, `48px`, `64px`, `80px`).
- **Border Radii**: Cards `20px` (or `24px`), Buttons `16px`, Modals `28px`, Inputs `18px`, Floating Dock `999px`.
- **Icons**: Lucide or Tabler outline icons with `2px` stroke, rounded caps, and monochrome style.

## High-Fidelity Redesigns

For each page, implement:
1. **Dynamic Dashboard**: Animated gradient background, progress ring (success rate), live agent status indicator grid, clear timeline list, and weekly progress charts.
2. **Brain Dump**: Large glowing pink/purple interactive orb container representing the AI, with clean transcript text.
3. **Schedule**: A responsive week selector, active day marker, timeline rows with durations, and clean add buttons.
4. **Tasks**: Tab filters, priorities color-coded, animated check transitions.
5. **Profile**: Background Lines animating behind the user avatar, clean modular settings navigation list.
6. **Save Me**: High-glowing centerpiece double-ring orb, status workload indicators, and checklist items.
