import React, { useState } from 'react';
import { useLeague } from '../contexts/LeagueContext';
import { useTopScorers } from '../hooks/useTopScorers';
import Skeleton from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';

interface PlayerStats {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    photo: string;
    nationality: string;
  };
  statistics: Array<{
    team: {
      id: number;
      name: string;
      logo: string;
    };
    goals: {
      total: number;
      assists: number | null;
    };
    cards: {
      yellow: number | null;
      red: number | null;
    };
  }>;
}

const PlayerImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return <Skeleton variant="circle" className="flex-shrink-0" />;
  }

  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      {!loaded && <Skeleton variant="circle" className="absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-12 h-12 rounded-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

const TopScorers: React.FC = () => {
  const { selectedLeagueId, season } = useLeague();
  const { data, isLoading, isError } = useTopScorers(selectedLeagueId, season);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <Skeleton variant="circle" className="w-8 h-8 flex-shrink-0" />
            <Skeleton variant="circle" className="w-12 h-12 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="w-1/3" />
              <Skeleton variant="text" className="w-1/4" />
            </div>
            <div className="hidden sm:flex space-x-4">
              <Skeleton variant="text" className="w-12" />
              <Skeleton variant="text" className="w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <ErrorMessage message="Failed to load top scorers data. Please try again later." />
      </div>
    );
  }

  const scorers: PlayerStats[] = data?.response || [];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Top Scorers
          </h2>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {scorers.map((item, index) => {
            const player = item.player;
            const stats = item.statistics[0];

            let rankClass =
              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm';
            if (index === 0)
              rankClass +=
                ' bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-500';
            else if (index === 1)
              rankClass +=
                ' bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
            else if (index === 2)
              rankClass +=
                ' bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-500';
            else
              rankClass +=
                ' bg-gray-50 text-gray-500 dark:bg-gray-800/80 dark:text-gray-400 shadow-none';

            const rowBg =
              index % 2 === 0
                ? 'bg-white dark:bg-gray-800'
                : 'bg-gray-50/50 dark:bg-gray-800/50';

            return (
              <div
                key={player.id}
                className={`p-4 sm:p-5 flex items-center gap-3 sm:gap-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${rowBg}`}
              >
                <div className="flex-shrink-0 sm:mr-1">
                  <div className={rankClass}>{index + 1}</div>
                </div>

                <PlayerImage src={player.photo} alt={player.name} />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                    <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                      {player.name}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {player.nationality}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 sm:mt-0.5">
                    <img
                      src={stats.team.logo}
                      alt={stats.team.name}
                      className="w-4 h-4 object-contain"
                    />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
                      {stats.team.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6 ml-2">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div className="flex flex-col items-center sm:items-end">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">
                        {stats.goals.total || 0}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mt-1 tracking-wider">
                        Goals
                      </div>
                    </div>

                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                    <div className="flex flex-col items-center sm:items-end">
                      <div className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 leading-none mt-1 sm:mt-0">
                        {stats.goals.assists || 0}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mt-1 tracking-wider">
                        Assists
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 sm:w-12 justify-end mt-1 sm:mt-0">
                    {stats.cards.yellow !== null && stats.cards.yellow > 0 && (
                      <div
                        className="w-4 h-5 sm:w-5 sm:h-6 bg-yellow-400 rounded flex items-center justify-center text-[10px] sm:text-xs font-bold text-yellow-900 shadow-sm"
                        title="Yellow Cards"
                      >
                        {stats.cards.yellow}
                      </div>
                    )}
                    {stats.cards.red !== null && stats.cards.red > 0 && (
                      <div
                        className="w-4 h-5 sm:w-5 sm:h-6 bg-red-500 rounded flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-sm"
                        title="Red Cards"
                      >
                        {stats.cards.red}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopScorers;
