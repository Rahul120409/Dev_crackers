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
    <div className={`min-h-screen w-full bg-gradient-to-br from-[#caf0f8] via-[#def6fa] to-[#c2eff7] text-slate-900 flex flex-col justify-between p-6 sm:p-10 select-none overflow-x-hidden font-sans antialiased relative transition-opacity duration-300 ${isNavigating ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}`}>
      
      {/* ========================================================================= */}
      {/* 1. BACKGROUND AMBIENT GLOWS (NO GRID LINES)                               */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#00b4d8]/20 via-[#0077b6]/15 to-transparent rounded-full blur-[140px]" />
        <div className="absolute -top-20 left-1/5 w-[500px] h-[500px] bg-white/45 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/5 w-[550px] h-[550px] bg-[#90e0ef]/45 rounded-full blur-[120px]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP INSTITUTIONAL HEADER                                               */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full flex items-center justify-between border-2 border-[#0077b6]/25 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-4 shadow-[0_10px_30px_rgba(0,119,182,0.12)]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0077b6] via-[#0096c7] to-[#00b4d8] flex items-center justify-center text-white shadow-md ring-2 ring-white shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-[#03045e] text-lg sm:text-xl tracking-tight">CapitalGuard</span>
              <span className="text-[11px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded bg-[#03045e] text-[#caf0f8] shadow-xs">
                ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-[#0077b6] font-bold leading-none mt-1">
              Institutional Asset & Capital Operating System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#caf0f8]/60 border border-[#0077b6]/30 text-[#03045e] shadow-xs">
            <Building className="w-4 h-4 text-[#0077b6] shrink-0" />
            <span className="font-black text-[#03045e]">Apex Commercial Bank Ltd.</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-5 py-2.5 rounded-xl bg-[#03045e] hover:bg-[#0077b6] text-white font-black text-xs transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 tracking-wide uppercase"
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
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 border-2 border-[#0077b6]/30 text-[#03045e] text-xs font-mono font-black mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#0077b6] animate-pulse" />
          <span>Next-Generation Balance Sheet Governance</span>
        </div>

        {/* Hero Headlines */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#03045e] tracking-tight leading-[1.05]">
          Protect the Capital. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077b6] via-[#0096c7] to-[#03045e]">
            Optimize the Future.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-lg text-[#03045e]/90 max-w-2xl font-semibold leading-relaxed">
          Comprehensive real-time risk simulation, portfolio optimization, automated Basel III regulatory safeguards, and liquidity management for institutional treasuries.
        </p>

        {/* ======================================================================= */}
        {/* PROMINENT "GET STARTED" ACTION BUTTONS                                   */}
        {/* ======================================================================= */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            id="welcome-get-started-button"
            onClick={handleGetStarted}
            className="w-full sm:w-auto flex-1 group px-8 py-4 rounded-xl bg-[#03045e] hover:bg-[#0077b6] text-white font-black text-base flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(3,4,94,0.3)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleRegister}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-[#03045e] text-[#03045e] hover:text-white font-black text-sm border-2 border-[#0077b6]/40 transition-all cursor-pointer shadow-sm"
          >
            Create Account
          </button>
        </div>

        {/* Core Institutional Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full text-left">
          <div className="p-5 rounded-2xl bg-white/90 border-2 border-[#0077b6]/25 backdrop-blur-sm hover:border-[#0077b6] transition-all hover:shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#caf0f8] border border-[#0077b6]/40 flex items-center justify-center text-[#03045e] mb-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#03045e]" />
            </div>
            <div className="text-base font-black text-[#03045e]">Automated Safeguards</div>
            <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-medium">
              Active breach detection, automated emergency rebalancing, and statutory Basel III buffers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/90 border-2 border-[#0077b6]/25 backdrop-blur-sm hover:border-[#0077b6] transition-all hover:shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#caf0f8] border border-[#0077b6]/40 flex items-center justify-center text-[#03045e] mb-3 shadow-xs">
              <Zap className="w-5 h-5 text-[#03045e]" />
            </div>
            <div className="text-base font-black text-[#03045e]">Stress Test Simulator</div>
            <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-medium">
              Deterministic market shock simulations (-10%, -20%, -30%) with instantaneous loss projections.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/90 border-2 border-[#0077b6]/25 backdrop-blur-sm hover:border-[#0077b6] transition-all hover:shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#caf0f8] border border-[#0077b6]/40 flex items-center justify-center text-[#03045e] mb-3 shadow-xs">
              <Layers className="w-5 h-5 text-[#03045e]" />
            </div>
            <div className="text-base font-black text-[#03045e]">Capital Optimization</div>
            <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-medium">
              Multi-asset allocation, HHI concentration control, and risk-weighted capital efficiency.
            </p>
          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER & COMPLIANCE                                                    */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#03045e]/80 border-t-2 border-[#0077b6]/25 pt-5 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
          <span className="font-extrabold text-[#03045e]">System Online • Book ID #CS-IND-0926</span>
        </div>
        <div className="flex items-center gap-4 text-[#03045e] font-bold">
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


