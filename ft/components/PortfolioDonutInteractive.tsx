'use client';

import React, { useState } from 'react';
import { AssetClassItem } from '../types/portfolio';
import { PieChart, TrendingUp, ShieldAlert, Sparkles, Droplets, Percent, DollarSign, Activity } from 'lucide-react';

interface PortfolioDonutInteractiveProps {
  assets: AssetClassItem[];
}

type DonutMode = 'allocation' | 'risk' | 'liquidity';

export const PortfolioDonutInteractive: React.FC<PortfolioDonutInteractiveProps> = ({ assets }) => {
  const [hoveredAsset, setHoveredAsset] = useState<AssetClassItem | null>(null);
  const [activeMode, setActiveMode] = useState<DonutMode>('allocation');

  // SVG Donut calculation
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius; // ~402.12

  // Determine percentage and total based on activeMode
  const getSlicePercentage = (asset: AssetClassItem) => {
    if (activeMode === 'risk') return asset.riskContributionPct;
    if (activeMode === 'liquidity') return (asset.liquidValueCr / 62.5) * 100; // Normalized to total liquid 62.5 Cr
    return asset.allocationPct; // Default allocation
  };

  const totalPercentage = 100;
  let accumulatedPercentage = 0;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between h-full text-slate-100">
      {/* Card Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Portfolio Donut Visualizer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive breakdown of allocation, risk contribution and liquidity
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMode('allocation')}
            className={`px-3 py-1 text-[11px] font-bold font-mono rounded-lg transition-all cursor-pointer ${
              activeMode === 'allocation'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Allocation %
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('risk')}
            className={`px-3 py-1 text-[11px] font-bold font-mono rounded-lg transition-all cursor-pointer ${
              activeMode === 'risk'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Risk Contrib %
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('liquidity')}
            className={`px-3 py-1 text-[11px] font-bold font-mono rounded-lg transition-all cursor-pointer ${
              activeMode === 'liquidity'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Liquidity
          </button>
        </div>
      </div>

      {/* Main Content Area: Donut Chart + Live Details Callout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-5">
        {/* Left: Interactive SVG Donut (6 cols) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90 transform overflow-visible">
              {assets.map((asset) => {
                const slicePct = getSlicePercentage(asset);
                const strokeDasharray = `${(slicePct / totalPercentage) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercentage / totalPercentage) * circumference);
                accumulatedPercentage += slicePct;

                const isHovered = hoveredAsset?.id === asset.id;

                return (
                  <circle
                    key={asset.id}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={asset.color}
                    strokeWidth={isHovered ? strokeWidth + 5 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer hover:opacity-90"
                    onMouseEnter={() => setHoveredAsset(asset)}
                    onMouseLeave={() => setHoveredAsset(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                {activeMode === 'allocation' ? '₹100 Cr' : activeMode === 'risk' ? '100%' : '₹62.5 Cr'}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {activeMode === 'allocation'
                  ? 'Total Capital'
                  : activeMode === 'risk'
                  ? 'Total Risk Pool'
                  : 'Liquid Buffer'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-mono mt-2 text-center">
            Mode: <span className="font-bold text-cyan-400 uppercase">{activeMode}</span> (Hover slice for 5 metrics)
          </p>
        </div>

        {/* Right: Dynamic Inspection Card & Legend (6 cols) */}
        <div className="md:col-span-6 space-y-3.5">
          {/* Live Hover Detail Box */}
          <div
            className={`p-4 rounded-xl border transition-all duration-200 ${
              hoveredAsset
                ? 'bg-slate-950/90 text-white border-cyan-500/40 shadow-xl ring-1 ring-cyan-500/30'
                : 'bg-slate-800/40 text-slate-300 border-slate-700/60'
            }`}
          >
            {hoveredAsset ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: hoveredAsset.color }}
                    />
                    <span className="text-sm font-extrabold tracking-tight text-white">{hoveredAsset.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {hoveredAsset.allocationPct}% Allocation
                  </span>
                </div>

                {/* All 5 Core Metrics Displayed */}
                <div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-800 text-xs font-mono">
                  {/* 1. Asset Value */}
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans uppercase">Asset Value</span>
                    <span className="text-sm font-bold text-white">₹{hoveredAsset.valueCr.toFixed(1)} Cr</span>
                  </div>
                  {/* 2. Expected Return */}
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans uppercase">Expected Return</span>
                    <span className="text-sm font-bold text-emerald-400">+{hoveredAsset.expectedReturnPct}%</span>
                  </div>
                  {/* 3. Risk Contribution */}
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans uppercase">Risk Contribution</span>
                    <span className={`text-sm font-bold ${
                      hoveredAsset.riskContributionPct > 40 ? 'text-amber-400' : 'text-cyan-300'
                    }`}>
                      {hoveredAsset.riskContributionPct}%
                    </span>
                  </div>
                  {/* 4. Liquidity Score / Tier */}
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans uppercase">Liquidity</span>
                    <span className="text-sm font-bold text-teal-300">
                      {(hoveredAsset.liquidityScore * 100).toFixed(0)}% ({hoveredAsset.liquidityLevel.split(' ')[0]})
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-2.5 text-center text-xs text-slate-400">
                <Sparkles className="w-5 h-5 text-cyan-400 mx-auto mb-1 opacity-80" />
                <p className="font-bold text-white">Live Multi-Asset Visualizer</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Hover over any slice or legend item for full 5-point telemetry.
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
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  hoveredAsset?.id === asset.id
                    ? 'bg-slate-800 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/20'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: asset.color }}
                  />
                  <div className="truncate">
                    <span className="font-bold text-slate-100 block leading-tight truncate">{asset.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">₹{asset.valueCr} Cr</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-cyan-400 text-xs block">
                    {activeMode === 'allocation'
                      ? `${asset.allocationPct}%`
                      : activeMode === 'risk'
                      ? `${asset.riskContributionPct}%`
                      : `${(asset.liquidityScore * 100).toFixed(0)}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
