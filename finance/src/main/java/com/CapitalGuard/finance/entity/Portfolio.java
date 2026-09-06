package com.CapitalGuard.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class Portfolio {

    private UUID id;
    private String name;
    private BigDecimal totalCapital = BigDecimal.ZERO;
    private List<Asset> assets;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
