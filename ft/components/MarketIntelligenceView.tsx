'use client';

import React, { useState, useEffect } from 'react';
import { MarketOverviewData, MarketItemData, MarketEventItem, MarketChartPoint } from '../types/market';
import {
  fetchLiveMarketOverview,
  fetchMarketChartData,
  triggerMarketSimulation,
  DEFAULT_MARKET_OVERVIEW
} from '../services/marketService';
import {
  Activity,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Zap,
  RefreshCw,
  Sliders,
  Cpu,
  BarChart3,
  ArrowDownRight,
  ArrowUpRight,
  Flame,
  Radio
} from 'lucide-react';

export const MarketIntelligenceView: React.FC = () => {
  const [data, setData] = useState<MarketOverviewData>(DEFAULT_MARKET_OVERVIEW);
  const [chartSymbol, setChartSymbol] = useState<string>('^NSEI');
  const [chartTimeframe, setChartTimeframe] = useState<string>('1D');
  const [chartPoints, setChartPoints] = useState<MarketChartPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'indices' | 'equities'>('indices');
  const [mounted, setMounted] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    const overview = await fetchLiveMarketOverview();
    setData(overview);

    const points = await fetchMarketChartData(chartSymbol, chartTimeframe);
    setChartPoints(points);
    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchMarketChartData(chartSymbol, chartTimeframe).then(setChartPoints);
  }, [chartSymbol, chartTimeframe]);

  const handleSimulate = async (scenario: 'MINOR_DROP' | 'MAJOR_DROP' | 'MARKET_CRASH' | 'VOLATILITY_SPIKE' | 'RESET') => {
    setSimulating(true);
    const updated = await triggerMarketSimulation(scenario);
    setData(updated);

    const points = await fetchMarketChartData(chartSymbol, chartTimeframe);
    setChartPoints(points);
    setSimulating(false);
  };

  // Status Styling
  const getStatusBadge = () => {
    switch (data.overallMarketStatus) {
      case 'CRITICAL_EVENT':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />,
          title: 'CRITICAL MARKET EVENT',
          dot: 'bg-rose-500 animate-ping'
        };
      case 'HIGH_VOLATILITY':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: <Flame className="w-5 h-5 text-amber-500" />,
          title: 'HIGH VOLATILITY',
          dot: 'bg-amber-500'
        };
      case 'WARNING':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
          title: 'MARKET WARNING',
          dot: 'bg-yellow-500'
        };
      case 'STABLE':
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
          title: 'MARKET STABLE',
          dot: 'bg-emerald-500'
        };
    }
  };

  const statusStyle = getStatusBadge();

  // Helper for Chart SVG Rendering
  const renderSvgChart = () => {
    if (!chartPoints || chartPoints.length === 0) return null;
    const prices = chartPoints.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    const width = 600;
    const height = 180;
    const padding = 20;

    const pointsSvg = chartPoints.map((p, idx) => {
      const x = padding + (idx / (chartPoints.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((p.price - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const isTrendDown = prices[prices.length - 1] < prices[0];
    const strokeColor = isTrendDown ? '#f43f5e' : '#10b981';
    const gradientId = `chartGradient-${isTrendDown ? 'down' : 'up'}`;

    return (
      <div className="relative w-full h-[200px] overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Fill Area */}
          <polygon
            points={`${padding},${height - padding} ${pointsSvg} ${width - padding},${height - padding}`}
            fill={`url(#${gradientId})`}
          />
          {/* Main Trend Line */}
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsSvg}
          />
        </svg>

        {/* Dynamic Overlay Price Labels */}
        <div className="absolute top-2 right-4 text-xs font-mono text-slate-400">
          Peak: <span className="text-slate-200 font-bold">₹{max.toLocaleString()}</span>
        </div>
        <div className="absolute bottom-2 right-4 text-xs font-mono text-slate-400">
          Trough: <span className="text-slate-200 font-bold">₹{min.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Market Intelligence & Risk Monitor</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time market monitoring across Indian indices & blue-chip equities via Yahoo Finance.
            Feeds detected crash and volatility events directly into the AI Risk Safeguard Engine.
          </p>
        </div>

        {/* Global Market Status Badge */}
        <div className={`z-10 px-4 py-3 rounded-xl border ${statusStyle.bg} flex items-center gap-3 min-w-[240px]`}>
          {statusStyle.icon}
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
              <h2 className="text-xs font-bold tracking-wider uppercase">{statusStyle.title}</h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Vol Score: <strong className="text-slate-200">{data.overallVolatilityScore}</strong> / 100
            </p>
          </div>
        </div>
      </div>

      {/* Hackathon Demo Event Simulator Bar */}
      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            <div>
              <span className="text-xs font-bold text-white">Hackathon Demo Event Simulator</span>
              <p className="text-[11px] text-slate-400">Inject real-time market shocks to test AI risk triggers (works offline/closed market)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => handleSimulate('MINOR_DROP')}
              disabled={simulating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all cursor-pointer"
            >
              Minor Drop (-2%)
            </button>
            <button
              onClick={() => handleSimulate('MAJOR_DROP')}
              disabled={simulating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition-all cursor-pointer"
            >
              Major Drop (-5%)
            </button>
            <button
              onClick={() => handleSimulate('MARKET_CRASH')}
              disabled={simulating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/30 text-rose-300 border border-rose-500/50 hover:bg-rose-600/50 transition-all shadow-lg shadow-rose-600/20 cursor-pointer font-bold"
            >
              🚨 Market Crash (-10%)
            </button>
            <button
              onClick={() => handleSimulate('VOLATILITY_SPIKE')}
              disabled={simulating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all cursor-pointer"
            >
              ⚡ Volatility Spike
            </button>
            <button
              onClick={() => handleSimulate('RESET')}
              disabled={simulating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Live
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Market Cards & Interactive Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Market Cards */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Tracked Assets</h2>
            </div>
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => setActiveTab('indices')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeTab === 'indices' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Indices (3)
              </button>
              <button
                onClick={() => setActiveTab('equities')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeTab === 'equities' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Equities (5)
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {(activeTab === 'indices' ? data.indices : data.keyEquities).map(item => {
              const isSelected = chartSymbol === item.symbol || chartSymbol === item.name;
              const isNegative = item.percentageChange < 0;

              return (
                <div
                  key={item.symbol}
                  onClick={() => setChartSymbol(item.symbol)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      <span className="text-[11px] font-mono text-slate-400">{item.symbol}</span>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold font-mono text-white">
                        ₹{item.currentPrice.toLocaleString()}
                      </div>
                      <div className={`flex items-center justify-end gap-0.5 text-xs font-bold font-mono ${
                        isNegative ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {isNegative ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        <span>{item.percentageChange > 0 ? '+' : ''}{item.percentageChange}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Day Range Bar */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Day L: ₹{item.dayLow}</span>
                    <span className={`px-2 py-0.5 rounded font-semibold ${
                      item.riskStatus === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.riskStatus === 'HIGH_RISK'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.riskStatus === 'WARNING'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {item.riskStatus}
                    </span>
                    <span>Day H: ₹{item.dayHigh}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Trend Chart & Real-time Alert Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Chart Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">Live Trend Chart</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {chartSymbol} Trend Analysis
                  <span suppressHydrationWarning className="text-xs font-mono font-normal text-slate-400">
                    ({mounted && data.lastUpdated !== 'Live' ? `Refreshed ${data.lastUpdated}` : 'Live Real-time'})
                  </span>
                </h3>
              </div>

              {/* Timeframe Filter Switcher */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                {['1H', '1D', '1W', '1M'].map(tf => (
                  <button
                    key={tf}
                    onClick={() => setChartTimeframe(tf)}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-colors cursor-pointer ${
                      chartTimeframe === tf ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Chart Render */}
            {renderSvgChart()}
          </div>

          {/* Real-time Alerts Feed & AI Engine API Connection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Risk Event Feed</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Output Stream: <code className="text-indigo-300 font-bold">/api/market/events</code>
              </span>
            </div>

            {/* Event Cards List */}
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {data.recentEvents.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs font-mono">
                  No critical market events detected. System operating normally.
                </div>
              ) : (
                data.recentEvents.map(evt => (
                  <div
                    key={evt.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                      evt.riskLevel === 'CRITICAL'
                        ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                        : evt.riskLevel === 'HIGH_RISK' || evt.riskLevel === 'EXTREME'
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-lg">
                      {evt.eventType === 'MARKET_CRASH' ? '🚨' : evt.eventType === 'VOLATILITY_SPIKE_DETECTED' ? '⚡' : '⚠️'}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-tight">{evt.eventType}</span>
                        <span suppressHydrationWarning className="text-[10px] font-mono text-slate-400">{evt.timestamp}</span>
                      </div>
                      <p className="text-xs font-medium">{evt.details}</p>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-1">
                        <span>Market: <strong className="text-white">{evt.market}</strong></span>
                        <span>Change: <strong className={evt.marketChange < 0 ? 'text-rose-400' : 'text-emerald-400'}>{evt.marketChange}%</strong></span>
                        <span>Vol Score: <strong className="text-white">{evt.volatilityScore}</strong></span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
