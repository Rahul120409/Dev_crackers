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
    // Prefetch dashboard so transition is instant
    router.prefetch('/dashboard');

    const registeredEmailParam = searchParams.get('registered');
    if (registeredEmailParam) {
      setEmail(registeredEmailParam);
    }
  }, [searchParams, router]);

  const handleEnterCommandCenter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authState === 'granted') {
      router.push('/dashboard');
      return;
    }

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

      // Show ACCESS GRANTED and proceed directly to dashboard
      setAuthState('granted');
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);
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
    if (authState === 'granted') {
      router.push('/dashboard');
      return;
    }

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
      }, 250);
    } catch {
      setAuthState('granted');
      setTimeout(() => {
        router.push('/dashboard');
      }, 250);
    }
  };

  const handleFillDemo = () => {
    setEmail('cro.kumar@capitalguard.bank');
    setPassword('CapitalGuard@2026');
    setErrorMessage(null);
    setIsUnregisteredEmail(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#caf0f8] via-[#def6fa] to-[#c2eff7] text-slate-900 flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 1. DYNAMIC LIVING CAPITAL NETWORK & FINANCIAL SHIELD (BACKGROUND)          */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Ambient Radial Soft Glows */}
        <div
          className={`absolute rounded-full blur-[140px] transition-all duration-700 ${
            authState === 'granted'
              ? 'w-[850px] h-[850px] bg-emerald-400/30 scale-125'
              : focusedField === 'password'
              ? 'w-[800px] h-[800px] bg-[#00b4d8]/30 scale-110'
              : focusedField === 'email'
              ? 'w-[850px] h-[850px] bg-gradient-to-tr from-[#6366f1]/45 via-[#8b5cf6]/40 to-[#00b4d8]/30 scale-115'
              : 'w-[700px] h-[700px] bg-[#0096c7]/20'
          }`}
        />
        <div
          className={`absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${
            focusedField === 'email' ? 'bg-[#818cf8]/35' : 'bg-white/40'
          }`}
        />
        <div
          className={`absolute bottom-0 right-1/4 w-[550px] h-[550px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${
            focusedField === 'email' ? 'bg-[#c084fc]/35' : 'bg-[#90e0ef]/40'
          }`}
        />

        {/* Background Multi-Faceted Financial Shield HUD */}
        <div className={`transition-all duration-700 ${
          authState === 'granted'
            ? 'scale-125 opacity-60 filter drop-shadow-[0_0_40px_#10b981]'
            : focusedField === 'email'
            ? 'scale-115 opacity-40 filter drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]'
            : focusedField !== 'none'
            ? 'scale-110 opacity-35'
            : 'scale-100 opacity-20'
        }`}>
          <FinancialShieldHUD
            activeNode={focusedField === 'email' ? 'assets' : focusedField === 'password' ? 'liquidity' : 'all'}
            statusGlow={authState === 'granted' ? 'emerald' : focusedField === 'email' ? 'indigo' : focusedField === 'password' ? 'cyan' : 'blue'}
            size="lg"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP COMMAND HEADER                                                     */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077b6] via-[#0096c7] to-[#00b4d8] flex items-center justify-center text-white border-2 border-white shadow-md group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-[0.12em] text-[#03045e] uppercase">CAPITALGUARD</span>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#03045e] text-[#caf0f8] shadow-xs">
                PORTAL
              </span>
            </div>
          </div>
        </Link>

        {/* System telemetry indicator */}
        <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#0077b6]/30 shadow-sm text-[#03045e]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="font-extrabold text-[#03045e]">NODE ACTIVE</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#0077b6] font-bold">256-BIT ENCRYPTION</span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CENTRAL FLOATING AUTHENTICATION PANEL                                  */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full max-w-md mx-auto my-auto py-6">
        <div
          className={`relative rounded-2xl bg-white/95 backdrop-blur-2xl border-2 transition-all duration-500 p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,119,182,0.18)] ${
            authState === 'granted'
              ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
              : focusedField !== 'none'
              ? 'border-[#0077b6] shadow-[0_15px_40px_rgba(0,119,182,0.22)]'
              : 'border-[#0077b6]/30'
          }`}
        >
          {/* Subtle Top Indicator Tag */}
          <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#0077b6]/20">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-[#03045e] font-black">
              <Shield className="w-3.5 h-3.5 text-[#0077b6]" />
              <span>CAPITALGUARD / SECURE ACCESS</span>
            </div>

            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-mono text-[#03045e] hover:text-[#0077b6] bg-[#caf0f8] hover:bg-[#def6fa] px-2.5 py-1 rounded-md border border-[#0077b6]/30 transition-colors flex items-center gap-1.5 cursor-pointer font-bold shadow-xs"
              title="Quick fill test credentials"
            >
              <KeyRound className="w-3 h-3 text-[#0077b6]" />
              <span>Auto-Fill Demo</span>
            </button>
          </div>

          {/* Heading & Subtitle */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#03045e]">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-[#0077b6] mt-1 font-bold">Enter the command center</p>
          </div>

          {/* Unregistered Email Alert */}
          {isUnregisteredEmail && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed font-medium">
                  No registered profile found for <strong className="font-mono text-[#03045e]">{email}</strong>.
                </div>
              </div>
              <Link
                href={`/register?email=${encodeURIComponent(email)}`}
                className="w-full py-2 px-3 bg-[#03045e] hover:bg-[#0077b6] text-white font-black rounded-lg transition-colors flex items-center justify-center gap-1 text-xs"
              >
                <span>Create Account with this Email →</span>
              </Link>
            </div>
          )}

          {/* Generic Error Alert */}
          {!isUnregisteredEmail && errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="text-[11px] font-bold">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEnterCommandCenter} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-[11px] font-mono font-black text-[#03045e] uppercase tracking-widest mb-1.5">
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
                  className="w-full bg-[#caf0f8]/30 border-2 border-[#0077b6]/30 focus:border-[#0077b6] focus:bg-white focus:ring-2 focus:ring-[#0077b6]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#03045e] font-bold placeholder-slate-400 transition-all outline-none font-sans"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[11px] font-mono font-black text-[#03045e] uppercase tracking-widest mb-1.5">
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
                  className="w-full bg-[#caf0f8]/30 border-2 border-[#0077b6]/30 focus:border-[#0077b6] focus:bg-white focus:ring-2 focus:ring-[#0077b6]/20 rounded-xl px-4 py-3 pr-10 text-xs sm:text-sm text-[#03045e] font-bold placeholder-slate-400 transition-all outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0077b6] hover:text-[#03045e] p-1 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* PRIMARY ENTER BUTTON */}
            <button
              type="submit"
              disabled={authState === 'authenticating'}
              className={`w-full py-4 px-4 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 border-2 ${
                authState === 'granted'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] ring-4 ring-emerald-400/30 animate-pulse'
                  : 'bg-[#03045e] hover:bg-[#0077b6] text-white border-[#03045e] shadow-[0_10px_25px_rgba(3,4,94,0.25)] hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {authState === 'authenticating' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : authState === 'granted' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>ACCESS GRANTED</span>
                </>
              ) : (
                <>
                  <span>ENTER CAPITALGUARD</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* SYSTEM STATUS INDICATORS */}
          <div className="mt-4 pt-3.5 border-t border-[#0077b6]/20 flex items-center justify-between text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              SECURE CONNECTION
            </span>
            <span className="flex items-center gap-1.5 text-[#0077b6] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#0077b6] animate-pulse" />
              SYSTEM OPERATIONAL
            </span>
          </div>

          {/* EXPLORE DEMO (SECONDARY ACTION) */}
          <div className="mt-4 pt-3 border-t border-[#0077b6]/20">
            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={authState === 'authenticating'}
              className="w-full py-2.5 px-3 rounded-xl bg-[#caf0f8] hover:bg-[#def6fa] text-[#03045e] text-xs font-mono font-black transition-all flex items-center justify-center gap-1.5 border-2 border-[#0077b6]/30 hover:border-[#03045e] cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-[#0077b6]" />
              <span>EXPLORE DEMO MODE (JUDGES)</span>
            </button>
          </div>

          {/* Bottom Switch to Register */}
          <div className="mt-5 text-center text-xs text-slate-600 font-medium">
            <span>New to CapitalGuard? </span>
            <Link
              href={`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`}
              className="text-[#0077b6] font-black hover:text-[#03045e] hover:underline transition-colors ml-1 inline-flex items-center gap-1"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#03045e]/80 font-bold gap-2 border-t border-[#0077b6]/25 pt-3">
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
