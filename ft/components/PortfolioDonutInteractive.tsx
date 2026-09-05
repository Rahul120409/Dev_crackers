'use client';

import React, { useState } from 'react';
import { AssetClassItem } from '../types/portfolio';
import { PieChart, TrendingUp, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface PortfolioDonutInteractiveProps {
  assets: AssetClassItem[];
}

export const PortfolioDonutInteractive: React.FC<PortfolioDonutInteractiveProps> = ({ assets }) => {
  const [hoveredAsset, setHoveredAsset] = useState<AssetClassItem | null>(null);

  // SVG Donut calculation
  const totalPercentage = 100;
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius; // ~402.12

  let accumulatedPercentage = 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Asset Allocation</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Current distribution of portfolio assets</p>
        </div>

        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
          ₹100 Cr Total Book
        </span>
      </div>

      {/* Main Content Area: Donut Chart + Live Details Callout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6">
        {/* Left: Interactive SVG Donut (6 cols) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90 transform overflow-visible">
              {assets.map((asset) => {
                const strokeDasharray = `${(asset.allocationPct / totalPercentage) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercentage / totalPercentage) * circumference);
                accumulatedPercentage += asset.allocationPct;

                const isHovered = hoveredAsset?.id === asset.id;

                return (
                  <circle
                    key={asset.id}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={asset.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredAsset(asset)}
                    onMouseLeave={() => setHoveredAsset(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-black font-mono tracking-tight text-slate-900">
                ₹100 Cr
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Portfolio
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-mono mt-3 text-center">
            Hover over segments to inspect asset metrics
          </p>
        </div>

        {/* Right: Dynamic Inspection Card & Legend (6 cols) */}
        <div className="md:col-span-6 space-y-4">
          {/* Live Hover Detail Box */}
          <div
            className={`p-4 rounded-xl border transition-all duration-200 ${
              hoveredAsset
                ? 'bg-slate-900 text-white border-slate-800 shadow-lg'
                : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            {hoveredAsset ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: hoveredAsset.color }}
                    />
                    <span className="text-sm font-bold tracking-tight">{hoveredAsset.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {hoveredAsset.allocationPct}% Allocation
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">CURRENT VALUE</span>
                    <span className="text-base font-bold text-white">₹{hoveredAsset.valueCr} Cr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">EXPECTED RETURN</span>
                    <span className="text-base font-bold text-emerald-400">+{hoveredAsset.expectedReturnPct}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">RISK LEVEL</span>
                    <span className={`text-xs font-bold ${
                      hoveredAsset.riskLevel === 'High' ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {hoveredAsset.riskLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">STATUS</span>
                    <span className={`text-xs font-bold ${
                      hoveredAsset.status === 'OVERWEIGHT'
                        ? 'text-amber-400'
                        : hoveredAsset.status === 'UNDERWEIGHT'
                        ? 'text-blue-400'
                        : 'text-emerald-400'
                    }`}>
                      {hoveredAsset.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-2 text-center text-xs text-slate-500">
                <Sparkles className="w-5 h-5 text-indigo-500 mx-auto mb-1 opacity-70" />
                <p className="font-semibold text-slate-700">Multi-Asset Allocation View</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Hover over any slice or legend item for live return & risk telemetry.
                </p>
              </div>
            )}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {assets.map((asset) => (
              <div
                key={asset.id}
                onMouseEnter={() => setHoveredAsset(asset)}
                onMouseLeave={() => setHoveredAsset(null)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  hoveredAsset?.id === asset.id
                    ? 'bg-slate-100 border-indigo-300 shadow-xs'
                    : 'bg-white border-slate-150 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: asset.color }}
                  />
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">{asset.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">₹{asset.valueCr} Cr</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-800 text-xs">
                  {asset.allocationPct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
