package com.CapitalGuard.finance.optimization.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RebalancePlanDto {

    private BigDecimal totalCapital;

    private BigDecimal totalTransactionCost;

    private Boolean rebalanceRecommended;

    private Integer totalTradesCount;

    private List<TradeInstructionDto> tradeInstructions;
}
