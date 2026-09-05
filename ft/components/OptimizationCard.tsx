'use client';

import React from 'react';
import { OptimizationDetails } from '../types/dashboard';
import { Sparkles, TrendingDown, ArrowUpRight, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

interface OptimizationCardProps {
  optimization: OptimizationDetails;
  onOpenOptimization: () => void;
}

export const OptimizationCard: React.FC<OptimizationCardProps> = ({
  optimization,
  onOpenOptimization,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-lg border border-indigo-900/50 relative overflow-hidden flex flex-col justify-between">
      {/* Background Accent / subtle geometry */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Automated Rebalancing Engine
            </span>
          </div>
          <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
            Recommended Action
          </span>
        </div>

        {/* Title and Subtitle */}
        <div className="mt-3">
          <h2 className="text-base font-bold text-white tracking-tight">
            {optimization.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">
            {optimization.description}
          </p>
        </div>

        {/* 3 Metric Badges */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {/* Expected Risk Reduction */}
          <div className="bg-slate-800/80 border border-slate-700/70 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              <span>Risk Reduction</span>
              <TrendingDown className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-emerald-400">
                {optimization.riskReduction}%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Lower tail VaR</p>
          </div>

          {/* Liquidity Improvement */}
          <div className="bg-slate-800/80 border border-slate-700/70 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              <span>Liquidity Delta</span>
              <ArrowUpRight className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-cyan-400">
                {optimization.liquidityImprovement}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Tier-1 HQLA buffer</p>
          </div>

          {/* Capital Efficiency */}
          <div className="bg-slate-800/80 border border-slate-700/70 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              <span>Capital Efficiency</span>
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-indigo-300">
                +{optimization.capitalEfficiency}%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Risk-adjusted return</p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 relative z-10">
        <div className="text-[11px] text-slate-300 hidden sm:flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>All regulatory capital & liquidity constraints verified</span>
        </div>

        <button
          onClick={onOpenOptimization}
          className="w-full sm:w-auto ml-auto px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs rounded-lg transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>View Optimization</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
