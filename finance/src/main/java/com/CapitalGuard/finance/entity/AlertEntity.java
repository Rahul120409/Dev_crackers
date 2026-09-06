package com.CapitalGuard.finance.entity;

import jakarta.persistence.Column;
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
 * JPA Entity mapping system alerts to the PostgreSQL database.
 */
@Entity
@Table(name = "alerts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertEntity {

    @Id
    private String id;

    private String severity;
    private String type;
    private String title;

    @Column(length = 1000)
    private String message;

    private String metric;
    private BigDecimal currentValue;
    private BigDecimal threshold;
    private String recommendedAction;
    private LocalDateTime createdAt;
}
