import { useQuery } from '@tanstack/react-query';
import { getStandings } from '../api/footballApi';

export const useStandings = (leagueId: number, season: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['standings', leagueId, season],
    queryFn: () => getStandings(leagueId, season),
    enabled: !!leagueId && !!season,
  });

  return { data, isLoading, isError };
};
