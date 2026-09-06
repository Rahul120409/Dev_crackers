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
public class MarketData {
    private String symbol;
    private String name;
    private BigDecimal currentPrice;
    private BigDecimal previousClose;
    private BigDecimal percentageChange;
    private BigDecimal dayHigh;
    private BigDecimal dayLow;
    private Long volume;
    private String riskStatus; // NORMAL, WARNING, HIGH_RISK, CRITICAL
    private String timestamp;
}
