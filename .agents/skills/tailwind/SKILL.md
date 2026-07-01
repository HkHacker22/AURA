---
name: tailwind
description: Reference guidelines for coding with Tailwind CSS, custom animations, responsive grid/flexbox layouts, HSL variables, and glassmorphism styling.
---

# Tailwind CSS Design Skill

This skill enforces best practices when implementing layouts, colors, responsive behaviors, and animations using Tailwind CSS.

## 1. Color Variables & Themes
- Use semantic HSL CSS variables inside `globals.css` and map them in `tailwind.config.js`.
- Always verify contrast ratio (WCAG AA compliance) for text components.

## 2. Flexbox & Grid Systems
- Prefer standard 12-column grid systems for complex dashboard layouts:
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-6">
  ```
- Use `flex flex-col` or `flex items-center justify-between` to build clean, flexible rows and columns.

## 3. Responsive Breakpoints
- Mobile-first approach: write base classes for mobile, then apply md: (768px), lg: (1024px), xl: (1280px) and 2xl: (1536px) for larger screens.
  - Mobile: `p-4 flex-col`
  - Desktop: `md:p-8 md:flex-row`

## 4. Glassmorphism Utilities
- Utilize Tailwind's backdrop-blur and border-opacity properties:
  - Base glass card: `bg-white/5 backdrop-blur-xl border border-white/10`
  - Elevated glass card: `bg-white/10 backdrop-blur-2xl border border-white/15`
  - Floating items: `shadow-2xl shadow-purple-500/10`

## 5. Animation Helpers
- Use Tailwind's transition properties: `transition-all duration-300 ease-in-out`
- Hover transformations: `hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg`
