---
name: react-component-generator
description: Generates React components for this project. Use when 
creating a new page, component, or UI element in src/pages or 
src/components.
---

# React Component Generator

Project Stack:
- React 18 + TypeScript + Vite
- Tailwind CSS with dark mode (dark: classes)
- React Query for data fetching
- Recharts for charts
- Lucide React for icons

Available Hooks (always use these, never fetch directly):
- useStandings(leagueId, season) from src/hooks/useStandings.ts
- useFixtures(leagueId, season) from src/hooks/useFixtures.ts
- useTopScorers(leagueId, season) from src/hooks/useTopScorers.ts
- useLeague() from src/contexts/LeagueContext.tsx
- useTheme() from src/contexts/ThemeContext.tsx

Available UI Components (always use these):
- Skeleton from src/components/ui/Skeleton.tsx for loading states
- ErrorMessage from src/components/ui/ErrorMessage.tsx for error states

Every page must follow this pattern:
const { data, isLoading, isError, refetch } = useYourHook(
  selectedLeague.id, selectedLeague.season
)
if (isLoading) return <Skeleton variant="table" />
if (isError) return <ErrorMessage message="..." onRetry={refetch} />

Dark Mode Color Palette:
- Page background: bg-white dark:bg-slate-900
- Cards: bg-gray-50 dark:bg-slate-800
- Primary text: text-gray-900 dark:text-slate-100
- Secondary text: text-gray-500 dark:text-slate-400
- Border: border-gray-200 dark:border-slate-700
