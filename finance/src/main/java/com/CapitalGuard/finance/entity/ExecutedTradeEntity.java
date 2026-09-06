package com.CapitalGuard.finance.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA Entity recording executed rebalancing trades in PostgreSQL.
 */
@Entity
@Table(name = "executed_trades")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutedTradeEntity {

    @Id
    private String id;

    private String portfolioId;
    private String symbol;
    private String assetType;
    private String action; // BUY, SELL, HOLD
    private BigDecimal tradeAmount;
    private long shareQuantity;
    private BigDecimal currentWeight;
    private BigDecimal targetWeight;
    private String status; // EXECUTED, PENDING, CANCELLED
    private LocalDateTime executedAt;
}
