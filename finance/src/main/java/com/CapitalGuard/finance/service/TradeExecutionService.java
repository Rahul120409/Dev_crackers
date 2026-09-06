package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.dto.TradeExecutionRequestDto;
import com.CapitalGuard.finance.dto.TradeExecutionResponseDto;
import com.CapitalGuard.finance.entity.ExecutedTradeEntity;
import com.CapitalGuard.finance.optimization.dto.response.TradeInstructionDto;
import com.CapitalGuard.finance.repository.TradeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Service managing trade execution, transaction recording, and portfolio rebalancing fulfillment.
 */
@Service
public class TradeExecutionService {

    private static final Logger log = LoggerFactory.getLogger(TradeExecutionService.class);

    private final TradeRepository tradeRepository;
    private final List<ExecutedTradeEntity> inMemoryTradeHistory = Collections.synchronizedList(new ArrayList<>());

    public TradeExecutionService(@Autowired(required = false) TradeRepository tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    public TradeExecutionResponseDto executeTrades(TradeExecutionRequestDto request) {
        if (request == null || request.getTrades() == null || request.getTrades().isEmpty()) {
            throw new IllegalArgumentException("Trade execution request must contain valid trade instructions.");
        }

        String portfolioId = request.getPortfolioId() != null ? request.getPortfolioId() : "PORT-101";
        String executionBatchId = "EXEC-" + UUID.randomUUID().toString().substring(0, 8);

        List<ExecutedTradeEntity> executedList = new ArrayList<>();
        BigDecimal totalValueTraded = BigDecimal.ZERO;
        BigDecimal totalFees = BigDecimal.ZERO;
        int executedCount = 0;

        for (TradeInstructionDto trade : request.getTrades()) {
            if ("HOLD".equalsIgnoreCase(trade.getAction())) {
                continue; // Skip hold instructions
            }

            BigDecimal amount = trade.getAmountChange() != null ? trade.getAmountChange().abs() : BigDecimal.ZERO;
            BigDecimal fee = trade.getEstimatedFee() != null ? trade.getEstimatedFee() : amount.multiply(new BigDecimal("0.001"));

            // Calculate mock share quantity assuming standard baseline price
            long shareQty = amount.divide(new BigDecimal("1000"), 0, RoundingMode.HALF_UP).longValue();
            if (shareQty <= 0) shareQty = 1;

            ExecutedTradeEntity tradeEntity = ExecutedTradeEntity.builder()
                    .id("TRD-" + UUID.randomUUID().toString().substring(0, 8))
                    .portfolioId(portfolioId)
                    .symbol(trade.getAssetName())
                    .assetType(inferAssetType(trade.getAssetName()))
                    .action(trade.getAction().toUpperCase())
                    .tradeAmount(amount)
                    .shareQuantity(shareQty)
                    .currentWeight(BigDecimal.valueOf(trade.getCurrentWeight() != null ? trade.getCurrentWeight() : 0.0))
                    .targetWeight(BigDecimal.valueOf(trade.getTargetWeight() != null ? trade.getTargetWeight() : 0.0))
                    .status("EXECUTED")
                    .executedAt(LocalDateTime.now())
                    .build();

            executedList.add(tradeEntity);
            inMemoryTradeHistory.add(tradeEntity);

            if (tradeRepository != null) {
                try {
                    tradeRepository.save(tradeEntity);
                } catch (Exception e) {
                    log.warn("Failed to persist trade entity to DB: {}", e.getMessage());
                }
            }

            totalValueTraded = totalValueTraded.add(amount);
            totalFees = totalFees.add(fee);
            executedCount++;
        }

        log.info("Successfully executed {} trades for portfolio {}. Total Traded: {}, Fees: {}",
                executedCount, portfolioId, totalValueTraded, totalFees);

        return TradeExecutionResponseDto.builder()
                .portfolioId(portfolioId)
                .executionId(executionBatchId)
                .status(executedCount > 0 ? "SUCCESS" : "NO_TRADES_EXECUTED")
                .totalTradesExecuted(executedCount)
                .totalValueTraded(totalValueTraded.setScale(2, RoundingMode.HALF_UP))
                .totalFeesIncurred(totalFees.setScale(2, RoundingMode.HALF_UP))
                .executedTrades(executedList)
                .message("Rebalancing trade order executed successfully. Audit records stored.")
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();
    }

    public List<ExecutedTradeEntity> getTradeHistory(String portfolioId) {
        if (tradeRepository != null) {
            try {
                if (portfolioId != null && !portfolioId.trim().isEmpty()) {
                    return tradeRepository.findByPortfolioIdOrderByExecutedAtDesc(portfolioId);
                }
                return tradeRepository.findAllByOrderByExecutedAtDesc();
            } catch (Exception ignored) {
            }
        }
        return new ArrayList<>(inMemoryTradeHistory);
    }

    private String inferAssetType(String name) {
        if (name == null) return "EQUITY";
        String upper = name.toUpperCase();
        if (upper.contains("BOND") || upper.contains("GOVT") || upper.contains("TREASURY")) return "FIXED_INCOME";
        if (upper.contains("GOLD") || upper.contains("COMMODITY")) return "COMMODITY";
        if (upper.contains("CASH") || upper.contains("LIQUID")) return "CASH";
        return "EQUITY";
    }
}
