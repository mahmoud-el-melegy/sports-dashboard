import React, { useState, useMemo } from 'react';
import { useLeague } from '../contexts/LeagueContext';
import { useFixtures } from '../hooks/useFixtures';
import Skeleton from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';

interface FixtureData {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      elapsed: number | null;
    };
  };
  teams: {
    home: { name: string; logo: string; };
    away: { name: string; logo: string; };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

type FilterType = 'All' | 'Upcoming' | 'Results';

const LIVE_STATUSES = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'];
const FINISHED_STATUSES = ['FT', 'AET', 'PEN'];
const UPCOMING_STATUSES = ['NS', 'TBD'];

const Fixtures: React.FC = () => {
  const { selectedLeagueId, selectedSeason } = useLeague();
  const { data, isLoading, isError, error } = useFixtures(selectedLeagueId, selectedSeason);
  const [filter, setFilter] = useState<FilterType>('All');

  const fixtures: FixtureData[] = useMemo(() => {
    return data?.response || [];
  }, [data]);

  const filteredFixtures = useMemo(() => {
    return fixtures.filter(item => {
      const status = item.fixture.status.short;
      if (filter === 'Upcoming') {
        return UPCOMING_STATUSES.includes(status);
      }
      if (filter === 'Results') {
        return FINISHED_STATUSES.includes(status);
      }
      return true; // 'All'
    });
  }, [fixtures, filter]);

  const groupedFixtures = useMemo(() => {
    const groups: Record<string, FixtureData[]> = {};
    filteredFixtures.forEach(item => {
      const dateObj = new Date(item.fixture.date);
      const dateKey = dateObj.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });
    return groups;
  }, [filteredFixtures]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          {[1, 2, 3].map(i => <Skeleton key={i} variant="text" className="h-10 w-24 rounded-full" />)}
        </div>
        {[1, 2].map(group => (
          <div key={group} className="space-y-4">
            <Skeleton variant="text" className="h-6 w-48 mb-2" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(card => (
                <Skeleton key={card} variant="card" className="h-32" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorMessage message={(error as Error)?.message || "Failed to load fixtures. Please try again later."} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {(['All', 'Upcoming', 'Results'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
              filter === f 
                ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Fixtures List */}
      <div className="space-y-10">
        {Object.entries(groupedFixtures).map(([date, matches]) => (
          <div key={date} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white sticky top-0 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur py-2 z-10 border-b border-gray-200 dark:border-gray-800">
              {date}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {matches.map((match) => {
                const status = match.fixture.status.short;
                const isLive = LIVE_STATUSES.includes(status);
                const isFinished = FINISHED_STATUSES.includes(status);
                const isUpcoming = UPCOMING_STATUSES.includes(status);
                
                const time = new Date(match.fixture.date).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div 
                    key={match.fixture.id}
                    className={`flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all ${
                      isFinished ? 'opacity-70 grayscale-[0.2]' : ''
                    } hover:border-gray-300 dark:hover:border-gray-600`}
                  >
                    {/* Home Team */}
                    <div className="flex flex-col items-center flex-1 text-center gap-2">
                      <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-12 h-12 object-contain" loading="lazy" />
                      <span className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                        {match.teams.home.name}
                      </span>
                    </div>

                    {/* Score / Time */}
                    <div className="flex flex-col items-center justify-center flex-[1.5] px-2">
                      <div className="flex items-center justify-center space-x-3 mb-1">
                        {isUpcoming ? (
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {time}
                          </span>
                        ) : (
                          <>
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                              {match.goals.home ?? '-'}
                            </span>
                            <span className="text-xl text-gray-400 mx-1">-</span>
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                              {match.goals.away ?? '-'}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-center gap-1.5 mt-1">
                        {isLive && (
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          </span>
                        )}
                        <span className={`text-xs font-medium uppercase px-2 py-0.5 rounded ${
                          isLive 
                            ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                            : isFinished 
                              ? 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'
                              : 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
                        }`}>
                          {status === 'NS' ? 'Upcoming' : status === 'FT' ? 'Full Time' : status === 'HT' ? 'Half Time' : status}
                          {isLive && match.fixture.status.elapsed ? ` ${match.fixture.status.elapsed}'` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center flex-1 text-center gap-2">
                      <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-12 h-12 object-contain" loading="lazy" />
                      <span className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                        {match.teams.away.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {Object.keys(groupedFixtures).length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
            No fixtures found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default Fixtures;
