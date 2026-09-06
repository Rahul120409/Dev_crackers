package com.CapitalGuard.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Asset {

    private UUID id;
    private String symbol;
    private String name;
    private String assetClass;
    private BigDecimal currentValue = BigDecimal.ZERO;
    private BigDecimal weight = BigDecimal.ZERO;
    private BigDecimal volatility = BigDecimal.ZERO;
    private BigDecimal liquidityScore = BigDecimal.ZERO;
    private BigDecimal riskWeight = BigDecimal.ONE;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
