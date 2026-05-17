import { useLeague } from '../contexts/LeagueContext';

export default function LeagueSelector() {
  const { leagues, selectedLeagueId, setSelectedLeagueId } = useLeague();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="flex overflow-x-auto py-3 gap-2 sm:gap-4 items-center no-scrollbar">
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
      </div>
    </div>
  );
}
