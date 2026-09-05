package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Asset;
import com.CapitalGuard.finance.entity.Portfolio;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Calculates the weighted‑average volatility of a portfolio.
 * The algorithm follows the simple formula used in the LLD:
 *   portfolioVolatility = Σ (asset.weight × asset.volatility)
 */
@Service
public class VolatilityService {

    /**
     * Returns the portfolio volatility as a BigDecimal rounded to 4 decimal places.
     *
     * @param portfolio the portfolio containing a list of assets
     * @return weighted‑average volatility (e.g., 0.1250 for 12.5 %)
     */
    public BigDecimal calculate(Portfolio portfolio) {
        BigDecimal sum = BigDecimal.ZERO;
        for (Asset asset : portfolio.getAssets()) {
            // weight and volatility are stored as BigDecimal with scale 4
            BigDecimal contribution = asset.getWeight().multiply(asset.getVolatility());
            sum = sum.add(contribution);
        }
        return sum.setScale(4, RoundingMode.HALF_UP);
    }
}
