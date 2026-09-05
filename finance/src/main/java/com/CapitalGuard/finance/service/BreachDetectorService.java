package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Portfolio;
import com.CapitalGuard.finance.model.BreachReport;
import com.CapitalGuard.finance.model.ControlAction;
import com.CapitalGuard.finance.model.RiskLimit;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Evaluates RiskOutput against active limits to detect threshold breaches
 * and determine required control actions (LLD Section 13 & 14).
 */
@Service
public class BreachDetectorService {

    public record BreachEvaluation(
            boolean hasBreach,
            String overallStatus, // "SAFE" or "BREACH"
            ControlAction primaryAction,
            List<BreachReport> breaches
    ) {}

    public BreachEvaluation detectBreaches(RiskEngine.RiskOutput metrics, RiskLimit limits) {
        List<BreachReport> breaches = new ArrayList<>();

        // 1. Check Risk Score
        BigDecimal currentRiskScore = BigDecimal.valueOf(metrics.riskScore());
        BigDecimal maxScore = BigDecimal.valueOf(limits.getMaxRiskScore());
        if (currentRiskScore.compareTo(maxScore) > 0) {
            breaches.add(BreachReport.builder()
                    .breach(true)
                    .type("RISK_SCORE")
                    .severity(currentRiskScore.compareTo(BigDecimal.valueOf(80)) >= 0 ? "CRITICAL" : "HIGH")
                    .metric("COMPOSITE_RISK_SCORE")
                    .currentValue(currentRiskScore)
                    .threshold(maxScore)
                    .recommendedAction(ControlAction.EMERGENCY_REBALANCE)
                    .details("Risk score " + metrics.riskScore() + " exceeds maximum threshold of " + limits.getMaxRiskScore())
                    .build());
        }

        // 2. Check Equity Concentration
        Map<String, BigDecimal> classMap = metrics.concentrationDetails().allocationByAssetClass();
        BigDecimal equityWeight = classMap.getOrDefault("Equity", BigDecimal.ZERO);
        if (equityWeight.compareTo(limits.getMaxEquityAllocation()) > 0) {
            breaches.add(BreachReport.builder()
                    .breach(true)
                    .type("CONCENTRATION")
                    .severity("HIGH")
                    .metric("EQUITY_ALLOCATION")
                    .currentValue(equityWeight)
                    .threshold(limits.getMaxEquityAllocation())
                    .recommendedAction(ControlAction.REDUCE_RISKY_ASSET)
                    .details("Equity allocation " + equityWeight.multiply(BigDecimal.valueOf(100)) + "% exceeds limit of " + limits.getMaxEquityAllocation().multiply(BigDecimal.valueOf(100)) + "%")
                    .build());
        }

        // 3. Check Liquidity Limit
        if (metrics.liquidity().compareTo(limits.getMinLiquidity()) < 0) {
            breaches.add(BreachReport.builder()
                    .breach(true)
                    .type("LIQUIDITY")
                    .severity("HIGH")
                    .metric("MIN_LIQUIDITY")
                    .currentValue(metrics.liquidity())
                    .threshold(limits.getMinLiquidity())
                    .recommendedAction(ControlAction.INCREASE_LIQUID_ASSETS)
                    .details("Liquid reserves $" + metrics.liquidity() + " dropped below required minimum $" + limits.getMinLiquidity())
                    .build());
        }

        // 4. Check Drawdown Limit
        if (metrics.drawdown().compareTo(limits.getMaxDrawdown()) > 0) {
            breaches.add(BreachReport.builder()
                    .breach(true)
                    .type("DRAWDOWN")
                    .severity("HIGH")
                    .metric("PORTFOLIO_DRAWDOWN")
                    .currentValue(metrics.drawdown())
                    .threshold(limits.getMaxDrawdown())
                    .recommendedAction(ControlAction.EMERGENCY_REBALANCE)
                    .details("Portfolio drawdown " + metrics.drawdown().multiply(BigDecimal.valueOf(100)) + "% exceeds tolerance of " + limits.getMaxDrawdown().multiply(BigDecimal.valueOf(100)) + "%")
                    .build());
        }

        // 5. Check VaR 95% Limit
        if (metrics.var95().compareTo(limits.getMaxVaR()) > 0) {
            breaches.add(BreachReport.builder()
                    .breach(true)
                    .type("VALUE_AT_RISK")
                    .severity("MEDIUM")
                    .metric("VAR_95")
                    .currentValue(metrics.var95())
                    .threshold(limits.getMaxVaR())
                    .recommendedAction(ControlAction.REDUCE_RISKY_ASSET)
                    .details("1-Day VaR 95% $" + metrics.var95() + " exceeds limit $" + limits.getMaxVaR())
                    .build());
        }

        // Determine Primary Control Action
        boolean hasBreach = !breaches.isEmpty();
        ControlAction primaryAction = ControlAction.NO_ACTION;

        if (hasBreach) {
            // Prioritize EMERGENCY_REBALANCE > REDUCE_RISKY_ASSET > INCREASE_LIQUID_ASSETS
            boolean hasEmergency = breaches.stream().anyMatch(b -> b.getRecommendedAction() == ControlAction.EMERGENCY_REBALANCE);
            boolean hasReduceRisk = breaches.stream().anyMatch(b -> b.getRecommendedAction() == ControlAction.REDUCE_RISKY_ASSET);

            if (hasEmergency) {
                primaryAction = ControlAction.EMERGENCY_REBALANCE;
            } else if (hasReduceRisk) {
                primaryAction = ControlAction.REDUCE_RISKY_ASSET;
            } else {
                primaryAction = ControlAction.INCREASE_LIQUID_ASSETS;
            }
        }

        return new BreachEvaluation(
                hasBreach,
                hasBreach ? "BREACH" : "SAFE",
                primaryAction,
                breaches
        );
    }
}
