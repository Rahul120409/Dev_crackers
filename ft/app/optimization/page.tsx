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

interface AssetAllocationComparison {
  id: string;
  name: string;
  category: string;
  color: string;
  currentPct: number;
  currentValueCr: number;
  recommendedPct: number;
  recommendedValueCr: number;
  deltaPct: number;
  deltaValueCr: number;
  action: 'REDUCE' | 'INCREASE' | 'HOLD';
  actionLabel: string;
}

const ALLOCATION_ITEMS: AssetAllocationComparison[] = [
  {
    id: 'equity',
    name: 'Listed Equity & ETFs',
    category: 'High-Beta Growth',
    color: '#F59E0B',
    currentPct: 30,
    currentValueCr: 30.0,
    recommendedPct: 22,
    recommendedValueCr: 22.0,
    deltaPct: -8,
    deltaValueCr: -8.0,
    action: 'REDUCE',
    actionLabel: 'Trim -8% (Sell ₹8.0 Cr)',
  },
  {
    id: 'gov_bonds',
    name: 'Government Sovereign Bonds',
    category: 'Sovereign 10Y Benchmark',
    color: '#3B82F6',
    currentPct: 30,
    currentValueCr: 30.0,
    recommendedPct: 35,
    recommendedValueCr: 35.0,
    deltaPct: 5,
    deltaValueCr: 5.0,
    action: 'INCREASE',
    actionLabel: 'Expand +5% (Buy ₹5.0 Cr)',
  },
  {
    id: 'corp_bonds',
    name: 'Corporate AAA Debt',
    category: 'Investment Grade Debt',
    color: '#0D9488',
    currentPct: 20,
    currentValueCr: 20.0,
    recommendedPct: 20,
    recommendedValueCr: 20.0,
    deltaPct: 0,
    deltaValueCr: 0.0,
    action: 'HOLD',
    actionLabel: 'Hold 20% (₹20.0 Cr)',
  },
  {
    id: 'gold',
    name: 'Gold & Strategic Reserves',
    category: 'Inflation / Hedge Asset',
    color: '#EAB308',
    currentPct: 10,
    currentValueCr: 10.0,
    recommendedPct: 10,
    recommendedValueCr: 10.0,
    deltaPct: 0,
    deltaValueCr: 0.0,
    action: 'HOLD',
    actionLabel: 'Hold 10% (₹10.0 Cr)',
  },
  {
    id: 'cash',
    name: 'Cash & Overnight Repo',
    category: 'Tier-1 Immediate Liquidity',
    color: '#10B981',
    currentPct: 10,
    currentValueCr: 10.0,
    recommendedPct: 13,
    recommendedValueCr: 13.0,
    deltaPct: 3,
    deltaValueCr: 3.0,
    action: 'INCREASE',
    actionLabel: 'Expand +3% (Deposit ₹3.0 Cr)',
  },
];

interface StrategyOption {
  id: string;
  name: string;
  tag: string;
  description: string;
  yieldDelta: string;
  riskScore: number;
  liquidityReserve: string;
  sharpeRatio: string;
}

