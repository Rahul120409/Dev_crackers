package com.CapitalGuard.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assets")
@Data
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false, length = 20)
    private String symbol;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "asset_class", nullable = false, length = 50)
    private String assetClass;

    @Column(name = "current_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentValue = BigDecimal.ZERO;

    @Column(name = "weight", nullable = false, precision = 5, scale = 4)
    private BigDecimal weight = BigDecimal.ZERO;

    @Column(name = "volatility", nullable = false, precision = 5, scale = 4)
    private BigDecimal volatility = BigDecimal.ZERO;

    @Column(name = "liquidity_score", nullable = false, precision = 5, scale = 4)
    private BigDecimal liquidityScore = BigDecimal.ZERO;

    @Column(name = "risk_weight", nullable = false, precision = 5, scale = 4)
    private BigDecimal riskWeight = BigDecimal.ONE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
