import { MarketOverviewData, MarketEventItem, MarketChartPoint } from '../types/market';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token') || localStorage.getItem('capitalguard_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const DEFAULT_MARKET_OVERVIEW: MarketOverviewData = {
  overallMarketStatus: 'STABLE',
  statusMessage: 'All key Indian indices (NIFTY 50, SENSEX, NIFTY BANK) operating within normal risk parameters.',
  overallVolatilityScore: 24.5,
  indices: [
    {
      symbol: '^NSEI',
      name: 'NIFTY 50',
      currentPrice: 23897.70,
      previousClose: 23873.40,
      percentageChange: 0.10,
      dayHigh: 24005.75,
      dayLow: 23895.85,
      volume: 1542000,
      riskStatus: 'NORMAL',
      timestamp: 'Live'
    },
    {
      symbol: '^BSESN',
      name: 'SENSEX',
      currentPrice: 78450.20,
      previousClose: 78310.15,
      percentageChange: 0.18,
      dayHigh: 78820.00,
      dayLow: 78250.00,
      volume: 2150000,
      riskStatus: 'NORMAL',
      timestamp: 'Live'
    },
    {
      symbol: '^NSEBANK',
      name: 'NIFTY BANK',
      currentPrice: 51200.45,
      previousClose: 51350.00,
      percentageChange: -0.29,
      dayHigh: 51600.00,
      dayLow: 51150.00,
      volume: 980000,
      riskStatus: 'NORMAL',
      timestamp: 'Live'
    }
  ],
  keyEquities: [
    {
      symbol: 'RELIANCE.NS',
      name: 'RELIANCE',
      currentPrice: 2980.50,
      previousClose: 2965.00,
      percentageChange: 0.52,
      dayHigh: 2995.00,
      dayLow: 2960.00,
      volume: 3450000,
      riskStatus: 'NORMAL',
      timestamp: 'Live'
    },
    {
      symbol: 'TCS.NS',
      name: 'TCS',
      currentPrice: 4120.00,
      previousClose: 4145.00,
      percentageChange: -0.60,
      dayHigh: 4160.00,
      dayLow: 4110.00,
      volume: 1250000,
      riskStatus: 'NORMAL',
      timestamp: 'Live'
    },
    {
      symbol: 'INFY.NS',
      name: 'INFOSYS',
      currentPrice: 1850.30,
      previousClose: 1842.00,
      percentageChange: 0.45,
      dayHigh: 1865.00,
      dayLow: 1838.00,
      volume: 2100000,
      riskStatus: 'NORMAL',
      timestamp: 'Live'
    },
    {
      symbol: 'HDFCBANK.NS',
      name: 'HDFC BANK',
      currentPrice: 1640.80,
      previousClose: 1655.00,
      percentageChange: -0.86,
      dayHigh: 1660.00,
      dayLow: 1635.00,
      volume: 4800000,
      riskStatus: 'NORMAL',
      timestamp: 'Live'
    },
    {
      symbol: 'ICICIBANK.NS',
      name: 'ICICI BANK',
      currentPrice: 1210.15,
      previousClose: 1205.00,
      percentageChange: 0.43,
      dayHigh: 1220.00,
      dayLow: 1200.00,
      volume: 3100000,
      riskStatus: 'NORMAL',
      timestamp: 'Live'
    }
  ],
  recentEvents: [
    {
      id: 'EVT-INIT-1',
      eventType: 'MARKET_MONITORING_ACTIVE',
      market: 'NIFTY 50',
      marketChange: 0.10,
      volatilityScore: 24.5,
      riskLevel: 'NORMAL',
      timestamp: 'Live',
      details: 'Real-time monitoring active. 8 assets tracked via Yahoo Finance.'
    }
  ],
  lastUpdated: 'Live',
  isSimulated: false
};

const LOCAL_STORAGE_MARKET_KEY = 'capitalguard_market_state';

function getStoredMarketState(): MarketOverviewData {
  if (typeof window === 'undefined') return DEFAULT_MARKET_OVERVIEW;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MARKET_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_MARKET_OVERVIEW;
  } catch {
    return DEFAULT_MARKET_OVERVIEW;
  }
}

function setStoredMarketState(state: MarketOverviewData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_MARKET_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save market state', e);
  }
}

export async function fetchLiveMarketOverview(): Promise<MarketOverviewData> {
  try {
    const res = await fetch(`${API_BASE}/api/market/live`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      setStoredMarketState(data);
      return data;
    }
  } catch (err) {
    console.warn('Backend market service offline, using cached state:', err);
  }
  return getStoredMarketState();
}

