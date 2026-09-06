package com.CapitalGuard.finance.market.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketOverview {
    private String overallMarketStatus; // "STABLE", "WARNING", "HIGH_VOLATILITY", "CRITICAL_EVENT"
    private String statusMessage;
    private Double overallVolatilityScore;
    private List<MarketData> indices; // NIFTY 50, SENSEX, NIFTY BANK
    private List<MarketData> keyEquities; // RELIANCE, TCS, INFOSYS, HDFC BANK, ICICI BANK
    private List<MarketEvent> recentEvents;
    private String lastUpdated;
    private Boolean isSimulated;
}
