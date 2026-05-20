import { useLeague } from '../contexts/LeagueContext';

export default function LeagueSelector() {
  const { 
    leagues, selectedLeagueId, setSelectedLeagueId,
    seasons, selectedSeason, setSelectedSeason
  } = useLeague();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="flex flex-row items-center justify-between py-3 gap-3">
          <div className="flex overflow-x-auto gap-2 sm:gap-4 items-center no-scrollbar flex-1">
            {leagues.map((league) => (
              <button
                key={league.id}
                onClick={() => setSelectedLeagueId(league.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedLeagueId === league.id
                    ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>

          <div className="relative flex-shrink-0">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm rounded-full pl-4 pr-9 py-2 outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer border border-transparent shadow-sm"
            >
              {seasons.map(season => (
                <option key={season} value={season}>
                  {season}-{season + 1}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
