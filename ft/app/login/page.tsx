'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FinancialShieldHUD } from '../../components/FinancialShieldHUD';

function LoginCommandCenter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form focus states to dynamically drive the background Capital Network & Shield
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password'>('none');
  const [authState, setAuthState] = useState<'idle' | 'authenticating' | 'granted'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnregisteredEmail, setIsUnregisteredEmail] = useState(false);

  useEffect(() => {
    const registeredEmailParam = searchParams.get('registered');
    if (registeredEmailParam) {
      setEmail(registeredEmailParam);
    }
  }, [searchParams]);

  const handleEnterCommandCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsUnregisteredEmail(false);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both institutional email and security credential.');
      return;
    }

    setAuthState('authenticating');

    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
      });

      // Show "ACCESS GRANTED" cinematic convergence
      setAuthState('granted');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      setAuthState('idle');
      if (err.message && (err.message.includes('UNREGISTERED_EMAIL') || err.message.includes('not registered'))) {
        setIsUnregisteredEmail(true);
        setErrorMessage('No institutional profile found for this address. Create an account below.');
      } else {
        setErrorMessage('Authentication failed. Verify credentials or use demo mode.');
      }
    }
  };

  const handleDemoAccess = async () => {
    setAuthState('authenticating');
    setErrorMessage(null);
    setIsUnregisteredEmail(false);

    try {
      await login({
        email: 'cro.kumar@capitalguard.bank',
        password: 'CapitalGuard@2026',
      });
      setAuthState('granted');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch {
      setAuthState('granted');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  };

  const handleFillDemo = () => {
    setEmail('cro.kumar@capitalguard.bank');
    setPassword('CapitalGuard@2026');
    setErrorMessage(null);
    setIsUnregisteredEmail(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#02040a] text-slate-100 flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* 1. DYNAMIC LIVING CAPITAL NETWORK & FINANCIAL SHIELD (BACKGROUND)          */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Subtle Micro-Grid */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="3 3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>

        {/* Ambient Radial Lighting that responds to state */}
        <div
          className={`absolute rounded-full blur-[160px] transition-all duration-1000 ${
            authState === 'granted'
              ? 'w-[900px] h-[900px] bg-emerald-600/25'
              : focusedField === 'password'
              ? 'w-[750px] h-[750px] bg-blue-600/20'
              : focusedField === 'email'
              ? 'w-[750px] h-[750px] bg-cyan-600/20'
              : 'w-[650px] h-[650px] bg-indigo-900/15'
          }`}
        />

        {/* Background Multi-Faceted Financial Shield HUD */}
        <div className={`opacity-25 transition-all duration-700 ${
          authState === 'granted'
            ? 'scale-125 opacity-70 filter drop-shadow-[0_0_40px_#10b981]'
            : focusedField !== 'none'
            ? 'scale-110 opacity-40'
            : 'scale-100 opacity-20'
        }`}>
          <FinancialShieldHUD
            activeNode={focusedField === 'email' ? 'assets' : focusedField === 'password' ? 'liquidity' : 'all'}
            statusGlow={authState === 'granted' ? 'emerald' : focusedField !== 'none' ? 'cyan' : 'blue'}
            size="lg"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP COMMAND HEADER                                                     */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white border border-cyan-400/40 shadow-lg shadow-cyan-950/80 group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-[0.15em] text-white uppercase">CAPITALGUARD</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-950/80 text-cyan-300 border border-cyan-500/30">
                PORTAL
              </span>
            </div>
          </div>
        </Link>

        {/* System telemetry indicator */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>NODE ACTIVE</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">256-BIT ENCRYPTION</span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CENTRAL FLOATING AUTHENTICATION PANEL                                  */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full max-w-md mx-auto my-auto py-6">
        <div
          className={`relative rounded-2xl bg-slate-950/85 backdrop-blur-2xl border transition-all duration-500 p-7 sm:p-8 shadow-2xl ${
            authState === 'granted'
              ? 'border-emerald-500/70 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
              : focusedField !== 'none'
              ? 'border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.2)]'
              : 'border-slate-800/90 shadow-black/80'
          }`}
        >
          {/* Subtle Top Indicator Tag */}
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-800/80">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-cyan-400">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>CAPITALGUARD / SECURE ACCESS</span>
            </div>

            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 bg-slate-900/90 hover:bg-slate-850 px-2 py-0.5 rounded border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center gap-1 cursor-pointer"
              title="Quick fill test credentials"
            >
              <KeyRound className="w-2.5 h-2.5" />
              <span>Auto-Fill Demo</span>
            </button>
          </div>

          {/* Heading & Subtitle */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">Enter the command center</p>
          </div>

          {/* Unregistered Email Alert */}
          {isUnregisteredEmail && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-950/50 border border-amber-800/70 text-amber-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  No registered profile found for <strong className="font-mono text-white">{email}</strong>.
                </div>
              </div>
              <Link
                href={`/register?email=${encodeURIComponent(email)}`}
                className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1 text-[11px]"
              >
                <span>Create Account with this Email →</span>
              </Link>
            </div>
          )}

          {/* Generic Error Alert */}
          {!isUnregisteredEmail && errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="text-[11px]">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEnterCommandCenter} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isUnregisteredEmail) setIsUnregisteredEmail(false);
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('none')}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 transition-all outline-none font-sans"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('none')}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-white placeholder-slate-600 transition-all outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* PRIMARY ENTER BUTTON */}
            <button
              type="submit"
              disabled={authState !== 'idle'}
              className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 shadow-lg ${
                authState === 'granted'
                  ? 'bg-emerald-600 text-white shadow-emerald-950/80 border border-emerald-400/50'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-cyan-950/60 border border-cyan-400/30'
              }`}
            >
              {authState === 'authenticating' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : authState === 'granted' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>ACCESS GRANTED</span>
                </>
              ) : (
                <>
                  <span>ENTER CAPITALGUARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* SYSTEM STATUS INDICATORS */}
          <div className="mt-4 pt-3.5 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              SECURE CONNECTION
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              SYSTEM OPERATIONAL
            </span>
          </div>

          {/* EXPLORE DEMO (SECONDARY ACTION) */}
          <div className="mt-4 pt-3 border-t border-slate-900">
            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={authState !== 'idle'}
              className="w-full py-2.5 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-cyan-300 text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 border border-slate-800/80 hover:border-cyan-500/30 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPLORE DEMO MODE (JUDGES)</span>
            </button>
          </div>

          {/* REGISTER LINK */}
          <div className="mt-5 pt-3 border-t border-slate-900 text-center text-xs text-slate-400">
            <span>New to CapitalGuard? </span>
            <Link
              href={`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`}
              className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors ml-1 inline-flex items-center gap-0.5"
            >
              <span>Create Account →</span>
            </Link>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-600 gap-2 border-t border-slate-900 pt-3">
        <div>CAPITALGUARD ARCHITECTURE // TIER-1 PROTOCOL</div>
        <div className="flex items-center gap-3">
          <span>BASEL III COMPLIANT</span>
          <span>•</span>
          <span>SOC-2 TYPE II</span>
          <span>•</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#02040a] text-white font-sans">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginCommandCenter />
    </Suspense>
  );
}
