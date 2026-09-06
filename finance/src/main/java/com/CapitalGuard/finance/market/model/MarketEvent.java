package com.CapitalGuard.finance.market.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketEvent {
    private String id;
    private String eventType; // MARKET_CRASH, VOLATILITY_SPIKE_DETECTED, MARKET_WARNING, MARKET_NORMAL
    private String market; // e.g. "NIFTY 50"
    private BigDecimal marketChange; // e.g. -8.5
    private Double volatilityScore; // e.g. 90.0
    private String riskLevel; // NORMAL, WARNING, HIGH_RISK, CRITICAL
    private String timestamp;
    private String details;
}
