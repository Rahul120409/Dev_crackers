package com.CapitalGuard.finance.optimization.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptimizationResponseDto {

    private Map<String, Double> currentAllocation;

    private Map<String, Double> optimizedAllocation;

    private Double expectedReturn;

    private Double risk;

    private Double utilityScore;

    private BigDecimal transactionCost;

    private Boolean rebalanceRecommended;

    private List<TradeInstructionDto> tradeInstructions;
}
