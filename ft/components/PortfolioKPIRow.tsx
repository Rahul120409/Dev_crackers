'use client';

import React from 'react';
import { PortfolioKPI } from '../types/portfolio';
import {
  Building2,
  Layers,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2
} from 'lucide-react';

interface PortfolioKPIRowProps {
  kpis: PortfolioKPI[];
}

export const PortfolioKPIRow: React.FC<PortfolioKPIRowProps> = ({ kpis }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-indigo-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-blue-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      default:
        return <Building2 className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getStatusBadge = (kpi: PortfolioKPI) => {
    if (kpi.statusType === 'optimal' || kpi.statusType === 'safe') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {kpi.statusText}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        {kpi.statusText}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            {/* Header: Title & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500">
                {kpi.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                {getIcon(kpi.icon)}
              </div>
            </div>

            {/* Value & Unit */}
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
                {kpi.value}
              </span>
              <span className="text-sm font-bold text-slate-500 font-mono">{kpi.unit}</span>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-slate-500 mt-1 font-medium">{kpi.subtitle}</p>
          </div>

          {/* Footer: Trend Change & Status */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span
              className={`flex items-center gap-1 font-semibold text-[11px] ${
                kpi.isPositive ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {kpi.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{kpi.change}</span>
            </span>

            {getStatusBadge(kpi)}
          </div>
        </div>
      ))}
    </div>
  );
};
