package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Asset;
import com.CapitalGuard.finance.entity.Portfolio;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

/**
 * Calculates Concentration Risk according to LLD Section 12.7.
 * Evaluates asset/class weight exposure and Herfindahl-Hirschman Index (HHI).
 */
@Service
public class ConcentrationService {

    public record ConcentrationReport(
            String highestConcentratedAsset,
            BigDecimal highestWeight,
            BigDecimal hhiIndex, // Herfindahl-Hirschman Index: sum(weight^2)
            Map<String, BigDecimal> allocationByAssetClass
    ) {}

    /**
     * Analyzes asset and asset-class concentration in the portfolio.
     */
    public ConcentrationReport analyze(Portfolio portfolio) {
        if (portfolio.getAssets() == null || portfolio.getAssets().isEmpty()) {
            return new ConcentrationReport("NONE", BigDecimal.ZERO, BigDecimal.ZERO, Map.of());
        }

        String maxAsset = "";
        BigDecimal maxWeight = BigDecimal.ZERO;
        BigDecimal hhi = BigDecimal.ZERO;
        Map<String, BigDecimal> classMap = new HashMap<>();

        for (Asset asset : portfolio.getAssets()) {
            BigDecimal weight = asset.getWeight() != null ? asset.getWeight() : BigDecimal.ZERO;

            // Track highest individual asset weight
            if (weight.compareTo(maxWeight) > 0) {
                maxWeight = weight;
                maxAsset = asset.getSymbol() != null ? asset.getSymbol() : asset.getName();
            }

            // HHI calculation: sum(weight^2)
            hhi = hhi.add(weight.multiply(weight));

            // Aggregate weight by asset class (Equity, FixedIncome, etc.)
            String assetClass = asset.getAssetClass() != null ? asset.getAssetClass() : "OTHER";
            BigDecimal currentClassWeight = classMap.getOrDefault(assetClass, BigDecimal.ZERO);
            classMap.put(assetClass, currentClassWeight.add(weight).setScale(4, RoundingMode.HALF_UP));
        }

        return new ConcentrationReport(
                maxAsset,
                maxWeight.setScale(4, RoundingMode.HALF_UP),
                hhi.setScale(4, RoundingMode.HALF_UP),
                classMap
        );
    }
}
