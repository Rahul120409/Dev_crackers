'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Activity,
  ChevronRight,
  Sparkles,
  Building,
  CheckCircle2,
  PieChart,
  ShieldAlert,
  Gauge,
  Wallet
} from 'lucide-react';

export default function WelcomeGetStartedPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [stressScenario, setStressScenario] = useState<number>(10); // 10, 20, or 30

  const handleGetStarted = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/login');
    }, 250);
  };

  const handleRegister = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/register');
    }, 250);
  };

  const functionsData = [
    {
      id: 'portfolio',
      title: 'Portfolio & Balance Sheet Intelligence',
      short: 'Portfolio Intelligence',
      badge: 'Real-time Book',
      icon: PieChart,
      color: '#0077b6',
      summary: 'Continuous asset monitoring across Sovereign Debt, Equities, MBS, Corporate Bonds & Cash Reserves with real-time HHI concentration metrics.',
      capabilities: [
        'Multi-asset balance sheet classification across 6 tiers',
        'Herfindahl-Hirschman Index (HHI) concentration tracking',
        'Live market valuation & yield spread calculations',
        'Automated book risk scoring on an institutional 0-100 scale'
      ],
      metrics: [
        { label: 'Health Score', value: '94.2 / 100', highlight: true },
        { label: 'HHI Concentration', value: '0.18 (Optimal)' },
        { label: 'Active Capital Book', value: '$248.50M' }
      ]
    },
    {
      id: 'risk',
      title: '1-Day 95% VaR & Risk Telemetry',
      short: 'Risk & 95% VaR',
      badge: 'Statutory Engine',
      icon: Activity,
      color: '#0096c7',
      summary: 'Continuous parametric and historical Value-at-Risk modeling with statutory threshold monitoring and volatility telemetry.',
      capabilities: [
        '1-Day 95% confidence parametric VaR calculation',
        'Live historical covariance volatility modeling',
        'Instantaneous statutory threshold breach alerts',
        'Multi-asset risk contribution decomposition'
      ],
      metrics: [
        { label: '95% 1-Day VaR', value: '$1.42M (0.57%)', highlight: true },
        { label: 'Confidence Level', value: '95.0% Parametric' },
        { label: 'Volatility Band', value: 'Normal / Stable' }
      ]
    },
    {
      id: 'simulator',
      title: 'Deterministic Stress Test Simulator',
      short: 'Stress Simulator',
      badge: 'Scenario Engine',
      icon: Zap,
      color: '#03045e',
      summary: 'Instantaneous macroeconomic shock simulations (-10%, -20%, -30%) with loss distribution and capital adequacy resilience scoring.',
      capabilities: [
        'Pre-configured macro equity & credit market shocks',
        'Cross-asset loss propagation modeling in <15ms',
        'Post-shock Tier 1 capital adequacy forecasting',
        'Autonomous mitigation recommendations'
      ],
      metrics: [
        { label: 'Shock Scenario', value: `-${stressScenario}% Market Shock`, highlight: true },
        { label: 'Projected Loss', value: `-$${(2.485 * stressScenario).toFixed(1)}M` },
        { label: 'Post-Shock Tier 1', value: `${(14.8 - stressScenario * 0.12).toFixed(1)}% (Pass)` }
      ]
    },
    {
      id: 'optimization',
      title: 'Quadratic Capital Optimizer',
      short: 'Capital Optimizer',
      badge: 'RWA Rebalancer',
      icon: Layers,
      color: '#0077b6',
      summary: 'Mathematical balance sheet rebalancing to maximize risk-adjusted yields while minimizing Risk-Weighted Assets (RWA) and HHI.',
      capabilities: [
        'Quadratic mean-variance optimization algorithms',
        'Regulatory boundary & concentration constraints',
        'Side-by-side current vs. recommended asset weights',
        '1-Click automated rebalance proposal generator'
      ],
      metrics: [
        { label: 'Yield Uplift', value: '+1.45% Projected ROI', highlight: true },
        { label: 'RWA Reduction', value: '-$8.60M (3.4%)' },
        { label: 'Optimization Solver', value: 'Converged in 12ms' }
      ]
    },
    {
      id: 'safeguards',
      title: 'Automated Safeguards & Basel III Governance',
      short: 'Basel III & Governance',
      badge: 'Audit & Compliance',
      icon: ShieldCheck,
      color: '#023e8a',
      summary: 'Institutional risk circuit breakers, autonomous breach mitigation triggers, and immutable ALCO committee audit logs.',
      capabilities: [
        'Automated Basel III statutory buffer enforcement',
        'Instant circuit breakers for risk limit breaches',
        'Immutable governance audit trail & sign-offs',
        'ALCO decision approval workflow logs'
      ],
      metrics: [
        { label: 'Statutory Status', value: '100% Basel III Pass', highlight: true },
        { label: 'Governance Trail', value: 'SHA-256 Verified' },
        { label: 'Emergency Safeguard', value: 'Armed & Active' }
      ]
    }
  ];

  return (
    <div className={`min-h-screen w-full bg-white dark:bg-[#040d21] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-8 select-none overflow-x-hidden font-sans antialiased relative transition-opacity duration-300 ${isNavigating ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}`}>
      
      {/* Dynamic Background Atmospheric Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-[#caf0f8]/40 via-[#caf0f8]/20 to-transparent dark:from-cyan-500/10 dark:via-transparent dark:to-transparent rounded-full blur-[160px]" />
        <div className="absolute -top-24 left-1/6 w-[600px] h-[600px] bg-[#caf0f8]/30 dark:bg-indigo-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-12 right-1/6 w-[650px] h-[650px] bg-[#caf0f8]/30 dark:bg-cyan-500/15 rounded-full blur-[140px]" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP INSTITUTIONAL HEADER                                               */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full flex items-center justify-between border-2 border-[#caf0f8] dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-[0_10px_30px_rgba(202,240,248,0.7)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0077b6] via-[#0096c7] to-[#03045e] dark:from-cyan-600 dark:to-blue-700 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(0,119,182,0.35)] ring-2 ring-[#caf0f8] dark:ring-cyan-500/30 shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-[#03045e] dark:text-white text-lg sm:text-xl tracking-tight">CapitalGuard</span>
              <span className="text-[11px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-md bg-[#03045e] text-[#caf0f8] dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/30 shadow-xs">
                ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-[#0077b6] dark:text-slate-400 font-bold leading-none mt-1">
              Institutional Asset & Capital Operating System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border-2 border-[#caf0f8] dark:border-slate-800 text-[#03045e] dark:text-slate-200 shadow-xs">
            <Building className="w-4 h-4 text-[#0077b6] dark:text-cyan-400 shrink-0" />
            <span className="font-black text-[#03045e] dark:text-slate-200">Apex Commercial Bank Ltd.</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-5 py-2.5 rounded-xl bg-[#03045e] hover:bg-[#0077b6] dark:bg-gradient-to-r dark:from-cyan-600 dark:to-blue-600 dark:hover:from-cyan-500 dark:hover:to-blue-500 text-white font-black text-xs transition-all cursor-pointer shadow-[0_4px_15px_rgba(3,4,94,0.25)] hover:scale-105 active:scale-95 tracking-wide uppercase border-2 border-[#caf0f8] dark:border-cyan-400/30"
          >
            Officer Sign In
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO COMPOSITION & LIVE TELEMETRY CHIPS                                */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center my-6 text-center max-w-5xl mx-auto w-full bg-transparent">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-slate-900/90 border-2 border-[#caf0f8] dark:border-slate-800 text-[#03045e] dark:text-cyan-300 text-xs font-mono font-black mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#0077b6] dark:text-cyan-400 animate-pulse" />
          <span>Next-Generation Balance Sheet Governance & Risk Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#03045e] dark:text-white tracking-tight leading-[1.06]">
          Protect Capital. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077b6] via-[#0096c7] to-[#03045e] dark:from-white dark:via-cyan-200 dark:to-cyan-400">
            Optimize the Future.
          </span>
        </h1>

        <p className="mt-3.5 text-sm sm:text-base text-[#03045e]/90 dark:text-slate-300 max-w-2xl font-semibold leading-relaxed">
          Comprehensive real-time risk simulation, portfolio optimization, automated Basel III regulatory safeguards, and liquidity management for institutional treasuries.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
          <button
            id="welcome-get-started-button"
            onClick={handleGetStarted}
            className="w-full sm:w-auto flex-1 group px-8 py-3.5 rounded-xl bg-[#03045e] hover:bg-[#0077b6] dark:bg-gradient-to-r dark:from-cyan-600 dark:to-blue-600 dark:hover:from-cyan-500 dark:hover:to-blue-500 text-white font-black text-base flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(3,4,94,0.3)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.8)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-[#caf0f8] dark:border-cyan-400/30"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleRegister}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-[#03045e] dark:hover:bg-slate-800 text-[#03045e] dark:text-cyan-300 hover:text-white border-2 border-[#caf0f8] dark:border-slate-800 transition-all cursor-pointer shadow-sm"
          >
            Create Account
          </button>
        </div>

        {/* Live Snapshot Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 w-full max-w-4xl">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border-2 border-[#caf0f8] dark:border-slate-800 shadow-xs dark:shadow-md flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#caf0f8]/50 dark:bg-slate-800/80 border-2 border-[#caf0f8] dark:border-slate-700 flex items-center justify-center text-[#03045e] dark:text-cyan-300 shrink-0 font-bold">
              <Wallet className="w-4 h-4 text-[#0077b6] dark:text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase">Active Book</div>
              <div className="text-sm font-black text-[#03045e] dark:text-white">$248.50M</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border-2 border-[#caf0f8] dark:border-slate-800 shadow-xs dark:shadow-md flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#caf0f8]/50 dark:bg-slate-800/80 border-2 border-[#caf0f8] dark:border-slate-700 flex items-center justify-center text-[#03045e] dark:text-cyan-300 shrink-0 font-bold">
              <Gauge className="w-4 h-4 text-[#0077b6] dark:text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase">Health Score</div>
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">94.2 / 100</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border-2 border-[#caf0f8] dark:border-slate-800 shadow-xs dark:shadow-md flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#caf0f8]/50 dark:bg-slate-800/80 border-2 border-[#caf0f8] dark:border-slate-700 flex items-center justify-center text-[#03045e] dark:text-cyan-300 shrink-0 font-bold">
              <ShieldAlert className="w-4 h-4 text-[#0077b6] dark:text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase">95% 1-Day VaR</div>
              <div className="text-sm font-black text-[#03045e] dark:text-white">$1.42M</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border-2 border-[#caf0f8] dark:border-slate-800 shadow-xs dark:shadow-md flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#caf0f8]/50 dark:bg-slate-800/80 border-2 border-[#caf0f8] dark:border-slate-700 flex items-center justify-center text-[#03045e] dark:text-cyan-300 shrink-0 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#0077b6] dark:text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase">Basel III Buffer</div>
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">Compliant</div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 3. INTERACTIVE LIVE MODULE PREVIEW TERMINAL                              */}
        {/* ======================================================================= */}
        <section className="w-full mt-10 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0077b6] dark:bg-cyan-400 animate-pulse" />
                <h2 className="text-lg font-black text-[#03045e] dark:text-white tracking-tight">System Function Summary & Live Telemetry</h2>
              </div>
              <p className="text-xs text-[#0077b6] dark:text-slate-400 font-bold">
                Click any core engine module below to test its live interactive telemetry and features:
              </p>
            </div>
            <div className="text-[11px] font-mono font-black text-[#03045e] dark:text-cyan-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border-2 border-[#caf0f8] dark:border-slate-800 self-start sm:self-auto shadow-xs">
              ⚡ 5 Core Modules Active
            </div>
          </div>

          {/* Module Selector Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border-2 border-[#caf0f8] dark:border-slate-800 shadow-sm mb-4">
            {functionsData.map((fn, idx) => {
              const Icon = fn.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={fn.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-black transition-all cursor-pointer text-left border-2 ${
                    isActive
                      ? 'bg-[#03045e] dark:bg-gradient-to-r dark:from-cyan-600 dark:to-blue-600 text-white border-[#caf0f8] dark:border-cyan-400/40 shadow-md scale-[1.02]'
                      : 'text-[#03045e] dark:text-slate-300 bg-white dark:bg-slate-950 border-[#caf0f8] dark:border-slate-800 hover:bg-[#caf0f8]/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#caf0f8] dark:text-white' : 'text-[#0077b6] dark:text-cyan-400'}`} />
                  <span className="truncate">{fn.short}</span>
                </button>
              );
            })}
          </div>

          {/* Active Function Detailed Preview Card */}
          {(() => {
            const activeFn = functionsData[activeTab];
            const Icon = activeFn.icon;
            return (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/95 border-2 border-[#caf0f8] dark:border-slate-800 backdrop-blur-xl shadow-[0_15px_40px_rgba(202,240,248,0.6)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all">
                
                {/* Header of Active Module */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-4 border-b-2 border-[#caf0f8] dark:border-slate-800 gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border-2 border-[#caf0f8] dark:border-slate-800 flex items-center justify-center text-[#03045e] dark:text-cyan-400 shadow-sm shrink-0">
                      <Icon className="w-6 h-6 text-[#03045e] dark:text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-[#03045e] dark:text-white">{activeFn.title}</h3>
                        <span className="text-[10px] uppercase font-mono font-black tracking-wider px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-950 border-2 border-[#caf0f8] dark:border-slate-800 text-[#03045e] dark:text-cyan-300">
                          {activeFn.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5 max-w-2xl leading-relaxed">
                        {activeFn.summary}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleGetStarted}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#03045e] hover:bg-[#0077b6] dark:bg-gradient-to-r dark:from-cyan-600 dark:to-blue-600 dark:hover:from-cyan-500 dark:hover:to-blue-500 text-white font-black text-xs shadow-md transition-all cursor-pointer shrink-0 uppercase tracking-wider border-2 border-[#caf0f8] dark:border-cyan-400/30"
                  >
                    <span>Launch Module</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Interactive Body Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                  
                  {/* Left Column: Core Operations (5 Cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="text-[11px] font-mono font-black uppercase text-[#0077b6] dark:text-cyan-400 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Core Algorithmic Operations
                    </div>
                    <div className="space-y-2">
                      {activeFn.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-950 border-2 border-[#caf0f8] dark:border-slate-800 text-xs font-bold text-[#03045e] dark:text-slate-200 hover:bg-[#caf0f8]/40 dark:hover:bg-slate-800/80 transition-colors shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-[#0077b6] dark:text-cyan-400 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Live Interactive Simulation Widget (7 Cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="text-[11px] font-mono font-black uppercase text-[#0077b6] dark:text-cyan-400 tracking-wider flex items-center justify-between">
                      <span>Live Interactive Engine Snapshot</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Active Telemetry</span>
                    </div>

                    {/* DYNAMIC CONTENT PER TAB */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#03045e] dark:from-slate-950 dark:to-[#040d21] text-white border-2 border-[#caf0f8] dark:border-slate-800 shadow-inner space-y-3">
                      
                      {/* 1. PORTFOLIO VISUAL */}
                      {activeTab === 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-cyan-300 font-bold">Asset Allocation Breakdown</span>
                            <span className="text-slate-300">Total: $248.50M</span>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-[11px] font-mono mb-1">
                                <span className="text-slate-200 font-bold">Sovereign Debt (US Treasuries)</span>
                                <span className="text-cyan-400 font-bold">35% ($86.97M)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '35%' }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[11px] font-mono mb-1">
                                <span className="text-slate-200 font-bold">Corporate Bonds (Investment Grade)</span>
                                <span className="text-indigo-400 font-bold">25% ($62.12M)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-400 rounded-full" style={{ width: '25%' }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[11px] font-mono mb-1">
                                <span className="text-slate-200 font-bold">Blue-Chip Equities</span>
                                <span className="text-emerald-400 font-bold">20% ($49.70M)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '20%' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. RISK & 95% VAR VISUAL */}
                      {activeTab === 1 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-cyan-300 font-bold">1-Day 95% Parametric VaR Profile</span>
                            <span className="text-emerald-400 font-bold">● Risk Within Bounds</span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-950/80 border-2 border-[#caf0f8] dark:border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-mono text-slate-400">Maximum Daily Estimated Loss</div>
                              <div className="text-xl font-mono font-black text-cyan-400">$1,420,000</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] font-mono text-slate-400">Risk-to-Capital Ratio</div>
                              <div className="text-base font-mono font-black text-emerald-400">0.57% (Safe)</div>
                            </div>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            Covariance Matrix: 6x6 Inverted • Historical Window: 250 Trading Days
                          </div>
                        </div>
                      )}

                      {/* 3. STRESS TEST SIMULATOR VISUAL */}
                      {activeTab === 2 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-cyan-300 font-bold">Interactive Macro Stress Shock</span>
                            <span className="text-slate-400">Select Severity:</span>
                          </div>
                          
                          {/* Scenario Selector Buttons */}
                          <div className="grid grid-cols-3 gap-2">
                            {[10, 20, 30].map((scen) => (
                              <button
                                key={scen}
                                onClick={() => setStressScenario(scen)}
                                className={`py-1.5 px-2 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-2 ${
                                  stressScenario === scen
                                    ? 'bg-red-500 text-white border-[#caf0f8] dark:border-red-400 shadow-md'
                                    : 'bg-slate-800 text-slate-300 border-[#caf0f8]/40 dark:border-slate-700 hover:bg-slate-700'
                                }`}
                              >
                                -{scen}% Shock
                              </button>
                            ))}
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950/80 border-2 border-[#caf0f8] dark:border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-mono text-slate-400">Instantaneous Portfolio Loss</div>
                              <div className="text-lg font-mono font-black text-red-400">
                                -${(2.485 * stressScenario).toFixed(2)}M
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] font-mono text-slate-400">Tier 1 Capital Adequacy</div>
                              <div className="text-base font-mono font-black text-emerald-400">
                                {(14.8 - stressScenario * 0.12).toFixed(1)}% (Min: 10.5%)
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. CAPITAL OPTIMIZER VISUAL */}
                      {activeTab === 3 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-cyan-300 font-bold">Mean-Variance Capital Optimization</span>
                            <span className="text-emerald-400 font-bold">+1.45% Yield Uplift</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 rounded-xl bg-slate-950/80 border-2 border-[#caf0f8] dark:border-slate-800">
                              <div className="text-[10px] font-mono text-slate-400">Current Risk-Weighted Assets</div>
                              <div className="text-base font-mono font-black text-slate-200">$214.2M</div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-950/80 border-2 border-[#caf0f8] dark:border-slate-800">
                              <div className="text-[10px] font-mono text-slate-400">Optimized RWA Allocation</div>
                              <div className="text-base font-mono font-black text-emerald-400">$205.6M (-$8.6M)</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. BASEL III & GOVERNANCE VISUAL */}
                      {activeTab === 4 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-cyan-300 font-bold">Regulatory Compliance & Safeguards</span>
                            <span className="text-emerald-400 font-bold">● Armed & Verified</span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-950/80 border-2 border-[#caf0f8] dark:border-slate-800 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-300">Liquidity Coverage Ratio (LCR):</span>
                              <span className="text-emerald-400 font-black">142.5% (Min: 100%)</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-300">Net Stable Funding Ratio (NSFR):</span>
                              <span className="text-emerald-400 font-black">118.2% (Min: 100%)</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-300">Statutory ALCO Audit Hash:</span>
                              <span className="text-cyan-300 font-mono text-[10px]">#0x9f8e...4a12</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Metrics Footer Bar */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                        {activeFn.metrics.map((met, i) => (
                          <div key={i} className="p-1.5 rounded-lg bg-slate-950/60">
                            <div className="text-[9px] font-mono text-slate-400 truncate">{met.label}</div>
                            <div className={`text-xs font-mono font-black ${met.highlight ? 'text-cyan-300' : 'text-slate-200'} truncate`}>
                              {met.value}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            );
          })()}
        </section>

        {/* ======================================================================= */}
        {/* 4. 4-STEP INSTITUTIONAL WORKFLOW PIPELINE                               */}
        {/* ======================================================================= */}
        <section className="w-full mt-12 text-left">
          <div className="mb-4">
            <h2 className="text-lg font-black text-[#03045e] dark:text-white tracking-tight">How CapitalGuard Operates (4-Step Workflow Pipeline)</h2>
            <p className="text-xs text-[#0077b6] dark:text-slate-400 font-bold">
              End-to-end continuous risk mitigation and balance sheet optimization:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border-2 border-[#caf0f8] dark:border-slate-800 shadow-sm dark:shadow-md hover:border-[#0077b6] dark:hover:border-cyan-400 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-md bg-[#03045e] text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/30">STEP 01</span>
                <PieChart className="w-4 h-4 text-[#0077b6] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-sm font-black text-[#03045e] dark:text-white">Ingest & Classify</h4>
              <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                Connects balance sheet holdings across 6 asset tiers with instant HHI concentration index scoring.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border-2 border-[#caf0f8] dark:border-slate-800 shadow-sm dark:shadow-md hover:border-[#0077b6] dark:hover:border-cyan-400 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-md bg-[#03045e] text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/30">STEP 02</span>
                <Activity className="w-4 h-4 text-[#0077b6] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-sm font-black text-[#03045e] dark:text-white">Stress & Model VaR</h4>
              <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                Computes 1-Day 95% parametric risk and projects losses across -10%, -20%, and -30% market shocks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border-2 border-[#caf0f8] dark:border-slate-800 shadow-sm dark:shadow-md hover:border-[#0077b6] dark:hover:border-cyan-400 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-md bg-[#03045e] text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/30">STEP 03</span>
                <Layers className="w-4 h-4 text-[#0077b6] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-sm font-black text-[#03045e] dark:text-white">Optimize Capital</h4>
              <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                Solves quadratic mean-variance algorithms to minimize Risk-Weighted Assets while boosting portfolio ROI.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border-2 border-[#caf0f8] dark:border-slate-800 shadow-sm dark:shadow-md hover:border-[#0077b6] dark:hover:border-cyan-400 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-md bg-[#03045e] text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/30">STEP 04</span>
                <ShieldCheck className="w-4 h-4 text-[#0077b6] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-sm font-black text-[#03045e] dark:text-white">Govern & Safeguard</h4>
              <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                Enforces Basel III regulatory safeguards, automated circuit breakers, and ALCO audit logs.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 5. FOOTER & STATUTORY COMPLIANCE                                          */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#03045e]/80 dark:text-slate-400 border-t-2 border-[#caf0f8] dark:border-slate-800 pt-4 gap-2 mt-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
          <span className="font-extrabold text-[#03045e] dark:text-white">System Online • Book ID #CS-IND-0926</span>
        </div>
        <div className="flex items-center gap-4 text-[#03045e] dark:text-slate-400 font-bold">
          <span>Basel III Compliant</span>
          <span>•</span>
          <span>1-Day 95% VaR Engine</span>
          <span>•</span>
          <span>© 2026 CapitalGuard</span>
        </div>
      </footer>

    </div>
  );
}
