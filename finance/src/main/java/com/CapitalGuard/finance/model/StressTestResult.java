package com.CapitalGuard.finance.model;

import com.CapitalGuard.finance.service.BreachDetectorService;
import com.CapitalGuard.finance.service.RiskEngine;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Result returned by the Stress Testing Engine (LLD Section 15 & 25).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StressTestResult {
    private String scenario;
    private BigDecimal shockPercentage;
    private BigDecimal initialPortfolioValue;
    private BigDecimal shockedPortfolioValue;
    private BigDecimal totalLoss;
    private RiskEngine.RiskOutput initialRisk;
    private RiskEngine.RiskOutput shockedRisk;
    private BreachDetectorService.BreachEvaluation breachStatus;
    private ControlAction recommendedAction;
    private String summary;
}
