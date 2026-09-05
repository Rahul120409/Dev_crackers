'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import {
  FlaskConical,
  Zap,
  Play,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Activity,
  DollarSign,
  Layers,
  ChevronRight,
  Info,
  Sparkles,
  CheckCircle2,
  Sliders,
  Flame,
  ArrowDownRight,
  ShieldAlert,
  Clock,
  Shield
} from 'lucide-react';
import { StressTestResponse, DecisionHistoryItem, SystemAlert } from '../../types/api';
import { runStressTest, getBreaches, getDecisions, resetBreachesToSafe } from '../../services/riskService';

interface ScenarioDef {
  id: 'EQUITY_CRASH' | 'RATES_HIKE' | 'LIQUIDITY_SQUEEZE' | 'STAGFLATION';
  title: string;
  category: string;
  description: string;
  defaultShock: number;
  iconColor: string;
}

const SCENARIOS: ScenarioDef[] = [
  {
    id: 'EQUITY_CRASH',
    title: 'Equity Market Crash (Golden Demo 🎬)',
    category: 'Market Risk',
    description: 'Simulates sharp global equity sell-off, high-beta stock devaluation, and VIX volatility spike.',
    defaultShock: -0.20,
    iconColor: 'text-red-400'
  },
  {
    id: 'RATES_HIKE',
    title: 'Sudden Interest Rates Hike (+200 bps)',
    category: 'Interest Rate Risk',
    description: 'Central bank benchmark rate increase causing sovereign & corporate bond yield curve steepening.',
    defaultShock: -0.15,
    iconColor: 'text-amber-400'
  },
  {
    id: 'LIQUIDITY_SQUEEZE',
    title: 'Interbank Liquidity Freeze',
    category: 'Liquidity Risk',
    description: 'Severe interbank spread blowout, commercial paper freeze, and liquid reserve drain.',
    defaultShock: -0.25,
    iconColor: 'text-cyan-400'
  },
  {
    id: 'STAGFLATION',
    title: 'Stagflationary Supply Shock',
    category: 'Macroeconomic',
    description: 'Simultaneous commodity inflation spike, negative GDP growth, and credit contraction.',
    defaultShock: -0.18,
    iconColor: 'text-indigo-400'
  }
];

