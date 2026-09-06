'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  ShieldAlert,
  ShieldCheck,
  Droplets,
  Coins,
  Activity,
  Sparkles,
  Zap,
  TrendingUp,
  RefreshCw,
  Clock,
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  PieChart,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  RiskOverviewResponse,
  SystemAlert,
  DecisionHistoryItem
} from '../../types/api';
import {
  getRiskOverview,
  getAlerts,
  getDecisions,
  getBreaches
} from '../../services/riskService';
import { mockAllocations } from '../../services/dashboardData';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core LLD Section 19.2 Requirements State
  const [riskOverview, setRiskOverview] = useState<RiskOverviewResponse | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [decisions, setDecisions] = useState<DecisionHistoryItem[]>([]);
  const [allocations, setAllocations] = useState(mockAllocations);
  const [activeAssetIndex, setActiveAssetIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const loadDashboardData = async () => {
    try {
      const [riskData, alertsData, decisionsData] = await Promise.all([
        getRiskOverview(),
        getAlerts(),
        getDecisions()
      ]);
      setRiskOverview(riskData);
      setAlerts(alertsData);
      setDecisions(decisionsData);
    } catch (err) {
      console.error('Failed to load live dashboard data', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
    setToastMessage('🔄 Live balance sheet, risk score, alerts, and decisions refreshed.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics derived from Risk Engine & Portfolio
  const totalCapital = '₹100.0 Cr';
  const totalCapitalUSD = '$1,000,000.00';
  const riskScore = riskOverview?.riskScore ?? 38;
  const riskLevel = riskOverview?.riskLevel ?? 'MODERATE';
  const liquidityAmount = riskOverview?.liquidity 
    ? `$${riskOverview.liquidity.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
    : '₹20.0 Cr';

  const isCriticalRisk = riskLevel === 'CRITICAL' || riskScore > 70;

  return (
    <div className="flex h-screen bg-[#caf0f8] dark:bg-[#070b14] text-[#03045e] dark:text-slate-100 font-sans overflow-hidden transition-colors">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* 2. MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-b from-[#caf0f8] via-[#def6fa] to-[#c2eff7] dark:from-[#0a0f1d] dark:via-[#070b14] dark:to-[#04070e] transition-colors">
        {/* TOP HEADER */}
        <Header onTriggerRefresh={handleRefresh} isRefreshing={isRefreshing} />

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="bg-emerald-100 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-200 px-6 py-2.5 text-xs flex items-center justify-between border-b border-emerald-300 dark:border-emerald-700/80 shadow-md animate-fadeIn">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 dark:text-emerald-400 hover:underline text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SCROLLABLE DASHBOARD CONTENT (LLD SECTION 19.2) */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* HEADER ROW */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/95 dark:bg-slate-900/60 p-5 rounded-2xl border-2 border-[#0077b6]/25 dark:border-slate-800 shadow-sm backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-[#03045e] dark:text-white tracking-tight">
                  Executive Dashboard & Capital Health
                </h1>
                <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40">
                  REAL-TIME FEEDS
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                Real-time capital balance, composite risk telemetry, statutory liquidity buffers, and autonomous decision logs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/optimization')}
                className="px-4 py-2 bg-gradient-to-r from-[#0077b6] to-[#0096c7] hover:from-[#03045e] hover:to-[#0077b6] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Optimize Capital Book</span>
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="p-2 rounded-xl bg-white hover:bg-[#caf0f8]/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#03045e] dark:text-slate-300 border border-[#0077b6]/30 dark:border-slate-700 cursor-pointer transition-colors shadow-xs"
                title="Refresh Feeds"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0077b6]' : ''}`} />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. TOP 4 KPI CARDS: TOTAL CAPITAL, RISK SCORE, RISK LEVEL, LIQUIDITY      */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* REQUIREMENT 1: TOTAL CAPITAL */}
            <div className="bg-white/95 dark:bg-slate-900/60 border-2 border-[#0077b6]/25 dark:border-slate-800 rounded-2xl p-4.5 hover:border-[#0077b6] dark:hover:border-slate-700 transition-all shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Capital</span>
                <div className="w-8 h-8 rounded-xl bg-[#caf0f8] dark:bg-indigo-500/10 border border-[#0077b6]/30 dark:border-indigo-500/20 flex items-center justify-center text-[#0077b6] dark:text-indigo-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-[#03045e] dark:text-white">{totalCapital}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">({totalCapitalUSD})</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">+3.2% vs last month</span>
                <span className="text-slate-500 font-medium">Book #CS-IND-0926</span>
              </div>
            </div>

            {/* REQUIREMENT 2: COMPOSITE RISK SCORE */}
            <div className="bg-white/95 dark:bg-slate-900/60 border-2 border-[#0077b6]/25 dark:border-slate-800 rounded-2xl p-4.5 hover:border-[#0077b6] dark:hover:border-slate-700 transition-all shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Composite Risk Score</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isCriticalRisk 
                    ? 'bg-rose-100 text-rose-700 dark:bg-red-500/10 dark:text-red-400 border border-rose-300 dark:border-red-500/20' 
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${
                  isCriticalRisk ? 'text-rose-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {riskScore}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">/ 100</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-auto font-mono font-medium">Limit: 70</span>
              </div>
              <div className="mt-2.5 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div
                  className={`h-full ${
                    isCriticalRisk ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, riskScore)}%` }}
                />
              </div>
            </div>

            {/* REQUIREMENT 3: RISK LEVEL */}
            <div className="bg-white/95 dark:bg-slate-900/60 border-2 border-[#0077b6]/25 dark:border-slate-800 rounded-2xl p-4.5 hover:border-[#0077b6] dark:hover:border-slate-700 transition-all shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk Level & Posture</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span
                  className={`text-lg font-black font-mono px-3 py-1 rounded-xl border inline-block ${
                    riskLevel === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40'
                      : riskLevel === 'HIGH'
                      ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40'
                  }`}
                >
                  {riskLevel}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                <span>VaR 95%: <strong className="text-[#03045e] dark:text-slate-200 font-bold">$12.9k</strong></span>
                <span>Vol: <strong className="text-[#03045e] dark:text-slate-200 font-bold">12.5%</strong></span>
              </div>
            </div>

            {/* REQUIREMENT 4: LIQUIDITY */}
            <div className="bg-white/95 dark:bg-slate-900/60 border-2 border-[#0077b6]/25 dark:border-slate-800 rounded-2xl p-4.5 hover:border-[#0077b6] dark:hover:border-slate-700 transition-all shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Instant Liquidity</span>
                <div className="w-8 h-8 rounded-xl bg-[#caf0f8] dark:bg-cyan-500/10 border border-[#0077b6]/30 dark:border-cyan-500/20 flex items-center justify-center text-[#0077b6] dark:text-cyan-400">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-[#0077b6] dark:text-cyan-300">
                  {liquidityAmount}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">160% LCR Buffer</span>
                <span className="text-slate-500 font-medium">Basel III Compliant</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 2. REQUIREMENT 5: ALLOCATION CHART & STATUTORY HEALTH                     */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* REQUIREMENT 5: ALLOCATION CHART (7 cols) */}
            <div className="lg:col-span-7 bg-white/95 dark:bg-slate-900/60 border-2 border-[#0077b6]/25 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#0077b6] dark:text-indigo-400" />
                  <h2 className="text-sm font-black text-[#03045e] dark:text-white uppercase tracking-wider">
                    Asset Allocation Chart (₹100 Cr Book)
                  </h2>
                </div>
                <button
                  onClick={() => router.push('/portfolio')}
                  className="text-xs text-[#0077b6] dark:text-indigo-400 hover:text-[#03045e] dark:hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer font-mono"
                >
                  <span>Detailed Portfolio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Allocation Distribution Bar */}
              <div className="space-y-3.5 mb-6">
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden flex p-0.5 border border-slate-200 dark:border-slate-800">
                  {allocations.map((a, idx) => (
                    <div
                      key={a.name}
                      onMouseEnter={() => setActiveAssetIndex(idx)}
                      onMouseLeave={() => setActiveAssetIndex(null)}
                      className="h-full first:rounded-l-lg last:rounded-r-lg transition-all duration-300 cursor-pointer hover:brightness-110"
                      style={{
                        width: `${a.percentage}%`,
                        backgroundColor: a.color
                      }}
                      title={`${a.name}: ${a.percentage}% (₹${a.amount} Cr)`}
                    />
                  ))}
                </div>

                {/* Legend Items */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {allocations.map((a, idx) => (
                    <div
                      key={a.name}
                      className={`p-3 rounded-xl border transition-all ${
                        activeAssetIndex === idx
                          ? 'bg-[#caf0f8]/60 dark:bg-slate-800/80 border-[#0077b6] dark:border-indigo-500 scale-[1.02] shadow-sm'
                          : 'bg-[#caf0f8]/25 dark:bg-slate-950/60 border-[#0077b6]/20 dark:border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                        <span className="text-xs font-bold text-[#03045e] dark:text-slate-200">{a.name}</span>
                      </div>
                      <div className="text-base font-black font-mono text-[#03045e] dark:text-white">
                        {a.percentage}%
                      </div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium block">
                        ₹{a.amount.toFixed(1)} Cr • {a.riskWeight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#caf0f8]/30 dark:bg-slate-950/60 border border-[#0077b6]/20 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-400 font-medium">
                <span>Concentration Index: <strong className="text-[#03045e] dark:text-slate-200 font-bold">HHI 0.2850</strong></span>
                <span>Top Asset: <strong className="text-[#0077b6] dark:text-indigo-400 font-bold">US10Y (40.0%)</strong></span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">● Statutory Limits OK</span>
              </div>
            </div>

            {/* Quick Governance & Capital Optimization Callout (5 cols) */}
            <div className="lg:col-span-5 bg-white/95 dark:bg-slate-900/60 border-2 border-[#0077b6]/25 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-black text-[#03045e] dark:text-white uppercase tracking-wider">
                      Capital Optimization Opportunity
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                    +1.85% Alpha
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4 font-medium">
                  Autonomous rebalancing model detects surplus cash drag. Reallocate ₹5.0 Cr from high-beta credit into sovereign G-Sec and overnight repo facility.
                </p>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#caf0f8]/30 dark:bg-slate-950/70 border border-[#0077b6]/20 dark:border-slate-800 text-center font-mono mb-4">
                  <div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-bold">Risk Cut</span>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">-25.0%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-bold">Surplus HQLA</span>
                    <span className="text-xs font-black text-[#0077b6] dark:text-cyan-300">+₹4.0 Cr</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-bold">Sharpe Delta</span>
                    <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">+38%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/optimization')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0077b6] via-[#0096c7] to-[#00b4d8] hover:from-[#03045e] hover:to-[#0077b6] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <span>Execute Optimization & Rebalancing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 3. REQUIREMENT 6 & 7: ACTIVE ALERTS & RECENT DECISIONS                    */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* REQUIREMENT 6: ACTIVE ALERTS (6 cols) */}
            <div className="lg:col-span-6 bg-white/95 dark:bg-slate-900/60 border-2 border-[#0077b6]/25 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-[#0077b6]/20 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-black text-[#03045e] dark:text-white uppercase tracking-wider">
                    Active System Alerts ({alerts.length})
                  </h3>
                </div>
                <button
                  onClick={() => router.push('/alerts')}
                  className="text-xs text-[#0077b6] dark:text-indigo-400 hover:text-[#03045e] dark:hover:text-indigo-300 font-bold font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Alerts</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {alerts.slice(0, 3).map((alt) => (
                  <div
                    key={alt.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      alt.severity === 'CRITICAL'
                        ? 'bg-rose-50 border-rose-300 dark:bg-red-950/30 dark:border-red-500/40'
                        : alt.severity === 'WARNING'
                        ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-500/40'
                        : 'bg-[#caf0f8]/25 border-[#0077b6]/20 dark:bg-slate-950/60 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#03045e] dark:text-white">{alt.title}</span>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                              alt.severity === 'CRITICAL'
                                ? 'bg-rose-200 text-rose-900 dark:bg-red-500/30 dark:text-red-200'
                                : 'bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-200'
                            }`}
                          >
                            {alt.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">{alt.message}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          <span>Metric: <strong className="text-[#03045e] dark:text-slate-200 font-bold">{alt.metric}</strong></span>
                          <span>Value: <strong className="text-rose-600 dark:text-red-400 font-bold">{alt.currentValue}</strong></span>
                          <span>Cap: {alt.threshold}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push('/alerts')}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-[10px] font-mono text-[#0077b6] dark:text-indigo-300 hover:bg-[#0077b6] hover:text-white border border-[#0077b6]/30 dark:border-slate-700 shrink-0 cursor-pointer font-bold transition-colors shadow-xs"
                      >
                        {alt.recommendedAction}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REQUIREMENT 7: RECENT DECISIONS (6 cols) */}
            <div className="lg:col-span-6 bg-white/95 dark:bg-slate-900/60 border-2 border-[#0077b6]/25 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-[#0077b6]/20 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0077b6] dark:text-indigo-400" />
                  <h3 className="text-sm font-black text-[#03045e] dark:text-white uppercase tracking-wider">
                    Recent Automated Decisions ({decisions.length})
                  </h3>
                </div>
                <button
                  onClick={() => router.push('/decisions')}
                  className="text-xs text-[#0077b6] dark:text-indigo-400 hover:text-[#03045e] dark:hover:text-indigo-300 font-bold font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Audit Trail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {decisions.slice(0, 3).map((dec) => (
                  <div
                    key={dec.id}
                    className="p-3.5 rounded-xl bg-[#caf0f8]/25 dark:bg-slate-950/60 border border-[#0077b6]/20 dark:border-slate-800/80 space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#caf0f8] text-[#03045e] dark:bg-indigo-500/20 dark:text-indigo-300 border border-[#0077b6]/30 dark:border-indigo-500/30">
                          {dec.id}
                        </span>
                        <span className="font-black text-[#03045e] dark:text-white text-[11px] truncate max-w-[220px]">
                          {dec.event}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {new Date(dec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      <span>Shift: <strong className="text-slate-800 dark:text-slate-300 font-bold">{dec.oldValue}</strong> ➔ <strong className="text-amber-600 dark:text-amber-400 font-bold">{dec.newValue}</strong> (Cap: {dec.threshold})</span>
                      <span className="text-[#0077b6] dark:text-indigo-400 font-bold">{dec.action}</span>
                    </div>

                    <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1 font-medium">
                      {dec.aiExplanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
