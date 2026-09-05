'use client';

import React from 'react';
import { ActivityItem } from '../types/dashboard';
import { History, CheckCircle2, Shield, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityItem[];
  onViewHistory?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onViewHistory,
}) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'analysis':
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'risk':
        return <Shield className="w-3.5 h-3.5 text-emerald-600" />;
      case 'optimization':
        return <Sparkles className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Activity & Audit</h2>
              <p className="text-[11px] text-slate-500">Autonomous ledger of control actions and analyses</p>
            </div>
          </div>
          <button
            onClick={onViewHistory}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            Audit Log <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Activity Timeline Items */}
        <div className="mt-4 relative pl-4 border-l-2 border-slate-100 space-y-4">
          {activities.map((item) => (
            <div key={item.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center shadow-xs" />

              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    {item.description}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">
                  {item.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Immutable Ledger: Hash Verified</span>
        <span className="font-mono text-[10px] text-slate-500">Block #0926-882</span>
      </div>
    </div>
  );
};
