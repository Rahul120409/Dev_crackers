'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Scale, SlidersHorizontal } from 'lucide-react';

interface PortfolioOptimizationCTAProps {
  onOpenOptimization?: () => void;
}

export const PortfolioOptimizationCTA: React.FC<PortfolioOptimizationCTAProps> = ({ onOpenOptimization }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/70 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Text Area */}
      <div className="relative z-10 space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>PORTFOLIO REBALANCING OPPORTUNITY</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Ready to optimize the portfolio?
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          Let CapitalGuard evaluate allocation, capital requirements, liquidity and risk constraints to shift into the optimal Markowitz frontier curve.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Basel III Guaranteed
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Scale className="w-4 h-4 text-cyan-400" />
            +8% Sharpe Efficiency
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            Zero Liquidity Disruption
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
        <Link
          href="/dashboard"
          onClick={(e) => {
            if (onOpenOptimization) {
              e.preventDefault();
              onOpenOptimization();
            }
          }}
          className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all shadow-xl shadow-indigo-950/80 flex items-center justify-center gap-2 border border-indigo-400/40 cursor-pointer group"
        >
          <span>OPEN OPTIMIZATION CENTER</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard"
          className="px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs tracking-wider uppercase rounded-xl border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
        >
          <span>VIEW RISK & CONTROLS</span>
        </Link>
      </div>
    </div>
  );
};
