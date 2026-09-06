package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Asset;
import com.CapitalGuard.finance.entity.Portfolio;
import com.CapitalGuard.finance.model.ControlAction;
import com.CapitalGuard.finance.model.StressTestRequest;
import com.CapitalGuard.finance.model.StressTestResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * Stress Testing and Market Shock Simulation Engine (LLD Section 15 & 25).
 */
@Service
public class StressTestService {

    private final MockPortfolioProvider mockPortfolioProvider;
    private final RiskEngine riskEngine;
    private final RiskControlService riskControlService;
    private final BreachDetectorService breachDetectorService;
    private final AlertService alertService;
    private final DecisionLogService decisionLogService;

    public StressTestService(
            MockPortfolioProvider mockPortfolioProvider,
            RiskEngine riskEngine,
            RiskControlService riskControlService,
            BreachDetectorService breachDetectorService,
            AlertService alertService,
            DecisionLogService decisionLogService) {
        this.mockPortfolioProvider = mockPortfolioProvider;
        this.riskEngine = riskEngine;
        this.riskControlService = riskControlService;
        this.breachDetectorService = breachDetectorService;
        this.alertService = alertService;
        this.decisionLogService = decisionLogService;
    }

    /**
     * Executes market shock and stress test flow.
     */
    public StressTestResult executeStressTest(StressTestRequest request) {
        Portfolio basePortfolio = mockPortfolioProvider.getMockPortfolio();
        RiskEngine.RiskOutput initialRisk = riskEngine.evaluatePortfolio(basePortfolio);
        BigDecimal initialValue = basePortfolio.getTotalCapital();

        BigDecimal shock = request.getShock() != null ? request.getShock() : new BigDecimal("-0.20");
        String scenario = request.getScenario() != null ? request.getScenario().toUpperCase() : "EQUITY_CRASH";

        // Create shocked copy of portfolio
        Portfolio shockedPortfolio = new Portfolio();
        shockedPortfolio.setName(basePortfolio.getName() + " [SHOCKED: " + scenario + "]");

        List<Asset> shockedAssets = new ArrayList<>();
        BigDecimal newTotalCapital = BigDecimal.ZERO;

        for (Asset a : basePortfolio.getAssets()) {
            Asset shockedAsset = new Asset();
            shockedAsset.setSymbol(a.getSymbol());
            shockedAsset.setName(a.getName());
            shockedAsset.setAssetClass(a.getAssetClass());
            shockedAsset.setLiquidityScore(a.getLiquidityScore());

            BigDecimal assetValue = a.getCurrentValue();
            BigDecimal assetVol = a.getVolatility();

            // Apply shock logic depending on scenario
            if (scenario.contains("EQUITY") && "Equity".equalsIgnoreCase(a.getAssetClass())) {
                // Asset value drops by shock (e.g. -20% -> value * 0.80)
                BigDecimal multiplier = BigDecimal.ONE.add(shock);
                assetValue = assetValue.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
                // In market crash, equity volatility surges dramatically (e.g. 2.5x)
                assetVol = assetVol.multiply(new BigDecimal("2.50")).setScale(4, RoundingMode.HALF_UP);
            } else if (scenario.contains("INTEREST") && "FixedIncome".equalsIgnoreCase(a.getAssetClass())) {
                BigDecimal multiplier = BigDecimal.ONE.add(shock);
                assetValue = assetValue.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
            } else if (scenario.contains("LIQUIDITY")) {
                // Drop liquidity score by 30%
                shockedAsset.setLiquidityScore(a.getLiquidityScore().multiply(new BigDecimal("0.70")).setScale(4, RoundingMode.HALF_UP));
            }

            shockedAsset.setCurrentValue(assetValue);
            shockedAsset.setVolatility(assetVol);
            newTotalCapital = newTotalCapital.add(assetValue);
            shockedAssets.add(shockedAsset);
        }

        shockedPortfolio.setTotalCapital(newTotalCapital);

        // Recalculate asset weights in the shocked portfolio
        for (Asset a : shockedAssets) {
            BigDecimal newWeight = a.getCurrentValue().divide(newTotalCapital, 4, RoundingMode.HALF_UP);
            a.setWeight(newWeight);
        }
        shockedPortfolio.setAssets(shockedAssets);

        // 3. Recalculate Risk on shocked portfolio
        RiskEngine.RiskOutput shockedRisk = riskEngine.evaluatePortfolio(shockedPortfolio);
        BigDecimal totalLoss = initialValue.subtract(newTotalCapital).setScale(2, RoundingMode.HALF_UP);

        // 4. Evaluate Breaches against limits
        BreachDetectorService.BreachEvaluation breachEvaluation =
                breachDetectorService.detectBreaches(shockedRisk, riskControlService.getLimits());

        // 5. Generate Alerts if breaches occurred
        if (breachEvaluation.hasBreach()) {
            alertService.generateAlertsFromBreaches(breachEvaluation.breaches());
        }

        // 6. Log Decision (Always recorded for audit trail in Golden Demo)
        ControlAction action = breachEvaluation.primaryAction();
        String reason = breachEvaluation.hasBreach()
                ? "Market shock triggered risk breach beyond configured limit of " + riskControlService.getLimits().getMaxRiskScore()
                : "Market shock simulation executed within risk tolerance.";

        decisionLogService.logDecision(
                "MARKET SHOCK SIMULATION: " + scenario,
                "COMPOSITE_RISK_SCORE",
                BigDecimal.valueOf(initialRisk.riskScore()),
                BigDecimal.valueOf(shockedRisk.riskScore()),
                BigDecimal.valueOf(riskControlService.getLimits().getMaxRiskScore()),
                action != ControlAction.NO_ACTION ? action : ControlAction.EMERGENCY_REBALANCE,
                reason
        );

        String summary = String.format(
                "Scenario %s with shock %s%% resulted in a total capital loss of $%s (from $%s to $%s). Risk Score shifted from %d (%s) to %d (%s). Action: %s.",
                scenario, shock.multiply(BigDecimal.valueOf(100)), totalLoss, initialValue, newTotalCapital,
                initialRisk.riskScore(), initialRisk.riskLevel(),
                shockedRisk.riskScore(), shockedRisk.riskLevel(),
                action
        );

        return StressTestResult.builder()
                .scenario(scenario)
                .shockPercentage(shock)
                .initialPortfolioValue(initialValue)
                .shockedPortfolioValue(newTotalCapital)
                .totalLoss(totalLoss)
                .initialRisk(initialRisk)
                .shockedRisk(shockedRisk)
                .breachStatus(breachEvaluation)
                .recommendedAction(action)
                .summary(summary)
                .build();
    }
}
