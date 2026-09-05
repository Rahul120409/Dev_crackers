package com.CapitalGuard.finance.portfolio.entity;

import com.CapitalGuard.finance.optimization.enums.AssetType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "assets")
public class AssetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_type", nullable = false)
    private AssetType assetType;

    @Column(name = "asset_class")
    private String assetClass;

    @Column(name = "expected_return")
    private Double expectedReturn;

    private Double volatility;

    @Column(name = "liquidity_score")
    private Double liquidityScore;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "current_value")
    private java.math.BigDecimal currentValue;

    @Column(name = "current_weight")
    private Double currentWeight;

    @Column(name = "target_weight")
    private Double targetWeight;

    @Column(name = "risk_weight")
    private Double riskWeight;

    @Column(name = "symbol")
    private String symbol;

    @Column(name = "price")
    private Double price;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = java.time.LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = java.time.LocalDateTime.now();
        }
        if (assetClass == null && assetType != null) {
            assetClass = assetType.name();
        }
        if (symbol == null) {
            symbol = name != null ? name : (assetType != null ? assetType.name() : "ASSET");
        }
        if (price == null) {
            price = 1.0;
        }
        if (currentValue == null) {
            currentValue = java.math.BigDecimal.ZERO;
        }
        if (currentWeight == null) {
            currentWeight = 0.0;
        }
        if (weight == null) {
            weight = currentWeight != null ? currentWeight : 0.0;
        }
        if (targetWeight == null) {
            targetWeight = 0.0;
        }
        if (riskWeight == null) {
            riskWeight = 0.0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
        if (assetClass == null && assetType != null) {
            assetClass = assetType.name();
        }
        if (symbol == null) {
            symbol = name != null ? name : (assetType != null ? assetType.name() : "ASSET");
        }
        if (price == null) {
            price = 1.0;
        }
        if (currentValue == null) {
            currentValue = java.math.BigDecimal.ZERO;
        }
        if (weight == null) {
            weight = currentWeight != null ? currentWeight : 0.0;
        }
        if (riskWeight == null) {
            riskWeight = 0.0;
        }
    }
}
