import {
  RiskOverviewResponse,
  BreachesResponse,
  RiskLimits,
  StressTestRequest,
  StressTestResponse,
  SystemAlert,
  DecisionHistoryItem
} from '../types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

// Helper to attach Authorization: Bearer <token> from localStorage (Step 2)
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

// ----------------------------------------------------------------------------
// DEFAULT MOCK DATA (Matches exact API contracts provided by User)
// ----------------------------------------------------------------------------

export const DEFAULT_RISK_OVERVIEW: RiskOverviewResponse = {
  riskScore: 38,
  riskLevel: 'MODERATE',
  volatility: 0.1250,
  var95: 12900.00,
  cvar95: 16512.00,
  drawdown: 0.0741,
  liquidity: 961000.00,
  concentrationDetails: {
    highestConcentratedAsset: "US10Y",
    highestWeight: 0.4000,
    hhiIndex: 0.2850,
    allocationByAssetClass: {
      Equity: 0.2500,
      FixedIncome: 0.4000,
      Commodity: 0.1500,
      Cash: 0.2000
    }
  },
  breakdown: {
    volatilityScore: 31.3,
    varScore: 25.8,
    concentrationScore: 57.0,
    drawdownScore: 37.1,
    liquidityScore: 3.9
  }
};

export const DEFAULT_BREACHES_SAFE: BreachesResponse = {
  hasBreach: false,
  overallStatus: 'SAFE',
  primaryAction: 'NO_ACTION',
  breaches: []
};

export const DEFAULT_RISK_LIMITS: RiskLimits = {
  maxEquityAllocation: 0.35,
  maxRiskScore: 70,
  maxDrawdown: 0.15,
  minLiquidity: 200000.00,
  maxVaR: 50000.00,
  maxCVaR: 75000.00
};

export const DEFAULT_ALERTS: SystemAlert[] = [
  {
    id: "ALT-101",
    severity: "CRITICAL",
    type: "RISK_SCORE",
    title: "Risk Limit Breach: COMPOSITE_RISK_SCORE",
    message: "Risk score 82 exceeds maximum threshold of 70",
    metric: "COMPOSITE_RISK_SCORE",
    currentValue: 82,
    threshold: 70,
    recommendedAction: "EMERGENCY_REBALANCE",
    createdAt: "2026-09-05T16:45:00"
  },
  {
    id: "ALT-102",
    severity: "WARNING",
    type: "CONCENTRATION",
    title: "Single-Asset Threshold Warning: US10Y",
    message: "US10Y Sovereign Bond allocation at 40.0% approaching limit 45%",
    metric: "ASSET_CONCENTRATION_US10Y",
    currentValue: 40.0,
    threshold: 45.0,
    recommendedAction: "REDUCE_EXPOSURE",
    createdAt: "2026-09-05T15:30:00"
  },
  {
    id: "ALT-103",
    severity: "MODERATE",
    type: "VOLATILITY",
    title: "Market Volatility Shift",
    message: "Historical 30-day volatility index elevated to 12.50%",
    metric: "VOLATILITY_ANNUALIZED",
    currentValue: 12.5,
    threshold: 18.0,
    recommendedAction: "MONITOR",
    createdAt: "2026-09-05T14:15:00"
  }
];

export const DEFAULT_DECISIONS: DecisionHistoryItem[] = [
  {
    id: "DEC-501",
    event: "MARKET SHOCK SIMULATION: EQUITY_CRASH",
    metric: "COMPOSITE_RISK_SCORE",
    oldValue: 38,
    newValue: 82,
    threshold: 70,
    action: "EMERGENCY_REBALANCE",
    reason: "Market shock triggered risk breach beyond configured limit of 70",
    aiExplanation: "Event: MARKET SHOCK SIMULATION: EQUITY_CRASH. Metric [COMPOSITE_RISK_SCORE] shifted from 38 to 82 against threshold 70. Triggered EMERGENCY_REBALANCE because Market shock triggered risk breach beyond configured limit of 70.",
    timestamp: "2026-09-05T16:45:00"
  },
  {
    id: "DEC-500",
    event: "AUTOMATED LIQUIDITY SWEEP",
    metric: "MIN_LIQUIDITY_BUFFER",
    oldValue: 820000,
    newValue: 961000,
    threshold: 200000,
    action: "SWEEP_SURPLUS_TO_OVERNIGHT_REPO",
    reason: "Surplus cash buffer exceeded minimum liquidity threshold by 380%",
    aiExplanation: "Event: AUTOMATED LIQUIDITY SWEEP. Swept $141,000 into high-yield overnight repo facility to optimize yield while maintaining 100% Basel III compliance.",
    timestamp: "2026-09-05T09:00:00"
  }
];

