import { useQuery } from '@tanstack/react-query';
import { searchPlayers } from '../api/footballApi';

export const useSearchPlayers = (name: string, leagueId: number, season: number) => {
  const cleanName = name.trim();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['searchPlayers', cleanName, leagueId, season],
    queryFn: () => searchPlayers(cleanName, leagueId, season),
    enabled: cleanName.length >= 3 && !!leagueId && !!season,
    retry: 1,
  });

  return { data, isLoading, isError, error, refetch };
};
