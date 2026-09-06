package com.CapitalGuard.finance.dto;

import com.CapitalGuard.finance.entity.ExecutedTradeEntity;
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
public class TradeExecutionResponseDto {
    private String portfolioId;
    private String executionId;
    private String status; // SUCCESS, PARTIAL_SUCCESS, FAILED
    private int totalTradesExecuted;
    private BigDecimal totalValueTraded;
    private BigDecimal totalFeesIncurred;
    private List<ExecutedTradeEntity> executedTrades;
    private String message;
    private String timestamp;
}
