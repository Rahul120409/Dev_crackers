export interface AssetAllocation {
  name: string;
  category: string;
  percentage: number;
  amount: number; // in Crores
  riskWeight: string;
  color: string;
  fillClass: string;
}

export interface KPIMetric {
  id: string;
  title: string;
  value: string;
  unit: string;
  description: string;
  change: string;
  isPositive: boolean;
  status: 'safe' | 'warning' | 'watch' | 'critical';
  statusText: string;
  iconName: string;
}

export interface HealthIndicator {
  name: string;
  metric: string;
  status: 'Safe' | 'Watch' | 'Moderate' | 'Critical';
  valuePercentage: number;
  threshold: string;
  statusColor: string;
}

export interface AlertItem {
  id: string;
  title: string;
  severity: 'HIGH' | 'WARNING' | 'MODERATE' | 'LOW';
  category: string;
  timestamp: string;
  threshold: string;
  currentValue: string;
  recommendedAction: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'analysis' | 'risk' | 'optimization' | 'system';
  badge: string;
}

export interface OptimizationDetails {
  title: string;
  description: string;
  riskReduction: number;
  liquidityImprovement: string;
  capitalEfficiency: number;
  currentAllocation: Record<string, number>;
  optimizedAllocation: Record<string, number>;
  expectedReturnDelta: string;
  rationale: string[];
}
