'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { KPICards } from '../../components/KPICards';
import { PortfolioAllocation } from '../../components/PortfolioAllocation';
import { FinancialHealth } from '../../components/FinancialHealth';
import { AlertsPanel } from '../../components/AlertsPanel';
import { OptimizationCard } from '../../components/OptimizationCard';
import { OptimizationModal } from '../../components/OptimizationModal';
import { RecentActivity } from '../../components/RecentActivity';
import {
  mockKPIs,
  mockAllocations,
  mockHealthIndicators,
  mockAlerts,
  mockOptimization,
  mockActivities
} from '../../services/dashboardData';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Zap,
  TrendingUp,
  RefreshCw,
  Building,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [appliedOptimization, setAppliedOptimization] = useState(false);

  // Dynamic portfolio state
  const [kpis, setKpis] = useState(mockKPIs);
  const [allocations, setAllocations] = useState(mockAllocations);
  const [healthIndicators, setHealthIndicators] = useState(mockHealthIndicators);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleApplyOptimization = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Update KPIs to reflect post-optimization gains
      setKpis((prev) =>
        prev.map((k) => {
          if (k.id === 'liquidity-position') {
            return {
              ...k,
              value: '₹24',
              change: '+₹4 Cr (Buffer Reinforced)',
              statusText: 'Fortified',
            };
          }
          if (k.id === 'risk-score') {
            return {
              ...k,
              value: '62',
              change: '-10 pts (Risk Reduced)',
              isPositive: true,
              status: 'safe',
              statusText: 'Safe / Low',
            };
          }
          if (k.id === 'available-capital') {
            return {
              ...k,
              value: '₹14',
              change: '+₹2 Cr optimized deployment',
              statusText: 'Expanded',
            };
          }
          return k;
        })
      );

      // Update Allocation
      setAllocations([
        {
          name: 'Loans',
          category: 'Commercial & Retail Credit',
          percentage: 42,
          amount: 42.0,
          riskWeight: '100% RWA',
          color: '#1E3A8A',
          fillClass: 'fill-blue-900 text-blue-900',
        },
        {
          name: 'Bonds',
          category: 'Sovereign & AAA Corporate Debt',
          percentage: 36,
          amount: 36.0,
          riskWeight: '20% RWA',
          color: '#0D9488',
          fillClass: 'fill-teal-600 text-teal-600',
        },
        {
          name: 'Cash',
          category: 'Central Bank Reserves & Overnight',
          percentage: 14,
          amount: 14.0,
          riskWeight: '0% RWA',
          color: '#16A34A',
          fillClass: 'fill-emerald-600 text-emerald-600',
        },
        {
          name: 'Equity',
          category: 'Listed Securities & Index Funds',
          percentage: 8,
          amount: 8.0,
          riskWeight: '150% RWA',
          color: '#D97706',
          fillClass: 'fill-amber-600 text-amber-600',
        },
      ]);

      // Update Health Indicators
      setHealthIndicators((prev) =>
        prev.map((h) => {
          if (h.name === 'Capital Adequacy (CAR)') {
            return { ...h, metric: '15.6% (Min: 11.5%)', valuePercentage: 94 };
          }
          if (h.name === 'Credit Risk Exposure') {
            return { ...h, metric: '1.6% Concentration Delta', status: 'Safe', valuePercentage: 45, statusColor: 'bg-emerald-600' };
          }
          return h;
        })
      );

      setAppliedOptimization(true);
      setIsRefreshing(false);
      setToastMessage('✅ Portfolio Optimization successfully executed and recorded on treasury ledger.');
      setTimeout(() => setToastMessage(null), 5000);
    }, 1000);
  };

  const handleTriggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage('🔄 Real-time balance sheet ledger & Basel III risk calculations re-synced.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050811] text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading CapitalGuard Secure Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans antialiased overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* 2. MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER */}
        <Header onTriggerRefresh={handleTriggerRefresh} isRefreshing={isRefreshing} />

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

        {/* SCROLLABLE DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 space-y-6">
          
          {/* WELCOME SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Balance Sheet & Capital Health Overview
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  REAL-TIME
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Institutional risk telemetry, autonomous liquidity control, and Markowitz portfolio optimization.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>View Optimization Plan</span>
              </button>
            </div>
          </div>

          {/* 3. TOP KPI CARDS ROW */}
          <KPICards metrics={kpis} />

          {/* 4. TWO-COLUMN MAIN GRID: ALLOCATION & HEALTH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* PORTFOLIO ALLOCATION (7 cols) */}
            <div className="lg:col-span-7">
              <PortfolioAllocation allocations={allocations} />
            </div>

            {/* FINANCIAL HEALTH INDICATORS (5 cols) */}
            <div className="lg:col-span-5">
              <FinancialHealth indicators={healthIndicators} />
            </div>
          </div>

          {/* 5. TWO-COLUMN LOWER GRID: ALERTS & OPTIMIZATION CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ALERTS PANEL (6 cols) */}
            <div className="lg:col-span-6">
              <AlertsPanel alerts={mockAlerts} />
            </div>

            {/* OPTIMIZATION OPPORTUNITY CARD (6 cols) */}
            <div className="lg:col-span-6">
              <OptimizationCard
                optimization={mockOptimization}
                onOpenOptimization={() => setIsModalOpen(true)}
              />
            </div>
          </div>

          {/* 6. RECENT ACTIVITY TIMELINE */}
          <div>
            <RecentActivity activities={mockActivities} />
          </div>

        </main>
      </div>

      {/* OPTIMIZATION MODAL (SIDE-BY-SIDE PROPOSAL REVIEW) */}
      <OptimizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        optimization={mockOptimization}
        onApplyRebalance={handleApplyOptimization}
      />
    </div>
  );
}
