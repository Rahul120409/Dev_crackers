package com.CapitalGuard.finance.optimization.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "optimization_logs")
public class OptimizationLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "portfolio_id")
    private String portfolioId;

    @Column(name = "risk_preference")
    private String riskPreference;

    @Column(name = "expected_return")
    private Double expectedReturn;

    private Double risk;

    @Column(name = "utility_score")
    private Double utilityScore;

    @Column(name = "transaction_cost")
    private BigDecimal transactionCost;

    @Column(name = "rebalance_recommended")
    private Boolean rebalanceRecommended;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
