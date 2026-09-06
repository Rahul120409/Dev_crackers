import { PortfolioKPI, AssetClassItem, PortfolioInsightData } from '../types/portfolio';

export const mockPortfolioKPIs: PortfolioKPI[] = [
  {
    id: 'total-asset-value',
    title: 'ASSET VALUE',
    value: '₹100',
    unit: 'Cr',
    subtitle: 'Current total book value',
    change: '+3.2% vs last month',
    isPositive: true,
    statusText: 'Optimal',
    statusType: 'optimal',
    icon: 'Building2',
  },
  {
    id: 'current-allocation',
    title: 'CURRENT ALLOCATION',
    value: '100',
    unit: '%',
    subtitle: '4 active asset tranches',
    change: '8% Loan Overweight',
    isPositive: false,
    statusText: 'Rebalance Alert',
    statusType: 'watch',
    icon: 'Layers',
  },
  {
    id: 'expected-return',
    title: 'EXPECTED RETURN',
    value: '7.4',
    unit: '%',
    subtitle: 'Projected weighted return',
    change: '+45 bps benchmark alpha',
    isPositive: true,
    statusText: 'Target 7.0%',
    statusType: 'safe',
    icon: 'TrendingUp',
  },
  {
    id: 'risk-contribution',
    title: 'RISK CONTRIBUTION',
    value: '52.4',
    unit: '% Max',
    subtitle: 'Loans dominant risk factor',
    change: '+4.2% variance concentration',
    isPositive: false,
    statusText: 'High Weight',
    statusType: 'watch',
    icon: 'ShieldAlert',
  },
  {
    id: 'portfolio-liquidity',
    title: 'LIQUIDITY RATIO',
    value: '62.5',
    unit: '%',
    subtitle: '₹62.5 Cr immediate T+1 access',
    change: 'Meets LCR Basel III',
    isPositive: true,
    statusText: 'Healthy Buffer',
    statusType: 'safe',
    icon: 'Droplets',
  },
];

export const mockAssetClasses: AssetClassItem[] = [
  {
    id: 'loans',
    name: 'Loans & Advances',
    category: 'Commercial & Retail Credit',
    valueCr: 50.0,
    allocationPct: 50,
    targetPct: 42,
    differencePct: 8,
    riskLevel: 'Medium',
    riskScore: 78,
    riskContributionPct: 52.4,
    expectedReturnPct: 8.2,
    liquidityScore: 0.35,
    liquidityLevel: 'Low (Term)',
    liquidValueCr: 17.5,
    status: 'OVERWEIGHT',
    color: '#3B82F6', // Vibrant Blue
    fillColor: 'bg-blue-600',
    description: 'Direct lending books, infrastructure tranches, and retail secured advances.',
  },
  {
    id: 'bonds',
    name: 'Sovereign & AAA Bonds',
    category: 'Central Govt Debt & AAA Corp',
    valueCr: 30.0,
    allocationPct: 30,
    targetPct: 33,
    differencePct: -3,
    riskLevel: 'Low',
    riskScore: 28,
    riskContributionPct: 18.6,
    expectedReturnPct: 6.1,
    liquidityScore: 0.90,
    liquidityLevel: 'High (T+1)',
    liquidValueCr: 27.0,
    status: 'UNDERWEIGHT',
    color: '#0D9488', // Teal
    fillColor: 'bg-teal-600',
    description: 'Central government sovereign securities, state debt, and AAA corporate bonds.',
  },
  {
    id: 'cash',
    name: 'Cash & Overnight Reserves',
    category: 'Central Bank Reserves & Repo',
    valueCr: 10.0,
    allocationPct: 10,
    targetPct: 15,
    differencePct: -5,
    riskLevel: 'Very Low',
    riskScore: 5,
    riskContributionPct: 1.2,
    expectedReturnPct: 3.2,
    liquidityScore: 1.00,
    liquidityLevel: 'Instant T+0',
    liquidValueCr: 10.0,
    status: 'UNDERWEIGHT',
    color: '#10B981', // Emerald
    fillColor: 'bg-emerald-600',
    description: 'Overnight clearing balances, statutory reserve ratio, and repo central bank facilities.',
  },
  {
    id: 'equity',
    name: 'Listed Equity & Index Funds',
    category: 'Blue-Chip Securities & Sector ETFs',
    valueCr: 10.0,
    allocationPct: 10,
    targetPct: 10,
    differencePct: 0,
    riskLevel: 'High',
    riskScore: 89,
    riskContributionPct: 27.8,
    expectedReturnPct: 11.5,
    liquidityScore: 0.80,
    liquidityLevel: 'High (T+1)',
    liquidValueCr: 8.0,
    status: 'BALANCED',
    color: '#F59E0B', // Amber
    fillColor: 'bg-amber-600',
    description: 'Blue-chip equities, sector ETFs, and long-term capital appreciation dividend holdings.',
  },
];

export const mockPortfolioInsight: PortfolioInsightData = {
  title: 'CapitalGuard Insight',
  badge: 'Concentration Warning',
  headline: 'Portfolio concentration detected',
  description:
    'Loans currently represent 50% of the portfolio, which is 8% above the recommended target allocation. Increasing liquidity and bond exposure may improve portfolio resilience.',
  recommendationAction: 'Reallocate 8% (₹8 Cr) from Loans into Bonds (+3%) and Cash Liquidity (+5%).',
  targetRebalanceRoute: '/optimization',
};

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

export async function savePortfolioToBackend(name: string, totalCapitalCr: number, assets: AssetClassItem[]) {
  try {
    const payload = {
      name,
      totalCapital: totalCapitalCr * 10000000,
      assets: assets.map(a => ({
        name: a.name,
        assetType: a.id.toUpperCase().includes('EQUITY') ? 'EQUITY' : a.id.toUpperCase().includes('BOND') ? 'GOVERNMENT_BOND' : a.id.toUpperCase().includes('CASH') ? 'CASH' : 'CORPORATE_BOND',
        weight: a.allocationPct / 100,
        value: a.valueCr * 10000000,
        volatility: a.riskLevel === 'High' ? 0.22 : a.riskLevel === 'Medium' ? 0.15 : 0.05,
        liquidityScore: a.liquidityScore,
        expectedReturn: a.expectedReturnPct / 100,
        riskLevel: a.riskLevel.toUpperCase()
      }))
    };

    const res = await fetch(`${API_BASE}/api/portfolio`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.warn('Backend portfolio save returned status:', res.status);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('Failed to save portfolio to backend, falling back to local state:', err);
    return null;
  }
}

export async function fetchLatestPortfolioFromBackend() {
  try {
    const res = await fetch(`${API_BASE}/api/portfolio`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch latest portfolio from backend:', err);
    return null;
  }
}

