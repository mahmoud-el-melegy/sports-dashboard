import { useQuery } from '@tanstack/react-query';
import { getTopScorers } from '../api/footballApi';

export const useTopScorers = (leagueId: number, season: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['topScorers', leagueId, season],
    queryFn: () => getTopScorers(leagueId, season),
    enabled: !!leagueId && !!season,
  });

  return { data, isLoading, isError };
};
