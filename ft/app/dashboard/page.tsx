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
    <div className="flex h-screen bg-[#070b14] text-slate-100 font-sans overflow-hidden">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* 2. MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#070b14] to-[#04070e]">
        {/* TOP HEADER */}
        <Header onTriggerRefresh={handleRefresh} isRefreshing={isRefreshing} />

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="bg-emerald-950/90 text-emerald-200 px-6 py-2.5 text-xs flex items-center justify-between border-b border-emerald-700/80 shadow-md animate-fadeIn">
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

        {/* SCROLLABLE DASHBOARD CONTENT (LLD SECTION 19.2) */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* HEADER ROW */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Executive Dashboard & Capital Health
                </h1>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  REAL-TIME FEEDS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time capital balance, composite risk telemetry, statutory liquidity buffers, and autonomous decision logs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/optimization')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-950/60 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Optimize Capital Book</span>
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-colors"
                title="Refresh Feeds"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. TOP 4 KPI CARDS: TOTAL CAPITAL, RISK SCORE, RISK LEVEL, LIQUIDITY      */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* REQUIREMENT 1: TOTAL CAPITAL */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Capital</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">{totalCapital}</span>
                <span className="text-xs text-slate-400 font-mono">({totalCapitalUSD})</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="text-emerald-400 font-semibold">+3.2% vs last month</span>
                <span className="text-slate-500">Book #CS-IND-0926</span>
              </div>
            </div>

            {/* REQUIREMENT 2: COMPOSITE RISK SCORE */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Composite Risk Score</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isCriticalRisk ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                  isCriticalRisk ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {riskScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
                <span className="text-[11px] text-slate-400 ml-auto font-mono">Limit: 70</span>
              </div>
              <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    isCriticalRisk ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500'
                  }`}
                  style={{ width: `${Math.min(100, riskScore)}%` }}
                />
              </div>
            </div>

            {/* REQUIREMENT 3: RISK LEVEL */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Level & Posture</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span
                  className={`text-xl font-bold font-mono px-3 py-1 rounded-lg border inline-block ${
                    riskLevel === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : riskLevel === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {riskLevel}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>VaR 95%: <strong className="text-slate-200">$12.9k</strong></span>
                <span>Vol: <strong className="text-slate-200">12.5%</strong></span>
              </div>
            </div>

            {/* REQUIREMENT 4: LIQUIDITY */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instant Liquidity</span>
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300">
                  {liquidityAmount}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="text-emerald-400 font-semibold">160% LCR Buffer</span>
                <span className="text-slate-500">Basel III Compliant</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 2. REQUIREMENT 5: ALLOCATION CHART & STATUTORY HEALTH                     */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* REQUIREMENT 5: ALLOCATION CHART (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Asset Allocation Chart (₹100 Cr Book)
                  </h2>
                </div>
                <button
                  onClick={() => router.push('/portfolio')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>Detailed Portfolio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Allocation Distribution Bar */}
              <div className="space-y-3.5 mb-6">
                <div className="h-4 w-full bg-slate-950 rounded-lg overflow-hidden flex p-0.5 border border-slate-800">
                  {allocations.map((a, idx) => (
                    <div
                      key={a.name}
                      onMouseEnter={() => setActiveAssetIndex(idx)}
                      onMouseLeave={() => setActiveAssetIndex(null)}
                      className="h-full first:rounded-l last:rounded-r transition-all duration-300 cursor-pointer hover:brightness-125"
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
                          ? 'bg-slate-800/80 border-indigo-500 scale-[1.02]'
                          : 'bg-slate-950/60 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                        <span className="text-xs font-bold text-slate-200">{a.name}</span>
                      </div>
                      <div className="text-base font-extrabold font-mono text-white">
                        {a.percentage}%
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        ₹{a.amount.toFixed(1)} Cr • {a.riskWeight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Concentration Index: <strong className="text-slate-200">HHI 0.2850</strong></span>
                <span>Top Asset: <strong className="text-indigo-400">US10Y (40.0%)</strong></span>
                <span className="text-emerald-400">● Statutory Limits OK</span>
              </div>
            </div>

            {/* Quick Governance & Capital Optimization Callout (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Capital Optimization Opportunity
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    +1.85% Alpha
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Autonomous rebalancing model detects surplus cash drag. Reallocate ₹5.0 Cr from high-beta credit into sovereign G-Sec and overnight repo facility.
                </p>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono mb-4">
                  <div>
                    <span className="text-[9px] text-slate-400 block">Risk Cut</span>
                    <span className="text-xs font-bold text-emerald-400">-25.0%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Surplus HQLA</span>
                    <span className="text-xs font-bold text-cyan-300">+₹4.0 Cr</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Sharpe Delta</span>
                    <span className="text-xs font-bold text-indigo-400">+38%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/optimization')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 cursor-pointer transition-all"
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
            <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Active System Alerts ({alerts.length})
                  </h3>
                </div>
                <button
                  onClick={() => router.push('/alerts')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 cursor-pointer"
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
                        ? 'bg-red-950/30 border-red-500/40'
                        : alt.severity === 'WARNING'
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white">{alt.title}</span>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded ${
                              alt.severity === 'CRITICAL'
                                ? 'bg-red-500/30 text-red-200'
                                : 'bg-amber-500/30 text-amber-200'
                            }`}
                          >
                            {alt.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{alt.message}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-400">
                          <span>Metric: <strong className="text-slate-200">{alt.metric}</strong></span>
                          <span>Value: <strong className="text-red-400">{alt.currentValue}</strong></span>
                          <span>Cap: {alt.threshold}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push('/alerts')}
                        className="px-2.5 py-1 rounded bg-slate-800 text-[10px] font-mono text-indigo-300 hover:text-white border border-slate-700 shrink-0 cursor-pointer"
                      >
                        {alt.recommendedAction}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REQUIREMENT 7: RECENT DECISIONS (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Recent Automated Decisions ({decisions.length})
                  </h3>
                </div>
                <button
                  onClick={() => router.push('/decisions')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Audit Trail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {decisions.slice(0, 3).map((dec) => (
                  <div
                    key={dec.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {dec.id}
                        </span>
                        <span className="font-bold text-white text-[11px] truncate max-w-[220px]">
                          {dec.event}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(dec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Shift: <strong className="text-slate-300">{dec.oldValue}</strong> ➔ <strong className="text-amber-400">{dec.newValue}</strong> (Cap: {dec.threshold})</span>
                      <span className="text-indigo-400 font-bold">{dec.action}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-1">
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
