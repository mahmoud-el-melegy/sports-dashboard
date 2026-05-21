import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Ruler,
  Weight,
  Trophy,
  Crosshair,
  Eye,
  Clock,
  Target,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useLeague } from '../contexts/LeagueContext';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import Skeleton from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';
import ImageWithFallback from '../components/ui/ImageWithFallback';

interface PlayerData {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: {
      date: string;
      place: string | null;
      country: string;
    };
    nationality: string;
    height: string | null;
    weight: string | null;
    photo: string;
  };
  statistics: Array<{
    team: {
      id: number;
      name: string;
      logo: string;
    };
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string | null;
      season: number;
    };
    games: {
      appearences: number | null;
      lineups: number | null;
      minutes: number | null;
      position: string | null;
      rating: string | null;
    };
    goals: {
      total: number | null;
      conceded: number | null;
      assists: number | null;
    };
    passes: {
      total: number | null;
      key: number | null;
      accuracy: number | null;
    };
    shots: {
      total: number | null;
      on: number | null;
    };
    cards: {
      yellow: number | null;
      red: number | null;
    };
  }>;
}

/* ────────────────────────────── Stat Card Component ────────────────────────────── */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 flex flex-col items-center text-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
    <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-none">
      {value}
    </span>
    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

/* ────────────────────────── Custom Tooltip for Recharts ────────────────────────── */

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { season: string } }>;
  label?: string;
  dataLabel: string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, dataLabel }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Season {payload[0].payload.season}
        </p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {payload[0].value} {dataLabel}
        </p>
      </div>
    );
  }
  return null;
};

/* ──────────────────────────────── Main Page ──────────────────────────────── */

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedSeason } = useLeague();
  const playerId = Number(id);

  const { data, isLoading, isError, error, refetch } = usePlayerProfile(playerId, selectedSeason);

  /* ─── Loading State ─── */
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Back button skeleton */}
        <Skeleton variant="text" className="w-28 h-9 rounded-xl" />

        {/* Hero skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Skeleton variant="circle" className="w-28 h-28 sm:w-36 sm:h-36" />
            <div className="flex-1 space-y-3 text-center sm:text-left w-full">
              <Skeleton variant="text" className="w-2/3 h-8 mx-auto sm:mx-0" />
              <Skeleton variant="text" className="w-1/2 h-4 mx-auto sm:mx-0" />
              <Skeleton variant="text" className="w-1/3 h-4 mx-auto sm:mx-0" />
              <div className="flex justify-center sm:justify-start gap-3 pt-2">
                <Skeleton variant="text" className="w-20 h-8 rounded-lg" />
                <Skeleton variant="text" className="w-20 h-8 rounded-lg" />
                <Skeleton variant="text" className="w-20 h-8 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-36 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  /* ─── Error State ─── */
  if (isError || !data) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <ErrorMessage
          message={(error as Error)?.message || 'Failed to load player data. Please try again.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const playerData: PlayerData | undefined = data?.response?.[0];

  if (!playerData) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <ErrorMessage message="Player not found." />
      </div>
    );
  }

  const { player, statistics } = playerData;
  const stats = statistics[0];

  const goals = stats?.goals?.total ?? 0;
  const assists = stats?.goals?.assists ?? 0;
  const appearances = stats?.games?.appearences ?? 0;
  const minutes = stats?.games?.minutes ?? 0;
  const yellowCards = stats?.cards?.yellow ?? 0;
  const redCards = stats?.cards?.red ?? 0;
  const passAccuracy = stats?.passes?.accuracy ?? 0;
  const shotsTotal = stats?.shots?.total ?? 0;
  const shotsOn = stats?.shots?.on ?? 0;
  const shotAccuracy = shotsTotal > 0 ? Math.round((shotsOn / shotsTotal) * 100) : 0;
  const position = stats?.games?.position ?? 'N/A';

  /* ─── Chart Data from all statistics entries (each stat = different league/season combo) ─── */
  const goalsChartData = statistics.map((s) => ({
    season: String(s.league.season),
    goals: s.goals.total ?? 0,
    league: s.league.name,
  }));

  const assistsChartData = statistics.map((s) => ({
    season: String(s.league.season),
    assists: s.goals.assists ?? 0,
    league: s.league.name,
  }));

  const barColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#6366f1'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ─── Back Button ─── */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* ─── Hero Section ─── */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-md">
        {/* Decorative gradient band */}
        <div className="absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 dark:from-indigo-600 dark:via-purple-700 dark:to-indigo-800" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          {/* Player Photo */}
          <div className="mt-8 sm:mt-12">
            <ImageWithFallback
              src={player.photo}
              alt={player.name}
              fallbackType="player"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-white dark:bg-gray-900"
            />
          </div>

          {/* Player Info */}
          <div className="flex-1 text-center sm:text-left mt-4 sm:mt-14 space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">
              {player.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-500" />
                {player.nationality}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                {player.age} years old
              </span>
              {stats?.team && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="inline-flex items-center gap-1.5">
                    <ImageWithFallback
                      src={stats.team.logo}
                      alt={stats.team.name}
                      fallbackType="team"
                      className="w-5 h-5 rounded-full overflow-hidden"
                    />
                    <span className="font-medium">{stats.team.name}</span>
                  </span>
                </>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wide">
                {position}
              </span>
              {player.height && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                  <Ruler className="w-3.5 h-3.5" />
                  {player.height}
                </span>
              )}
              {player.weight && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                  <Weight className="w-3.5 h-3.5" />
                  {player.weight}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Season Stats Cards ─── */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
          Season {selectedSeason} Statistics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Goals"
            value={goals}
            color="bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400"
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Assists"
            value={assists}
            color="bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400"
          />
          <StatCard
            icon={<Eye className="w-5 h-5" />}
            label="Appearances"
            value={appearances}
            color="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Minutes"
            value={minutes.toLocaleString()}
            color="bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400"
          />
          <StatCard
            icon={
              <div className="w-4 h-5 bg-yellow-400 rounded-sm" />
            }
            label="Yellow Cards"
            value={yellowCards}
            color="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400"
          />
          <StatCard
            icon={
              <div className="w-4 h-5 bg-red-500 rounded-sm" />
            }
            label="Red Cards"
            value={redCards}
            color="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
          />
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Pass Accuracy"
            value={`${passAccuracy}%`}
            color="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            icon={<Crosshair className="w-5 h-5" />}
            label="Shot Accuracy"
            value={`${shotAccuracy}%`}
            color="bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400"
          />
        </div>
      </div>

      {/* ─── Charts Section ─── */}
      {statistics.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Goals Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
              Goals by Competition
            </h3>
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalsChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis
                    dataKey="league"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip dataLabel="Goals" />} />
                  <Bar dataKey="goals" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {goalsChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Assists Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
              Assists by Competition
            </h3>
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assistsChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis
                    dataKey="league"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip dataLabel="Assists" />} />
                  <Bar dataKey="assists" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {assistsChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerProfile;
