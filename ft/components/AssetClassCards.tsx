'use client';

import React from 'react';
import { AssetClassItem } from '../types/portfolio';
import { TrendingUp, Shield, Activity, Droplets } from 'lucide-react';

interface AssetClassCardsProps {
  assets: AssetClassItem[];
}

export const AssetClassCards: React.FC<AssetClassCardsProps> = ({ assets }) => {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Very Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Low':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OVERWEIGHT':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'UNDERWEIGHT':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'BALANCED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            {/* Header: Asset Name & Status Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="font-extrabold text-sm text-slate-900 tracking-tight uppercase">
                  {asset.name}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${getStatusBadge(asset.status)}`}>
                {asset.status}
              </span>
            </div>

            {/* Value & Percentage */}
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black font-mono tracking-tight text-slate-900">
                  ₹{asset.valueCr}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono ml-1">Cr</span>
              </div>
              <span className="text-xs font-bold font-mono px-2 py-1 bg-slate-100 rounded-md text-slate-700">
                {asset.allocationPct}% allocation
              </span>
            </div>

            {/* Description */}
            <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {asset.description}
            </p>
          </div>

          {/* Metrics Footer: Risk & Expected Return */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Risk
              </span>
              <span className={`inline-block mt-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(asset.riskLevel)}`}>
                {asset.riskLevel}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Exp. Return
              </span>
              <span className="text-sm font-extrabold font-mono text-emerald-600 mt-0.5 block">
                +{asset.expectedReturnPct}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
