package com.CapitalGuard.finance.optimization.dto.request;

import com.CapitalGuard.finance.optimization.enums.AssetType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetInputDto {

    @NotNull(message = "Asset name must not be null")
    private String name;

    private AssetType assetType;

    private Double currentWeight;

    private BigDecimal currentValue;

    private Double expectedReturn;

    private Double volatility;

    private Double liquidityScore;

    private String riskLevel;
}
