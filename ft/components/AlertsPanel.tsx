'use client';

import React from 'react';
import { AlertItem } from '../types/dashboard';
import { AlertTriangle, Bell, Clock, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';

interface AlertsPanelProps {
  alerts: AlertItem[];
  onViewAllAlerts?: () => void;
  onAcknowledgeAlert?: (id: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onViewAllAlerts,
  onAcknowledgeAlert,
}) => {
  const getSeverityStyle = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'HIGH':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          border: 'border-l-4 border-l-rose-500',
          iconColor: 'text-rose-600',
        };
      case 'WARNING':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-300',
          border: 'border-l-4 border-l-amber-500',
          iconColor: 'text-amber-600',
        };
      case 'MODERATE':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          border: 'border-l-4 border-l-blue-500',
          iconColor: 'text-blue-600',
        };
      default:
        return {
          badge: 'bg-slate-50 text-slate-700 border-slate-200',
          border: 'border-l-4 border-l-slate-400',
          iconColor: 'text-slate-600',
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Important Alerts</h2>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800">
                  {alerts.length} Require Review
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Active risk threshold breaches and safeguard triggers</p>
            </div>
          </div>
          <button
            onClick={onViewAllAlerts}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            Alert Center <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="mt-3.5 space-y-2.5">
          {alerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 ${style.border} hover:bg-slate-100/60 transition-all`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${style.badge}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed font-normal">
                  <span className="font-semibold text-slate-700">Observation:</span> {alert.currentValue}
                </p>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 text-[10px] truncate max-w-[240px]">
                    <strong className="font-semibold text-slate-700">Action:</strong> {alert.recommendedAction}
                  </span>
                  <button
                    onClick={() => onAcknowledgeAlert?.(alert.id)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-0.5 rounded hover:bg-indigo-50 transition-colors"
                  >
                    Resolve →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
        <span>Safeguard Protocol: Auto-Escalate after 4h</span>
        <span className="text-emerald-700 font-medium">Risk Control Engine v1.0</span>
      </div>
    </div>
  );
};
