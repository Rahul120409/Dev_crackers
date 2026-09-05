// ============================================================================
// PART 1: AUTHENTICATION & USER MANAGEMENT
// ============================================================================

export interface RegisterRequest {
  username?: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  userId: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  message: string;
}

// ============================================================================
// PART 2: RISK ENGINE & CONTROLS
// ============================================================================

export interface AllocationByAssetClass {
  Equity: number;
  FixedIncome: number;
  Commodity: number;
  Cash: number;
}

export interface ConcentrationDetails {
  highestConcentratedAsset: string;
  highestWeight: number;
  hhiIndex: number;
  allocationByAssetClass: AllocationByAssetClass;
}

export interface RiskBreakdown {
  volatilityScore: number;
  varScore: number;
  concentrationScore: number;
  drawdownScore: number;
  liquidityScore: number;
}

export interface RiskOverviewResponse {
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  volatility: number;
  var95: number;
  cvar95: number;
  drawdown: number;
  liquidity: number;
  concentrationDetails: ConcentrationDetails;
  breakdown: RiskBreakdown;
}

export interface BreachItem {
  id: string;
  metric: string;
  currentValue: number;
  threshold: number;
  severity: 'WARNING' | 'CRITICAL';
  message: string;
  action: string;
}

export interface BreachesResponse {
  hasBreach: boolean;
  overallStatus: 'SAFE' | 'WARNING' | 'BREACH';
  primaryAction: 'NO_ACTION' | 'EMERGENCY_REBALANCE' | 'INCREASE_LIQUIDITY' | 'HEDGE_EXPOSURE';
  breaches: BreachItem[];
}

export interface RiskLimits {
  maxEquityAllocation: number;
  maxRiskScore: number;
  maxDrawdown: number;
  minLiquidity: number;
  maxVaR: number;
  maxCVaR: number;
}

export interface StressTestRequest {
  scenario: 'EQUITY_CRASH' | 'RATES_HIKE' | 'LIQUIDITY_SQUEEZE' | 'STAGFLATION';
  shock: number; // e.g. -0.10, -0.20, -0.30
}

export interface StressTestResponse {
  scenario: string;
  shockPercentage: number;
  initialPortfolioValue: number;
  shockedPortfolioValue: number;
  totalLoss: number;
  initialRisk: {
    riskScore: number;
    riskLevel: string;
  };
  shockedRisk: {
    riskScore: number;
    riskLevel: string;
  };
  breachStatus: {
    hasBreach: boolean;
    overallStatus: string;
    primaryAction: string;
  };
  recommendedAction: string;
  summary: string;
}

export interface SystemAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'MODERATE' | 'LOW';
  type: string;
  title: string;
  message: string;
  metric: string;
  currentValue: number;
  threshold: number;
  recommendedAction: string;
  createdAt: string;
}

export interface DecisionHistoryItem {
  id: string;
  event: string;
  metric: string;
  oldValue: number;
  newValue: number;
  threshold: number;
  action: string;
  reason: string;
  aiExplanation: string;
  timestamp: string;
}
