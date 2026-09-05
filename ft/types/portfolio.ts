export interface PortfolioKPI {
  id: string;
  title: string;
  value: string;
  unit: string;
  subtitle: string;
  change: string;
  isPositive: boolean;
  statusText: string;
  statusType: 'safe' | 'watch' | 'optimal' | 'alert';
  icon: string;
}

export interface AssetClassItem {
  id: string;
  name: string;
  category: string;
  valueCr: number; // in ₹ Cr (Asset value)
  allocationPct: number; // current % (Current allocation)
  targetPct: number; // target %
  differencePct: number; // delta %
  riskLevel: 'Very Low' | 'Low' | 'Medium' | 'High';
  riskScore: number;
  riskContributionPct: number; // % contribution to total portfolio risk (Risk contribution)
  expectedReturnPct: number; // % expected annual return (Expected return)
  liquidityScore: number; // 0.0 - 1.0 (Liquidity)
  liquidityLevel: 'Instant T+0' | 'High (T+1)' | 'Moderate (T+3)' | 'Low (Term)';
  liquidValueCr: number;
  status: 'OVERWEIGHT' | 'UNDERWEIGHT' | 'BALANCED';
  color: string;
  fillColor: string;
  description: string;
}

export interface PortfolioInsightData {
  title: string;
  badge: string;
  headline: string;
  description: string;
  recommendationAction: string;
  targetRebalanceRoute: string;
}
