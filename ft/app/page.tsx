'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();

  // Sequence Stages:
  // 0: Deep black / initial ambient glow
  // 1: Financial grid & telemetry lines
  // 2: Perspective floor
  // 3: Geometric Shield Gateway
  // 4: Typography (CAPITAL GUARD)
  // 5: Complete -> Automatic Transition to /welcome
  const [animStage, setAnimStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimStage(1), 100);
    const t2 = setTimeout(() => setAnimStage(2), 250);
    const t3 = setTimeout(() => setAnimStage(3), 500);
    const t4 = setTimeout(() => setAnimStage(4), 800);

    // Fast, smooth ticker to 100% in ~1.1s total
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnimStage(5);
          return 100;
        }
        return prev + 6;
      });
    }, 30);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(interval);
    };
  }, []);

  // When progress finishes (Stage 5), automatically transition directly to /welcome
  useEffect(() => {
    if (animStage === 5) {
      const redirectTimer = setTimeout(() => {
        router.push('/welcome');
      }, 350);

      return () => clearTimeout(redirectTimer);
    }
  }, [animStage, router]);

  // Click anywhere to skip directly to /welcome
  const handleProceed = () => {
    router.push('/welcome');
  };

  return (
    <div
      onClick={handleProceed}
      className="fixed inset-0 w-screen h-screen bg-[#010308] text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden font-sans antialiased cursor-pointer"
    >
      {/* Ambient Glows (No harsh grid lines) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[750px] bg-gradient-to-b from-[#0077b6]/20 via-[#00b4d8]/15 to-transparent rounded-full blur-[150px]" />
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-white/40 dark:bg-indigo-700/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-[#90e0ef]/40 rounded-full blur-[130px]" />
      </div>

      {/* Top Header */}
      <div className="relative z-30 w-full flex items-center justify-between text-[11px] font-mono tracking-widest text-slate-500">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0077b6] dark:bg-indigo-500/20 border border-[#0077b6]/40 flex items-center justify-center text-white dark:text-cyan-400 shadow-md">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-[#03045e] dark:text-slate-100 tracking-[0.2em] text-xs">CAPITALGUARD</span>
          <span className="hidden sm:inline text-[#0077b6] dark:text-slate-600 font-bold">/ INSTITUTIONAL OS</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#0077b6] dark:bg-cyan-400 animate-pulse" />
          <span className="tracking-widest text-[#03045e] dark:text-slate-300 font-bold">
            ● INITIALIZING ({progress}%)
          </span>
          <span className="text-[10px] text-white bg-[#03045e] hover:bg-[#0077b6] dark:text-indigo-400 dark:bg-slate-900/80 font-bold px-2.5 py-1 rounded-md border border-[#0077b6]/30 shadow-xs transition-colors">
            Click to Proceed
          </span>
        </div>
      </div>

      {/* Central Hero Composition */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center my-auto">
        <div
          className={`absolute w-[440px] h-[520px] sm:w-[600px] sm:h-[680px] pointer-events-none flex items-center justify-center transition-all duration-700 ${
            animStage >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 680">
            <defs>
              <linearGradient id="gateGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0077b6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#00b4d8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#03045e" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="innerGate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#caf0f8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#90e0ef" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d="M 300 40 L 530 140 L 490 440 Q 440 580 300 640 Q 160 580 110 440 L 70 140 Z"
              fill="url(#innerGate)"
              stroke="url(#gateGlow)"
              strokeWidth="2"
            />
            <path
              d="M 300 80 L 480 165 L 445 420 Q 400 535 300 585 Q 200 535 155 420 L 120 165 Z"
              fill="none"
              stroke="#0077b6"
              strokeWidth="1.5"
              strokeDasharray="8 6"
              opacity="0.7"
            />
            <line x1="300" y1="40" x2="300" y2="640" stroke="#0077b6" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
            <circle cx="300" cy="40" r="6" fill="#03045e" stroke="#00b4d8" strokeWidth="2" />
            <circle cx="300" cy="40" r="3" fill="#caf0f8" />
          </svg>
        </div>

        <div
          className={`relative z-10 text-center flex flex-col items-center justify-center space-y-1 sm:space-y-2 transition-all duration-700 ${
            animStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="text-[11px] sm:text-xs font-mono font-black tracking-[0.35em] text-[#0077b6] dark:text-cyan-400 uppercase mb-1">
            FINANCIAL COMMAND & CONTROL SYSTEM
          </div>

          <div className="text-5xl sm:text-7xl md:text-8xl lg:text-[105px] font-black tracking-[-0.03em] text-[#03045e] dark:text-white leading-[0.88] uppercase drop-shadow-[0_4px_20px_rgba(0,119,182,0.2)]">
            CAPITAL
          </div>

          <div className="text-5xl sm:text-7xl md:text-8xl lg:text-[105px] font-black tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-b from-[#0077b6] via-[#0096c7] to-[#03045e] dark:from-slate-100 dark:via-slate-300 dark:to-cyan-400 leading-[0.88] uppercase drop-shadow-[0_4px_20px_rgba(0,119,182,0.15)]">
            GUARD
          </div>

          <div className="text-xs sm:text-base md:text-lg font-black tracking-[0.2em] text-[#03045e] dark:text-cyan-300 uppercase pt-2 sm:pt-3">
            Protect Capital. Optimize the Future.
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="relative z-30 w-full max-w-lg mx-auto flex flex-col items-center pb-2">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between w-full text-[10px] font-mono tracking-widest text-[#0077b6] dark:text-slate-500 font-bold">
            <span>AUTOMATICALLY OPENING CAPITALGUARD</span>
            <span className="text-[#03045e] dark:text-cyan-400 font-black">{progress}%</span>
          </div>
          <div className="w-full h-[3px] bg-[#caf0f8] dark:bg-slate-900 rounded-full overflow-hidden border border-[#0077b6]/30 dark:border-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-[#03045e] via-[#0077b6] to-[#00b4d8] dark:from-blue-500 dark:via-cyan-400 dark:to-white transition-all duration-75 ease-out shadow-[0_0_10px_rgba(0,119,182,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-[10px] font-mono text-[#0077b6] dark:text-slate-600 tracking-wider pt-3 flex items-center gap-2 font-bold">
          <span>APEX TREASURY BANK</span>
          <span>•</span>
          <span>ENTERPRISE GRADE</span>
          <span>•</span>
          <span>BOOK #CS-IND-0926</span>
        </div>
      </div>
    </div>
  );
}
