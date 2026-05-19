---
name: api-error-handler
description: Handles API loading and error states. Use when fetching 
data from API-Football, writing hooks, or building any component 
that displays data from the API.
---

# API Error Handler

Rule: Every component that fetches data must handle three states:
loading, error, success. Never skip loading or error states.

Standard Pattern:
const { data, isLoading, isError, refetch } = useYourHook(leagueId, season)
if (isLoading) return <Skeleton variant="table" />
if (isError) return <ErrorMessage message="Failed to load data" onRetry={refetch} />
return <YourComponent data={data} />

Skeleton Variants:
- variant="table" for standings and top scorers
- variant="card" for fixture cards
- variant="circle" for player/team photos
- variant="text" for single lines of text

API-Football Rules:
- Free tier is 100 requests/day, never fetch inside a loop
- Always pass both leagueId and season to every hook
- Current season is 2024
- Cache time should be at least 5 minutes (300000ms)
- If response is empty array show empty state not an error

Empty State Pattern:
if (data?.response?.length === 0) return (
  <div className="text-center text-gray-500 dark:text-slate-400 py-12">
    No data available for this league.
  </div>
)

Never do this:
- Fetch directly with axios inside a component
- Use data! without checking isLoading first
- Show raw API error messages to the user
- Fetch without a loading state
