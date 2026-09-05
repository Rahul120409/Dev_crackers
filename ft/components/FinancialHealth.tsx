'use client';

import React from 'react';
import { HealthIndicator } from '../types/dashboard';
import { ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

interface FinancialHealthProps {
  indicators: HealthIndicator[];
}

export const FinancialHealth: React.FC<FinancialHealthProps> = ({ indicators }) => {
  const getStatusBadge = (status: HealthIndicator['status']) => {
    switch (status) {
      case 'Safe':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Safe
          </span>
        );
      case 'Watch':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Watch
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <AlertCircle className="w-3 h-3 text-blue-600" />
            Moderate
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Critical
          </span>
        );
      default:
        return null;
    }
  };

  const getBarColor = (status: HealthIndicator['status']) => {
    switch (status) {
      case 'Safe':
        return 'bg-emerald-600';
      case 'Watch':
        return 'bg-amber-500';
      case 'Moderate':
        return 'bg-blue-600';
      case 'Critical':
        return 'bg-rose-600';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Financial Health & Safeguards</h2>
              <p className="text-[11px] text-slate-500">Prudential limits and stress threshold indicators</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Basel III / RBI Audit
          </span>
        </div>

        {/* 4 Horizontal Indicators */}
        <div className="mt-4 space-y-4">
          {indicators.map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">({item.metric})</span>
                </div>
                {getStatusBadge(item.status)}
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(item.status)}`}
                  style={{ width: `${item.valuePercentage}%` }}
                />
              </div>

              {/* Threshold info */}
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Regulatory Benchmark: {item.threshold}</span>
                <span className="font-mono text-slate-600 font-medium">{item.valuePercentage}% of limit</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1 text-slate-600 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Overall Solvency: Compliant
        </span>
        <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
          View Limit Rules →
        </span>
      </div>
    </div>
  );
};
