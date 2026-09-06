package com.CapitalGuard.finance.optimization.repository;

import com.CapitalGuard.finance.optimization.entity.OptimizationLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptimizationLogRepository extends JpaRepository<OptimizationLogEntity, Long> {
}
