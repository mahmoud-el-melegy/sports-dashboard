import React, { useMemo } from 'react';
import { useLeague } from '../contexts/LeagueContext';
import { useStandings } from '../hooks/useStandings';
import Skeleton from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface StandingTeam {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
}

const Standings: React.FC = () => {
  const { selectedLeagueId, season } = useLeague();
  const { data, isLoading, isError } = useStandings(selectedLeagueId, season);

  const standings: StandingTeam[] = useMemo(() => {
    if (data?.response?.[0]?.league?.standings?.[0]) {
      return data.response[0].league.standings[0];
    }
    return [];
  }, [data]);

  const getRowClass = (rank: number, total: number) => {
    if (rank <= 4) return 'bg-blue-50/50 hover:bg-blue-100/50 dark:bg-blue-900/20 dark:hover:bg-blue-900/40';
    if (rank > total - 3) return 'bg-red-50/50 hover:bg-red-100/50 dark:bg-red-900/20 dark:hover:bg-red-900/40';
    return 'hover:bg-gray-50 dark:hover:bg-gray-800/50';
  };

  const getBarColor = (rank: number, total: number) => {
    if (rank <= 4) return '#3b82f6'; // blue-500
    if (rank > total - 3) return '#ef4444'; // red-500
    return '#9ca3af'; // gray-400
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <Skeleton variant="text" className="w-1/4 h-8 mb-6" />
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} variant="table-row" className="h-12" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorMessage message="Failed to load standings. Please try again later." />;
  }

  const chartData = standings.map(s => ({
    name: s.team.name.length > 12 ? s.team.name.substring(0, 10) + '..' : s.team.name,
    fullName: s.team.name,
    points: s.points,
    rank: s.rank
  }));

  const totalTeams = standings.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">League Table</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-300">
              <tr>
                <th className="px-4 py-4 font-semibold w-16">Rank</th>
                <th className="px-4 py-4 font-semibold">Team</th>
                <th className="px-4 py-4 font-semibold text-center w-16">P</th>
                <th className="px-4 py-4 font-semibold text-center w-16">W</th>
                <th className="px-4 py-4 font-semibold text-center w-16">D</th>
                <th className="px-4 py-4 font-semibold text-center w-16">L</th>
                <th className="px-4 py-4 font-semibold text-center w-16 hidden sm:table-cell">GF</th>
                <th className="px-4 py-4 font-semibold text-center w-16 hidden sm:table-cell">GA</th>
                <th className="px-4 py-4 font-semibold text-center w-16">GD</th>
                <th className="px-4 py-4 font-semibold text-center w-16">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {standings.map((s) => (
                <tr 
                  key={s.team.id}
                  className={`transition-colors duration-150 ${getRowClass(s.rank, totalTeams)}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {s.rank}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={s.team.logo} 
                        alt={s.team.name} 
                        className="w-8 h-8 object-contain"
                        loading="lazy"
                      />
                      <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                        {s.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{s.all.played}</td>
                  <td className="px-4 py-3 text-center">{s.all.win}</td>
                  <td className="px-4 py-3 text-center">{s.all.draw}</td>
                  <td className="px-4 py-3 text-center">{s.all.lose}</td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">{s.all.goals.for}</td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">{s.all.goals.against}</td>
                  <td className="px-4 py-3 text-center font-medium">
                    <span className={s.goalsDiff > 0 ? 'text-green-600 dark:text-green-400' : s.goalsDiff < 0 ? 'text-red-600 dark:text-red-400' : ''}>
                      {s.goalsDiff > 0 ? `+${s.goalsDiff}` : s.goalsDiff}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white text-base">
                    {s.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Points Distribution</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-gray-800" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                interval={0}
                tick={{ fill: 'currentColor' }}
                className="text-gray-500 dark:text-gray-400 text-xs"
                height={80}
              />
              <YAxis 
                tick={{ fill: 'currentColor' }}
                className="text-gray-500 dark:text-gray-400 text-sm"
              />
              <Tooltip
                cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl rounded-lg p-3">
                        <p className="font-semibold text-gray-900 dark:text-white mb-1">
                          {payload[0].payload.fullName}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {payload[0].value} Points
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.rank, totalTeams)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Standings;
