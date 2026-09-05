'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  DollarSign,
  Droplets,
  Activity,
  Check,
  ChevronRight,
  Info,
  Scale,
  RefreshCw
} from 'lucide-react';

interface StrategyOption {
  id: string;
  name: string;
  tag: string;
  description: string;
  yieldDelta: string;
  riskScore: number;
  liquidityReserve: string;
  sharpeRatio: string;
  allocations: {
    Loans: number;
    Bonds: number;
    Cash: number;
    Equity: number;
  };
}

const STRATEGIES: StrategyOption[] = [
  {
    id: 'balanced',
    name: 'Balanced Basel III Alpha (Recommended)',
    tag: 'AI OPTIMAL',
    description: 'Maximizes risk-adjusted yield while preserving statutory liquidity buffers and slashing tail-risk.',
    yieldDelta: '+1.85%',
    riskScore: 54,
    liquidityReserve: '₹24.0 Cr',
    sharpeRatio: '1.96',
    allocations: { Loans: 45, Bonds: 35, Cash: 15, Equity: 5 }
  },
  {
    id: 'conservative',
    name: 'Maximum Capital Shield',
    tag: 'LOWEST RISK',
    description: 'Prioritizes maximum solvency and risk-off sovereign liquidity protection.',
    yieldDelta: '+0.95%',
    riskScore: 36,
    liquidityReserve: '₹30.0 Cr',
    sharpeRatio: '1.78',
    allocations: { Loans: 38, Bonds: 40, Cash: 20, Equity: 2 }
  },
  {
    id: 'yield',
    name: 'Aggressive Capital Yield Maximizer',
    tag: 'MAX YIELD',
    description: 'Exploits high-yield corporate credit spreads and equity market upside within statutory limits.',
    yieldDelta: '+2.75%',
    riskScore: 66,
    liquidityReserve: '₹18.0 Cr',
    sharpeRatio: '1.88',
    allocations: { Loans: 52, Bonds: 28, Cash: 8, Equity: 12 }
  }
];

