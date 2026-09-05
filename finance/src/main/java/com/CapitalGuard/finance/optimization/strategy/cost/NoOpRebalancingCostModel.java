package com.CapitalGuard.finance.optimization.strategy.cost;

import com.CapitalGuard.finance.optimization.dto.request.RebalancingConstraintDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class NoOpRebalancingCostModel implements RebalancingCostModel {

    @Override
    public BigDecimal calculateTransactionCost(double[] currentWeights, double[] targetWeights, BigDecimal totalCapital, RebalancingConstraintDto constraint) {
        if (constraint == null || !Boolean.TRUE.equals(constraint.getEnableRebalancingPenalties())) {
            return BigDecimal.ZERO;
        }

        double feePercentage = constraint.getTransactionFeePercentage() != null ? constraint.getTransactionFeePercentage() : 0.0;
        if (feePercentage <= 0.0 || totalCapital == null || totalCapital.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        double totalTurnoverWeight = 0.0;
        int len = Math.min(currentWeights.length, targetWeights.length);
        for (int i = 0; i < len; i++) {
            totalTurnoverWeight += Math.abs(targetWeights[i] - currentWeights[i]);
        }

        double tradedValueFraction = totalTurnoverWeight / 2.0;
        BigDecimal tradedAmount = totalCapital.multiply(BigDecimal.valueOf(tradedValueFraction));
        return tradedAmount.multiply(BigDecimal.valueOf(feePercentage)).setScale(2, RoundingMode.HALF_UP);
    }
}
