package com.CapitalGuard.finance.optimization.dto.request;

import com.CapitalGuard.finance.optimization.enums.RiskPreference;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
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
public class OptimizationRequestDto {

    private BigDecimal totalCapital;

    private RiskPreference riskPreference;

    @NotEmpty(message = "Assets list must not be empty")
    @Valid
    private List<AssetInputDto> assets;

    private RebalancingConstraintDto constraint;
}
