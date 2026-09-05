package com.CapitalGuard.finance.portfolio.dto;

import com.CapitalGuard.finance.optimization.enums.AssetType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllocationDto {

    private String name;

    private AssetType assetType;

    private Double weight;

    private BigDecimal value;

    private Double volatility;

    private Double liquidityScore;

    private Double expectedReturn;

    private String riskLevel;
}