export default function StressTestingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState('simulator');
  const [selectedScenarioId, setSelectedScenarioId] = useState<'EQUITY_CRASH' | 'RATES_HIKE' | 'LIQUIDITY_SQUEEZE' | 'STAGFLATION'>('EQUITY_CRASH');
  const [selectedShock, setSelectedShock] = useState<number>(-0.20);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<StressTestResponse | null>(null);
  const [decisionLogs, setDecisionLogs] = useState<DecisionHistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    getDecisions().then(data => setDecisionLogs(data));
  }, []);

  const handleExecuteSimulation = async (scenario = selectedScenarioId, shock = selectedShock) => {
    setIsSimulating(true);
    try {
      const res = await runStressTest({ scenario, shock });
      setSimulationResult(res);
      const updatedDecisions = await getDecisions();
      setDecisionLogs(updatedDecisions);
      setToastMessage(`⚡ Stress simulation executed: ${scenario} (${(shock * 100).toFixed(0)}% Shock)`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to run stress test', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    resetBreachesToSafe();
    setSimulationResult(null);
    setToastMessage('✅ Portfolio restored to baseline SAFE status.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeScenarioDef = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  const isBreached = simulationResult ? simulationResult.breachStatus.hasBreach : false;

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-100 font-sans overflow-hidden">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#070b14] to-[#04070e]">
        <Header />

        {/* Action / Title Bar */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-md shadow-red-950/40">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Market Shock & Stress Testing Simulator
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                    🎬 Golden Demo Engine Active
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Instantaneous market shock calculations, capital loss projections, and automated safeguard breach triggers.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {simulationResult && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Baseline
              </button>
            )}
            <span className="text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
              Book: #CS-IND-0926 • $1,000,000 (₹100 Cr)
            </span>
          </div>
        </div>

        {/* Dynamic Safeguard Breach Status Banner */}
        {isBreached ? (
          <div className="bg-red-950/70 border-b border-red-500/40 px-6 py-3 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-200 uppercase tracking-wide">
                    CRITICAL SAFEGUARD BREACH ACTIVATED
                  </span>
                  <span className="text-[10px] bg-red-500/30 text-red-100 px-2 py-0.5 rounded font-mono font-bold border border-red-400/40">
                    STATUS: BREACH
                  </span>
                </div>
                <p className="text-xs text-red-300 mt-0.5 font-mono">
                  Mandatory Control Action: <strong className="text-white uppercase">{simulationResult?.recommendedAction || 'EMERGENCY_REBALANCE'}</strong> • Risk threshold of 70 exceeded.
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 cursor-pointer"
            >
              Reset to Safe
            </button>
          </div>
        ) : (
          <div className="bg-emerald-950/30 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Current Portfolio Safeguard Status: <strong className="text-white">SAFE</strong> • Ready for market shock stress testing.</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">Basel III Buffer Active</span>
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="bg-indigo-950/80 border-b border-indigo-500/40 px-6 py-2 text-xs text-indigo-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable View Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Simulation Control Card */}
          <div className="bg-slate-900/70 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-black/40">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Select Stress Scenario & Shock Intensity
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate adverse macroeconomic shocks against institutional book assets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Scenario Picker (7 cols) */}
              <div className="lg:col-span-7">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Macroeconomic Scenario Catalog
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        setSelectedScenarioId(sc.id);
                        setSelectedShock(sc.defaultShock);
                      }}
                      className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                        selectedScenarioId === sc.id
                          ? 'bg-red-950/40 border-red-500/80 shadow-md shadow-red-950/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{sc.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-400 block mb-1.5">{sc.category}</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{sc.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Buttons & Execute Trigger (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                    Instant Shock Magnitude (Golden Demo Buttons)
                  </label>

                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    {[
                      { shock: -0.10, label: '-10%', title: 'Minor Dip' },
                      { shock: -0.20, label: '-20%', title: 'Golden Demo 🎬' },
                      { shock: -0.30, label: '-30%', title: 'Crash' }
                    ].map((item) => (
                      <button
                        key={item.shock}
                        type="button"
                        onClick={() => {
                          setSelectedShock(item.shock);
                          handleExecuteSimulation(selectedScenarioId, item.shock);
                        }}
                        disabled={isSimulating}
                        className={`p-3 rounded-xl text-center border transition-all cursor-pointer ${
                          selectedShock === item.shock
                            ? 'bg-red-500/20 border-red-500 text-red-200 shadow-md shadow-red-950/60'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-base font-extrabold font-mono text-red-400">{item.label}</div>
                        <div className="text-[10px] font-semibold text-slate-300 mt-0.5">{item.title}</div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Target Scenario:</span>
                      <span className="text-white font-bold">{selectedScenarioId}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Configured Shock:</span>
                      <span className="text-red-400 font-bold">{(selectedShock * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleExecuteSimulation(selectedScenarioId, selectedShock)}
                    disabled={isSimulating}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 border border-red-400/40 cursor-pointer transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {isSimulating ? 'Computing Adverse Shock Model...' : `Execute Shock Simulation (${(selectedShock * 100).toFixed(0)}%)`}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Simulation Results (When executed) */}
          {simulationResult && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Stress Shock Impact Diagnostics
                </h3>
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/30">
                  {simulationResult.scenario} • {(simulationResult.shockPercentage * 100).toFixed(2)}%
                </span>
              </div>

              {/* Comparative KPI 4-Card Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Portfolio Value & Loss */}
                <div className="bg-slate-900/60 border border-red-500/30 rounded-xl p-4">
                  <span className="text-xs font-medium text-red-300">Portfolio Capital Impact</span>
                  <div className="mt-2 text-2xl font-bold font-mono text-white">
                    ${simulationResult.shockedPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="mt-2 text-xs font-mono font-bold text-red-400 flex items-center gap-1">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>Loss: -${simulationResult.totalLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* 2. Risk Score Shift */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-medium text-slate-400">Risk Score Surge</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-mono text-slate-400 line-through">
                      {simulationResult.initialRisk.riskScore}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                    <span className="text-3xl font-extrabold font-mono text-red-400">
                      {simulationResult.shockedRisk.riskScore}
                    </span>
                    <span className="text-xs text-red-300 font-bold uppercase">
                      ({simulationResult.shockedRisk.riskLevel})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">Threshold Limit: 70</span>
                </div>

                {/* 3. Safeguard Breach Status */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-medium text-slate-400">Engine Breach Status</span>
                  <div className="mt-2">
                    <span className={`text-lg font-bold font-mono px-2.5 py-1 rounded border inline-block ${
                      simulationResult.breachStatus.hasBreach
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {simulationResult.breachStatus.overallStatus}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-2 font-mono">
                    Limit exceeded during volatility surge
                  </span>
                </div>

                {/* 4. Automated Action Mandate */}
                <div className="bg-slate-900/60 border border-indigo-500/30 rounded-xl p-4">
                  <span className="text-xs font-medium text-indigo-300">Automated Control Mandate</span>
                  <div className="mt-2 text-base font-extrabold font-mono text-indigo-300 truncate">
                    {simulationResult.recommendedAction}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-2 font-mono">
                    Person 2 Safeguard Engine Response
                  </span>
                </div>
              </div>

              {/* AI Diagnostic Summary Callout */}
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed font-mono">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">AI Engine Diagnostic Summary:</strong> {simulationResult.summary}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Historical Stress Test Audit Trail */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Stress Test & Market Shock Decision Log
              </h3>
              <span className="text-xs text-slate-400 font-mono">Immutable Audit Trail</span>
            </div>

            <div className="space-y-3">
              {decisionLogs.slice(0, 4).map((dec) => (
                <div key={dec.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                        {dec.id}
                      </span>
                      <span className="font-bold text-white">{dec.event}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{new Date(dec.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-300 mb-2">
                    <span>Metric: <strong className="text-white">{dec.metric}</strong></span>
                    <span>Shift: <strong className="text-slate-400">{dec.oldValue}</strong> ➔ <strong className="text-red-400">{dec.newValue}</strong></span>
                    <span>Action: <strong className="text-indigo-400">{dec.action}</strong></span>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {dec.aiExplanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
