package com.CapitalGuard.finance.optimization.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TradeInstructionDto {

    private String assetName;

    private String action; // BUY, SELL, HOLD

    private Double currentWeight;

    private Double targetWeight;

    private Double weightChange;

    private BigDecimal amountChange;

    private BigDecimal estimatedFee;
}
