import React, { createContext, useContext, useState } from 'react';

export interface League {
  id: number;
  name: string;
}

export const SUPPORTED_LEAGUES: League[] = [
  { id: 39, name: 'Premier League' },
  { id: 140, name: 'La Liga' },
  { id: 135, name: 'Serie A' },
  { id: 78, name: 'Bundesliga' },
  { id: 61, name: 'Ligue 1' },
];

export const SUPPORTED_SEASONS: number[] = Array.from(
  { length: 2025 - 2006 + 1 },
  (_, i) => 2025 - i
);

interface LeagueContextType {
  selectedLeagueId: number;
  setSelectedLeagueId: (id: number) => void;
  selectedSeason: number;
  setSelectedSeason: (season: number) => void;
  leagues: League[];
  seasons: number[];
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const LeagueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLeagueId, setSelectedLeagueId] = useState<number>(39); // Default to Premier League (id: 39)
  const [selectedSeason, setSelectedSeason] = useState<number>(2024); // Default season to 2024

  return (
    <LeagueContext.Provider
      value={{
        selectedLeagueId,
        setSelectedLeagueId,
        selectedSeason,
        setSelectedSeason,
        leagues: SUPPORTED_LEAGUES,
        seasons: SUPPORTED_SEASONS,
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
};
