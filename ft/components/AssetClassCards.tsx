'use client';

import React from 'react';
import { AssetClassItem } from '../types/portfolio';
import { TrendingUp, Shield, Activity, Droplets, Percent } from 'lucide-react';

interface AssetClassCardsProps {
  assets: AssetClassItem[];
}

export const AssetClassCards: React.FC<AssetClassCardsProps> = ({ assets }) => {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Very Low':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Low':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      case 'Medium':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'High':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OVERWEIGHT':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'UNDERWEIGHT':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'BALANCED':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm hover:border-slate-700 transition-all flex flex-col justify-between group text-slate-100"
        >
          <div>
            {/* Header: Asset Name & Status Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="font-extrabold text-xs text-white tracking-tight uppercase truncate">
                  {asset.name}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono shrink-0 ${getStatusBadge(asset.status)}`}>
                {asset.status}
              </span>
            </div>

            {/* 1. Asset Value & 2. Current Allocation */}
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black font-mono tracking-tight text-white">
                  ₹{asset.valueCr.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono ml-1">Cr</span>
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/30 rounded-md text-cyan-300">
                {asset.allocationPct}% allocation
              </span>
            </div>

            {/* Description */}
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
              {asset.description}
            </p>
          </div>

          {/* Metrics Footer: 3. Expected Return, 4. Risk Contribution, 5. Liquidity */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs font-mono">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider block">
                  Exp. Return
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  +{asset.expectedReturnPct}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider block">
                  Risk Contrib
                </span>
                <span className={`text-sm font-extrabold ${
                  asset.riskContributionPct > 40 ? 'text-amber-400' : 'text-slate-200'
                }`}>
                  {asset.riskContributionPct}%
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-sans flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-400" />
                Liquidity:
              </span>
              <span className="font-bold text-teal-300">
                {(asset.liquidityScore * 100).toFixed(0)}% (₹{asset.liquidValueCr} Cr)
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
