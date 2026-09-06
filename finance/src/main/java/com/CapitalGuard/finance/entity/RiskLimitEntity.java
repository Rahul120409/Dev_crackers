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
 * JPA Entity mapping risk limit parameters to PostgreSQL database.
 */
@Entity
@Table(name = "risk_limits")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskLimitEntity {

    @Id
    private String id;

    private BigDecimal maxEquityAllocation;
    private int maxRiskScore;
    private BigDecimal maxDrawdown;
    private BigDecimal minLiquidity;
    private BigDecimal maxVaR;
    private BigDecimal maxCVaR;
    private LocalDateTime updatedAt;
}
