'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  Sliders,
  Play,
  RotateCcw,
  Zap,
  TrendingDown,
  Scale,
  DollarSign,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Info,
  History,
  BellRing,
  Check,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import {
  RiskOverviewResponse,
  BreachesResponse,
  RiskLimits,
  StressTestResponse,
  SystemAlert,
  DecisionHistoryItem
} from '../../types/api';
import {
  getRiskOverview,
  getBreaches,
  getRiskLimits,
  updateRiskLimits,
  runStressTest,
  getAlerts,
  getDecisions,
  resetBreachesToSafe
} from '../../services/riskService';

export default function RiskAndControlsPage() {
  const [currentTab, setCurrentTab] = useState('risk');
  const [activeSubView, setActiveSubView] = useState<'overview' | 'stress' | 'limits' | 'alerts' | 'decisions'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core API States
  const [overview, setOverview] = useState<RiskOverviewResponse | null>(null);
  const [breaches, setBreaches] = useState<BreachesResponse | null>(null);
  const [limits, setLimits] = useState<RiskLimits | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [decisions, setDecisions] = useState<DecisionHistoryItem[]>([]);

  // Stress Test Simulation States
  const [selectedScenario, setSelectedScenario] = useState<'EQUITY_CRASH' | 'RATES_HIKE' | 'LIQUIDITY_SQUEEZE' | 'STAGFLATION'>('EQUITY_CRASH');
  const [selectedShock, setSelectedShock] = useState<number>(-0.20);
  const [isSimulating, setIsSimulating] = useState(false);
  const [stressResult, setStressResult] = useState<StressTestResponse | null>(null);

  // Edit Limits Form State
  const [isEditingLimits, setIsEditingLimits] = useState(false);
  const [tempLimits, setTempLimits] = useState<RiskLimits | null>(null);
  const [isSavingLimits, setIsSavingLimits] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Load all initial data from APIs
  const loadData = async () => {
    try {
      const [ovData, brData, limData, alData, decData] = await Promise.all([
        getRiskOverview(),
        getBreaches(),
        getRiskLimits(),
        getAlerts(),
        getDecisions()
      ]);
      setOverview(ovData);
      setBreaches(brData);
      setLimits(limData);
      setTempLimits(limData);
      setAlerts(alData);
      setDecisions(decData);
    } catch (err) {
      console.error('Failed to load risk engine data', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
  };

  // Run Stress Test Simulation (Golden Demo API 🎬)
  const handleExecuteStressTest = async (scenario = selectedScenario, shock = selectedShock) => {
    setIsSimulating(true);
    try {
      const res = await runStressTest({ scenario, shock });
      setStressResult(res);
      // Reload breaches, alerts, and decisions reflecting the simulated shock
      const [updatedBreaches, updatedAlerts, updatedDecisions] = await Promise.all([
        getBreaches(),
        getAlerts(),
        getDecisions()
      ]);
      setBreaches(updatedBreaches);
      setAlerts(updatedAlerts);
      setDecisions(updatedDecisions);
    } catch (err) {
      console.error('Stress test simulation failed', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetSimulation = () => {
    const safe = resetBreachesToSafe();
    setBreaches(safe);
    setStressResult(null);
    loadData();
  };

  // Save Limits Form
  const handleSaveLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempLimits) return;
    setIsSavingLimits(true);
    setSaveSuccessMessage(null);
    try {
      const updated = await updateRiskLimits(tempLimits);
      setLimits(updated);
      setSaveSuccessMessage('Risk thresholds updated and synchronized with Risk Engine.');
      setTimeout(() => {
        setSaveSuccessMessage(null);
        setIsEditingLimits(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to update limits', err);
    } finally {
      setIsSavingLimits(false);
    }
  };

  const currentRiskScore = stressResult ? stressResult.shockedRisk.riskScore : (overview?.riskScore || 38);
  const currentRiskLevel = stressResult ? stressResult.shockedRisk.riskLevel : (overview?.riskLevel || 'MODERATE');
  const isBreached = breaches?.hasBreach || (stressResult && stressResult.breachStatus.hasBreach);

  return (
    <div className="flex h-screen bg-[#caf0f8] dark:bg-[#070b14] text-[#03045e] dark:text-slate-100 font-sans overflow-hidden transition-colors">
      {/* Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#caf0f8] dark:bg-gradient-to-b dark:from-[#0a0f1d] dark:via-[#070b14] dark:to-[#04070e] transition-colors">
        <Header />

        {/* Action / Title Bar */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Risk Engine & Institutional Controls
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                    Engine v4.2 • Live Monitor
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Real-time Value-at-Risk, asset concentration limits, automated breach triggers, and scenario stress testing.
                </p>
              </div>
            </div>
          </div>

          {/* Sub-view Navigation & Live Refresh */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveSubView('overview')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSubView === 'overview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSubView('stress')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeSubView === 'stress'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Stress Test 🎬
              </button>
              <button
                onClick={() => setActiveSubView('limits')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSubView === 'limits'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Threshold Limits
              </button>
              <button
                onClick={() => setActiveSubView('alerts')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeSubView === 'alerts'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Alerts ({alerts.length})
              </button>
              <button
                onClick={() => setActiveSubView('decisions')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSubView === 'decisions'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Audit Log
              </button>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Refresh Live Engine Feeds"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Breaches Banner */}
        {isBreached ? (
          <div className="bg-red-950/60 border-b border-red-500/40 px-6 py-3 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-200 uppercase tracking-wide">
                    CRITICAL SAFEGUARD BREACH DETECTED
                  </span>
                  <span className="text-[10px] bg-red-500/30 text-red-200 px-2 py-0.5 rounded font-mono font-bold border border-red-400/40">
                    STATUS: BREACH
                  </span>
                </div>
                <p className="text-xs text-red-300/90 mt-0.5">
                  Primary Automated Safeguard: <span className="font-bold text-white uppercase">{breaches?.primaryAction || 'EMERGENCY_REBALANCE'}</span>. Limits exceeded during volatility shock.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubView('stress')}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold shadow-md cursor-pointer"
              >
                Inspect Shock Impact
              </button>
              <button
                onClick={handleResetSimulation}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium border border-slate-700 cursor-pointer"
              >
                Reset to Safe
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/30 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">
                Safeguard Status: <strong className="text-white">SAFE</strong> • All 6 regulatory & capital thresholds within acceptable risk bounds.
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Primary Action: <span className="text-emerald-400 font-semibold">NO_ACTION</span>
            </div>
          </div>
        )}

        {/* Scrollable View Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ========================================================================= */}
          {/* VIEW: OVERVIEW */}
          {/* ========================================================================= */}
          {activeSubView === 'overview' && overview && (
            <div className="space-y-6">
              {/* SECTION 19.4 — TOP KEY RISK INDICATORS (7 DEDICATED METRIC CARDS) */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400">
                      Core Risk Telemetry & Prudential Limits (7 KRI Vector)
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Confidence: 95% 1-Day Horizon
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
                  {/* 1. RISK SCORE */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 relative overflow-hidden backdrop-blur-sm shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Risk Score</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border font-mono ${
                            currentRiskLevel === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-300 border-red-500/40'
                              : currentRiskLevel === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {currentRiskLevel}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white font-mono">{currentRiskScore}</span>
                        <span className="text-xs text-slate-400 font-mono">/ 100</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Limit: <strong className="text-slate-300 font-mono">{limits?.maxRiskScore || 70}</strong>
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80">
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ${
                            currentRiskScore > 70
                              ? 'bg-gradient-to-r from-amber-500 to-red-500'
                              : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                          }`}
                          style={{ width: `${Math.min(100, currentRiskScore)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. VOLATILITY */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Volatility</span>
                        <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white font-mono">
                          {(overview.volatility * 100).toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-slate-400 font-mono">% p.a.</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Regime: <strong className="text-emerald-400">Low Variance</strong>
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>252-Day Matrix</span>
                      <span className="text-emerald-400 font-bold">Stable</span>
                    </div>
                  </div>

                  {/* 3. VALUE AT RISK (VaR 95%) */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">VaR (95% 1D)</span>
                        <Activity className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-xl font-black text-white font-mono">
                          ${overview.var95.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">(₹1.25 Cr)</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Max VaR: <strong className="text-slate-300 font-mono">${(limits?.maxVaR || 50000).toLocaleString('en-US')}</strong>
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Confidence</span>
                      <span className="text-indigo-400 font-bold">95.0%</span>
                    </div>
                  </div>

                  {/* 4. CONDITIONAL VaR (CVaR / Expected Shortfall) */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">CVaR (Tail)</span>
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-xl font-black text-white font-mono">
                          ${overview.cvar95.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">(₹1.65 Cr)</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Expected Shortfall: <strong className="text-amber-400 font-mono">5% Worst</strong>
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Tail Loss</span>
                      <span className="text-amber-400 font-bold">Controlled</span>
                    </div>
                  </div>

                  {/* 5. DRAWDOWN */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Drawdown</span>
                        <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white font-mono">
                          {(overview.drawdown * 100).toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-slate-400 font-mono">%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Peak-to-Trough Delta
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Max Cap</span>
                      <span className="text-slate-300 font-bold">{( (limits?.maxDrawdown || 0.15) * 100 ).toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* 6. LIQUIDITY */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Liquidity</span>
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-xl font-black text-emerald-400 font-mono">
                          ${(overview.liquidity / 1000).toFixed(0)}k
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">(₹20.0 Cr)</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        LCR: <strong className="text-emerald-400">145% Buffer</strong>
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Mandate</span>
                      <span className="text-emerald-400 font-bold">Basel III ✓</span>
                    </div>
                  </div>

                  {/* 7. CONCENTRATION */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Concentration</span>
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-indigo-300 font-mono">
                          {(overview.concentrationDetails.highestWeight * 100).toFixed(0)}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Max</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">
                        Top: <strong className="text-white font-mono">{overview.concentrationDetails.highestConcentratedAsset}</strong>
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>HHI Index</span>
                      <span className="text-indigo-300 font-bold">{overview.concentrationDetails.hhiIndex.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Concentration Matrix & Risk Factor Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Concentration Details */}
                <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <h2 className="text-sm font-bold text-white">Concentration & Asset Class Allocation</h2>
                    </div>
                    <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      HHI Index: {overview.concentrationDetails.hhiIndex.toFixed(4)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400">Highest Concentrated Single Asset</span>
                      <div className="text-base font-bold text-white font-mono mt-0.5">
                        {overview.concentrationDetails.highestConcentratedAsset} (US 10-Year Treasury)
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-[11px] text-slate-400">Weight</span>
                      <div className="text-base font-bold text-indigo-400">
                        {(overview.concentrationDetails.highestWeight * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Asset Class Weight Bars */}
                  <div className="space-y-3">
                    {Object.entries(overview.concentrationDetails.allocationByAssetClass).map(([cls, weight]) => {
                      const pct = (weight * 100).toFixed(1);
                      return (
                        <div key={cls}>
                          <div className="flex justify-between text-xs font-medium mb-1">
                            <span className="text-slate-300">{cls}</span>
                            <span className="font-mono text-slate-200">{pct}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Risk Factor Score Breakdown */}
                <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-indigo-400" />
                      <h2 className="text-sm font-bold text-white">Risk Factor Contribution Breakdown</h2>
                    </div>
                    <span className="text-[11px] text-slate-400">Engine Weights</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Concentration Risk Factor</span>
                        <span className="font-mono text-amber-400 font-bold">{overview.breakdown.concentrationScore} / 100</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${overview.breakdown.concentrationScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Drawdown Risk Score</span>
                        <span className="font-mono text-slate-200 font-medium">{overview.breakdown.drawdownScore} / 100</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${overview.breakdown.drawdownScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Volatility Factor Score</span>
                        <span className="font-mono text-slate-200 font-medium">{overview.breakdown.volatilityScore} / 100</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${overview.breakdown.volatilityScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Value at Risk (VaR) Factor</span>
                        <span className="font-mono text-slate-200 font-medium">{overview.breakdown.varScore} / 100</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${overview.breakdown.varScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Liquidity Stress Factor</span>
                        <span className="font-mono text-emerald-400 font-bold">{overview.breakdown.liquidityScore} / 100 (Safe)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${overview.breakdown.liquidityScore}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: STRESS TEST / MARKET SHOCK SIMULATOR (🎬 Golden Demo) */}
          {/* ========================================================================= */}
          {activeSubView === 'stress' && (
            <div className="space-y-6">
              <div className="bg-slate-900/70 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <h2 className="text-lg font-bold text-white">Market Shock Scenario Simulator (Golden Demo API 🎬)</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Execute instantaneous stress shocks against the live portfolio to evaluate capital erosion, risk spike, and automated safeguard triggers.
                    </p>
                  </div>

                  {stressResult && (
                    <button
                      onClick={handleResetSimulation}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset to Baseline Safe State
                    </button>
                  )}
                </div>

                {/* Interactive Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Scenario Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Select Stress Scenario
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'EQUITY_CRASH', label: 'Equity Market Crash', desc: 'Global equity selloff & VIX spike' },
                        { id: 'RATES_HIKE', label: 'Sudden Rates Hike', desc: '+150 bps yield curve shift' },
                        { id: 'LIQUIDITY_SQUEEZE', label: 'Liquidity Squeeze', desc: 'Interbank spread blowout' },
                        { id: 'STAGFLATION', label: 'Stagflation Shock', desc: 'Commodity surge & slow growth' }
                      ].map((sc) => (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => setSelectedScenario(sc.id as any)}
                          className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                            selectedScenario === sc.id
                              ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-xs font-bold">{sc.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{sc.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shock Intensity Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Shock Magnitude (Instant Buttons)
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { shock: -0.10, label: '-10% Shock', desc: 'Minor Market Pullback' },
                        { shock: -0.20, label: '-20% Shock', desc: 'Golden Demo (Bear Crash)' },
                        { shock: -0.30, label: '-30% Shock', desc: 'Systemic Meltdown' }
                      ].map((item) => (
                        <button
                          key={item.shock}
                          type="button"
                          onClick={() => {
                            setSelectedShock(item.shock);
                            handleExecuteStressTest(selectedScenario, item.shock);
                          }}
                          disabled={isSimulating}
                          className={`p-3 rounded-lg text-center border transition-all cursor-pointer ${
                            selectedShock === item.shock
                              ? 'bg-red-500/20 border-red-500 text-red-200 font-bold'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-sm font-bold font-mono text-red-400">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleExecuteStressTest(selectedScenario, selectedShock)}
                      disabled={isSimulating}
                      className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      {isSimulating ? 'Executing Shock Calculation on Risk Engine...' : `Run Stress Simulation (${(selectedShock * 100).toFixed(0)}%)`}
                    </button>
                  </div>
                </div>

                {/* Shock Output Result Card */}
                {stressResult && (
                  <div className="mt-8 pt-6 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                        Simulation Result: {stressResult.scenario} ({(stressResult.shockPercentage * 100).toFixed(2)}%)
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded border font-mono ${
                          stressResult.breachStatus.hasBreach
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        STATUS: {stressResult.breachStatus.overallStatus}
                      </span>
                    </div>

                    {/* Comparative KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400">Initial Portfolio Value</span>
                        <div className="text-xl font-bold font-mono text-white mt-1">
                          ${stressResult.initialPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <span className="text-[10px] text-slate-400">Pre-shock baseline</span>
                      </div>

                      <div className="bg-slate-950/80 p-4 rounded-xl border border-red-500/30">
                        <span className="text-[11px] text-red-300">Shocked Portfolio Value</span>
                        <div className="text-xl font-bold font-mono text-red-400 mt-1">
                          ${stressResult.shockedPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <span className="text-[10px] text-red-400 font-mono">
                          Total Loss: -${stressResult.totalLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400">Risk Score Shift</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold font-mono text-slate-300">
                            {stressResult.initialRisk.riskScore}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                          <span className="text-2xl font-black font-mono text-red-400">
                            {stressResult.shockedRisk.riskScore}
                          </span>
                        </div>
                        <span className="text-[10px] text-red-400 uppercase font-bold">
                          Level: {stressResult.shockedRisk.riskLevel}
                        </span>
                      </div>

                      <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-500/30">
                        <span className="text-[11px] text-indigo-300">Recommended Safeguard Action</span>
                        <div className="text-base font-bold font-mono text-indigo-400 mt-1 truncate">
                          {stressResult.recommendedAction}
                        </div>
                        <span className="text-[10px] text-slate-400">Automated engine mandate</span>
                      </div>
                    </div>

                    {/* Summary Callout */}
                    <div className="mt-4 p-4 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed font-mono">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Engine Diagnostic Summary:</strong> {stressResult.summary}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: RISK LIMITS & THRESHOLD CONFIGURATION */}
          {/* ========================================================================= */}
          {activeSubView === 'limits' && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-400" />
                      Risk Thresholds & Governance Parameters (GET / PUT /api/risk/limits)
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure maximum allowable risk score, portfolio drawdown, concentration, and liquidity mandates.
                    </p>
                  </div>

                  {!isEditingLimits ? (
                    <button
                      onClick={() => {
                        setTempLimits(limits);
                        setIsEditingLimits(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
                    >
                      Adjust Thresholds
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditingLimits(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {saveSuccessMessage && (
                  <div className="mb-6 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {saveSuccessMessage}
                  </div>
                )}

                <form onSubmit={handleSaveLimits}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Max Risk Score */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Max Composite Risk Score
                      </label>
                      <span className="text-[11px] text-slate-400 block mb-3">
                        Hard cap threshold before automated safeguard trigger.
                      </span>
                      {isEditingLimits ? (
                        <input
                          type="number"
                          value={tempLimits?.maxRiskScore || 70}
                          onChange={(e) =>
                            setTempLimits(prev => prev ? { ...prev, maxRiskScore: Number(e.target.value) } : null)
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
                        />
                      ) : (
                        <div className="text-2xl font-bold font-mono text-white">
                          {limits?.maxRiskScore || 70} <span className="text-xs text-slate-400">/ 100</span>
                        </div>
                      )}
                    </div>

                    {/* Max Equity Allocation */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Max Equity Allocation
                      </label>
                      <span className="text-[11px] text-slate-400 block mb-3">
                        Portfolio cap for high-beta equity assets.
                      </span>
                      {isEditingLimits ? (
                        <input
                          type="number"
                          step="0.01"
                          value={tempLimits?.maxEquityAllocation || 0.35}
                          onChange={(e) =>
                            setTempLimits(prev => prev ? { ...prev, maxEquityAllocation: Number(e.target.value) } : null)
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
                        />
                      ) : (
                        <div className="text-2xl font-bold font-mono text-white">
                          {((limits?.maxEquityAllocation || 0.35) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>

                    {/* Max Drawdown */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Max Drawdown Cap
                      </label>
                      <span className="text-[11px] text-slate-400 block mb-3">
                        Cumulative peak-to-trough decline tolerance.
                      </span>
                      {isEditingLimits ? (
                        <input
                          type="number"
                          step="0.01"
                          value={tempLimits?.maxDrawdown || 0.15}
                          onChange={(e) =>
                            setTempLimits(prev => prev ? { ...prev, maxDrawdown: Number(e.target.value) } : null)
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
                        />
                      ) : (
                        <div className="text-2xl font-bold font-mono text-white">
                          {((limits?.maxDrawdown || 0.15) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>

                    {/* Min Liquidity Buffer */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Minimum Liquidity Buffer
                      </label>
                      <span className="text-[11px] text-slate-400 block mb-3">
                        Basel III required cash & liquid reserve minimum.
                      </span>
                      {isEditingLimits ? (
                        <input
                          type="number"
                          value={tempLimits?.minLiquidity || 200000}
                          onChange={(e) =>
                            setTempLimits(prev => prev ? { ...prev, minLiquidity: Number(e.target.value) } : null)
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
                        />
                      ) : (
                        <div className="text-2xl font-bold font-mono text-emerald-400">
                          ${(limits?.minLiquidity || 200000).toLocaleString('en-US')}
                        </div>
                      )}
                    </div>

                    {/* Max VaR */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Maximum 1-Day VaR (95%)
                      </label>
                      <span className="text-[11px] text-slate-400 block mb-3">
                        Maximum daily statistical loss threshold.
                      </span>
                      {isEditingLimits ? (
                        <input
                          type="number"
                          value={tempLimits?.maxVaR || 50000}
                          onChange={(e) =>
                            setTempLimits(prev => prev ? { ...prev, maxVaR: Number(e.target.value) } : null)
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
                        />
                      ) : (
                        <div className="text-2xl font-bold font-mono text-white">
                          ${(limits?.maxVaR || 50000).toLocaleString('en-US')}
                        </div>
                      )}
                    </div>

                    {/* Max CVaR */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Maximum CVaR (Expected Shortfall)
                      </label>
                      <span className="text-[11px] text-slate-400 block mb-3">
                        Tail-risk conditional VaR limit.
                      </span>
                      {isEditingLimits ? (
                        <input
                          type="number"
                          value={tempLimits?.maxCVaR || 75000}
                          onChange={(e) =>
                            setTempLimits(prev => prev ? { ...prev, maxCVaR: Number(e.target.value) } : null)
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
                        />
                      ) : (
                        <div className="text-2xl font-bold font-mono text-white">
                          ${(limits?.maxCVaR || 75000).toLocaleString('en-US')}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditingLimits && (
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingLimits(false)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingLimits}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                      >
                        {isSavingLimits ? 'Saving to Backend API...' : 'Save & Enforce Limits'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: SYSTEM ALERTS */}
          {/* ========================================================================= */}
          {activeSubView === 'alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-indigo-400" />
                  Live System Risk Alerts (GET /api/alerts)
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {alerts.length} Active System Alerts
                </span>
              </div>

              <div className="space-y-3">
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                      alt.severity === 'CRITICAL'
                        ? 'bg-red-950/40 border-red-500/40'
                        : alt.severity === 'WARNING'
                        ? 'bg-amber-950/40 border-amber-500/40'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          alt.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : alt.severity === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}
                      >
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{alt.title}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                              alt.severity === 'CRITICAL'
                                ? 'bg-red-500/30 text-red-200'
                                : 'bg-amber-500/30 text-amber-200'
                            }`}
                          >
                            {alt.severity}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{alt.id}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{alt.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400 font-mono">
                          <span>Metric: <strong className="text-slate-200">{alt.metric}</strong></span>
                          <span>Current: <strong className="text-red-300">{alt.currentValue}</strong></span>
                          <span>Threshold: <strong className="text-slate-200">{alt.threshold}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 block mb-1">
                        {new Date(alt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-semibold border border-slate-700">
                        {alt.recommendedAction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: DECISION HISTORY (AUDIT LOG) */}
          {/* ========================================================================= */}
          {activeSubView === 'decisions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  Decision History & AI Explanation Audit Log (GET /api/decisions)
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  Immutable Governance Log
                </span>
              </div>

              <div className="space-y-3">
                {decisions.map((dec) => (
                  <div
                    key={dec.id}
                    className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {dec.id}
                        </span>
                        <span className="text-xs font-bold text-white">{dec.event}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(dec.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Metric Shift Row */}
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-400">Target Metric: </span>
                        <span className="font-bold text-white">{dec.metric}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Shift:</span>
                        <span className="text-slate-300">{dec.oldValue}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-amber-400 font-bold">{dec.newValue}</span>
                        <span className="text-slate-400">(Threshold: {dec.threshold})</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Action: </span>
                        <span className="text-indigo-400 font-bold">{dec.action}</span>
                      </div>
                    </div>

                    {/* AI Explanation Box */}
                    <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed font-mono">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-indigo-300">AI Explanatory Trace: </strong>
                          {dec.aiExplanation}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
