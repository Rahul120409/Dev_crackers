package com.CapitalGuard.finance.optimization.strategy;

import com.CapitalGuard.finance.optimization.dto.request.AssetInputDto;
import com.CapitalGuard.finance.optimization.dto.request.RebalancingConstraintDto;
import com.CapitalGuard.finance.optimization.enums.AssetType;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ConstraintValidator {

    public boolean isValidAllocation(double[] weights, List<AssetInputDto> assets, RebalancingConstraintDto constraint) {
        if (weights == null || assets == null || weights.length != assets.size()) {
            return false;
        }

        double totalWeight = 0.0;
        for (double w : weights) {
            if (w < 0.0 || w > 1.0) {
                return false;
            }
            totalWeight += w;
        }
        if (Math.abs(totalWeight - 1.0) > 1e-4) {
            return false;
        }

        if (constraint == null) {
            return true;
        }

        double equityWeight = 0.0;
        double cashWeight = 0.0;
        double goldWeight = 0.0;
        double weightedLiquidity = 0.0;
        double weightedVolatility = 0.0;

        for (int i = 0; i < assets.size(); i++) {
            AssetInputDto asset = assets.get(i);
            double w = weights[i];

            AssetType type = asset.getAssetType();
            if (type == null && asset.getName() != null) {
                try {
                    String formattedName = asset.getName().trim().toUpperCase().replace(" ", "_").replace("-", "_");
                    type = AssetType.valueOf(formattedName);
                } catch (IllegalArgumentException ignored) {}
            }

            if (type != null) {
                switch (type) {
                    case EQUITY -> equityWeight += w;
                    case CASH -> cashWeight += w;
                    case GOLD -> goldWeight += w;
                    default -> {}
                }
            }

            double liquidity = asset.getLiquidityScore() != null ? asset.getLiquidityScore() : 1.0;
            weightedLiquidity += w * liquidity;

            double vol = asset.getVolatility() != null ? asset.getVolatility() : 0.1;
            weightedVolatility += w * vol;
        }

        if (constraint.getMaxEquityAllocation() != null && equityWeight > constraint.getMaxEquityAllocation() + 1e-4) {
            return false;
        }

        if (constraint.getMinCashAllocation() != null && cashWeight < constraint.getMinCashAllocation() - 1e-4) {
            return false;
        }

        if (constraint.getMaxGoldAllocation() != null && goldWeight > constraint.getMaxGoldAllocation() + 1e-4) {
            return false;
        }

        if (constraint.getMinLiquidity() != null && weightedLiquidity < constraint.getMinLiquidity() - 1e-4) {
            return false;
        }

        if (constraint.getMaxRiskScore() != null) {
            double maxRisk = constraint.getMaxRiskScore() > 1.0 ? constraint.getMaxRiskScore() / 100.0 : constraint.getMaxRiskScore();
            if (weightedVolatility > maxRisk + 1e-4) {
                return false;
            }
        }

        return true;
    }
}
