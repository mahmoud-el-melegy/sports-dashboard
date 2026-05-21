import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, UserX, Award, Activity, Calendar, MapPin, X } from 'lucide-react';
import { useLeague } from '../contexts/LeagueContext';
import { useDebounce } from '../hooks/useDebounce';
import { useSearchPlayers } from '../hooks/useSearchPlayers';
import Skeleton from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';
import ImageWithFallback from '../components/ui/ImageWithFallback';

interface PlayerSearchResult {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
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
      total: number | null;
      assists: number | null;
    };
  }>;
}

const Search: React.FC = () => {
  const { selectedLeagueId, selectedSeason, leagues } = useLeague();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const activeLeagueName = leagues.find((l) => l.id === selectedLeagueId)?.name || 'Selected League';

  const { data, isLoading, isError, error, refetch } = useSearchPlayers(
    debouncedSearchTerm,
    selectedLeagueId,
    selectedSeason
  );

  const players: PlayerSearchResult[] = data?.response || [];
  const showResults = debouncedSearchTerm.trim().length >= 3;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Search Header & Input */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Discover Football Stars
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Find stats, goals, and details for players in <span className="font-semibold text-indigo-600 dark:text-indigo-400">{activeLeagueName}</span> during the <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedSeason}</span> season.
        </p>

        {/* Center Search Input Box */}
        <div className="relative max-w-xl mx-auto mt-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search players by name (e.g. Messi, Ronaldo, Mbappe)..."
            className="block w-full pl-11 pr-12 py-3.5 sm:py-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-md transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Helper Hint */}
        {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
          <p className="text-xs text-amber-500 dark:text-amber-400 animate-pulse">
            Keep typing! Need at least 3 characters to search.
          </p>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {/* Loading Skeletons */}
        {isLoading && showResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center space-x-4">
                  <Skeleton variant="circle" className="w-16 h-16 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-3/4" />
                    <Skeleton variant="text" className="w-1/2" />
                  </div>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                  <Skeleton variant="text" className="w-full" />
                  <div className="flex justify-between pt-2">
                    <Skeleton variant="text" className="w-1/3" />
                    <Skeleton variant="text" className="w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && showResults && !isLoading && (
          <div className="max-w-xl mx-auto py-8">
            <ErrorMessage
              message={(error as Error)?.message || 'Failed to search players. Please try again later.'}
              onRetry={refetch}
            />
          </div>
        )}

        {/* Initial Empty / Prompt State */}
        {!showResults && !isLoading && !isError && (
          <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="inline-flex p-3 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <SearchIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ready to Search</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Type at least 3 characters in the search bar above to fetch matching player statistics from our sports database.
            </p>
          </div>
        )}

        {/* Friendly Empty State (No results found) */}
        {showResults && !isLoading && !isError && players.length === 0 && (
          <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm max-w-lg mx-auto space-y-4 animate-fade-in">
            <div className="inline-flex p-3 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
              <UserX className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Players Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We couldn't find any players named "{debouncedSearchTerm}" in {activeLeagueName} for the {selectedSeason} season.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Tip: Double-check spelling or try changing the active league and season using the selector above.
            </p>
          </div>
        )}

        {/* Search Results Grid */}
        {showResults && !isLoading && !isError && players.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((item) => {
              const { player, statistics } = item;
              const stats = statistics[0]; // Active league/season stats
              const team = stats?.team;
              const goals = stats?.goals?.total || 0;
              const assists = stats?.goals?.assists || 0;

              return (
                <Link
                  key={player.id}
                  to={`/player/${player.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top: Photo & Basic Details */}
                    <div className="flex items-center space-x-4">
                      <ImageWithFallback
                        src={player.photo}
                        alt={player.name}
                        fallbackType="player"
                        skeletonVariant="circle"
                        className="w-16 h-16 rounded-full border-2 border-indigo-50 dark:border-indigo-950/50 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 truncate">
                          {player.name}
                        </h2>
                        
                        {/* Age & Nationality */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {player.age} yrs
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            {player.nationality}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Club */}
                    {team && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100/50 dark:border-gray-700/30">
                        <ImageWithFallback
                          src={team.logo}
                          alt={team.name}
                          fallbackType="team"
                          skeletonVariant="circle"
                          className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-white dark:bg-gray-900 p-0.5"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                          {team.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Performance Stats */}
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {/* Goals */}
                      <div className="flex items-center gap-1.5">
                        <div className="p-1 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Goals</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white leading-none mt-0.5">{goals}</span>
                        </div>
                      </div>

                      {/* Assists */}
                      <div className="flex items-center gap-1.5">
                        <div className="p-1 rounded-lg bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Assists</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white leading-none mt-0.5">{assists}</span>
                        </div>
                      </div>
                    </div>

                    {/* Nav Arrow Indicator */}
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      View Profile &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
