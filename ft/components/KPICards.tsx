'use client';

import React from 'react';
import {
  Building2,
  Coins,
  Droplets,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { KPIMetric } from '../types/dashboard';

interface KPICardsProps {
  metrics: KPIMetric[];
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-indigo-600" />;
      case 'Coins':
        return <Coins className="w-5 h-5 text-emerald-600" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-cyan-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusBadge = (metric: KPIMetric) => {
    switch (metric.status) {
      case 'safe':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
            <CheckCircle className="w-3 h-3" />
            {metric.statusText}
          </span>
        );
      case 'watch':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {metric.statusText}
          </span>
        );
      case 'warning':
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            {metric.statusText}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const isRisk = metric.id === 'risk-score';
        return (
          <div
            key={metric.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Row: Icon + Status */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center">
                  {getIcon(metric.iconName)}
                </div>
                {getStatusBadge(metric)}
              </div>

              {/* Title */}
              <div className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                {metric.title}
              </div>

              {/* Metric Value */}
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                  {metric.value}
                </span>
                <span className="text-sm font-semibold text-slate-600 font-sans">
                  {metric.unit}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-1">
                {metric.description}
              </p>
            </div>

            {/* Bottom Row: Trend indicator */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span
                className={`font-medium inline-flex items-center gap-0.5 ${
                  metric.isPositive
                    ? 'text-emerald-700'
                    : isRisk
                    ? 'text-amber-700 font-semibold'
                    : 'text-rose-600'
                }`}
              >
                {metric.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {metric.change}
              </span>
              <span className="text-slate-400 text-[10px]">Real-time</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
