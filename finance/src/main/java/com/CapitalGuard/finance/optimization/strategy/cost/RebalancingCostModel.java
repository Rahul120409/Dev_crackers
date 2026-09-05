package com.CapitalGuard.finance.optimization.strategy.cost;

import com.CapitalGuard.finance.optimization.dto.request.RebalancingConstraintDto;

import java.math.BigDecimal;

public interface RebalancingCostModel {

    BigDecimal calculateTransactionCost(double[] currentWeights, double[] targetWeights, BigDecimal totalCapital, RebalancingConstraintDto constraint);
}
