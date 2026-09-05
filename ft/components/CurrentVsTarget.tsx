'use client';

import React, { useState } from 'react';
import { AssetClassItem } from '../types/portfolio';
import { SlidersHorizontal, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Droplets, Shield } from 'lucide-react';

interface CurrentVsTargetProps {
  assets: AssetClassItem[];
}

export const CurrentVsTarget: React.FC<CurrentVsTargetProps> = ({ assets }) => {
  const [viewMetric, setViewMetric] = useState<'allocation' | 'risk_liquidity'>('allocation');

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5 h-full flex flex-col justify-between text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Allocation & Risk Weight Bars
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare Current vs Target allocations, Risk contributions and Liquidity buffers
          </p>
        </div>

        {/* Bar View Selector */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMetric('allocation')}
            className={`px-3 py-1 text-[11px] font-bold font-mono rounded-lg transition-all cursor-pointer ${
              viewMetric === 'allocation'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Current vs Target
          </button>
          <button
            type="button"
            onClick={() => setViewMetric('risk_liquidity')}
            className={`px-3 py-1 text-[11px] font-bold font-mono rounded-lg transition-all cursor-pointer ${
              viewMetric === 'risk_liquidity'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Risk & Liquidity Bars
          </button>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="space-y-3.5 flex-1">
        {assets.map((asset) => {
          const isOverweight = asset.differencePct > 0;
          const isUnderweight = asset.differencePct < 0;
          const isBalanced = asset.differencePct === 0;

          return (
            <div key={asset.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2.5 hover:bg-slate-800/70 hover:border-slate-600 transition-colors">
              {/* Asset Header: Name, Value & Difference Tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-xs font-bold text-white font-mono">
                    {asset.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    (₹{asset.valueCr} Cr)
                  </span>
                </div>

                {/* Overweight / Underweight / Balanced Tag */}
                <div>
                  {isOverweight && (
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      +{asset.differencePct}% Overweight
                    </span>
                  )}
                  {isUnderweight && (
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {asset.differencePct}% Underweight
                    </span>
                  )}
                  {isBalanced && (
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Balanced (0%)
                    </span>
                  )}
                </div>
              </div>

              {viewMetric === 'allocation' ? (
                /* Progress Bars (Current vs Target) */
                <div className="space-y-1.5 pt-0.5">
                  {/* Current Bar */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-slate-400 w-12 font-semibold">Current:</span>
                    <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-750">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${asset.allocationPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400 w-12 text-right">
                      {asset.allocationPct}%
                    </span>
                  </div>

                  {/* Target Bar */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-slate-500 w-12 font-semibold">Target:</span>
                    <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-750">
                      <div
                        className="bg-slate-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${asset.targetPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 w-12 text-right">
                      {asset.targetPct}%
                    </span>
                  </div>
                </div>
              ) : (
                /* Risk Contribution & Liquidity Progress Bars */
                <div className="space-y-1.5 pt-0.5">
                  {/* Risk Contribution Bar */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-amber-400 w-12 font-semibold">Risk:</span>
                    <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-750">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${asset.riskContributionPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 w-12 text-right">
                      {asset.riskContributionPct}%
                    </span>
                  </div>

                  {/* Liquidity Score Bar */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-teal-400 w-12 font-semibold">Liquid:</span>
                    <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-750">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${asset.liquidityScore * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-400 w-12 text-right">
                      {(asset.liquidityScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Mini Footer: Return, Risk, Liquidity summary line */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-700/60">
                <span className="text-emerald-400 font-bold">Return: +{asset.expectedReturnPct}%</span>
                <span className="text-amber-400 font-bold">Risk Contrib: {asset.riskContributionPct}%</span>
                <span className="text-teal-400 font-bold">Liquidity: ₹{asset.liquidValueCr} Cr ({asset.liquidityLevel.split(' ')[0]})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
