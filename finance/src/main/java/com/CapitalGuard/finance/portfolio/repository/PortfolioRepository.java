package com.CapitalGuard.finance.portfolio.repository;

import com.CapitalGuard.finance.portfolio.entity.PortfolioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PortfolioRepository extends JpaRepository<PortfolioEntity, UUID> {
}
