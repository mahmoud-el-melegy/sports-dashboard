import { useQuery } from '@tanstack/react-query';
import { getFixtures } from '../api/footballApi';

export const useFixtures = (leagueId: number, season: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['fixtures', leagueId, season],
    queryFn: () => getFixtures(leagueId, season),
    enabled: !!leagueId && !!season,
  });

  return { data, isLoading, isError };
};