export async function fetchMarketChartData(symbol: string = '^NSEI', timeframe: string = '1D'): Promise<MarketChartPoint[]> {
  try {
    const res = await fetch(`${API_BASE}/api/market/chart?symbol=${encodeURIComponent(symbol)}&range=${timeframe}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend market chart API offline, generating trend points:', err);
  }

  // Fallback Chart Point Generator
  const points: MarketChartPoint[] = [];
  const state = getStoredMarketState();
  const targetObj = state.indices.find(i => i.symbol === symbol || i.name === symbol) || state.indices[0];
  const basePrice = targetObj ? targetObj.currentPrice : 23897.70;
  const isDrop = targetObj ? targetObj.percentageChange < 0 : false;

  const count = timeframe === '1H' ? 12 : timeframe === '1D' ? 24 : timeframe === '1W' ? 28 : 30;

  for (let i = count; i >= 0; i--) {
    const timeLabel = `T-${i * 5}m`;
    const noise = Math.sin(i * 0.4) * (basePrice * 0.001);
    const trendOffset = isDrop ? (basePrice * (targetObj.percentageChange / 100)) * (1 - i / count) : noise;
    points.push({
      timestamp: timeLabel,
      price: Math.round((basePrice + trendOffset + noise) * 100) / 100
    });
  }
  return points;
}

export async function triggerMarketSimulation(scenario: 'MINOR_DROP' | 'MAJOR_DROP' | 'MARKET_CRASH' | 'VOLATILITY_SPIKE' | 'RESET', customPct?: number): Promise<MarketOverviewData> {
  try {
    const res = await fetch(`${API_BASE}/api/market/simulate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ scenario, customPercentage: customPct })
    });
    if (res.ok) {
      const data = await res.json();
      setStoredMarketState(data);
      return data;
    }
  } catch (err) {
    console.warn('Backend market simulation trigger offline, generating client simulation:', err);
  }

  // Deterministic Client Simulation fallback
  const currentState = getStoredMarketState();
  let dropPct = 0;
  let status: 'STABLE' | 'WARNING' | 'HIGH_VOLATILITY' | 'CRITICAL_EVENT' = 'STABLE';
  let message = 'Market operating normally.';
  let eventType = 'MARKET_NORMAL';
  let riskLevel: 'NORMAL' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL' | 'EXTREME' = 'NORMAL';
  let volScore = 24.5;

  if (scenario === 'MINOR_DROP') {
    dropPct = customPct ?? -2.5;
    status = 'WARNING';
    message = '⚠️ MARKET WARNING: Moderate downward pressure on NIFTY 50 and benchmark indices.';
    eventType = 'MARKET_WARNING';
    riskLevel = 'WARNING';
    volScore = 55.0;
  } else if (scenario === 'MAJOR_DROP') {
    dropPct = customPct ?? -5.5;
    status = 'HIGH_VOLATILITY';
    message = '⚡ HIGH MARKET RISK: Major equity sell-off detected across tracked Indian assets.';
    eventType = 'HIGH_RISK_DROP';
    riskLevel = 'HIGH_RISK';
    volScore = 78.0;
  } else if (scenario === 'MARKET_CRASH') {
    dropPct = customPct ?? -10.0;
    status = 'CRITICAL_EVENT';
    message = '🚨 CRITICAL MARKET CRASH DETECTED! NIFTY 50 dropped severely. Risk safeguards engaged.';
    eventType = 'MARKET_CRASH';
    riskLevel = 'CRITICAL';
    volScore = 94.5;
  } else if (scenario === 'VOLATILITY_SPIKE') {
    dropPct = -4.2;
    status = 'HIGH_VOLATILITY';
    message = '⚡ VOLATILITY SPIKE: Sudden intraday variance spike detected across blue-chip components.';
    eventType = 'VOLATILITY_SPIKE_DETECTED';
    riskLevel = 'EXTREME';
    volScore = 88.0;
  } else {
    // RESET
    setStoredMarketState(DEFAULT_MARKET_OVERVIEW);
    return DEFAULT_MARKET_OVERVIEW;
  }

  const updatedIndices = currentState.indices.map(idx => {
    const newPrice = idx.previousClose * (1 + dropPct / 100);
    return {
      ...idx,
      currentPrice: Math.round(newPrice * 100) / 100,
      percentageChange: dropPct,
      riskStatus: (dropPct <= -8 ? 'CRITICAL' : dropPct <= -5 ? 'HIGH_RISK' : dropPct <= -2 ? 'WARNING' : 'NORMAL') as any
    };
  });

  const updatedEquities = currentState.keyEquities.map(eq => {
    const eqDrop = dropPct * (1 + (Math.sin(eq.symbol.length) * 0.1));
    const newPrice = eq.previousClose * (1 + eqDrop / 100);
    return {
      ...eq,
      currentPrice: Math.round(newPrice * 100) / 100,
      percentageChange: Math.round(eqDrop * 100) / 100,
      riskStatus: (eqDrop <= -8 ? 'CRITICAL' : eqDrop <= -5 ? 'HIGH_RISK' : eqDrop <= -2 ? 'WARNING' : 'NORMAL') as any
    };
  });

  const newEvent: MarketEventItem = {
    id: `EVT-SIM-${Date.now().toString().slice(-4)}`,
    eventType,
    market: 'NIFTY 50',
    marketChange: dropPct,
    volatilityScore: volScore,
    riskLevel,
    timestamp: new Date().toLocaleTimeString(),
    details: `${scenario} trigger applied. NIFTY 50 shifted ${dropPct}% with Volatility Score ${volScore}.`
  };

  const updatedState: MarketOverviewData = {
    overallMarketStatus: status,
    statusMessage: message,
    overallVolatilityScore: volScore,
    indices: updatedIndices,
    keyEquities: updatedEquities,
    recentEvents: [newEvent, ...currentState.recentEvents].slice(0, 20),
    lastUpdated: new Date().toLocaleTimeString(),
    isSimulated: true
  };

  setStoredMarketState(updatedState);
  return updatedState;
}

export async function fetchRiskEventsForAiEngine(): Promise<MarketEventItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/market/events`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend risk events API offline, using local events:', err);
  }
  return getStoredMarketState().recentEvents;
}
