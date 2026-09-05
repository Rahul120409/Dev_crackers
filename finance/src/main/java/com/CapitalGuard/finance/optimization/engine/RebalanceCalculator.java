package com.CapitalGuard.finance.optimization.engine;

import com.CapitalGuard.finance.optimization.dto.request.AssetInputDto;
import com.CapitalGuard.finance.optimization.dto.request.RebalancingConstraintDto;
import com.CapitalGuard.finance.optimization.dto.response.TradeInstructionDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * Calculates specific buy/sell trade instructions required to transition
 * from current asset allocation weights to optimized target weights.
 */
@Component
public class RebalanceCalculator {

    public List<TradeInstructionDto> calculateTradeInstructions(
            List<AssetInputDto> assets,
            double[] optimizedWeights,
            BigDecimal totalCapital,
            RebalancingConstraintDto constraint) {

        List<TradeInstructionDto> instructions = new ArrayList<>();
        if (assets == null || optimizedWeights == null || assets.size() != optimizedWeights.length) {
            return instructions;
        }

        BigDecimal capital = (totalCapital != null && totalCapital.compareTo(BigDecimal.ZERO) > 0)
                ? totalCapital
                : BigDecimal.valueOf(100_000_000);

        double feePercentage = (constraint != null && constraint.getTransactionFeePercentage() != null)
                ? constraint.getTransactionFeePercentage()
                : 0.001; // Default 0.1% fee if unspecified

        for (int i = 0; i < assets.size(); i++) {
            AssetInputDto asset = assets.get(i);
            double currentWeight = asset.getCurrentWeight() != null ? asset.getCurrentWeight() : 0.0;
            double targetWeight = Math.round(optimizedWeights[i] * 1000.0) / 1000.0;
            double weightDiff = targetWeight - currentWeight;

            String action;
            if (Math.abs(weightDiff) < 1e-4) {
                action = "HOLD";
            } else if (weightDiff > 0) {
                action = "BUY";
            } else {
                action = "SELL";
            }

            BigDecimal amountChange = capital.multiply(BigDecimal.valueOf(weightDiff))
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal estimatedFee = amountChange.abs()
                    .multiply(BigDecimal.valueOf(feePercentage))
                    .setScale(2, RoundingMode.HALF_UP);

            instructions.add(TradeInstructionDto.builder()
                    .assetName(asset.getName())
                    .action(action)
                    .currentWeight(Math.round(currentWeight * 1000.0) / 1000.0)
                    .targetWeight(targetWeight)
                    .weightChange(Math.round(weightDiff * 1000.0) / 1000.0)
                    .amountChange(amountChange)
                    .estimatedFee(estimatedFee)
                    .build());
        }

        return instructions;
    }
}
