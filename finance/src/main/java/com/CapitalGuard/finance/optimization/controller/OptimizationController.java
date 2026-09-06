package com.CapitalGuard.finance.optimization.controller;

import com.CapitalGuard.finance.optimization.dto.request.AssetInputDto;
import com.CapitalGuard.finance.optimization.dto.request.OptimizationRequestDto;
import com.CapitalGuard.finance.optimization.dto.request.RebalancingConstraintDto;
import com.CapitalGuard.finance.optimization.dto.response.OptimizationResponseDto;
import com.CapitalGuard.finance.optimization.dto.response.RebalancePlanDto;
import com.CapitalGuard.finance.optimization.enums.AssetType;
import com.CapitalGuard.finance.optimization.enums.RiskPreference;
import com.CapitalGuard.finance.optimization.service.OptimizationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST controller providing endpoints for asset allocation optimization & rebalancing calculations.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OptimizationController {

    private final OptimizationService optimizationService;

    public OptimizationController(OptimizationService optimizationService) {
        this.optimizationService = optimizationService;
    }

    @PostMapping("/optimization")
    public ResponseEntity<OptimizationResponseDto> optimizePortfolio(@Valid @RequestBody OptimizationRequestDto request) {
        OptimizationResponseDto response = optimizationService.optimizePortfolio(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/optimization")
    public ResponseEntity<OptimizationResponseDto> optimizePortfolioDefault() {
        OptimizationRequestDto defaultRequest = createDefaultRequest();
        OptimizationResponseDto response = optimizationService.optimizePortfolio(defaultRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/rebalance")
    public ResponseEntity<RebalancePlanDto> rebalancePortfolio(@Valid @RequestBody OptimizationRequestDto request) {
        RebalancePlanDto response = optimizationService.generateRebalancePlan(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rebalance")
    public ResponseEntity<RebalancePlanDto> rebalancePortfolioDefault() {
        OptimizationRequestDto defaultRequest = createDefaultRequest();
        RebalancePlanDto response = optimizationService.generateRebalancePlan(defaultRequest);
        return ResponseEntity.ok(response);
    }

    private OptimizationRequestDto createDefaultRequest() {
        return OptimizationRequestDto.builder()
                .totalCapital(BigDecimal.valueOf(100_000_000))
                .riskPreference(RiskPreference.MODERATE)
                .assets(List.of(
                        AssetInputDto.builder().name("EQUITY").assetType(AssetType.EQUITY).currentWeight(0.30).expectedReturn(0.12).volatility(0.22).liquidityScore(0.80).build(),
                        AssetInputDto.builder().name("GOVERNMENT_BOND").assetType(AssetType.GOVERNMENT_BOND).currentWeight(0.30).expectedReturn(0.05).volatility(0.05).liquidityScore(0.95).build(),
                        AssetInputDto.builder().name("CORPORATE_BOND").assetType(AssetType.CORPORATE_BOND).currentWeight(0.20).expectedReturn(0.08).volatility(0.10).liquidityScore(0.70).build(),
                        AssetInputDto.builder().name("GOLD").assetType(AssetType.GOLD).currentWeight(0.10).expectedReturn(0.07).volatility(0.15).liquidityScore(0.60).build(),
                        AssetInputDto.builder().name("CASH").assetType(AssetType.CASH).currentWeight(0.10).expectedReturn(0.03).volatility(0.01).liquidityScore(1.00).build()
                ))
                .constraint(RebalancingConstraintDto.builder()
                        .maxEquityAllocation(0.35)
                        .minCashAllocation(0.10)
                        .maxGoldAllocation(0.20)
                        .transactionFeePercentage(0.001)
                        .enableRebalancingPenalties(true)
                        .build())
                .build();
    }
}