// Local Storage Keys for offline persistence & stateful updates
const STORAGE_KEY_LIMITS = 'capitalguard_risk_limits';
const STORAGE_KEY_BREACHES = 'capitalguard_risk_breaches';
const STORAGE_KEY_ALERTS = 'capitalguard_risk_alerts';
const STORAGE_KEY_DECISIONS = 'capitalguard_risk_decisions';
const STORAGE_KEY_OVERVIEW = 'capitalguard_risk_overview';

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to store key ${key}`, e);
  }
}

// ----------------------------------------------------------------------------
// API IMPLEMENTATIONS (Step 2: Attaching Authorization Bearer Header)
// ----------------------------------------------------------------------------

/**
 * 4. Full Risk Overview
 * GET http://localhost:8082/api/risk
 */
export async function getRiskOverview(): Promise<RiskOverviewResponse> {
  const targetUrl = `${API_BASE}/api/risk`;
  const headers = getAuthHeaders();
  console.log(`%c[RISK API CALL] GET ${targetUrl}`, 'color: #38bdf8; font-weight: bold; padding: 2px 4px; background: #0f172a; border-radius: 3px;', { headers });
  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    console.log(`%c[RISK API RESPONSE] GET ${targetUrl} Status: ${res.status} ${res.statusText}`, res.ok ? 'color: #4ade80; font-weight: bold;' : 'color: #fbbf24; font-weight: bold;');
    if (res.ok) {
      const data = await res.json();
      console.log(`%c[RISK API DATA] Risk Overview Payload:`, 'color: #4ade80;', data);
      setStored(STORAGE_KEY_OVERVIEW, data);
      return data;
    }
  } catch (err) {
    console.warn(`%c[RISK API OFFLINE/FALLBACK] GET ${targetUrl} unavailable:`, 'color: #f87171;', err);
  }
  const fallback = getStored<RiskOverviewResponse>(STORAGE_KEY_OVERVIEW, DEFAULT_RISK_OVERVIEW);
  console.log(`%c[RISK CLIENT-STATE] Using Risk Overview data:`, 'color: #a78bfa;', fallback);
  return fallback;
}

/**
 * 5. Check Active Breaches & Actions
 * GET http://localhost:8082/api/risk/breaches
 */
export async function getBreaches(): Promise<BreachesResponse> {
  const targetUrl = `${API_BASE}/api/risk/breaches`;
  const headers = getAuthHeaders();
  console.log(`%c[RISK API CALL] GET ${targetUrl}`, 'color: #38bdf8; font-weight: bold; padding: 2px 4px; background: #0f172a; border-radius: 3px;', { headers });
  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    console.log(`%c[RISK API RESPONSE] GET ${targetUrl} Status: ${res.status} ${res.statusText}`, res.ok ? 'color: #4ade80; font-weight: bold;' : 'color: #fbbf24; font-weight: bold;');
    if (res.ok) {
      const data = await res.json();
      console.log(`%c[RISK API DATA] Breaches Payload:`, 'color: #4ade80;', data);
      setStored(STORAGE_KEY_BREACHES, data);
      return data;
    }
  } catch (err) {
    console.warn(`%c[RISK API OFFLINE/FALLBACK] GET ${targetUrl} unavailable:`, 'color: #f87171;', err);
  }
  const fallback = getStored<BreachesResponse>(STORAGE_KEY_BREACHES, DEFAULT_BREACHES_SAFE);
  console.log(`%c[RISK CLIENT-STATE] Using Breaches status:`, 'color: #a78bfa;', fallback);
  return fallback;
}

/**
 * 6a. View Risk Thresholds
 * GET http://localhost:8082/api/risk/limits
 */
export async function getRiskLimits(): Promise<RiskLimits> {
  const targetUrl = `${API_BASE}/api/risk/limits`;
  const headers = getAuthHeaders();
  console.log(`%c[RISK API CALL] GET ${targetUrl}`, 'color: #38bdf8; font-weight: bold; padding: 2px 4px; background: #0f172a; border-radius: 3px;', { headers });
  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    console.log(`%c[RISK API RESPONSE] GET ${targetUrl} Status: ${res.status} ${res.statusText}`, res.ok ? 'color: #4ade80; font-weight: bold;' : 'color: #fbbf24; font-weight: bold;');
    if (res.ok) {
      const data = await res.json();
      console.log(`%c[RISK API DATA] Risk Limits Payload:`, 'color: #4ade80;', data);
      setStored(STORAGE_KEY_LIMITS, data);
      return data;
    }
  } catch (err) {
    console.warn(`%c[RISK API OFFLINE/FALLBACK] GET ${targetUrl} unavailable:`, 'color: #f87171;', err);
  }
  const fallback = getStored<RiskLimits>(STORAGE_KEY_LIMITS, DEFAULT_RISK_LIMITS);
  console.log(`%c[RISK CLIENT-STATE] Using Risk Limits:`, 'color: #a78bfa;', fallback);
  return fallback;
}

/**
 * 6b. Update Risk Thresholds
 * PUT http://localhost:8082/api/risk/limits
 */
export async function updateRiskLimits(limits: RiskLimits): Promise<RiskLimits> {
  const targetUrl = `${API_BASE}/api/risk/limits`;
  const headers = getAuthHeaders();
  console.log(`%c[RISK API CALL] PUT ${targetUrl}`, 'color: #38bdf8; font-weight: bold; padding: 2px 4px; background: #0f172a; border-radius: 3px;', { limits, headers });
  try {
    const res = await fetch(targetUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(limits),
    });
    console.log(`%c[RISK API RESPONSE] PUT ${targetUrl} Status: ${res.status} ${res.statusText}`, res.ok ? 'color: #4ade80; font-weight: bold;' : 'color: #fbbf24; font-weight: bold;');
    if (res.ok) {
      const data = await res.json();
      console.log(`%c[RISK API DATA] Updated Risk Limits:`, 'color: #4ade80;', data);
      setStored(STORAGE_KEY_LIMITS, data);
      return data;
    }
  } catch (err) {
    console.warn(`%c[RISK API OFFLINE/FALLBACK] PUT ${targetUrl} unavailable, updating local state:`, 'color: #f87171;', err);
  }
  setStored(STORAGE_KEY_LIMITS, limits);
  return limits;
}

/**
 * 7. Run Stress Test / Market Shock (Golden Demo API 🎬)
 * POST http://localhost:8082/api/scenarios/stress-test
 */
export async function runStressTest(request: StressTestRequest): Promise<StressTestResponse> {
  const targetUrl = `${API_BASE}/api/scenarios/stress-test`;
  const headers = getAuthHeaders();
  console.log(`%c[SCENARIO API CALL 🎬] POST ${targetUrl}`, 'color: #38bdf8; font-weight: bold; padding: 2px 4px; background: #0f172a; border-radius: 3px;', { request, headers });
  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });
    console.log(`%c[SCENARIO API RESPONSE] POST ${targetUrl} Status: ${res.status} ${res.statusText}`, res.ok ? 'color: #4ade80; font-weight: bold;' : 'color: #fbbf24; font-weight: bold;');
    if (res.ok) {
      const data = await res.json();
      console.log(`%c[SCENARIO API DATA] Stress Simulation Result:`, 'color: #4ade80;', data);
      return data;
    }
  } catch (err) {
    console.warn(`%c[SCENARIO API OFFLINE/FALLBACK] POST ${targetUrl} unavailable, generating deterministic model response:`, 'color: #f87171;', err);
  }

  // Deterministic Client-Side Simulation matching Golden Demo Contract
  const shock = request.shock;
  const shockAbs = Math.abs(shock);
  const initialPortfolioValue = 1000000.00;
  const equityPortion = 250000.00;
  const equityLoss = equityPortion * shockAbs;
  const shockedPortfolioValue = initialPortfolioValue - equityLoss;
  const totalLoss = equityLoss;

  const initialScore = 38;
  let shockedScore = Math.round(initialScore + shockAbs * 220);
  if (shockAbs >= 0.20) shockedScore = Math.max(82, shockedScore);
  if (shockedScore > 98) shockedScore = 98;

  let shockedLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'MODERATE';
  if (shockedScore >= 80) shockedLevel = 'CRITICAL';
  else if (shockedScore >= 60) shockedLevel = 'HIGH';

  const isBreach = shockedScore > 70 || shockAbs >= 0.15;
  const primaryAction = isBreach ? 'EMERGENCY_REBALANCE' : 'NO_ACTION';

  const formattedPct = (shock * 100).toFixed(2);
  const summary = `Scenario ${request.scenario} with shock ${formattedPct}% resulted in a total capital loss of $${totalLoss.toFixed(2)} (from $${initialPortfolioValue.toFixed(2)} to $${shockedPortfolioValue.toFixed(2)}). Risk Score shifted from ${initialScore} (MODERATE) to ${shockedScore} (${shockedLevel}). Action: ${primaryAction}.`;

  const response: StressTestResponse = {
    scenario: request.scenario,
    shockPercentage: shock,
    initialPortfolioValue,
    shockedPortfolioValue,
    totalLoss,
    initialRisk: {
      riskScore: initialScore,
      riskLevel: 'MODERATE'
    },
    shockedRisk: {
      riskScore: shockedScore,
      riskLevel: shockedLevel
    },
    breachStatus: {
      hasBreach: isBreach,
      overallStatus: isBreach ? 'BREACH' : 'SAFE',
      primaryAction: primaryAction
    },
    recommendedAction: primaryAction,
    summary
  };

  console.log(`%c[SCENARIO SIMULATED RESULT]`, 'color: #a78bfa; font-weight: bold;', response);

  if (isBreach) {
    const breachResp: BreachesResponse = {
      hasBreach: true,
      overallStatus: 'BREACH',
      primaryAction: 'EMERGENCY_REBALANCE',
      breaches: [
        {
          id: `BRC-${Date.now()}`,
          metric: 'COMPOSITE_RISK_SCORE',
          currentValue: shockedScore,
          threshold: 70,
          severity: 'CRITICAL',
          message: `Composite Risk Score ${shockedScore} breached threshold 70 during ${request.scenario}`,
          action: 'EMERGENCY_REBALANCE'
        },
        {
          id: `BRC-${Date.now() + 1}`,
          metric: 'VALUE_AT_RISK_95',
          currentValue: Math.round(12900 * (1 + shockAbs * 3)),
          threshold: 50000,
          severity: 'WARNING',
          message: `Projected VaR (95%) elevated during market shock event`,
          action: 'HEDGE_EXPOSURE'
        }
      ]
    };
    setStored(STORAGE_KEY_BREACHES, breachResp);

    const newDecision: DecisionHistoryItem = {
      id: `DEC-${Date.now().toString().slice(-3)}`,
      event: `MARKET SHOCK SIMULATION: ${request.scenario}`,
      metric: "COMPOSITE_RISK_SCORE",
      oldValue: initialScore,
      newValue: shockedScore,
      threshold: 70,
      action: "EMERGENCY_REBALANCE",
      reason: `Market shock triggered risk breach beyond configured limit of 70`,
      aiExplanation: `Event: MARKET SHOCK SIMULATION: ${request.scenario}. Metric [COMPOSITE_RISK_SCORE] shifted from ${initialScore} to ${shockedScore} against threshold 70. Triggered EMERGENCY_REBALANCE because Market shock triggered risk breach beyond configured limit of 70.`,
      timestamp: new Date().toISOString().replace('Z', '')
    };
    const currentDecisions = getStored<DecisionHistoryItem[]>(STORAGE_KEY_DECISIONS, DEFAULT_DECISIONS);
    setStored(STORAGE_KEY_DECISIONS, [newDecision, ...currentDecisions]);

    const newAlert: SystemAlert = {
      id: `ALT-${Date.now().toString().slice(-3)}`,
      severity: "CRITICAL",
      type: "RISK_SCORE",
      title: `Risk Limit Breach: COMPOSITE_RISK_SCORE (${request.scenario})`,
      message: `Risk score ${shockedScore} exceeds maximum threshold of 70`,
      metric: "COMPOSITE_RISK_SCORE",
      currentValue: shockedScore,
      threshold: 70,
      recommendedAction: "EMERGENCY_REBALANCE",
      createdAt: new Date().toISOString().replace('Z', '')
    };
    const currentAlerts = getStored<SystemAlert[]>(STORAGE_KEY_ALERTS, DEFAULT_ALERTS);
    setStored(STORAGE_KEY_ALERTS, [newAlert, ...currentAlerts]);
  }

  return response;
}

/**
 * 8. System Alerts
 * GET http://localhost:8082/api/alerts
 */
export async function getAlerts(): Promise<SystemAlert[]> {
  const targetUrl = `${API_BASE}/api/alerts`;
  const headers = getAuthHeaders();
  console.log(`%c[ALERTS API CALL] GET ${targetUrl}`, 'color: #38bdf8; font-weight: bold; padding: 2px 4px; background: #0f172a; border-radius: 3px;', { headers });
  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    console.log(`%c[ALERTS API RESPONSE] GET ${targetUrl} Status: ${res.status} ${res.statusText}`, res.ok ? 'color: #4ade80; font-weight: bold;' : 'color: #fbbf24; font-weight: bold;');
    if (res.ok) {
      const data = await res.json();
      console.log(`%c[ALERTS API DATA] Alerts Payload (${data.length} items):`, 'color: #4ade80;', data);
      setStored(STORAGE_KEY_ALERTS, data);
      return data;
    }
  } catch (err) {
    console.warn(`%c[ALERTS API OFFLINE/FALLBACK] GET ${targetUrl} unavailable:`, 'color: #f87171;', err);
  }
  const fallback = getStored<SystemAlert[]>(STORAGE_KEY_ALERTS, DEFAULT_ALERTS);
  console.log(`%c[ALERTS CLIENT-STATE] Using Alerts (${fallback.length} items):`, 'color: #a78bfa;', fallback);
  return fallback;
}

/**
 * 9. Decision History (Audit Log)
 * GET http://localhost:8082/api/decisions
 */
export async function getDecisions(): Promise<DecisionHistoryItem[]> {
  const targetUrl = `${API_BASE}/api/decisions`;
  const headers = getAuthHeaders();
  console.log(`%c[DECISIONS API CALL] GET ${targetUrl}`, 'color: #38bdf8; font-weight: bold; padding: 2px 4px; background: #0f172a; border-radius: 3px;', { headers });
  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    console.log(`%c[DECISIONS API RESPONSE] GET ${targetUrl} Status: ${res.status} ${res.statusText}`, res.ok ? 'color: #4ade80; font-weight: bold;' : 'color: #fbbf24; font-weight: bold;');
    if (res.ok) {
      const data = await res.json();
      console.log(`%c[DECISIONS API DATA] Decisions Payload (${data.length} items):`, 'color: #4ade80;', data);
      setStored(STORAGE_KEY_DECISIONS, data);
      return data;
    }
  } catch (err) {
    console.warn(`%c[DECISIONS API OFFLINE/FALLBACK] GET ${targetUrl} unavailable:`, 'color: #f87171;', err);
  }
  const fallback = getStored<DecisionHistoryItem[]>(STORAGE_KEY_DECISIONS, DEFAULT_DECISIONS);
  console.log(`%c[DECISIONS CLIENT-STATE] Using Decisions History (${fallback.length} items):`, 'color: #a78bfa;', fallback);
  return fallback;
}

/**
 * Reset simulated breaches back to normal state
 */
export function resetBreachesToSafe(): BreachesResponse {
  console.log(`%c[RISK ENGINE] Resetting Breaches to SAFE baseline`, 'color: #4ade80; font-weight: bold;');
  setStored(STORAGE_KEY_BREACHES, DEFAULT_BREACHES_SAFE);
  return DEFAULT_BREACHES_SAFE;
}
