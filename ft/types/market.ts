export interface MarketItemData {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  percentageChange: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  riskStatus: 'NORMAL' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL';
  timestamp: string;
}

export interface MarketEventItem {
  id: string;
  eventType: string; // MARKET_CRASH, VOLATILITY_SPIKE_DETECTED, MARKET_WARNING
  market: string;
  marketChange: number;
  volatilityScore: number;
  riskLevel: 'NORMAL' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL' | 'EXTREME';
  timestamp: string;
  details: string;
}

export interface MarketOverviewData {
  overallMarketStatus: 'STABLE' | 'WARNING' | 'HIGH_VOLATILITY' | 'CRITICAL_EVENT';
  statusMessage: string;
  overallVolatilityScore: number;
  indices: MarketItemData[];
  keyEquities: MarketItemData[];
  recentEvents: MarketEventItem[];
  lastUpdated: string;
  isSimulated: boolean;
}

export interface MarketChartPoint {
  timestamp: string;
  price: number;
}
