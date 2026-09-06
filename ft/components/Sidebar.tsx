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
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const { user, logout } = useAuth();
  const { isOpen, toggleSidebar } = useSidebar();

  // Automatically detect the active tab from current URL
  const activeTab = (() => {
    if (pathname.startsWith('/portfolio')) return 'portfolio';
    if (pathname.startsWith('/risk')) return 'risk';
    if (pathname.startsWith('/optimization')) return 'optimization';
    if (pathname.startsWith('/simulator')) return 'simulator';
    if (pathname.startsWith('/alerts')) return 'alerts';
    if (pathname.startsWith('/decisions')) return 'decisions';
    if (pathname.startsWith('/settings')) return 'settings';
    if (pathname.startsWith('/dashboard')) return 'dashboard';
    return currentTab || 'dashboard';
  })();

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
    { id: 'portfolio', label: 'Portfolio & Assets', icon: PieChart },
    { id: 'risk', label: 'Risk Center', icon: ShieldCheck },
    { id: 'optimization', label: 'Optimization', icon: Sparkles, badge: '1 Opp' },
    { id: 'simulator', label: 'Stress Testing', icon: FlaskConical, badge: 'Golden Demo' },
    { id: 'alerts', label: 'System Alerts', icon: BellRing, badge: '3 Active' },
    { id: 'decisions', label: 'Decision History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-white dark:bg-slate-900 text-[#03045e] dark:text-slate-200 flex flex-col justify-between border-r border-[#0077b6]/25 dark:border-slate-800 shrink-0 select-none transition-[width] duration-200 ease-in-out relative z-30 shadow-xs`}
    >
      {/* Brand Header */}
      <div>
        <div
          className={`h-16 flex items-center border-b border-[#0077b6]/20 dark:border-slate-800/80 transition-colors ${
            isOpen ? 'px-4 justify-between' : 'px-0 justify-center'
          }`}
        >
          <div
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-3 overflow-hidden cursor-pointer group"
            title="CapitalGuard Dashboard"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077b6] via-[#0096c7] to-[#00b4d8] flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform border border-white dark:border-[#caf0f8]/40">
              <Shield className="w-5 h-5 text-white animate-pulse" />
            </div>
            {isOpen && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-black tracking-tight text-[#03045e] dark:text-white text-base truncate">CapitalGuard</span>
                  <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-[#03045e] text-[#caf0f8] dark:bg-[#caf0f8]/20 dark:text-[#caf0f8] border border-[#0077b6]/30 dark:border-[#caf0f8]/40 shrink-0">
                    ENTERPRISE
                  </span>
                </div>
                <p className="text-[11px] text-[#0077b6] dark:text-slate-400 font-bold leading-none mt-0.5 truncate">
                  Asset & Capital Controls
                </p>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          {isOpen ? (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#03045e] dark:hover:text-[#caf0f8] hover:bg-[#caf0f8]/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Collapse Navigation"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#03045e] dark:hover:text-[#caf0f8] hover:bg-[#caf0f8]/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Expand Navigation"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Institutional Context */}
        {isOpen ? (
          <div className="px-4 py-3 border-b border-[#0077b6]/20 dark:border-slate-800/60 bg-[#caf0f8]/30 dark:bg-slate-950/40 transition-opacity duration-200">
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-[#03045e] dark:text-slate-300 truncate">
                <Building className="w-3.5 h-3.5 text-[#0077b6] dark:text-[#00b4d8] shrink-0" />
                Apex Commercial Bank Ltd.
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="System Online" />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex justify-between">
              <span>Book ID: #CS-IND-0926</span>
              <span className="text-[#0077b6] dark:text-[#caf0f8] font-mono font-bold">Basel III Active</span>
            </div>
          </div>
        ) : (
          <div className="py-2.5 flex justify-center border-b border-[#0077b6]/20 dark:border-slate-800/60 bg-[#caf0f8]/30 dark:bg-slate-950/40" title="Apex Commercial Bank - Basel III Active">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0077b6] ring-4 ring-[#caf0f8] animate-pulse" />
          </div>
        )}

        {/* Navigation Section */}
        <div className={`p-2.5 ${!isOpen ? 'px-2' : ''}`}>
          {isOpen && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 py-1.5 flex items-center justify-between">
              <span>Main Management</span>
              <span className="text-[9px] text-[#0077b6] dark:text-[#00b4d8] font-mono font-bold">8 MODULES</span>
            </div>
          )}
          <nav className="space-y-1.5 mt-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onSelectTab) onSelectTab(item.id);
                    if (item.id === 'dashboard') router.push('/dashboard');
                    else if (item.id === 'portfolio') router.push('/portfolio');
                    else if (item.id === 'risk') router.push('/risk');
                    else if (item.id === 'optimization') router.push('/optimization');
                    else if (item.id === 'simulator') router.push('/simulator');
                    else if (item.id === 'alerts') router.push('/alerts');
                    else if (item.id === 'decisions') router.push('/decisions');
                    else if (item.id === 'settings') router.push('/settings');
                  }}
                  title={!isOpen ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer group relative ${
                    isOpen ? 'justify-between px-3 py-2.5' : 'justify-center p-2.5'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white shadow-md shadow-[#0077b6]/30 border border-white dark:border-[#caf0f8]/40'
                      : 'text-[#03045e] dark:text-slate-300 hover:bg-[#caf0f8]/60 dark:hover:bg-slate-800/80 hover:text-[#0077b6] dark:hover:text-[#caf0f8]'
                  }`}
                >
                  <div className={`flex items-center ${isOpen ? 'gap-2.5' : 'justify-center'}`}>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#0077b6] dark:text-slate-400 group-hover:text-[#03045e] dark:group-hover:text-[#caf0f8]'}`} />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </div>

                  {/* Badge in Open View */}
                  {isOpen && item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge === 'Live'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                          : item.badge === 'Golden Demo'
                          ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border border-red-300 dark:border-red-500/30'
                          : 'bg-[#caf0f8] text-[#03045e] dark:bg-[#caf0f8]/20 dark:text-[#caf0f8] border border-[#0077b6]/30 dark:border-[#caf0f8]/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Mini Dot Indicator in Collapsed View */}
                  {!isOpen && item.badge && (
                    <span
                      className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                        item.badge === 'Live'
                          ? 'bg-emerald-500 ring-2 ring-white dark:ring-emerald-950'
                          : item.badge === 'Golden Demo'
                          ? 'bg-red-500 ring-2 ring-white dark:ring-red-950'
                          : 'bg-[#0077b6] ring-2 ring-white dark:ring-cyan-950'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className={`border-t border-[#0077b6]/20 dark:border-slate-800/80 bg-[#caf0f8]/20 dark:bg-slate-950/30 ${isOpen ? 'p-3' : 'p-2'}`}>
        {isOpen ? (
          <>
            <div className="flex items-center justify-between px-2 py-1 text-slate-600 dark:text-slate-400 text-xs hover:text-[#03045e] dark:hover:text-slate-200 cursor-pointer mb-2 font-medium">
              <span className="flex items-center gap-1.5 text-[11px]">
                <HelpCircle className="w-3.5 h-3.5 text-[#0077b6] dark:text-slate-400" />
                Institutional Helpdesk
              </span>
              <button
                onClick={handleSignOut}
                className="text-[10px] text-[#0077b6] dark:text-indigo-400 hover:underline cursor-pointer font-bold"
                title="Log Out & Switch User"
              >
                Sign Out
              </button>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-800/60 border border-[#0077b6]/25 dark:border-slate-700/50 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0077b6] to-[#0096c7] dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#0077b6]/30 dark:ring-indigo-500/40 shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#03045e] dark:text-white truncate">{displayName}</span>
                  <UserCheck className="w-3 h-3 text-[#0077b6] dark:text-blue-400 shrink-0" />
                </div>
                <p className="text-[11px] text-[#0077b6] dark:text-slate-400 font-semibold truncate">{displayRole}</p>
              </div>
              <button onClick={handleSignOut} title="Sign Out" className="cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 hover:text-[#03045e] dark:hover:text-white" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0077b6] to-[#0096c7] dark:from-indigo-700 dark:to-slate-800 flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#0077b6]/30 dark:ring-indigo-500/40 cursor-pointer hover:ring-[#0077b6] transition-all"
              title={`${displayName} (${displayRole})`}
              onClick={handleSignOut}
            >
              {initials}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

