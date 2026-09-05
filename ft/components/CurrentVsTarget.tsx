'use client';

import React from 'react';
import { AssetClassItem } from '../types/portfolio';
import { SlidersHorizontal, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CurrentVsTargetProps {
  assets: AssetClassItem[];
}

export const CurrentVsTarget: React.FC<CurrentVsTargetProps> = ({ assets }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Current vs Target Allocation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify allocation gaps that may require optimization.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" /> Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" /> Target
          </span>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="space-y-4">
        {assets.map((asset) => {
          const isOverweight = asset.differencePct > 0;
          const isUnderweight = asset.differencePct < 0;
          const isBalanced = asset.differencePct === 0;

          return (
            <div key={asset.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 space-y-2 hover:bg-slate-100/60 transition-colors">
              {/* Asset Header: Name & Difference Tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                    {asset.name}
                  </span>
                </div>

                {/* Overweight / Underweight / Balanced Tag */}
                <div>
                  {isOverweight && (
                    <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      +{asset.differencePct}% Overweight
                    </span>
                  )}
                  {isUnderweight && (
                    <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                      {asset.differencePct}% Underweight
                    </span>
                  )}
                  {isBalanced && (
                    <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Balanced (0%)
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bars (Current vs Target) */}
              <div className="space-y-1.5 pt-1">
                {/* Current Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500 w-12 font-medium">Current:</span>
                  <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${asset.allocationPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-800 w-10 text-right">
                    {asset.allocationPct}%
                  </span>
                </div>

                {/* Target Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-400 w-12 font-medium">Target:</span>
                  <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${asset.targetPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 w-10 text-right">
                    {asset.targetPct}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
