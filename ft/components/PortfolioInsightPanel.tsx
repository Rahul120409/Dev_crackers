'use client';

import React from 'react';
import Link from 'next/link';
import { PortfolioInsightData } from '../types/portfolio';
import { Sparkles, ArrowRight, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface PortfolioInsightPanelProps {
  insight: PortfolioInsightData;
}

export const PortfolioInsightPanel: React.FC<PortfolioInsightPanelProps> = ({ insight }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white rounded-xl p-6 shadow-md border border-indigo-900/60 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left: Intelligence Message */}
      <div className="relative z-10 space-y-2 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </span>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-300">
            {insight.title}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
            {insight.badge}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">
          {insight.headline}
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          {insight.description}
        </p>

        <div className="pt-1 flex items-center gap-2 text-xs font-mono text-cyan-300">
          <span>Action:</span>
          <span className="text-slate-200">{insight.recommendationAction}</span>
        </div>
      </div>

      {/* Right: Quick Action to Optimization */}
      <div className="relative z-10 shrink-0 w-full md:w-auto">
        <Link
          href={insight.targetRebalanceRoute}
          className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-indigo-950/80 flex items-center justify-center gap-2 border border-indigo-400/30 group cursor-pointer"
        >
          <span>Open Optimizer</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
