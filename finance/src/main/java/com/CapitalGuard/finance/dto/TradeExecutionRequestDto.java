package com.CapitalGuard.finance.dto;

import com.CapitalGuard.finance.optimization.dto.response.TradeInstructionDto;
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
public class TradeExecutionRequestDto {
    private String portfolioId;
    private BigDecimal totalCapital;
    private List<TradeInstructionDto> trades;
}
