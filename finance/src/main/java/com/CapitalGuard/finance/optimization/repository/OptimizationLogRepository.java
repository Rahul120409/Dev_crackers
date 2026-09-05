package com.CapitalGuard.finance.optimization.repository;

import com.CapitalGuard.finance.optimization.entity.OptimizationLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptimizationLogRepository extends JpaRepository<OptimizationLogEntity, Long> {
}
