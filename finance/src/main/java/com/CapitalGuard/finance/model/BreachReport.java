package com.CapitalGuard.finance.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Breach details conforming to LLD Section 13.3.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreachReport {
    private boolean breach;
    private String type; // CONCENTRATION, RISK_SCORE, DRAWDOWN, LIQUIDITY, VAR
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL
    private String metric;
    private BigDecimal currentValue;
    private BigDecimal threshold;
    private ControlAction recommendedAction;
    private String details;
}
