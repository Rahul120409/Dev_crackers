package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Portfolio;
import com.CapitalGuard.finance.model.Alert;
import com.CapitalGuard.finance.model.RiskLimit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * High-level orchestration for Risk Control:
 * Evaluates limits, triggers breach detector, and creates alerts (LLD Section 13-16).
 */
@Service
public class RiskControlService {

    private final RiskEngine riskEngine;
    private final BreachDetectorService breachDetectorService;
    private final AlertService alertService;
    private final MockPortfolioProvider mockPortfolioProvider;

    private RiskLimit currentLimits = new RiskLimit(); // Default limits from LLD

    @Autowired
    public RiskControlService(
            RiskEngine riskEngine,
            BreachDetectorService breachDetectorService,
            AlertService alertService,
            MockPortfolioProvider mockPortfolioProvider) {
        this.riskEngine = riskEngine;
        this.breachDetectorService = breachDetectorService;
        this.alertService = alertService;
        this.mockPortfolioProvider = mockPortfolioProvider;
    }

    public BreachDetectorService.BreachEvaluation evaluateCurrentPortfolio() {
        Portfolio portfolio = mockPortfolioProvider.getMockPortfolio();
        RiskEngine.RiskOutput metrics = riskEngine.evaluatePortfolio(portfolio);
        BreachDetectorService.BreachEvaluation evaluation = breachDetectorService.detectBreaches(metrics, currentLimits);

        if (evaluation.hasBreach()) {
            alertService.generateAlertsFromBreaches(evaluation.breaches());
        }

        return evaluation;
    }

    public RiskLimit getLimits() {
        return currentLimits;
    }

    public RiskLimit updateLimits(RiskLimit newLimits) {
        this.currentLimits = newLimits;
        return this.currentLimits;
    }

    public List<Alert> getAlerts() {
        return alertService.getAllAlerts();
    }
}
