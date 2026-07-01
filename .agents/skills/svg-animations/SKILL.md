---
name: svg-animations
description: Reference guidelines for coding with animated SVGs, path tracing, neon glow filters, rotating particles, and responsive vector shapes.
---

# SVG Animations Skill

This skill guides the design and implementation of highly creative, animated, and glowing SVG vectors for AURA.

## 1. Neon Glow Filters
- Standardize a premium neon glow filter in SVGs to apply to paths and circles:
  ```xml
  <defs>
    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  ```

## 2. Animated Path Tracing
- Use `framer-motion` to trace SVG paths by setting `strokeDasharray` and animating `strokeDashoffset`:
  ```tsx
  <motion.path
    d="M..."
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2, ease: "easeInOut" }}
  />
  ```

## 3. Shifting Gradients
- Define radial and linear gradients to give icons and buttons depth:
  ```xml
  <linearGradient id="purple-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#7C3AED" />
    <stop offset="100%" stopColor="#06B6D4" />
  </linearGradient>
  ```

## 4. Rotating and Pulsating Rings
- Apply infinite rotations and scales to orb vectors to signify active AI reasoning:
  ```tsx
  <motion.svg
    animate={{ rotate: 360 }}
    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
  />
  ```
