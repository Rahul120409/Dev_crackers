'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import {
  BellRing,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  RefreshCw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  Check
} from 'lucide-react';
import { SystemAlert } from '../../types/api';
import { getAlerts } from '../../services/riskService';

export default function AlertsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState('alerts');
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [filteredSeverity, setFilteredSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'MODERATE' | 'LOW'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const loadAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAlerts();
  };

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds(prev => [...prev, id]);
    setToastMessage(`Alert ${id} acknowledged by Risk Officer.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExecuteAction = (action: string, alertId: string) => {
    if (action === 'EMERGENCY_REBALANCE') {
      router.push('/optimization');
    } else if (action === 'REDUCE_EXPOSURE') {
      router.push('/portfolio');
    } else {
      router.push('/risk');
    }
  };

  const displayedAlerts = filteredSeverity === 'ALL'
    ? alerts
    : alerts.filter(a => a.severity === filteredSeverity);

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING').length;
  const moderateCount = alerts.filter(a => a.severity === 'MODERATE' || a.severity === 'LOW').length;

  return (
    <div className="flex h-screen bg-white dark:bg-[#070b14] text-[#03045e] dark:text-slate-100 font-sans overflow-hidden transition-colors">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0a0f1d] dark:via-[#070b14] dark:to-[#04070e] transition-colors">
        <Header />

        {/* Action / Title Bar */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  System Risk Alerts & Safeguard Triggers
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                    GET /api/alerts • Live
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Real-time notification engine monitoring limit breaches, concentration spikes, and automated control actions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title="Refresh Alerts Feed"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-6 py-2.5 flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable View Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-medium text-slate-400">Total Active Alerts</span>
              <div className="mt-2 text-3xl font-extrabold font-mono text-white">{alerts.length}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Live telemetry triggers</span>
            </div>

            <div className="bg-slate-900/60 border border-red-500/30 rounded-xl p-4">
              <span className="text-xs font-medium text-red-300">Critical Breaches</span>
              <div className="mt-2 text-3xl font-extrabold font-mono text-red-400">{criticalCount}</div>
              <span className="text-[10px] text-red-400 mt-1 block font-mono">Immediate intervention required</span>
            </div>

            <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-4">
              <span className="text-xs font-medium text-amber-300">Threshold Warnings</span>
              <div className="mt-2 text-3xl font-extrabold font-mono text-amber-400">{warningCount}</div>
              <span className="text-[10px] text-amber-300 mt-1 block font-mono">Approaching policy caps</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-medium text-slate-400">Monitored Metrics</span>
              <div className="mt-2 text-3xl font-extrabold font-mono text-cyan-400">{moderateCount}</div>
              <span className="text-[10px] text-cyan-300 mt-1 block font-mono">Stable variance bands</span>
            </div>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Filter by Severity:</span>
              <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-800 gap-1 text-xs">
                {(['ALL', 'CRITICAL', 'WARNING', 'MODERATE'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilteredSeverity(sev)}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      filteredSeverity === sev
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Showing {displayedAlerts.length} of {alerts.length} notifications
            </span>
          </div>

          {/* Alerts Feed */}
          <div className="space-y-4">
            {displayedAlerts.map((alert) => {
              const isAck = acknowledgedIds.includes(alert.id);
              return (
                <div
                  key={alert.id}
                  className={`p-5 rounded-xl border transition-all ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-950/30 border-red-500/40 shadow-lg shadow-red-950/20'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-950/30 border-amber-500/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : alert.severity === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}
                      >
                        {alert.severity === 'CRITICAL' ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : alert.severity === 'WARNING' ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <Info className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-sm font-bold text-white">{alert.title}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                              alert.severity === 'CRITICAL'
                                ? 'bg-red-500/30 text-red-200 border border-red-400/40'
                                : alert.severity === 'WARNING'
                                ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {alert.severity}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {alert.id}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{alert.message}</p>

                        <div className="flex items-center gap-4 mt-2.5 text-xs font-mono text-slate-400 flex-wrap">
                          <span>Target Metric: <strong className="text-white">{alert.metric}</strong></span>
                          <span>Current: <strong className="text-red-400">{alert.currentValue}</strong></span>
                          <span>Threshold Cap: <strong className="text-slate-200">{alert.threshold}</strong></span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 lg:self-center shrink-0">
                      {!isAck ? (
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="px-3 py-2 rounded-lg bg-emerald-950/40 text-emerald-300 text-xs font-mono flex items-center gap-1 border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" /> Acknowledged
                        </span>
                      )}

                      <button
                        onClick={() => handleExecuteAction(alert.recommendedAction, alert.id)}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{alert.recommendedAction}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
