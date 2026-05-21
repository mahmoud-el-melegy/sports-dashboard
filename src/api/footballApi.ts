import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'x-apisports-key': import.meta.env.VITE_API_KEY,
  },
});

const handleResponse = (response: any) => {
  const data = response.data;
  if (data.errors) {
    if (typeof data.errors === 'object' && Object.keys(data.errors).length > 0) {
      const errorMessage = Object.values(data.errors).join(', ');
      throw new Error(errorMessage);
    }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      throw new Error(data.errors[0] as string);
    }
  }
  return data;
};

export const getStandings = async (leagueId: number, season: number) => {
  const response = await api.get('/standings', {
    params: {
      league: leagueId,
      season: season,
    },
  });
  return handleResponse(response);
};

export const getFixtures = async (leagueId: number, season: number) => {
  const response = await api.get('/fixtures', {
    params: {
      league: leagueId,
      season: season,
    },
  });
  return handleResponse(response);
};

export const getTopScorers = async (leagueId: number, season: number) => {
  const response = await api.get('/players/topscorers', {
    params: {
      league: leagueId,
      season: season,
    },
  });
  return handleResponse(response);
};

export const searchPlayers = async (name: string, leagueId: number, season: number) => {
  const response = await api.get('/players', {
    params: {
      search: name,
      league: leagueId,
      season: season,
    },
  });
  return handleResponse(response);
};

