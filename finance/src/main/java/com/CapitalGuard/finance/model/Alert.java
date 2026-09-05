package com.CapitalGuard.finance.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * System alert object conforming to LLD Section 16.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    private String id;
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL
    private String type; // CONCENTRATION, LIMIT_BREACH, MARKET_SHOCK
    private String title;
    private String message;
    private String metric;
    private BigDecimal currentValue;
    private BigDecimal threshold;
    private ControlAction recommendedAction;
    private LocalDateTime createdAt;
}
