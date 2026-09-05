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
      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[750px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-indigo-700/15 rounded-full blur-[130px]" />
      </div>

      {/* SVG Market Grid Layer */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${animStage >= 1 ? 'opacity-40' : 'opacity-0'}`}>
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 900">
          <defs>
            <linearGradient id="chartGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <line x1="0" y1="180" x2="1440" y2="180" stroke="#1E293B" strokeWidth="0.75" strokeDasharray="3 6" opacity="0.4" />
          <line x1="0" y1="360" x2="1440" y2="360" stroke="#1E293B" strokeWidth="0.75" strokeDasharray="3 6" opacity="0.4" />
          <line x1="0" y1="540" x2="1440" y2="540" stroke="#1E293B" strokeWidth="0.75" strokeDasharray="3 6" opacity="0.4" />
          <path d="M 0 420 Q 200 360 400 410 T 800 320 T 1200 390 T 1440 280 L 1440 900 L 0 900 Z" fill="url(#chartGlowGrad)" />
          <path d="M 0 420 Q 200 360 400 410 T 800 320 T 1200 390 T 1440 280" fill="none" stroke="url(#chartLineGrad)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Perspective Floor */}
      <div className={`absolute bottom-0 left-0 right-0 h-[45vh] pointer-events-none transition-all duration-700 ${animStage >= 2 ? 'opacity-70' : 'opacity-0'}`}>
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 500">
          <defs>
            <linearGradient id="floorFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
              <stop offset="25%" stopColor="#0284C7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <line x1="720" y1="0" x2="-200" y2="500" stroke="url(#floorFade)" strokeWidth="0.8" />
          <line x1="720" y1="0" x2="100" y2="500" stroke="url(#floorFade)" strokeWidth="0.8" />
          <line x1="720" y1="0" x2="350" y2="500" stroke="url(#floorFade)" strokeWidth="0.8" />
          <line x1="720" y1="0" x2="550" y2="500" stroke="url(#floorFade)" strokeWidth="0.8" />
          <line x1="720" y1="0" x2="720" y2="500" stroke="url(#floorFade)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="720" y1="0" x2="890" y2="500" stroke="url(#floorFade)" strokeWidth="0.8" />
          <line x1="720" y1="0" x2="1090" y2="500" stroke="url(#floorFade)" strokeWidth="0.8" />
          <line x1="720" y1="0" x2="1340" y2="500" stroke="url(#floorFade)" strokeWidth="0.8" />
          <line x1="720" y1="0" x2="1640" y2="500" stroke="url(#floorFade)" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Top Header */}
      <div className="relative z-30 w-full flex items-center justify-between text-[11px] font-mono tracking-widest text-slate-500">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-indigo-900/40">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-100 tracking-[0.2em] text-xs">CAPITALGUARD</span>
          <span className="hidden sm:inline text-slate-600">/ INSTITUTIONAL OS</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-widest text-slate-300">
            ● INITIALIZING ({progress}%)
          </span>
          <span className="text-[10px] text-indigo-400 font-medium px-2 py-1 rounded bg-slate-900/80 border border-slate-800">
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
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="innerGate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d="M 300 40 L 530 140 L 490 440 Q 440 580 300 640 Q 160 580 110 440 L 70 140 Z"
              fill="url(#innerGate)"
              stroke="url(#gateGlow)"
              strokeWidth="1.5"
            />
            <path
              d="M 300 80 L 480 165 L 445 420 Q 400 535 300 585 Q 200 535 155 420 L 120 165 Z"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeDasharray="8 6"
              opacity="0.6"
            />
            <line x1="300" y1="40" x2="300" y2="640" stroke="#67E8F9" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
            <circle cx="300" cy="40" r="5" fill="#030712" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="300" cy="40" r="2.5" fill="#67E8F9" />
          </svg>
        </div>

        <div
          className={`relative z-10 text-center flex flex-col items-center justify-center space-y-1 sm:space-y-2 transition-all duration-700 ${
            animStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.35em] text-cyan-400 uppercase mb-1">
            FINANCIAL COMMAND & CONTROL SYSTEM
          </div>

          <div className="text-5xl sm:text-7xl md:text-8xl lg:text-[105px] font-black tracking-[-0.03em] text-white leading-[0.88] uppercase drop-shadow-[0_0_35px_rgba(56,189,248,0.3)]">
            CAPITAL
          </div>

          <div className="text-5xl sm:text-7xl md:text-8xl lg:text-[105px] font-black tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-slate-300 to-cyan-400 leading-[0.88] uppercase">
            GUARD
          </div>

          <div className="text-xs sm:text-base md:text-lg font-bold tracking-[0.2em] text-cyan-300 uppercase pt-2 sm:pt-3">
            Protect Capital. Optimize the Future.
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="relative z-30 w-full max-w-lg mx-auto flex flex-col items-center pb-2">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between w-full text-[10px] font-mono tracking-widest text-slate-500">
            <span>AUTOMATICALLY OPENING CAPITALGUARD</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-[2px] bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-white transition-all duration-75 ease-out shadow-[0_0_10px_rgba(56,189,248,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-600 tracking-wider pt-3 flex items-center gap-2">
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
