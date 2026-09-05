'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { PortfolioKPIRow } from '../../components/PortfolioKPIRow';
import { PortfolioDonutInteractive } from '../../components/PortfolioDonutInteractive';
import { AssetClassCards } from '../../components/AssetClassCards';
import { CurrentVsTarget } from '../../components/CurrentVsTarget';
import { PortfolioInsightPanel } from '../../components/PortfolioInsightPanel';
import { PortfolioTable } from '../../components/PortfolioTable';
import { PortfolioOptimizationCTA } from '../../components/PortfolioOptimizationCTA';
import { OptimizationModal } from '../../components/OptimizationModal';
import {
  mockPortfolioKPIs,
  mockAssetClasses,
  mockPortfolioInsight,
} from '../../services/portfolioData';
import { mockOptimization } from '../../services/dashboardData';
import { useAuth } from '../../context/AuthContext';
import {
  PieChart,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function PortfolioPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState('portfolio');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Just now');
      setToastMessage('🔄 Portfolio asset allocation & risk weights successfully re-synced.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    if (tabId === 'dashboard') {
      router.push('/dashboard');
    } else if (tabId === 'portfolio') {
      router.push('/portfolio');
    } else if (tabId === 'optimization') {
      setIsModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#02040a] text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading Portfolio & Asset Book...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans antialiased overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar currentTab="portfolio" onSelectTab={handleSelectTab} />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER */}
        <Header onTriggerRefresh={handleRefresh} isRefreshing={isRefreshing} />

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="bg-emerald-900/90 text-emerald-100 px-4 py-2.5 text-xs flex items-center justify-between border-b border-emerald-700/80 shadow-md animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-300 hover:text-white text-xs underline font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SCROLLABLE PORTFOLIO VIEW */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 space-y-6">
          
          {/* ========================================================================= */}
          {/* PAGE TITLE BAR                                                            */}
          {/* ========================================================================= */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Portfolio & Assets
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  PORTFOLIO LIVE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Monitor asset allocation, portfolio exposure and capital distribution.
              </p>
            </div>

            {/* Right: Last Updated & Refresh */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                  Sync Status
                </span>
                <span className="text-xs font-mono font-semibold text-slate-700">
                  Last updated: {lastUpdated}
                </span>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Sync live asset prices & allocations"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1 — PORTFOLIO SUMMARY (4 KPI CARDS)                               */}
          {/* ========================================================================= */}
          <PortfolioKPIRow kpis={mockPortfolioKPIs} />

          {/* ========================================================================= */}
          {/* SECTION 2 & 4 — ASSET ALLOCATION (DONUT) + CURRENT VS TARGET BARS         */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Asset Allocation Interactive Donut (6 cols) */}
            <div className="lg:col-span-6">
              <PortfolioDonutInteractive assets={mockAssetClasses} />
            </div>

            {/* Right: Current vs Target Allocation Bars (6 cols) */}
            <div className="lg:col-span-6">
              <CurrentVsTarget assets={mockAssetClasses} />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3 — ASSET CLASS BREAKDOWN (4 COMPACT CARDS)                       */}
          {/* ========================================================================= */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-500">
                Asset Class Profiles
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                4 Active Tranches (₹100 Cr)
              </span>
            </div>
            <AssetClassCards assets={mockAssetClasses} />
          </div>

          {/* ========================================================================= */}
          {/* SECTION 5 — CAPITALGUARD INSIGHT PANEL                                    */}
          {/* ========================================================================= */}
          <PortfolioInsightPanel insight={mockPortfolioInsight} />

          {/* ========================================================================= */}
          {/* SECTION 6 — DETAILED SORTABLE ASSET TABLE                                 */}
          {/* ========================================================================= */}
          <PortfolioTable assets={mockAssetClasses} />

          {/* ========================================================================= */}
          {/* SECTION 7 — OPTIMIZATION CTA SECTION                                      */}
          {/* ========================================================================= */}
          <PortfolioOptimizationCTA onOpenOptimization={() => setIsModalOpen(true)} />

        </main>
      </div>

      {/* OPTIMIZATION MODAL INTEGRATION */}
      <OptimizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        optimization={mockOptimization}
        onApplyRebalance={() => {
          setIsModalOpen(false);
          setToastMessage('✅ Portfolio rebalancing applied! Capital allocated to Markowitz target.');
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />
    </div>
  );
}
