package com.CapitalGuard.finance.repository;

import com.CapitalGuard.finance.entity.RiskLimitEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskLimitRepository extends JpaRepository<RiskLimitEntity, String> {
}
