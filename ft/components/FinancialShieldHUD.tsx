'use client';

import React from 'react';

interface FinancialShieldHUDProps {
  stage?: number; // 0 to 6 for splash progression
  activeNode?: 'none' | 'capital' | 'assets' | 'liquidity' | 'risk' | 'all';
  calibratedNodes?: {
    assets?: boolean;
    capital?: boolean;
    liquidity?: boolean;
    risk?: boolean;
  };
  securityLevel?: number; // 0 to 4
  statusGlow?: 'blue' | 'cyan' | 'emerald' | 'amber' | 'indigo' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

// Pre-computed static tick coordinates to guarantee 100% hydration match between SSR and Client
const STATIC_CALIPER_TICKS = [
  { deg: 0, x1: 475, y1: 250, x2: 485, y2: 250, major: true },
  { deg: 30, x1: 444.86, y1: 362.5, x2: 453.52, y2: 367.5, major: false },
  { deg: 60, x1: 362.5, y1: 444.86, x2: 367.5, y2: 453.52, major: false },
  { deg: 90, x1: 250, y1: 475, x2: 250, y2: 485, major: true },
  { deg: 120, x1: 137.5, y1: 444.86, x2: 132.5, y2: 453.52, major: false },
  { deg: 150, x1: 55.14, y1: 362.5, x2: 46.48, y2: 367.5, major: false },
  { deg: 180, x1: 25, y1: 250, x2: 15, y2: 250, major: true },
  { deg: 210, x1: 55.14, y1: 137.5, x2: 46.48, y2: 132.5, major: false },
  { deg: 240, x1: 137.5, y1: 55.14, x2: 132.5, y2: 46.48, major: false },
  { deg: 270, x1: 250, y1: 25, x2: 250, y2: 15, major: true },
  { deg: 300, x1: 362.5, y1: 55.14, x2: 367.5, y2: 46.48, major: false },
  { deg: 330, x1: 444.86, y1: 137.5, x2: 453.52, y2: 132.5, major: false },
];

export const FinancialShieldHUD: React.FC<FinancialShieldHUDProps> = ({
  stage = 6,
  activeNode = 'all',
  calibratedNodes = { assets: true, capital: true, liquidity: true, risk: true },
  securityLevel = 4,
  statusGlow = 'cyan',
  size = 'lg',
}) => {
  const isAssetsActive = activeNode === 'all' || activeNode === 'assets' || calibratedNodes.assets;
  const isCapitalActive = activeNode === 'all' || activeNode === 'capital' || calibratedNodes.capital;
  const isLiquidityActive = activeNode === 'all' || activeNode === 'liquidity' || calibratedNodes.liquidity;
  const isRiskActive = activeNode === 'all' || activeNode === 'risk' || calibratedNodes.risk;

  const glowColor =
    statusGlow === 'emerald'
      ? '#10B981'
      : statusGlow === 'blue'
      ? '#3B82F6'
      : statusGlow === 'amber'
      ? '#F59E0B'
      : statusGlow === 'indigo'
      ? '#6366F1'
      : statusGlow === 'purple'
      ? '#8B5CF6'
      : '#06B6D4';

  const viewBoxSize = 500;

  return (
    <div className={`relative flex items-center justify-center select-none ${
      size === 'sm' ? 'w-64 h-64' : size === 'md' ? 'w-80 h-80' : 'w-96 h-96 sm:w-[450px] sm:h-[450px]'
    }`}>
      {/* Background Radial Glow Halo */}
      <div
        className="absolute inset-4 rounded-full blur-3xl opacity-40 transition-all duration-1000 animate-pulse-slow"
        style={{
          background: `radial-gradient(circle, ${glowColor}40 0%, rgba(59,130,246,0.15) 50%, transparent 70%)`
        }}
      />

      <svg
        className="w-full h-full overflow-visible transition-transform duration-700"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="shieldOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#6366F1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="shieldFacetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="streamPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="50%" stopColor="#67E8F9" stopOpacity="1" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="coreGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          {/* Filters */}
          <filter id="hudNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ========================================================================= */}
        {/* 1. OUTER ORBITAL RINGS & RADAR TICK MARKS                                 */}
        {/* ========================================================================= */}
        <g className="opacity-40">
          {/* Main Orbital Track */}
          <circle cx="250" cy="250" r="230" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="250" cy="250" r="215" fill="none" stroke="#334155" strokeWidth="0.75" />
          <circle cx="250" cy="250" r="185" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="6 12" />

          {/* 12-Hour Compass / Caliper Static Ticks */}
          {STATIC_CALIPER_TICKS.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.major ? '#38BDF8' : '#475569'}
              strokeWidth={t.major ? '1.5' : '1'}
              opacity={t.major ? '0.8' : '0.4'}
            />
          ))}
        </g>

        {/* Dynamic Spinning Orbital Arc */}
        <g className="animate-spin" style={{ transformOrigin: '250px 250px', animationDuration: '30s' }}>
          <path
            d="M 250 25 A 225 225 0 0 1 475 250"
            fill="none"
            stroke="url(#streamPulseGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="475" cy="250" r="3" fill="#67E8F9" filter="url(#hudNeonGlow)" />
        </g>

        <g className="animate-spin" style={{ transformOrigin: '250px 250px', animationDuration: '20s', animationDirection: 'reverse' }}>
          <path
            d="M 250 475 A 225 225 0 0 1 25 250"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            opacity="0.6"
          />
        </g>

        {/* ========================================================================= */}
        {/* 2. THE MULTI-FACETED DIGITAL CYBERNETIC SHIELD                           */}
        {/* ========================================================================= */}
        <g filter="url(#hudNeonGlow)">
          {/* Main Exterior Crest Shell */}
          <path
            d="M 250 55 
               L 410 120 
               L 380 300 
               Q 350 410 250 455 
               Q 150 410 120 300 
               L 90 120 
               Z"
            fill="url(#shieldFacetGrad)"
            stroke="url(#shieldOuterGrad)"
            strokeWidth="2.5"
            className="transition-all duration-700"
          />

          {/* Secondary Interior Reinforcement Crest */}
          <path
            d="M 250 85 
               L 375 138 
               L 350 285 
               Q 325 375 250 415 
               Q 175 375 150 285 
               L 125 138 
               Z"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.2"
            strokeDasharray="6 4"
            opacity="0.75"
          />

          {/* Inner Facet Geometries (Diamond & Triangle Flow Lattice) */}
          {/* Upper Left Facet */}
          <polygon points="250,85 125,138 250,230" fill="#06B6D4" fillOpacity="0.06" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.6" />
          {/* Upper Right Facet */}
          <polygon points="250,85 375,138 250,230" fill="#3B82F6" fillOpacity="0.08" stroke="#3b82f6" strokeWidth="0.8" opacity="0.6" />
          {/* Lower Left Facet */}
          <polygon points="125,138 150,285 250,230" fill="#1E293B" fillOpacity="0.2" stroke="#1E293B" strokeWidth="0.8" />
          {/* Lower Right Facet */}
          <polygon points="375,138 350,285 250,230" fill="#1E293B" fillOpacity="0.2" stroke="#1E293B" strokeWidth="0.8" />
          {/* Bottom Left Keel */}
          <polygon points="150,285 250,415 250,230" fill="#06B6D4" fillOpacity="0.05" stroke="#06b6d4" strokeWidth="0.8" opacity="0.5" />
          {/* Bottom Right Keel */}
          <polygon points="350,285 250,415 250,230" fill="#3B82F6" fillOpacity="0.05" stroke="#3b82f6" strokeWidth="0.8" opacity="0.5" />

          {/* Vertical Tactical Centerline / Flow Spine */}
          <line x1="250" y1="55" x2="250" y2="455" stroke="#67E8F9" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.85" />
          <line x1="120" y1="230" x2="380" y2="230" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        </g>

        {/* ========================================================================= */}
        {/* 3. CORE QUANTUM REACTOR & GYROSCOPE                                      */}
        {/* ========================================================================= */}
        <g className="transition-transform duration-500">
          {/* Outer Crosshair Rings */}
          <circle cx="250" cy="230" r="38" fill="none" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.6" />
          <circle cx="250" cy="230" r="28" fill="#030712" stroke="url(#coreGlowGrad)" strokeWidth="2" />
          
          {/* Pulsing Core */}
          <circle cx="250" cy="230" r="18" fill="#06B6D4" fillOpacity="0.25" className="animate-ping" opacity="0.6" />
          <circle cx="250" cy="230" r="10" fill="#030712" stroke="#67E8F9" strokeWidth="1.5" />
          <circle cx="250" cy="230" r="4" fill="#38BDF8" />

          {/* Micro HUD Reticles */}
          <line x1="250" y1="185" x2="250" y2="198" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="250" y1="262" x2="250" y2="275" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="205" y1="230" x2="218" y2="230" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="282" y1="230" x2="295" y2="230" stroke="#38BDF8" strokeWidth="1.5" />
        </g>

        {/* ========================================================================= */}
        {/* 4. STRATEGIC FINANCIAL NODES (WITH METRICS & TELEMETRY)                  */}
        {/* ========================================================================= */}
        
        {/* NODE 1: CAPITAL APEX (TOP) */}
        <g className={`transition-all duration-500 ${isCapitalActive ? 'opacity-100' : 'opacity-40'}`}>
          <line x1="250" y1="55" x2="250" y2="28" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="250" cy="55" r="7" fill="#030712" stroke="#38BDF8" strokeWidth="2" filter="url(#hudNeonGlow)" />
          <circle cx="250" cy="55" r="3" fill="#67E8F9" />
          
          {/* HUD Metric Card */}
          <rect x="185" y="6" width="130" height="22" rx="4" fill="#050814" stroke="#0284C7" strokeWidth="1" opacity="0.95" />
          <text x="250" y="18" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace" letterSpacing="1">
            CAPITAL // ₹100Cr
          </text>
        </g>

        {/* NODE 2: ASSETS (UPPER RIGHT) */}
        <g className={`transition-all duration-500 ${isAssetsActive ? 'opacity-100' : 'opacity-40'}`}>
          <line x1="410" y1="120" x2="445" y2="105" stroke="#06B6D4" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="410" cy="120" r="7" fill="#030712" stroke="#06B6D4" strokeWidth="2" filter="url(#hudNeonGlow)" />
          <circle cx="410" cy="120" r="3" fill="#22D3EE" />

          {/* HUD Metric Card */}
          <rect x="360" y="85" width="130" height="22" rx="4" fill="#050814" stroke="#0891B2" strokeWidth="1" opacity="0.95" />
          <text x="425" y="97" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace" letterSpacing="1">
            ASSETS // ALLOCATION
          </text>
        </g>

        {/* NODE 3: LIQUIDITY (LOWER RIGHT) */}
        <g className={`transition-all duration-500 ${isLiquidityActive ? 'opacity-100' : 'opacity-40'}`}>
          <line x1="380" y1="300" x2="425" y2="320" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="380" cy="300" r="7" fill="#030712" stroke="#3B82F6" strokeWidth="2" filter="url(#hudNeonGlow)" />
          <circle cx="380" cy="300" r="3" fill="#60A5FA" />

          {/* HUD Metric Card */}
          <rect x="350" y="325" width="140" height="22" rx="4" fill="#050814" stroke="#2563EB" strokeWidth="1" opacity="0.95" />
          <text x="420" y="337" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace" letterSpacing="1">
            LIQUIDITY // ₹20Cr HQLA
          </text>
        </g>

        {/* NODE 4: OPTIMIZATION (BOTTOM KEEL) */}
        <g className="transition-all duration-500 opacity-90">
          <line x1="250" y1="455" x2="250" y2="475" stroke="#6366F1" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="250" cy="455" r="7" fill="#030712" stroke="#6366F1" strokeWidth="2" filter="url(#hudNeonGlow)" />
          <circle cx="250" cy="455" r="3" fill="#818CF8" />

          {/* HUD Metric Card */}
          <rect x="175" y="475" width="150" height="22" rx="4" fill="#050814" stroke="#4F46E5" strokeWidth="1" opacity="0.95" />
          <text x="250" y="487" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace" letterSpacing="1">
            OPTIMIZATION // +8% GAIN
          </text>
        </g>

        {/* NODE 5: RISK SAFEGUARD (LOWER LEFT) */}
        <g className={`transition-all duration-500 ${isRiskActive ? 'opacity-100' : 'opacity-40'}`}>
          <line x1="120" y1="300" x2="75" y2="320" stroke={isRiskActive ? '#10B981' : '#F43F5E'} strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="120" cy="300" r="7" fill="#030712" stroke={isRiskActive ? '#10B981' : '#F43F5E'} strokeWidth="2" filter="url(#hudNeonGlow)" />
          <circle cx="120" cy="300" r="3" fill={isRiskActive ? '#34D399' : '#FB7185'} />

          {/* HUD Metric Card */}
          <rect x="10" y="325" width="140" height="22" rx="4" fill="#050814" stroke={isRiskActive ? '#059669' : '#E11D48'} strokeWidth="1" opacity="0.95" />
          <text x="80" y="337" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace" letterSpacing="1">
            {isRiskActive ? 'RISK // CAR 14.8% (PASS)' : 'RISK // VAR 95% GUARD'}
          </text>
        </g>

        {/* NODE 6: DECISION MATRIX (UPPER LEFT) */}
        <g className="transition-all duration-500 opacity-90">
          <line x1="90" y1="120" x2="55" y2="105" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="90" cy="120" r="7" fill="#030712" stroke="#38BDF8" strokeWidth="2" filter="url(#hudNeonGlow)" />
          <circle cx="90" cy="120" r="3" fill="#7DD3FC" />

          {/* HUD Metric Card */}
          <rect x="10" y="85" width="130" height="22" rx="4" fill="#050814" stroke="#0284C7" strokeWidth="1" opacity="0.95" />
          <text x="75" y="97" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace" letterSpacing="1">
            DECISION // SOLVER
          </text>
        </g>
      </svg>
    </div>
  );
};
