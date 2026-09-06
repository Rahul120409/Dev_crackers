'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import {
  History,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  Filter,
  RefreshCw,
  FileText,
  Download,
  CheckCircle2
} from 'lucide-react';
import { DecisionHistoryItem } from '../../types/api';
import { getDecisions } from '../../services/riskService';

export default function DecisionsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState('decisions');
  const [decisions, setDecisions] = useState<DecisionHistoryItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const loadDecisions = async () => {
    try {
      const data = await getDecisions();
      setDecisions(data);
    } catch (err) {
      console.error('Failed to load decisions', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDecisions();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDecisions();
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(decisions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CapitalGuard-Decision-Audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage('✅ Governance Audit Log exported to JSON successfully.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const displayedDecisions = selectedFilter === 'ALL'
    ? decisions
    : decisions.filter(d => d.action === selectedFilter);

  return (
    <div className="flex h-screen bg-white dark:bg-[#070b14] text-[#03045e] dark:text-slate-100 font-sans overflow-hidden transition-colors">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0a0f1d] dark:via-[#070b14] dark:to-[#04070e] transition-colors">
        <Header />

        {/* Action / Title Bar */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Decision History & AI Explanatory Audit Trail
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    GET /api/decisions • Immutable
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Comprehensive governance log recording automated triggers, metric shifts, and AI rationales for regulatory compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Audit Trail
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title="Refresh Decision Log"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-6 py-2 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable View Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-medium text-slate-400">Total Recorded Interventions</span>
              <div className="mt-2 text-2xl font-bold font-mono text-white">{decisions.length} Logged Events</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Regulatory verification complete</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-medium text-slate-400">Primary Governance Engine</span>
              <div className="mt-2 text-base font-bold font-mono text-indigo-300">Person 2 Safeguard Engine</div>
              <span className="text-[10px] text-emerald-400 mt-1 block font-mono">100% Basel III Auditable</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-medium text-slate-400">AI Explanatory Fidelity</span>
              <div className="mt-2 text-base font-bold font-mono text-cyan-300">Deterministic Model Traces</div>
              <span className="text-[10px] text-slate-400 mt-1 block font-mono">Real-time causality mapping</span>
            </div>
          </div>

          {/* Timeline Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Chronological Governance Timeline
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {displayedDecisions.length} Decision Records
              </span>
            </div>

            <div className="space-y-4">
              {displayedDecisions.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.id}
                      </span>
                      <h3 className="text-sm font-bold text-white">{item.event}</h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Quantitative Shift Matrix */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-400">Tracked Metric: </span>
                      <strong className="text-white">{item.metric}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Metric Shift:</span>
                      <span className="text-slate-300">{item.oldValue}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-amber-400 font-bold">{item.newValue}</span>
                      <span className="text-slate-500">(Limit: {item.threshold})</span>
                    </div>

                    <div>
                      <span className="text-slate-400">Triggered Safeguard: </span>
                      <strong className="text-indigo-400 font-bold">{item.action}</strong>
                    </div>
                  </div>

                  {/* Root Reason */}
                  <div className="text-xs text-slate-300 font-mono">
                    <span className="text-slate-400">Root Cause / Trigger: </span>
                    {item.reason}
                  </div>

                  {/* AI Explanation Trace */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/25 border border-indigo-500/25 text-xs text-indigo-200 leading-relaxed font-mono">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-300">AI Explanatory Trace & Compliance Note: </strong>
                        {item.aiExplanation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
