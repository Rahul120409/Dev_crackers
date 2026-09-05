'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function RegisterCommandCenter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  // Strictly 4 fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [authState, setAuthState] = useState<'idle' | 'initializing' | 'created'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Clean Password Strength
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const securityScore = [hasMinLength, hasUpper && hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const isMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid institutional email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify confirmation.');
      return;
    }

    setAuthState('initializing');

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      });

      setAuthState('created');
    } catch (err: any) {
      setAuthState('idle');
      setErrorMessage(err.message || 'Failed to create account. Please try again.');
    }
  };

  const handleContinueToSignIn = () => {
    router.push(`/login?registered=${encodeURIComponent(email.trim().toLowerCase())}`);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#02040a] text-slate-100 flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden font-sans antialiased">
      
      {/* Background Micro-Grid */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="register-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="3 3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#register-grid)" />
        </svg>
      </div>

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER                                                             */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full max-w-md mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white border border-cyan-400/40 shadow-lg shadow-cyan-950/80 group-hover:scale-105 transition-transform">
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

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 text-slate-300 hover:text-white font-mono text-xs border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center gap-1.5"
          >
            <span>SIGN IN</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CENTERED REGISTRATION CARD (CLEAN, ATTRACTIVE & SIMPLE)                */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full max-w-md mx-auto my-auto py-6">
        <div className="relative rounded-2xl bg-slate-950/85 backdrop-blur-2xl border border-slate-800/90 p-7 sm:p-8 shadow-2xl shadow-black/80">
          
          {/* SUCCESS VIEW */}
          {authState === 'created' ? (
            <div className="py-4 text-center space-y-5 animate-in zoom-in-95 duration-400">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/80">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase font-sans">
                  ACCOUNT CREATED
                </h2>
                <p className="text-xs text-slate-300 font-sans">
                  Welcome to CapitalGuard. Your institutional account is active.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 text-left space-y-1">
                <div className="flex justify-between">
                  <span>EMAIL:</span>
                  <span className="text-cyan-400 font-bold">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span>SECURITY:</span>
                  <span className="text-emerald-400">LEVEL 1 // AUTHORIZED</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinueToSignIn}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60 border border-emerald-400/40"
              >
                <span>CONTINUE TO SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* CLEAN 4-FIELD REGISTRATION FORM */
            <div>
              {/* Header */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-cyan-400 mb-2">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>CREATE NEW ACCOUNT</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Create Your Account</h2>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Get started with CapitalGuard</p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-[11px]">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleCreateAccount} className="space-y-3.5">
                {/* 1. FULL NAME */}
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest mb-1">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 transition-all outline-none font-sans"
                  />
                </div>

                {/* 2. EMAIL */}
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest mb-1">
                    WORK EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 transition-all outline-none font-sans"
                  />
                </div>

                {/* 3. PASSWORD */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                      PASSWORD
                    </label>
                    {password.length > 0 && (
                      <span className={`text-[10px] font-mono font-bold ${
                        securityScore >= 3 ? 'text-emerald-400' : securityScore === 2 ? 'text-cyan-400' : 'text-amber-400'
                      }`}>
                        {securityScore >= 3 ? 'STRONG' : securityScore === 2 ? 'MODERATE' : 'WEAK'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create your password (min 8 chars)"
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

                  {/* Compact Strength Bar */}
                  {password.length > 0 && (
                    <div className="w-full bg-slate-900 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          securityScore >= 3 ? 'bg-emerald-400 w-full' : securityScore === 2 ? 'bg-cyan-400 w-2/3' : 'bg-amber-400 w-1/3'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* 4. CONFIRM PASSWORD */}
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest mb-1">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className={`w-full bg-slate-900/90 border rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-white placeholder-slate-600 transition-all outline-none font-sans ${
                        confirmPassword.length > 0
                          ? isMatch
                            ? 'border-emerald-500/80 focus:border-emerald-400'
                            : 'border-rose-500/80 focus:border-rose-400'
                          : 'border-slate-800 focus:border-blue-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Match confirmation feedback */}
                  {confirmPassword.length > 0 && (
                    <div className="mt-1 text-[10px] font-mono flex items-center gap-1">
                      {isMatch ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Passwords match perfectly
                        </span>
                      ) : (
                        <span className="text-rose-400">Passwords do not match</span>
                      )}
                    </div>
                  )}
                </div>

                {/* PRIMARY CREATE ACCOUNT BUTTON */}
                <button
                  type="submit"
                  disabled={authState !== 'idle'}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-950/60 border border-cyan-400/30 disabled:opacity-50"
                >
                  {authState === 'initializing' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>CREATING ACCOUNT...</span>
                    </>
                  ) : (
                    <>
                      <span>CREATE ACCOUNT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* SIGN IN LINK */}
              <div className="mt-5 pt-3 border-t border-slate-900 text-center text-xs text-slate-400">
                <span>Already have an institutional account? </span>
                <Link
                  href="/login"
                  className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors ml-1 inline-flex items-center gap-0.5"
                >
                  <span>Sign In →</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full max-w-md mx-auto flex items-center justify-between text-[10px] font-mono text-slate-600 pt-3 border-t border-slate-900">
        <div>CAPITALGUARD SECURITY</div>
        <div className="flex items-center gap-3">
          <span>BASEL III COMPLIANT</span>
          <span>•</span>
          <span>SOC-2 TYPE II</span>
        </div>
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#02040a] text-white font-sans">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterCommandCenter />
    </Suspense>
  );
}
