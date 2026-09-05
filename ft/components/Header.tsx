'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface HeaderProps {
  onTriggerRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onTriggerRefresh, isRefreshing = false }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedPortfolio, setSelectedPortfolio] = useState('Institutional Treasury Core Book (₹100 Cr)');
  const [showNotifications, setShowNotifications] = useState(false);

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
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shrink-0">
      {/* Title & Live Timestamp */}
      <div className="flex items-center gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{currentTime || 'Sep 5, 2026 • 15:14:00 IST'}</span>
          </div>
        </div>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-4">
        {/* Portfolio Selector */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer transition-colors text-xs text-slate-800 font-medium shadow-sm">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={selectedPortfolio}
              onChange={(e) => setSelectedPortfolio(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer pr-4 font-semibold text-slate-800"
            >
              <option value="Institutional Treasury Core Book (₹100 Cr)">Institutional Treasury Core Book (₹100 Cr)</option>
              <option value="Global Liquidity & Sovereign Reserve (₹45 Cr)">Global Liquidity & Sovereign Reserve (₹45 Cr)</option>
              <option value="Commercial Credit Portfolio Beta (₹150 Cr)">Commercial Credit Portfolio Beta (₹150 Cr)</option>
            </select>
          </div>
        </div>

        {/* Refresh Action */}
        <button
          onClick={onTriggerRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors shadow-sm disabled:opacity-50"
          title="Recompute Risk & Metrics"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          <span className="hidden sm:inline">{isRefreshing ? 'Recalculating...' : 'Sync Data'}</span>
        </button>

        {/* Status indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[11px] font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Core Engine: Nominal</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">System Notifications</span>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-1.5 py-0.5 rounded">
                  3 Active
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2">
                  <p className="font-semibold text-slate-900">Concentration Breach Alert</p>
                  <p className="text-slate-500 text-[11px]">Equity/Loan sub-tranche crossed 35% threshold.</p>
                  <span className="text-[10px] text-slate-400">12 mins ago</span>
                </div>
                <div className="py-2">
                  <p className="font-semibold text-slate-900">Stress Test Engine Ready</p>
                  <p className="text-slate-500 text-[11px]">Markowitz-Liquidity simulation ready to review.</p>
                  <span className="text-[10px] text-slate-400">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Mini */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold ring-2 ring-slate-200">
            RK
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">R. Kumar</div>
            <div className="text-[10px] text-slate-500 font-medium">Head of Risk</div>
          </div>
        </div>
      </div>
    </header>
  );
};
