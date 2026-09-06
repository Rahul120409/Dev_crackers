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
import { AddPortfolioModal } from '../../components/AddPortfolioModal';
import {
  mockPortfolioKPIs,
  mockAssetClasses,
  mockPortfolioInsight,
} from '../../services/portfolioData';
import { mockOptimization } from '../../services/dashboardData';
import { useAuth } from '../../context/AuthContext';
import { AssetClassItem, PortfolioKPI } from '../../types/portfolio';
import {
  PieChart,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  PlusCircle,
  SlidersHorizontal
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export default function PortfolioPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { portfolio, updatePortfolio } = usePortfolio();

  const [currentTab, setCurrentTab] = useState('portfolio');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const portfolioName = portfolio.portfolioName;
  const totalCapitalCr = portfolio.totalCapitalCr;
  const assets = portfolio.assets;
  const [kpis, setKpis] = useState<PortfolioKPI[]>(mockPortfolioKPIs);

  // Authentication Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    recalculateKPIs(portfolio.assets, portfolio.totalCapitalCr);
  }, [portfolio]);

  // Recalculate KPIs when assets or total capital change
  const recalculateKPIs = (newAssets: AssetClassItem[], capitalCr: number) => {
    const totalExpReturn = newAssets.reduce(
      (acc, a) => acc + (a.allocationPct / 100) * a.expectedReturnPct,
      0
    );
    const totalLiquidVal = newAssets.reduce((acc, a) => acc + a.liquidValueCr, 0);
    const liquidityRatio = capitalCr > 0 ? (totalLiquidVal / capitalCr) * 100 : 0;
    const maxRiskContrib = Math.max(...newAssets.map((a) => a.riskContributionPct), 0);

    const updatedKPIs: PortfolioKPI[] = [
      {
        id: 'total-asset-value',
        title: 'ASSET VALUE',
        value: `₹${capitalCr.toFixed(0)}`,
        unit: 'Cr',
        subtitle: 'Current total book value',
        change: 'Live User Portfolio',
        isPositive: true,
        statusText: 'Active Book',
        statusType: 'optimal',
        icon: 'Building2',
      },
      {
        id: 'current-allocation',
        title: 'CURRENT ALLOCATION',
        value: '100',
        unit: '%',
        subtitle: `${newAssets.length} active asset tranches`,
        change: `${newAssets[0]?.name.split(' ')[0] || 'Primary'} leading tranche`,
        isPositive: true,
        statusText: 'Balanced Book',
        statusType: 'safe',
        icon: 'Layers',
      },
      {
        id: 'expected-return',
        title: 'EXPECTED RETURN',
        value: totalExpReturn.toFixed(1),
        unit: '%',
        subtitle: 'Projected weighted return',
        change: '+50 bps vs benchmark',
        isPositive: true,
        statusText: 'Model Forecast',
        statusType: 'safe',
        icon: 'TrendingUp',
      },
      {
        id: 'risk-contribution',
        title: 'RISK CONTRIBUTION',
        value: maxRiskContrib.toFixed(1),
        unit: '% Max',
        subtitle: 'Dominant risk tranche',
        change: 'Risk Engine Active',
        isPositive: maxRiskContrib <= 50,
        statusText: maxRiskContrib > 50 ? 'Watch Risk' : 'Safe Bound',
        statusType: maxRiskContrib > 50 ? 'watch' : 'safe',
        icon: 'ShieldAlert',
      },
      {
        id: 'portfolio-liquidity',
        title: 'LIQUIDITY RATIO',
        value: liquidityRatio.toFixed(1),
        unit: '%',
        subtitle: `₹${totalLiquidVal.toFixed(1)} Cr immediate T+1 access`,
        change: liquidityRatio >= 50 ? 'Meets Basel III' : 'Tight Buffer',
        isPositive: liquidityRatio >= 50,
        statusText: liquidityRatio >= 50 ? 'Healthy Buffer' : 'Buffer Alert',
        statusType: liquidityRatio >= 50 ? 'safe' : 'watch',
        icon: 'Droplets',
      },
    ];

    setKpis(updatedKPIs);
  };

  const handleSaveCustomPortfolio = (
    newAssets: AssetClassItem[],
    capitalCr: number,
    name: string
  ) => {
    updatePortfolio(name, capitalCr, newAssets);
    setLastUpdated('Just now');
    setToastMessage(`⚡ Custom portfolio "${name}" successfully applied with ₹${capitalCr} Cr capital!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

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
    <div className="flex h-screen bg-[#070b14] text-slate-100 font-sans overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar currentTab="portfolio" onSelectTab={handleSelectTab} />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#070b14] to-[#04070e]">
        {/* TOP HEADER */}
        <Header onTriggerRefresh={handleRefresh} isRefreshing={isRefreshing} />

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="bg-emerald-950/90 text-emerald-200 px-6 py-2.5 text-xs flex items-center justify-between border-b border-emerald-700/80 shadow-md animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400 hover:text-white text-xs underline font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SCROLLABLE PORTFOLIO VIEW */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          
          {/* ========================================================================= */}
          {/* PAGE TITLE BAR & USER INPUT ACTIONS                                        */}
          {/* ========================================================================= */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {portfolioName}
                </h1>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PORTFOLIO LIVE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Total Capital: <strong className="text-white font-mono">₹{totalCapitalCr} Cr</strong> • {assets.length} Active Asset Tranches • Basel III Liquidity Verified
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Button to Open User Input Portfolio Modal */}
              <button
                type="button"
                onClick={() => setIsAddPortfolioOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50 transition-all flex items-center gap-2 cursor-pointer border border-cyan-400/30"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Configure Holdings & Capital</span>
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Sync live asset prices & allocations"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1 — PORTFOLIO SUMMARY (DYNAMIC KPI CARDS)                         */}
          {/* ========================================================================= */}
          <PortfolioKPIRow kpis={kpis} />

          {/* ========================================================================= */}
          {/* SECTION 2 & 4 — ASSET ALLOCATION (DONUT) + CURRENT VS TARGET BARS         */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Asset Allocation Interactive Donut (6 cols) */}
            <div className="lg:col-span-6">
              <PortfolioDonutInteractive assets={assets} />
            </div>

            {/* Right: Current vs Target Allocation Bars (6 cols) */}
            <div className="lg:col-span-6">
              <CurrentVsTarget assets={assets} />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3 — ASSET CLASS BREAKDOWN (COMPACT CARDS)                         */}
          {/* ========================================================================= */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-500">
                Asset Class Profiles
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                {assets.length} Active Tranches (₹{totalCapitalCr} Cr)
              </span>
            </div>
            <AssetClassCards assets={assets} />
          </div>

          {/* ========================================================================= */}
          {/* SECTION 5 — CAPITALGUARD INSIGHT PANEL                                    */}
          {/* ========================================================================= */}
          <PortfolioInsightPanel insight={mockPortfolioInsight} />

          {/* ========================================================================= */}
          {/* SECTION 6 — DETAILED SORTABLE ASSET TABLE                                 */}
          {/* ========================================================================= */}
          <PortfolioTable assets={assets} />

          {/* ========================================================================= */}
          {/* SECTION 7 — OPTIMIZATION CTA SECTION                                      */}
          {/* ========================================================================= */}
          <PortfolioOptimizationCTA onOpenOptimization={() => setIsModalOpen(true)} />

        </main>
      </div>

      {/* 1. CUSTOM PORTFOLIO INPUT MODAL */}
      <AddPortfolioModal
        isOpen={isAddPortfolioOpen}
        onClose={() => setIsAddPortfolioOpen(false)}
        onSavePortfolio={handleSaveCustomPortfolio}
      />

      {/* 2. OPTIMIZATION MODAL INTEGRATION */}
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
