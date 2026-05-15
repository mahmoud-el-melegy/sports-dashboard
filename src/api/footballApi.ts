import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'x-apisports-key': import.meta.env.VITE_API_KEY,
  },
});

export const getStandings = async (leagueId: number, season: number) => {
  const response = await api.get('/standings', {
    params: {
      league: leagueId,
      season: season,
    },
  });
  return response.data;
};

export const getFixtures = async (leagueId: number, season: number) => {
  const response = await api.get('/fixtures', {
    params: {
      league: leagueId,
      season: season,
    },
  });
  return response.data;
};

export const getTopScorers = async (leagueId: number, season: number) => {
  const response = await api.get('/players/topscorers', {
    params: {
      league: leagueId,
      season: season,
    },
  });
  return response.data;
};
