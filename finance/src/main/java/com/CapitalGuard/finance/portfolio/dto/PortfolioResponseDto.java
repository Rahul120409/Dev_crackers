package com.CapitalGuard.finance.portfolio.dto;

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
public class PortfolioResponseDto {

    private String id;

    private String name;

    private BigDecimal totalCapital;

    private List<AllocationDto> assets;
}
