import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LeagueProvider } from './contexts/LeagueContext';
import Standings from './pages/Standings';
import Fixtures from './pages/Fixtures';
import TopScorers from './pages/TopScorers';
import './App.css';

const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Router>
        <Routes>
          <Route path="/" element={<Standings />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/top-scorers" element={<TopScorers />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LeagueProvider>
          <AppContent />
        </LeagueProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
