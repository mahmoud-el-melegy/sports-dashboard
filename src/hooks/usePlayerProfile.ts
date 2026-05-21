import { useQuery } from '@tanstack/react-query';
import { getPlayerById } from '../api/footballApi';

export const usePlayerProfile = (playerId: number, season: number) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['playerProfile', playerId, season],
    queryFn: () => getPlayerById(playerId, season),
    enabled: !!playerId && !!season,
  });

  return { data, isLoading, isError, error, refetch };
};