export default function OptimizationPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState('optimization');
  const [selectedStrategyId, setSelectedStrategyId] = useState('balanced');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState<number>(0);
  const [isExecuted, setIsExecuted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom Sensitivity Sliders
  const [riskAversion, setRiskAversion] = useState(6);
  const [minLiquidity, setMinLiquidity] = useState(20);
  const [equityCap, setEquityCap] = useState(10);

  // Current baseline allocation
  const currentAllocation = { Loans: 50, Bonds: 30, Cash: 10, Equity: 10 };
  const activeStrategy = STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleExecuteRebalance = () => {
    setIsExecuting(true);
    setExecutionStep(1);

    setTimeout(() => {
      setExecutionStep(2);
      setTimeout(() => {
        setExecutionStep(3);
        setTimeout(() => {
          setIsExecuting(false);
          setIsExecuted(true);
          setToastMessage('✅ Portfolio optimization executed successfully! Book #CS-IND-0926 rebalanced.');
          setTimeout(() => setToastMessage(null), 5000);
        }, 800);
      }, 800);
    }, 800);
  };

  const handleReset = () => {
    setIsExecuted(false);
    setExecutionStep(0);
    setToastMessage('Portfolio state reset to baseline.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-100 font-sans overflow-hidden">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#070b14] to-[#04070e]">
        <Header />

        {/* Action / Title Bar */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Portfolio & Capital Optimization Engine
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    1 Active Opportunity Detected
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Markowitz Mean-Variance & Black-Litterman optimization models with Basel III capital and liquidity constraints.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
              Book ID: #CS-IND-0926 • ₹100.0 Cr
            </span>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metric Gains Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Yield Boost */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-slate-400">Projected Yield Boost</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-emerald-400">
                  {isExecuted ? activeStrategy.yieldDelta : activeStrategy.yieldDelta}
                </span>
                <span className="text-xs text-emerald-300 font-mono">+₹1.85 Cr/yr</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Enhanced treasury spread via liquid overnight repo & sovereign swaps.
              </p>
            </div>

            {/* 2. Risk Score Reduction */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-slate-400">Risk Score Impact</span>
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-400 line-through">72</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
                <span className="text-3xl font-extrabold font-mono text-indigo-300">
                  {isExecuted ? activeStrategy.riskScore : activeStrategy.riskScore}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">-25% Tail Risk</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Shifts portfolio well beneath maximum risk threshold limit of 70.
              </p>
            </div>

            {/* 3. Sharpe Ratio Efficiency */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-slate-400">Sharpe Ratio</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-400 line-through">1.42</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
                <span className="text-3xl font-extrabold font-mono text-cyan-300">
                  {activeStrategy.sharpeRatio}
                </span>
                <span className="text-xs text-cyan-400 font-mono">+38% Gain</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Markowitz efficient frontier optimal capital point.
              </p>
            </div>

            {/* 4. Liquidity Reserve */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-slate-400">HQLA Liquidity Buffer</span>
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-white">
                  {activeStrategy.liquidityReserve}
                </span>
                <span className="text-xs text-emerald-400 font-mono">160% LCR</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Statutory requirement is ₹15.0 Cr (Fully compliant).
              </p>
            </div>
          </div>

          {/* Strategy Selection Matrix */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  Select Institutional Optimization Strategy
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose from pre-computed algorithmic models tailored for treasury governance.
                </p>
              </div>
              {isExecuted && (
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Rebalance
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STRATEGIES.map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => setSelectedStrategyId(strategy.id)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedStrategyId === strategy.id
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-950/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{strategy.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                        strategy.id === 'balanced'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : strategy.id === 'conservative'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {strategy.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {strategy.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block">Alpha</span>
                      <span className="text-xs font-bold text-emerald-400">{strategy.yieldDelta}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">Risk</span>
                      <span className="text-xs font-bold text-slate-200">{strategy.riskScore}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">Sharpe</span>
                      <span className="text-xs font-bold text-cyan-400">{strategy.sharpeRatio}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Allocation Comparison: Current vs Optimized */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Asset Allocation Shift (Current vs Target)
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Total Book: ₹100.0 Cr</span>
              </div>

              <div className="space-y-4">
                {Object.keys(currentAllocation).map((key) => {
                  const curr = currentAllocation[key as keyof typeof currentAllocation];
                  const opt = activeStrategy.allocations[key as keyof typeof activeStrategy.allocations];
                  const delta = opt - curr;
                  return (
                    <div key={key} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-white">{key}</span>
                        <div className="flex items-center gap-4 font-mono">
                          <span className="text-slate-400">Current: <strong className="text-slate-200">{curr}% (₹{curr}Cr)</strong></span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-indigo-300">Target: <strong className="text-white">{opt}% (₹{opt}Cr)</strong></span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              delta > 0
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : delta < 0
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {delta > 0 ? `+${delta}% (+₹${delta}Cr)` : delta < 0 ? `${delta}% (${delta}Cr)` : '0%'}
                          </span>
                        </div>
                      </div>

                      {/* Stacked Visual Bar */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] text-slate-400 block mb-1">Current</span>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-400 rounded-full" style={{ width: `${curr * 2}%` }} />
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] text-indigo-300 block mb-1">Target Strategy</span>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${opt * 2}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Execution Schedule & 1-Click Action */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Rebalancing Order Schedule
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Step-by-step transaction legs generated for institutional order router.
                </p>

                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border transition-all text-xs font-mono ${
                    executionStep >= 1 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Leg 1: Commercial Credit Sell</span>
                      {executionStep >= 1 && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Trim -₹5.0 Cr Loans ➔ Liquidate into Settlement Account.</p>
                  </div>

                  <div className={`p-3 rounded-lg border transition-all text-xs font-mono ${
                    executionStep >= 2 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Leg 2: Sovereign G-Sec Allocation</span>
                      {executionStep >= 2 && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Acquire +₹5.0 Cr AAA 10Y Sovereign Bonds at par.</p>
                  </div>

                  <div className={`p-3 rounded-lg border transition-all text-xs font-mono ${
                    executionStep >= 3 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Leg 3: Overnight Repo Sweep</span>
                      {executionStep >= 3 && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Sweep +₹5.0 Cr surplus into 6.75% High-Yield Overnight Facility.</p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Est. Execution Cost: <strong className="text-white">₹12,400</strong></span>
                  <span>Est. Slippage: <strong className="text-emerald-400">0.02%</strong></span>
                </div>
              </div>

              <div className="pt-6">
                {!isExecuted ? (
                  <button
                    onClick={handleExecuteRebalance}
                    disabled={isExecuting}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/60 border border-indigo-400/30 transition-all cursor-pointer"
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Executing Leg {executionStep} of 3...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Execute 1-Click Capital Rebalance</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-center">
                    <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Capital Rebalancing Complete</span>
                    </div>
                    <p className="text-[11px] text-emerald-400/80 mt-1">
                      New weights active across treasury books and verified against Basel III limits.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
