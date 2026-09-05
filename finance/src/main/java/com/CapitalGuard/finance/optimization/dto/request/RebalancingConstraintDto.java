package com.CapitalGuard.finance.optimization.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RebalancingConstraintDto {

    private Double maxEquityAllocation;

    private Double minCashAllocation;

    private Double maxGoldAllocation;

    private Double minLiquidity;

    private Double maxRiskScore;

    private Double transactionFeePercentage;

    private Boolean enableRebalancingPenalties;

    private Double minRebalanceThreshold;
}
