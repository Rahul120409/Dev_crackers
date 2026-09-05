package com.CapitalGuard.finance.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Calculates the Composite Risk Score (0-100) and Severity Level
 * according to LLD Section 12.9:
 *
 * Risk Score =
 *    30% * Volatility Score
 *  + 25% * VaR Score
 *  + 20% * Concentration Score
 *  + 15% * Drawdown Score
 *  + 10% * Liquidity Score
 *
 * Classification:
 *   0 - 30   : LOW
 *  31 - 60   : MODERATE
 *  61 - 80   : HIGH
 *  81 - 100  : CRITICAL
 */
@Service
public class RiskScoreService {

    public enum RiskLevel {
        LOW, MODERATE, HIGH, CRITICAL
    }

    public record CompositeRiskAssessment(
            int riskScore,
            RiskLevel riskLevel,
            BigDecimal volatilityScore,
            BigDecimal varScore,
            BigDecimal concentrationScore,
            BigDecimal drawdownScore,
            BigDecimal liquidityScore
    ) {}

    public CompositeRiskAssessment evaluate(
            BigDecimal volatility,
            BigDecimal varPercentage,
            BigDecimal hhiConcentration,
            BigDecimal drawdownPercentage,
            BigDecimal weightedLiquidityScore) {

        // 1. Volatility score (benchmark: 0% to 40% maps to 0-100)
        BigDecimal volRatio = volatility.divide(new BigDecimal("0.40"), 4, RoundingMode.HALF_UP);
        BigDecimal volScore = clamp(volRatio.multiply(new BigDecimal("100")));

        // 2. VaR score (benchmark: 0% to 5% maps to 0-100)
        BigDecimal varRatio = varPercentage.divide(new BigDecimal("0.05"), 4, RoundingMode.HALF_UP);
        BigDecimal varScore = clamp(varRatio.multiply(new BigDecimal("100")));

        // 3. Concentration score (benchmark: HHI 0.0 to 0.50 maps to 0-100)
        BigDecimal concRatio = hhiConcentration.divide(new BigDecimal("0.50"), 4, RoundingMode.HALF_UP);
        BigDecimal concScore = clamp(concRatio.multiply(new BigDecimal("100")));

        // 4. Drawdown score (benchmark: 0% to 20% maps to 0-100)
        BigDecimal ddRatio = drawdownPercentage.divide(new BigDecimal("0.20"), 4, RoundingMode.HALF_UP);
        BigDecimal ddScore = clamp(ddRatio.multiply(new BigDecimal("100")));

        // 5. Liquidity Risk score (inverse: 1.0 liquidity = 0 risk, 0.0 liquidity = 100 risk)
        BigDecimal liqRiskRatio = BigDecimal.ONE.subtract(weightedLiquidityScore);
        BigDecimal liqScore = clamp(liqRiskRatio.multiply(new BigDecimal("100")));

        // Weighted sum: 30% Vol + 25% VaR + 20% Conc + 15% Drawdown + 10% Liquidity
        BigDecimal totalScore = volScore.multiply(new BigDecimal("0.30"))
                .add(varScore.multiply(new BigDecimal("0.25")))
                .add(concScore.multiply(new BigDecimal("0.20")))
                .add(ddScore.multiply(new BigDecimal("0.15")))
                .add(liqScore.multiply(new BigDecimal("0.10")));

        int roundedScore = clamp(totalScore).setScale(0, RoundingMode.HALF_UP).intValue();

        RiskLevel level;
        if (roundedScore <= 30) {
            level = RiskLevel.LOW;
        } else if (roundedScore <= 60) {
            level = RiskLevel.MODERATE;
        } else if (roundedScore <= 80) {
            level = RiskLevel.HIGH;
        } else {
            level = RiskLevel.CRITICAL;
        }

        return new CompositeRiskAssessment(
                roundedScore,
                level,
                volScore.setScale(1, RoundingMode.HALF_UP),
                varScore.setScale(1, RoundingMode.HALF_UP),
                concScore.setScale(1, RoundingMode.HALF_UP),
                ddScore.setScale(1, RoundingMode.HALF_UP),
                liqScore.setScale(1, RoundingMode.HALF_UP)
        );
    }

    private BigDecimal clamp(BigDecimal value) {
        if (value.compareTo(BigDecimal.ZERO) < 0) return BigDecimal.ZERO;
        if (value.compareTo(new BigDecimal("100")) > 0) return new BigDecimal("100");
        return value;
    }
}