const STRATEGIES: StrategyOption[] = [
  {
    id: 'balanced',
    name: 'Markowitz Efficient Frontier (Recommended)',
    tag: 'OPTIMAL',
    description: 'Maximizes risk-adjusted yield while preserving statutory liquidity buffers and slashing tail-risk.',
    yieldDelta: '+1.30%',
    riskScore: 54,
    liquidityReserve: '₹13.0 Cr',
    sharpeRatio: '1.96',
  },
  {
    id: 'conservative',
    name: 'Maximum Capital Shield',
    tag: 'LOWEST RISK',
    description: 'Prioritizes maximum solvency and risk-off sovereign liquidity protection.',
    yieldDelta: '+0.95%',
    riskScore: 36,
    liquidityReserve: '₹20.0 Cr',
    sharpeRatio: '1.78',
  },
  {
    id: 'yield',
    name: 'Aggressive Capital Yield Maximizer',
    tag: 'MAX YIELD',
    description: 'Exploits high-yield corporate credit spreads and equity upside within statutory limits.',
    yieldDelta: '+2.75%',
    riskScore: 66,
    liquidityReserve: '₹10.0 Cr',
    sharpeRatio: '1.88',
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

  const activeStrategy = STRATEGIES.find((s: StrategyOption) => s.id === selectedStrategyId) || STRATEGIES[0];

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
    <div className="flex h-screen bg-[#caf0f8] dark:bg-[#070b14] text-[#03045e] dark:text-slate-100 font-sans overflow-hidden transition-colors">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#caf0f8] dark:bg-gradient-to-b dark:from-[#0a0f1d] dark:via-[#070b14] dark:to-[#04070e] transition-colors">
        <Header />

        {/* Action / Title Bar */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Portfolio & Capital Optimization Engine
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    FRONTIER ACTIVE
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  LLD Section 19.5: Side-by-side comparison of Current vs Recommended allocations with Delta actions and automated rebalancing.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
              Total Capital: <strong className="text-white">₹100.0 Cr</strong>
            </span>
            {isExecuted && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400 hover:text-white underline font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Key Metric Gains Row (Before vs After Optimization) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Expected Return */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">Expected Return</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-slate-500 line-through">7.40%</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-2xl font-black font-mono text-emerald-400">
                  8.70%
                </span>
                <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">+130 bps</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Projected annual gross return on Markowitz frontier.
              </p>
            </div>

            {/* 2. Risk Score Impact */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">Risk Score Impact</span>
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-slate-500 line-through">72</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-2xl font-black font-mono text-indigo-300">
                  54
                </span>
                <span className="text-[10px] text-indigo-300 font-mono font-bold bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30">-18 pts</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Brings portfolio comfortably below max threshold of 70.
              </p>
            </div>

            {/* 3. Value at Risk (VaR 95%) */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">VaR (95% 1-Day)</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-slate-500 line-through">₹2.10 Cr</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xl font-black font-mono text-cyan-300">
                  ₹1.45 Cr
                </span>
                <span className="text-[10px] text-cyan-300 font-mono font-bold bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30">-31%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Tail risk and expected shortfall significantly mitigated.
              </p>
            </div>

            {/* 4. Liquidity Reserve */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">Liquidity Buffer</span>
                <Droplets className="w-4 h-4 text-teal-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-slate-500 line-through">₹10.0 Cr</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xl font-black font-mono text-teal-300">
                  ₹13.0 Cr
                </span>
                <span className="text-[10px] text-teal-300 font-mono font-bold bg-teal-500/20 px-1.5 py-0.5 rounded border border-teal-500/30">+₹3.0 Cr</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Exceeds statutory LCR requirement of ₹10.0 Cr.
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 19.5: SIDE-BY-SIDE COMPARISON TABLE (CURRENT VS OPTIMIZED)        */}
          {/* ========================================================================= */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  Side-by-Side Allocation Comparison (Current vs Recommended)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  LLD Section 19.5 specification: Compare current and optimized allocation side by side with explicit delta actions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-cyan-300 border border-indigo-500/40">
                  MARKOWITZ FRONTIER MODEL
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 select-none">
                  <tr>
                    <th className="py-3.5 px-5">Asset Class & Tranche</th>
                    <th className="py-3.5 px-4 text-center">Category</th>
                    <th className="py-3.5 px-4 text-right bg-slate-900/40">Current Allocation (%)</th>
                    <th className="py-3.5 px-4 text-right bg-slate-900/40">Current Value (₹ Cr)</th>
                    <th className="py-3.5 px-4 text-right bg-indigo-950/30 text-indigo-300">Recommended Allocation (%)</th>
                    <th className="py-3.5 px-4 text-right bg-indigo-950/30 text-indigo-300">Recommended Value (₹ Cr)</th>
                    <th className="py-3.5 px-4 text-center">Delta Action (%)</th>
                    <th className="py-3.5 px-5 text-center">Execution Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80 font-sans">
                  {ALLOCATION_ITEMS.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Asset Name */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-bold text-white text-xs">{item.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-center text-slate-400 text-[11px]">
                        {item.category}
                      </td>

                      {/* Current Allocation % */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-300 bg-slate-900/40">
                        {item.currentPct}%
                      </td>

                      {/* Current Value ₹ Cr */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200 bg-slate-900/40">
                        ₹{item.currentValueCr.toFixed(1)} Cr
                      </td>

                      {/* Recommended Allocation % */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-cyan-300 bg-indigo-950/30">
                        {item.recommendedPct}%
                      </td>

                      {/* Recommended Value ₹ Cr */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-white bg-indigo-950/30">
                        ₹{item.recommendedValueCr.toFixed(1)} Cr
                      </td>

                      {/* Delta Action % */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border ${
                            item.deltaPct > 0
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : item.deltaPct < 0
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {item.deltaPct > 0 ? `+${item.deltaPct}% (+₹${item.deltaValueCr} Cr)` : item.deltaPct < 0 ? `${item.deltaPct}% (${item.deltaValueCr} Cr)` : '0% (Hold)'}
                        </span>
                      </td>

                      {/* Execution Action */}
                      <td className="py-3.5 px-5 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-[11px] font-mono font-bold ${
                            item.action === 'REDUCE'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-600/50'
                              : item.action === 'INCREASE'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {item.actionLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Table Footer Totals */}
                <tfoot className="bg-slate-950/90 border-t-2 border-slate-800 text-xs font-mono font-bold text-white">
                  <tr>
                    <td className="py-3.5 px-5 font-sans font-black uppercase text-slate-300">
                      Total Book Allocations
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 text-[11px]">
                      5 Tranches
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-300 bg-slate-900/40">
                      100.0%
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-200 bg-slate-900/40">
                      ₹100.0 Cr
                    </td>
                    <td className="py-3.5 px-4 text-right text-cyan-300 bg-indigo-950/30">
                      100.0%
                    </td>
                    <td className="py-3.5 px-4 text-right text-white bg-indigo-950/30">
                      ₹100.0 Cr
                    </td>
                    <td className="py-3.5 px-4 text-center text-emerald-400">
                      Net Zero Delta (₹0)
                    </td>
                    <td className="py-3.5 px-5 text-center text-emerald-400 font-sans text-[11px]">
                      Fully Balanced
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* REBALANCE EXECUTION & TRANSACTION SCHEDULE                                */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Allocation Shift Progress Bars */}
            <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Asset Shift Visualizer (Current vs Recommended)
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Total: ₹100.0 Cr</span>
              </div>

              <div className="space-y-3">
                {ALLOCATION_ITEMS.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-white font-mono">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-slate-400">Current: <strong className="text-slate-200">{item.currentPct}%</strong></span>
                        <ChevronRight className="w-3 h-3 text-slate-600" />
                        <span className="text-cyan-300">Target: <strong className="text-white">{item.recommendedPct}%</strong></span>
                        <span className={`font-bold ${item.deltaPct > 0 ? 'text-emerald-400' : item.deltaPct < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                          ({item.deltaPct > 0 ? `+${item.deltaPct}%` : `${item.deltaPct}%`})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                          <span>Current</span>
                          <span>{item.currentPct}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 rounded-full" style={{ width: `${item.currentPct * 2}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-cyan-300 mb-1 font-mono">
                          <span>Recommended</span>
                          <span>{item.recommendedPct}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style={{ width: `${item.recommendedPct * 2}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Engine Card */}
            <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Rebalance Execution Router
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Multi-leg order routing schedule with automated slippage protection and execution ledger.
                </p>

                <div className="space-y-3">
                  {/* Leg 1 */}
                  <div className={`p-3.5 rounded-xl border transition-all text-xs font-mono ${
                    executionStep >= 1 ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200' : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-[10px]">1</span>
                        Leg 1: Equity De-Risking Sell
                      </span>
                      {executionStep >= 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] text-slate-500">PENDING</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 pl-7">Liquidate -₹8.0 Cr Equity ➔ Credit into Central Clearing Book.</p>
                  </div>

                  {/* Leg 2 */}
                  <div className={`p-3.5 rounded-xl border transition-all text-xs font-mono ${
                    executionStep >= 2 ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200' : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center text-[10px]">2</span>
                        Leg 2: Sovereign G-Sec Buy Order
                      </span>
                      {executionStep >= 2 ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] text-slate-500">PENDING</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 pl-7">Acquire +₹5.0 Cr Sovereign 10-Year AAA Benchmark Bonds.</p>
                  </div>

                  {/* Leg 3 */}
                  <div className={`p-3.5 rounded-xl border transition-all text-xs font-mono ${
                    executionStep >= 3 ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200' : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-[10px]">3</span>
                        Leg 3: Cash & Overnight Reserve Deposit
                      </span>
                      {executionStep >= 3 ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] text-slate-500">PENDING</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 pl-7">Deposit +₹3.0 Cr into Central Bank Liquid Overnight Facility.</p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Est. Execution Friction: <strong className="text-white">₹14,200</strong></span>
                  <span>Max Slippage: <strong className="text-emerald-400">0.015%</strong></span>
                </div>
              </div>

              <div className="pt-6">
                {!isExecuted ? (
                  <button
                    type="button"
                    onClick={handleExecuteRebalance}
                    disabled={isExecuting}
                    className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/80 border border-indigo-400/40 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Executing Transaction Leg {executionStep} of 3...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Execute 1-Click Portfolio Rebalancing Order</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-center shadow-lg">
                    <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Rebalancing Executed & Settled</span>
                    </div>
                    <p className="text-[11px] text-emerald-300/80 mt-1">
                      New weights active across treasury books. Decision logged to immutable audit trail.
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
