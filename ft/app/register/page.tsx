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
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#caf0f8] via-[#def6fa] to-[#c2eff7] text-slate-900 flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden font-sans antialiased">
      
      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-gradient-to-b from-[#00b4d8]/20 via-[#0077b6]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-white/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-[#90e0ef]/40 rounded-full blur-[130px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER                                                             */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full max-w-md mx-auto flex items-center justify-between">
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

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-lg bg-white/90 hover:bg-[#03045e] text-[#03045e] hover:text-white font-mono text-xs font-black border border-[#0077b6]/30 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>SIGN IN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CENTERED REGISTRATION CARD (CLEAN, ATTRACTIVE & SIMPLE)                */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full max-w-md mx-auto my-auto py-6">
        <div className="relative rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#0077b6]/30 p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,119,182,0.18)]">
          
          {/* SUCCESS VIEW */}
          {authState === 'created' ? (
            <div className="py-4 text-center space-y-5 animate-in zoom-in-95 duration-400">
              <div className="w-14 h-14 rounded-2xl bg-[#caf0f8] border-2 border-[#0077b6]/40 text-[#03045e] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8 text-[#0077b6]" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#03045e] uppercase font-sans">
                  ACCOUNT CREATED
                </h2>
                <p className="text-xs sm:text-sm text-[#0077b6] font-bold font-sans">
                  Welcome to CapitalGuard. Your institutional account is active.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#caf0f8]/40 border border-[#0077b6]/30 text-xs font-mono text-slate-700 text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">EMAIL:</span>
                  <span className="text-[#03045e] font-black">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">SECURITY:</span>
                  <span className="text-emerald-700 font-black">LEVEL 1 // AUTHORIZED</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinueToSignIn}
                className="w-full py-4 px-4 rounded-xl bg-[#03045e] hover:bg-[#0077b6] text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#03045e]/20 border-2 border-[#03045e]"
              >
                <span>CONTINUE TO SIGN IN</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            /* CLEAN 4-FIELD REGISTRATION FORM */
            <div>
              {/* Header */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-[#03045e] font-black mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#0077b6]" />
                  <span>CREATE NEW ACCOUNT</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#03045e]">Create Your Account</h2>
                <p className="text-xs sm:text-sm text-[#0077b6] mt-1 font-bold">Get started with CapitalGuard</p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-[11px] font-bold">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleCreateAccount} className="space-y-3.5">
                {/* 1. FULL NAME */}
                <div>
                  <label className="block text-[11px] font-mono font-black text-[#03045e] uppercase tracking-widest mb-1">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-[#caf0f8]/30 border-2 border-[#0077b6]/30 focus:border-[#0077b6] focus:bg-white focus:ring-2 focus:ring-[#0077b6]/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#03045e] font-bold placeholder-slate-400 transition-all outline-none font-sans"
                  />
                </div>

                {/* 2. EMAIL */}
                <div>
                  <label className="block text-[11px] font-mono font-black text-[#03045e] uppercase tracking-widest mb-1">
                    WORK EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-[#caf0f8]/30 border-2 border-[#0077b6]/30 focus:border-[#0077b6] focus:bg-white focus:ring-2 focus:ring-[#0077b6]/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#03045e] font-bold placeholder-slate-400 transition-all outline-none font-sans"
                  />
                </div>

                {/* 3. PASSWORD */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-mono font-black text-[#03045e] uppercase tracking-widest">
                      PASSWORD
                    </label>
                    {password.length > 0 && (
                      <span className={`text-[10px] font-mono font-bold ${
                        securityScore >= 3 ? 'text-emerald-700' : securityScore === 2 ? 'text-[#0077b6]' : 'text-amber-700'
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
                      className="w-full bg-[#caf0f8]/30 border-2 border-[#0077b6]/30 focus:border-[#0077b6] focus:bg-white focus:ring-2 focus:ring-[#0077b6]/20 rounded-xl px-4 py-2.5 pr-10 text-xs sm:text-sm text-[#03045e] font-bold placeholder-slate-400 transition-all outline-none font-sans"
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

                  {/* Compact Strength Bar */}
                  {password.length > 0 && (
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-300">
                      <div
                        className={`h-full transition-all duration-300 ${
                          securityScore >= 3 ? 'bg-emerald-500 w-full' : securityScore === 2 ? 'bg-[#0077b6] w-2/3' : 'bg-amber-500 w-1/3'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* 4. CONFIRM PASSWORD */}
                <div>
                  <label className="block text-[11px] font-mono font-black text-[#03045e] uppercase tracking-widest mb-1">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className={`w-full bg-[#caf0f8]/30 border-2 rounded-xl px-4 py-2.5 pr-10 text-xs sm:text-sm text-[#03045e] font-bold placeholder-slate-400 transition-all outline-none font-sans ${
                        confirmPassword.length > 0
                          ? isMatch
                            ? 'border-emerald-500 focus:border-emerald-600 bg-white'
                            : 'border-rose-400 focus:border-rose-500 bg-white'
                          : 'border-[#0077b6]/30 focus:border-[#0077b6] focus:bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0077b6] hover:text-[#03045e] p-1 cursor-pointer"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Match confirmation feedback */}
                  {confirmPassword.length > 0 && (
                    <div className="mt-1 text-[11px] font-mono flex items-center gap-1 font-bold">
                      {isMatch ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Passwords match perfectly
                        </span>
                      ) : (
                        <span className="text-rose-600">Passwords do not match</span>
                      )}
                    </div>
                  )}
                </div>

                {/* PRIMARY CREATE ACCOUNT BUTTON */}
                <button
                  type="submit"
                  disabled={authState !== 'idle'}
                  className="w-full py-4 px-4 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 bg-[#03045e] hover:bg-[#0077b6] text-white shadow-[0_10px_25px_rgba(3,4,94,0.25)] border-2 border-[#03045e] disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {authState === 'initializing' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>CREATING ACCOUNT...</span>
                    </>
                  ) : (
                    <>
                      <span>CREATE ACCOUNT</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              </form>

              {/* SIGN IN LINK */}
              <div className="mt-5 pt-3.5 border-t border-[#0077b6]/20 text-center text-xs text-slate-600 font-medium">
                <span>Already have an institutional account? </span>
                <Link
                  href="/login"
                  className="font-black text-[#0077b6] hover:text-[#03045e] hover:underline transition-colors ml-1 inline-flex items-center gap-0.5"
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
      <footer className="relative z-20 w-full max-w-md mx-auto flex items-center justify-between text-[11px] font-mono text-[#03045e]/80 font-bold pt-3 border-t border-[#0077b6]/25">
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
