package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Asset;
import com.CapitalGuard.finance.entity.Portfolio;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Calculates Liquidity Risk according to LLD Section 12.8.
 * Computes the total liquid-equivalent capital value and portfolio-weighted liquidity score.
 */
@Service
public class LiquidityService {

    public record LiquidityReport(
            BigDecimal totalLiquidValue,          // sum(asset value * liquidity score)
            BigDecimal weightedLiquidityScore,    // sum(weight * liquidity score) from 0.0 to 1.0
            BigDecimal totalCapital
    ) {}

    /**
     * Calculates portfolio liquidity values.
     */
    public LiquidityReport calculate(Portfolio portfolio) {
        if (portfolio.getAssets() == null || portfolio.getAssets().isEmpty()) {
            return new LiquidityReport(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        BigDecimal totalLiquidValue = BigDecimal.ZERO;
        BigDecimal weightedScore = BigDecimal.ZERO;

        for (Asset asset : portfolio.getAssets()) {
            BigDecimal value = asset.getCurrentValue() != null ? asset.getCurrentValue() : BigDecimal.ZERO;
            BigDecimal weight = asset.getWeight() != null ? asset.getWeight() : BigDecimal.ZERO;
            BigDecimal score = asset.getLiquidityScore() != null ? asset.getLiquidityScore() : BigDecimal.ZERO;

            // liquid value contribution = value * liquidity_score
            totalLiquidValue = totalLiquidValue.add(value.multiply(score));

            // weighted liquidity score = weight * liquidity_score
            weightedScore = weightedScore.add(weight.multiply(score));
        }

        return new LiquidityReport(
                totalLiquidValue.setScale(2, RoundingMode.HALF_UP),
                weightedScore.setScale(4, RoundingMode.HALF_UP),
                portfolio.getTotalCapital() != null ? portfolio.getTotalCapital() : BigDecimal.ZERO
        );
    }
}
