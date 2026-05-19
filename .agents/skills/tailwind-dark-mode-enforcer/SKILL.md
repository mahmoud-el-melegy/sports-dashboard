---
name: tailwind-dark-mode-enforcer
description: Enforces dark mode Tailwind classes. Use when writing 
or reviewing any component that has styling, colors, backgrounds, 
or text colors.
---

# Tailwind Dark Mode Enforcer

Rule: Every Tailwind color class must have a matching dark: variant.
Never add a light mode color without its dark mode pair.

Color System:
- bg-white dark:bg-slate-900 (page background)
- bg-gray-50 dark:bg-slate-800 (cards)
- text-gray-900 dark:text-slate-100 (primary text)
- text-gray-500 dark:text-slate-400 (secondary text)
- border-gray-200 dark:border-slate-700 (borders)
- hover:bg-gray-100 dark:hover:bg-slate-700 (table rows)
- bg-blue-50 dark:bg-blue-900/20 (top 4 rows)
- bg-red-50 dark:bg-red-900/20 (relegation rows)
- bg-gray-200 dark:bg-slate-700 animate-pulse (skeletons)

Checklist before finishing any component:
- Every bg- has a dark:bg-
- Every text- has a dark:text-
- Every border- has a dark:border-
- Hover states have dark variants
- No hardcoded hex colors
