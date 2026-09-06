'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Sliders,
  Shield,
  User,
  Key,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Save,
  Globe,
  Bell,
  SlidersHorizontal,
  Lock,
  Cpu
} from 'lucide-react';
import { RiskLimits } from '../../types/api';
import { getRiskLimits, updateRiskLimits } from '../../services/riskService';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState('settings');
  const [activeSection, setActiveSection] = useState<'profile' | 'limits' | 'automation' | 'connectivity'>('limits');
  
  // Risk Limits state
  const [limits, setLimits] = useState<RiskLimits | null>(null);
  const [isSavingLimits, setIsSavingLimits] = useState(false);
  
  // Automation settings
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalHedge, setCriticalHedge] = useState(true);

  // Connectivity
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [copiedToken, setCopiedToken] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    getRiskLimits().then(data => setLimits(data));
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082'}/api/risk`, {
        method: 'GET',
        cache: 'no-store'
      });
      if (res.ok) setBackendStatus('online');
      else setBackendStatus('offline');
    } catch {
      setBackendStatus('offline');
    }
  };

  const handleSaveLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limits) return;
    setIsSavingLimits(true);
    try {
      const updated = await updateRiskLimits(limits);
      setLimits(updated);
      setToastMessage('✅ Regulatory risk limits successfully updated and enforced.');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to update limits', err);
    } finally {
      setIsSavingLimits(false);
    }
  };

  const handleCopyToken = () => {
    if (user?.token) {
      navigator.clipboard.writeText(user.token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  return (
    <div className="flex h-screen bg-[#caf0f8] dark:bg-[#070b14] text-[#03045e] dark:text-slate-100 font-sans overflow-hidden transition-colors">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#caf0f8] dark:bg-gradient-to-b dark:from-[#0a0f1d] dark:via-[#070b14] dark:to-[#04070e] transition-colors">
        <Header />

        {/* Action / Title Bar */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  System Settings & Governance Configuration
                </h1>
                <p className="text-xs text-slate-400">
                  Manage policy thresholds, automated safeguard triggers, institutional officer profile, and backend telemetry.
                </p>
              </div>
            </div>
          </div>

          {/* Section Nav */}
          <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveSection('limits')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeSection === 'limits' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Risk Limits
            </button>
            <button
              onClick={() => setActiveSection('automation')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeSection === 'automation' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Safeguard Automation
            </button>
            <button
              onClick={() => setActiveSection('profile')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeSection === 'profile' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Officer Identity
            </button>
            <button
              onClick={() => setActiveSection('connectivity')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeSection === 'connectivity' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              API Telemetry
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

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ===================================================================== */}
          {/* SECTION: RISK LIMITS                                                 */}
          {/* ===================================================================== */}
          {activeSection === 'limits' && limits && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    Regulatory Risk Caps & Threshold Parameters (GET / PUT /api/risk/limits)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Modifications will trigger immediate safeguard alerts if live portfolio metrics breach these values.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveLimits} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Max Composite Risk Score
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-3 font-mono">
                      Hard threshold limit (Default: 70)
                    </span>
                    <input
                      type="number"
                      value={limits.maxRiskScore}
                      onChange={(e) => setLimits({ ...limits, maxRiskScore: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Max Equity Allocation Cap
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-3 font-mono">
                      High-beta allocation limit (Default: 0.35 = 35%)
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={limits.maxEquityAllocation}
                      onChange={(e) => setLimits({ ...limits, maxEquityAllocation: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Max Allowed Drawdown
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-3 font-mono">
                      Peak-to-trough decline cap (Default: 0.15 = 15%)
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={limits.maxDrawdown}
                      onChange={(e) => setLimits({ ...limits, maxDrawdown: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Minimum Statutory Liquidity
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-3 font-mono">
                      Basel III minimum HQLA cash buffer (in USD / INR)
                    </span>
                    <input
                      type="number"
                      value={limits.minLiquidity}
                      onChange={(e) => setLimits({ ...limits, minLiquidity: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Max Value-at-Risk (95% 1-Day)
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-3 font-mono">
                      Daily expected statistical loss ceiling
                    </span>
                    <input
                      type="number"
                      value={limits.maxVaR}
                      onChange={(e) => setLimits({ ...limits, maxVaR: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Max CVaR (Expected Shortfall)
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-3 font-mono">
                      Tail risk loss tolerance boundary
                    </span>
                    <input
                      type="number"
                      value={limits.maxCVaR}
                      onChange={(e) => setLimits({ ...limits, maxCVaR: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isSavingLimits}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950/50 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingLimits ? 'Saving to Backend Engine...' : 'Enforce & Synchronize Limits'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION: SAFEGUARD AUTOMATION                                        */}
          {/* ===================================================================== */}
          {activeSection === 'automation' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  Control Engine & Automated Safeguards
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure autonomous execution thresholds for Person 2 Safeguard Engine.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Automated Emergency Rebalancing</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Automatically route rebalance orders to primary liquidity pool when Risk Score &gt; 80.
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoRebalance(!autoRebalance)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      autoRebalance ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        autoRebalance ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Critical Breach Real-Time Notifications</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Dispatch immediate high-priority alerts to Risk Committee on VaR & concentration spikes.
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      emailAlerts ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        emailAlerts ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Dynamic Hedging Mandate (Basel III Tier-1)</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Lock equity exposures and shift overnight liquidity to high-quality repo facilities during market stress.
                    </p>
                  </div>
                  <button
                    onClick={() => setCriticalHedge(!criticalHedge)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      criticalHedge ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        criticalHedge ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION: OFFICER PROFILE & IDENTITY                                  */}
          {/* ===================================================================== */}
          {activeSection === 'profile' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  Authorized Institutional Officer Profile
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Authenticated session identity from GET /api/auth/me.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Full Legal Name:</span>
                  <div className="text-base font-bold text-white">{user?.name || 'Alex Morgan'}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Institutional Email:</span>
                  <div className="text-base font-bold text-white">{user?.email || 'alex@capitalshield.com'}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Assigned Role:</span>
                  <div className="text-base font-bold text-indigo-300">{user?.role || 'ROLE_RISK_MANAGER'}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Financial Institution:</span>
                  <div className="text-base font-bold text-white">{user?.institution || 'Apex Commercial Bank Ltd.'}</div>
                </div>
              </div>

              {/* JWT Token View */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400" /> Active Session Token (Bearer)
                  </span>
                  <button
                    onClick={handleCopyToken}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-mono"
                  >
                    {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedToken ? 'Copied to Clipboard' : 'Copy Token'}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-400 break-all select-all">
                  {user?.token || 'No active token found'}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION: API CONNECTIVITY & TELEMETRY                                */}
          {/* ===================================================================== */}
          {activeSection === 'connectivity' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Backend API Gateway Telemetry
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live connection status to Spring Boot REST endpoints.
                  </p>
                </div>

                <button
                  onClick={checkBackendHealth}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                  title="Ping Backend"
                >
                  <RefreshCw className="w-4 h-4 text-indigo-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Target API Base URL:</span>
                  <div className="text-sm font-bold text-white">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082'}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Live Gateway Status:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span className={`font-bold ${backendStatus === 'online' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {backendStatus === 'online' ? 'CONNECTED (200 OK)' : 'FALLBACK CLIENT ENGINE ACTIVE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
