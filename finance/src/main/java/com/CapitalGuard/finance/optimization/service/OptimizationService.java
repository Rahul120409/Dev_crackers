package com.CapitalGuard.finance.optimization.service;

import com.CapitalGuard.finance.optimization.dto.request.AssetInputDto;
import com.CapitalGuard.finance.optimization.dto.request.OptimizationRequestDto;
import com.CapitalGuard.finance.optimization.dto.request.RebalancingConstraintDto;
import com.CapitalGuard.finance.optimization.dto.response.OptimizationResponseDto;
import com.CapitalGuard.finance.optimization.dto.response.RebalancePlanDto;
import com.CapitalGuard.finance.optimization.dto.response.TradeInstructionDto;
import com.CapitalGuard.finance.optimization.entity.OptimizationLogEntity;
import com.CapitalGuard.finance.optimization.enums.RiskPreference;
import com.CapitalGuard.finance.optimization.engine.OptimizationEngine;
import com.CapitalGuard.finance.optimization.engine.RebalanceCalculator;
import com.CapitalGuard.finance.optimization.repository.OptimizationLogRepository;
import com.CapitalGuard.finance.optimization.strategy.cost.RebalancingCostModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service orchestrating optimization execution, cost calculations, and database logging.
 */
@Service
public class OptimizationService {

    private final OptimizationEngine optimizationEngine;
    private final RebalanceCalculator rebalanceCalculator;
    private final RebalancingCostModel costModel;
    private final OptimizationLogRepository logRepository;

    public OptimizationService() {
        this(null, null, null, null);
    }

    public OptimizationService(
            OptimizationEngine optimizationEngine,
            RebalanceCalculator rebalanceCalculator,
            RebalancingCostModel costModel) {
        this(optimizationEngine, rebalanceCalculator, costModel, null);
    }

    @Autowired
    public OptimizationService(
            OptimizationEngine optimizationEngine,
            RebalanceCalculator rebalanceCalculator,
            RebalancingCostModel costModel,
            OptimizationLogRepository logRepository) {
        this.optimizationEngine = optimizationEngine;
        this.rebalanceCalculator = rebalanceCalculator;
        this.costModel = costModel;
        this.logRepository = logRepository;
    }

    public OptimizationResponseDto optimizePortfolio(OptimizationRequestDto request) {
        if (request == null || request.getAssets() == null || request.getAssets().isEmpty()) {
            throw new IllegalArgumentException("Optimization request must contain at least one asset.");
        }

        List<AssetInputDto> assets = request.getAssets();
        BigDecimal totalCapital = request.getTotalCapital() != null ? request.getTotalCapital() : BigDecimal.valueOf(100_000_000);
        RiskPreference riskPref = request.getRiskPreference() != null ? request.getRiskPreference() : RiskPreference.MODERATE;
        RebalancingConstraintDto constraint = request.getConstraint() != null ? request.getConstraint() : new RebalancingConstraintDto();

        double[] targetWeights = optimizationEngine.optimize(assets, riskPref, constraint);

        Map<String, Double> currentAlloc = new HashMap<>();
        Map<String, Double> optimizedAlloc = new HashMap<>();
        double[] currentWeights = new double[assets.size()];

        double optReturn = 0.0;
        double optRisk = 0.0;

        for (int i = 0; i < assets.size(); i++) {
            AssetInputDto asset = assets.get(i);
            double cw = asset.getCurrentWeight() != null ? asset.getCurrentWeight() : (1.0 / assets.size());
            currentWeights[i] = cw;

            double tw = targetWeights[i];
            currentAlloc.put(asset.getName(), Math.round(cw * 1000.0) / 1000.0);
            optimizedAlloc.put(asset.getName(), Math.round(tw * 1000.0) / 1000.0);

            double ret = asset.getExpectedReturn() != null ? asset.getExpectedReturn() : 0.08;
            double vol = asset.getVolatility() != null ? asset.getVolatility() : 0.15;

            optReturn += tw * ret;
            optRisk += tw * vol;
        }

        BigDecimal transactionCost = costModel.calculateTransactionCost(currentWeights, targetWeights, totalCapital, constraint);
        List<TradeInstructionDto> tradeInstructions = rebalanceCalculator.calculateTradeInstructions(assets, targetWeights, totalCapital, constraint);
        boolean rebalanceRecommended = tradeInstructions.stream().anyMatch(t -> !"HOLD".equalsIgnoreCase(t.getAction()));

        double utilityScore = optimizationEngine.computeUtility(targetWeights,
                assets.stream().mapToDouble(a -> a.getExpectedReturn() != null ? a.getExpectedReturn() : 0.08).toArray(),
                assets.stream().mapToDouble(a -> a.getVolatility() != null ? a.getVolatility() : 0.15).toArray(),
                riskPref.getRiskAversionFactor());

        // Save optimization run audit log to PostgreSQL database if logRepository is active
        if (logRepository != null) {
            try {
                OptimizationLogEntity logEntity = OptimizationLogEntity.builder()
                        .portfolioId("PORT-101")
                        .riskPreference(riskPref.name())
                        .expectedReturn(Math.round(optReturn * 1000.0) / 1000.0)
                        .risk(Math.round(optRisk * 1000.0) / 1000.0)
                        .utilityScore(Math.round(utilityScore * 1000.0) / 1000.0)
                        .transactionCost(transactionCost)
                        .rebalanceRecommended(rebalanceRecommended)
                        .build();

                logRepository.save(logEntity);
            } catch (Exception ignored) {
                // Ignore DB log failures during offline unit testing
            }
        }

        return OptimizationResponseDto.builder()
                .currentAllocation(currentAlloc)
                .optimizedAllocation(optimizedAlloc)
                .expectedReturn(Math.round(optReturn * 1000.0) / 1000.0)
                .risk(Math.round(optRisk * 1000.0) / 1000.0)
                .utilityScore(Math.round(utilityScore * 1000.0) / 1000.0)
                .transactionCost(transactionCost)
                .rebalanceRecommended(rebalanceRecommended)
                .tradeInstructions(tradeInstructions)
                .build();
    }

    public RebalancePlanDto generateRebalancePlan(OptimizationRequestDto request) {
        OptimizationResponseDto optResponse = optimizePortfolio(request);

        List<TradeInstructionDto> activeTrades = optResponse.getTradeInstructions().stream()
                .filter(t -> !"HOLD".equalsIgnoreCase(t.getAction()))
                .toList();

        return RebalancePlanDto.builder()
                .totalCapital(request.getTotalCapital() != null ? request.getTotalCapital() : BigDecimal.valueOf(100_000_000))
                .totalTransactionCost(optResponse.getTransactionCost())
                .rebalanceRecommended(optResponse.getRebalanceRecommended())
                .totalTradesCount(activeTrades.size())
                .tradeInstructions(optResponse.getTradeInstructions())
                .build();
    }
}
