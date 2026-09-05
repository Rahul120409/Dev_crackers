package com.CapitalGuard.finance.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Configurable risk limits matching LLD Section 13.1.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskLimit {

    @Builder.Default
    private BigDecimal maxEquityAllocation = new BigDecimal("0.35"); // 35%

    @Builder.Default
    private int maxRiskScore = 70; // 0-100 scale

    @Builder.Default
    private BigDecimal maxDrawdown = new BigDecimal("0.15"); // 15%

    @Builder.Default
    private BigDecimal minLiquidity = new BigDecimal("200000.00"); // Minimum liquid cash/bonds

    @Builder.Default
    private BigDecimal maxVaR = new BigDecimal("50000.00"); // Max acceptable VaR

    @Builder.Default
    private BigDecimal maxCVaR = new BigDecimal("75000.00"); // Max acceptable CVaR
}
