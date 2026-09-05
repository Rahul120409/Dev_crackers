'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Activity,
  ChevronRight,
  Sparkles,
  Lock,
  Building,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Cpu
} from 'lucide-react';

export default function WelcomeGetStartedPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGetStarted = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/login');
    }, 300);
  };

  const handleRegister = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/register');
    }, 300);
  };

  return (
    <div className={`min-h-screen w-full bg-[#02050e] text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none overflow-x-hidden font-sans antialiased relative transition-opacity duration-300 ${isNavigating ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}`}>
      
      {/* ========================================================================= */}
      {/* 1. BACKGROUND AMBIENT GLOWS & GRID PATTERN                                */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radial ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-blue-600/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute -top-20 left-1/5 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/5 w-[500px] h-[500px] bg-indigo-700/10 rounded-full blur-[130px]" />

        {/* Ambient Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP INSTITUTIONAL HEADER                                               */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/40 ring-1 ring-indigo-400/40">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">CapitalGuard</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Institutional Asset & Capital Operating System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            <span>Apex Commercial Bank Ltd.</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            Officer Sign In
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN HERO SHOWCASE (DEDICATED "GET STARTED" VIEW)                       */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center my-auto py-8 text-center max-w-4xl mx-auto w-full">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Balance Sheet Governance</span>
        </div>

        {/* Hero Headlines */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
          Protect the Capital. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
            Optimize the Future.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
          Comprehensive real-time risk simulation, portfolio optimization, automated Basel III regulatory safeguards, and liquidity management for institutional treasuries.
        </p>

        {/* ======================================================================= */}
        {/* PROMINENT "GET STARTED" ACTION BUTTONS                                   */}
        {/* ======================================================================= */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            id="welcome-get-started-button"
            onClick={handleGetStarted}
            className="w-full sm:w-auto flex-1 group px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(56,189,248,0.45)] border border-cyan-400/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 text-cyan-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleRegister}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all cursor-pointer"
          >
            Create Account
          </button>
        </div>

        {/* Core Institutional Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full text-left">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">Automated Safeguards</div>
            <p className="text-xs text-slate-400 mt-1">
              Active breach detection, automated emergency rebalancing, and statutory Basel III buffers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">Stress Test Simulator</div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic market shock simulations (-10%, -20%, -30%) with instantaneous loss projections.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">Capital Optimization</div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-asset allocation, HHI concentration control, and risk-weighted capital efficiency.
            </p>
          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER & COMPLIANCE                                                    */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/80 pt-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>System Online • Book ID #CS-IND-0926</span>
        </div>
        <div className="flex items-center gap-4">
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
