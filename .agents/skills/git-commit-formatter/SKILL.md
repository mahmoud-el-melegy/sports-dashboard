---
name: git-commit-formatter
description: Formats git commit messages. Use when committing code, 
suggesting a commit message, or asking what to write in a git commit.
---

# Git Commit Formatter

Always format commit messages using this exact convention:

Prefixes:
- feat: new feature or component
- fix: bug fix
- docs: documentation changes
- style: styling, dark mode, responsive changes
- refactor: code restructure without behavior change
- test: adding or updating tests
- chore: config, dependencies, tooling

Rules:
- Always lowercase
- No period at the end
- Keep it under 60 characters
- Be specific about what was built

Examples:
feat: build standings page with table and bar chart
feat: add league selector component
fix: fix dark mode not persisting on refresh
style: make fixtures page responsive on mobile
docs: add readme and development guide
