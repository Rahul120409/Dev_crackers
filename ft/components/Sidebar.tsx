'use client';

import React from 'react';
import {
  Shield,
  LayoutDashboard,
  PieChart,
  ShieldCheck,
  Sparkles,
  FlaskConical,
  BellRing,
  History,
  Settings,
  HelpCircle,
  Building,
  ChevronRight,
  UserCheck,
  Activity
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    router.push('/login');
  };

  const displayName = user?.name || 'Alex Morgan';
  const displayRole = user?.role || 'ROLE_RISK_MANAGER';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AM';

  // Strict LLD Section 19.1 Sequence
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { id: 'market', label: 'Market Intelligence', icon: Activity, badge: 'Yahoo Live' },
    { id: 'portfolio', label: 'Portfolio & Assets', icon: PieChart },
    { id: 'risk', label: 'Risk Center', icon: ShieldCheck },
    { id: 'optimization', label: 'Optimization', icon: Sparkles, badge: '1 Opp' },
    { id: 'simulator', label: 'Stress Testing', icon: FlaskConical, badge: 'Golden Demo' },
    { id: 'alerts', label: 'System Alerts', icon: BellRing, badge: '3 Active' },
    { id: 'decisions', label: 'Decision History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-5 border-b border-slate-800/80 gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-base">CapitalGuard</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Asset & Capital Controls
            </p>
          </div>
        </div>

        {/* Institutional Context */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              Apex Commercial Bank Ltd.
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Book ID: #CS-IND-0926</span>
            <span className="text-emerald-400 font-mono font-medium">Basel III Active</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Main Management
          </div>
          <nav className="space-y-1 mt-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (item.id === 'dashboard') router.push('/dashboard');
                    else if (item.id === 'market') router.push('/market');
                    else if (item.id === 'portfolio') router.push('/portfolio');
                    else if (item.id === 'risk') router.push('/risk');
                    else if (item.id === 'optimization') router.push('/optimization');
                    else if (item.id === 'simulator') router.push('/simulator');
                    else if (item.id === 'alerts') router.push('/alerts');
                    else if (item.id === 'decisions') router.push('/decisions');
                    else if (item.id === 'settings') router.push('/settings');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-700/50'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge === 'Live'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.badge === 'Golden Demo'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/30">
        <div className="flex items-center justify-between px-2 py-1 text-slate-400 text-xs hover:text-slate-200 cursor-pointer mb-2">
          <span className="flex items-center gap-1.5 text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Institutional Helpdesk
          </span>
          <button
            onClick={handleSignOut}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium hover:underline cursor-pointer"
            title="Log Out & Switch User"
          >
            Sign Out
          </button>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-indigo-500/40">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-white truncate">{displayName}</span>
              <UserCheck className="w-3 h-3 text-blue-400 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-400 truncate">{displayRole}</p>
          </div>
          <button onClick={handleSignOut} title="Sign Out" className="cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
          </button>
        </div>
      </div>
    </aside>
  );
};
