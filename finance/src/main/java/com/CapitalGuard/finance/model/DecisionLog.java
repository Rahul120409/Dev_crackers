package com.CapitalGuard.finance.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Decision Log conforming to LLD Section 17 & 9.8.
 * Records the 'why' behind system actions and limit triggers.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DecisionLog {
    private String id;
    private String event;
    private String metric;
    private BigDecimal oldValue;
    private BigDecimal newValue;
    private BigDecimal threshold;
    private ControlAction action;
    private String reason;
    private String aiExplanation; // Bonus explainability for AI points!
    private LocalDateTime timestamp;
}
