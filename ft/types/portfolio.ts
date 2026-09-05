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
  valueCr: number; // in ₹ Cr
  allocationPct: number; // current %
  targetPct: number; // target %
  differencePct: number; // delta %
  riskLevel: 'Very Low' | 'Low' | 'Medium' | 'High';
  riskScore: number;
  expectedReturnPct: number;
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
