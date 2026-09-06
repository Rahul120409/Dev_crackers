'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Bell,
  Search,
  ChevronDown,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onTriggerRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onTriggerRefresh, isRefreshing = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { portfolio, availablePortfolios, switchPortfolioByName } = usePortfolio();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolio?.portfolioName || 'Institutional Capital Alpha Book');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (portfolio?.portfolioName) {
      setSelectedPortfolio(portfolio.portfolioName);
    }
  }, [portfolio?.portfolioName]);

  const displayName = user?.name || user?.username || 'Alex Morgan';
  const displayRole = user?.role
    ? user.role.startsWith('ROLE_')
      ? user.role.replace('ROLE_', '').replace(/_/g, ' ')
      : user.role
    : 'Risk Manager';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || displayName.slice(0, 2).toUpperCase() || 'AM';

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' • ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }) + ' IST';
      setCurrentTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#0077b6]/20 dark:border-slate-800 px-6 flex items-center justify-between z-10 shrink-0 select-none transition-colors">
      {/* Title & Live Timestamp */}
      <div className="flex items-center gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-black text-[#03045e] dark:text-white tracking-tight">Executive Dashboard</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#caf0f8] text-[#03045e] dark:bg-cyan-500/10 dark:text-cyan-300 border border-[#0077b6]/30 dark:border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0077b6] dark:bg-cyan-400 animate-pulse" />
              Live Feed
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#0077b6] dark:text-slate-400 mt-0.5 font-mono font-medium">
            <Calendar className="w-3 h-3 text-[#0077b6] dark:text-cyan-400" />
            <span>{currentTime || 'Sep 5, 2026 • 15:14:00 IST'}</span>
          </div>
        </div>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-3.5">
        {/* Portfolio Selector */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-[#caf0f8]/30 hover:bg-[#caf0f8]/60 dark:bg-slate-950/80 dark:hover:bg-slate-800/80 border border-[#0077b6]/30 dark:border-slate-700/80 rounded-xl px-3 py-1.5 cursor-pointer transition-colors text-xs text-[#03045e] dark:text-slate-200 font-bold shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#0077b6] dark:text-cyan-400" />
            <select
              value={selectedPortfolio}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedPortfolio(val);
                switchPortfolioByName(val);
              }}
              className="bg-transparent border-none outline-none cursor-pointer pr-4 font-bold text-[#03045e] dark:text-slate-200"
            >
              {availablePortfolios.map((p) => (
                <option
                  key={p.portfolioName}
                  value={p.portfolioName}
                  className="bg-white dark:bg-slate-900 text-[#03045e] dark:text-slate-100"
                >
                  {p.portfolioName} (₹{p.totalCapitalCr.toLocaleString()} Cr)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Refresh Action */}
        <button
          onClick={onTriggerRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-xs font-bold text-[#03045e] hover:text-black dark:text-slate-300 dark:hover:text-white bg-white hover:bg-[#caf0f8]/50 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-[#0077b6]/30 dark:border-slate-700 rounded-xl px-3 py-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          title="Recompute Risk & Metrics"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#0077b6] dark:text-cyan-400 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
          <span className="hidden sm:inline font-mono">{isRefreshing ? 'Recalculating...' : 'Sync Data'}</span>
        </button>

        {/* Status indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#caf0f8] dark:bg-cyan-500/10 text-[#03045e] dark:text-cyan-300 border border-[#0077b6]/30 dark:border-cyan-500/30 text-[11px] font-bold font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-cyan-400" />
          <span>Core: Nominal</span>
        </div>

        {/* Theme Toggle: Light / Dark Mode with #CAF0F8 Ice Accent */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl border transition-all cursor-pointer shadow-xs bg-[#caf0f8] hover:bg-[#def6fa] text-[#03045e] border-[#0077b6]/40 dark:bg-slate-800/90 dark:hover:bg-slate-700 dark:text-cyan-300 dark:border-cyan-500/40"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#0077b6]" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#03045e] hover:text-black dark:text-slate-300 dark:hover:text-white bg-white hover:bg-[#caf0f8]/50 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-[#0077b6]/30 dark:border-slate-700 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#0077b6] dark:text-slate-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-[#caf0f8] dark:border-slate-700 p-3.5 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">System Notifications</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 font-semibold px-1.5 py-0.5 rounded">
                  3 Active
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-2.5">
                  <p className="font-semibold text-slate-900 dark:text-slate-200">Concentration Breach Alert</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Equity/Loan sub-tranche crossed 35% threshold.</p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">12 mins ago</span>
                </div>
                <div className="py-2.5">
                  <p className="font-semibold text-slate-900 dark:text-slate-200">Stress Test Engine Ready</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Markowitz-Liquidity simulation ready to review.</p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic User Avatar Mini */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#caf0f8] dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0077b6] to-[#00b4d8] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#caf0f8] dark:ring-cyan-500/40 shadow-xs">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[130px]" title={displayName}>
              {displayName}
            </div>
            <div className="text-[10px] text-[#0077b6] dark:text-cyan-300 font-medium font-mono capitalize truncate max-w-[130px]" title={displayRole}>
              {displayRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

