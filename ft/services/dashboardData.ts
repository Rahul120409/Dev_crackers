import { AssetAllocation, KPIMetric, HealthIndicator, AlertItem, ActivityItem, OptimizationDetails } from '../types/dashboard';

export const mockKPIs: KPIMetric[] = [
  {
    id: 'total-assets',
    title: 'Total Assets',
    value: '₹100',
    unit: 'Cr',
    description: 'Consolidated institutional book value',
    change: '+3.2% vs last month',
    isPositive: true,
    status: 'safe',
    statusText: 'Optimal',
    iconName: 'Building2',
  },
  {
    id: 'available-capital',
    title: 'Available Capital',
    value: '₹12',
    unit: 'Cr',
    description: 'Unallocated tier-1 surplus reserve',
    change: '+₹0.8 Cr newly released',
    isPositive: true,
    status: 'safe',
    statusText: 'Surplus',
    iconName: 'Coins',
  },
  {
    id: 'liquidity-position',
    title: 'Liquidity',
    value: '₹20',
    unit: 'Cr',
    description: 'High-Quality Liquid Assets (HQLA)',
    change: '15% above statutory min (₹15 Cr)',
    isPositive: true,
    status: 'safe',
    statusText: 'Buffer Safe',
    iconName: 'Droplets',
  },
  {
    id: 'risk-score',
    title: 'Risk Score',
    value: '72',
    unit: '/100',
    description: 'Composite balance sheet risk index',
    change: '+4 pts in last 24h',
    isPositive: false,
    status: 'watch',
    statusText: 'Watch / High',
    iconName: 'ShieldAlert',
  },
];

export const mockAllocations: AssetAllocation[] = [
  {
    name: 'Loans',
    category: 'Commercial & Retail Credit',
    percentage: 50,
    amount: 50.0,
    riskWeight: '100% RWA',
    color: '#1E3A8A', // Deep Navy/Slate
    fillClass: 'fill-blue-900 text-blue-900',
  },
  {
    name: 'Bonds',
    category: 'Sovereign & AAA Corporate Debt',
    percentage: 30,
    amount: 30.0,
    riskWeight: '20% RWA',
    color: '#0D9488', // Teal
    fillClass: 'fill-teal-600 text-teal-600',
  },
  {
    name: 'Cash',
    category: 'Central Bank Reserves & Overnight',
    percentage: 10,
    amount: 10.0,
    riskWeight: '0% RWA',
    color: '#16A34A', // Emerald
    fillClass: 'fill-emerald-600 text-emerald-600',
  },
  {
    name: 'Equity',
    category: 'Listed Securities & Index Funds',
    percentage: 10,
    amount: 10.0,
    riskWeight: '150% RWA',
    color: '#D97706', // Amber
    fillClass: 'fill-amber-600 text-amber-600',
  },
];

export const mockHealthIndicators: HealthIndicator[] = [
  {
    name: 'Capital Adequacy (CAR)',
    metric: '14.8% (Min: 11.5%)',
    status: 'Safe',
    valuePercentage: 88,
    threshold: 'Basel III Target 11.5%',
    statusColor: 'bg-emerald-600',
  },
  {
    name: 'Liquidity Coverage (LCR)',
    metric: '133.3% (Min: 100%)',
    status: 'Safe',
    valuePercentage: 90,
    threshold: 'HQLA Buffer Adequate',
    statusColor: 'bg-emerald-600',
  },
  {
    name: 'Credit Risk Exposure',
    metric: '2.4% Concentration Delta',
    status: 'Watch',
    valuePercentage: 68,
    threshold: 'Limit: 2.0% single sector',
    statusColor: 'bg-amber-500',
  },
  {
    name: 'Market Risk (95% 1-Day VaR)',
    metric: '₹2.1 Cr (Tail CVaR: ₹3.2 Cr)',
    status: 'Moderate',
    valuePercentage: 55,
    threshold: 'Tolerance: ₹2.5 Cr',
    statusColor: 'bg-blue-600',
  },
];

export const mockAlerts: AlertItem[] = [
  {
    id: 'ALT-101',
    title: 'High credit exposure detected',
    severity: 'HIGH',
    category: 'Concentration Limit',
    timestamp: '12 mins ago',
    threshold: 'Max single borrower: 15%',
    currentValue: '17.2% in Tier-1 Infrastructure Loan portfolio',
    recommendedAction: 'Syndicate or hedge loan sub-tranche',
  },
  {
    id: 'ALT-102',
    title: 'Liquidity buffer approaching threshold',
    severity: 'WARNING',
    category: 'Liquidity Safeguard',
    timestamp: '45 mins ago',
    threshold: 'Min buffer ₹18.0 Cr',
    currentValue: '₹20.0 Cr (Downward velocity detected)',
    recommendedAction: 'Shift ₹2.5 Cr from short term credit to overnight repo',
  },
  {
    id: 'ALT-103',
    title: 'Capital utilization above 80%',
    severity: 'MODERATE',
    category: 'Capital Deployment',
    timestamp: '2 hours ago',
    threshold: 'Target ceiling: 78%',
    currentValue: '88% active capital deployed across credit books',
    recommendedAction: 'Execute scheduled rebalancing run',
  },
];

export const mockOptimization: OptimizationDetails = {
  title: 'Optimization Opportunity',
  description: 'Your current portfolio may be improved while maintaining capital and liquidity constraints.',
  riskReduction: 14,
  liquidityImprovement: '+₹4 Cr',
  capitalEfficiency: 8,
  currentAllocation: {
    'Loans': 50,
    'Bonds': 30,
    'Cash': 10,
    'Equity': 10,
  },
  optimizedAllocation: {
    'Loans': 42,
    'Bonds': 36,
    'Cash': 14,
    'Equity': 8,
  },
  expectedReturnDelta: '+45 bps net risk-adjusted return',
  rationale: [
    'Reduces Credit RWA by shifting 8% from unrated loans into AAA Sovereign Bonds',
    'Increases Tier-1 HQLA liquidity buffer from ₹20 Cr to ₹24 Cr (+₹4 Cr)',
    'Lowers 95% Value-at-Risk by 14% while preserving an 8.65% portfolio yield',
    'Maintains all Basel III & liquidity coverage constraints fully within green bands'
  ]
};

export const mockActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Portfolio analysis completed',
    description: 'Autonomous balance sheet health check across all 4 asset books.',
    timestamp: '14m ago',
    type: 'analysis',
    badge: 'Engine Run'
  },
  {
    id: 'act-2',
    title: 'Risk controls evaluated',
    description: 'Checked 12 capital & concentration risk limits. 1 limit on watch.',
    timestamp: '38m ago',
    type: 'risk',
    badge: 'Basel III Pass'
  },
  {
    id: 'act-3',
    title: 'Optimization recommendation generated',
    description: 'Markowitz-Liquidity solver identified +8% capital efficiency boost.',
    timestamp: '1h 12m ago',
    type: 'optimization',
    badge: 'Ready for Review'
  },
];
