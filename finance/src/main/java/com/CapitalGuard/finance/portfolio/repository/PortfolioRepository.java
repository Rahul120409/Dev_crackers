package com.CapitalGuard.finance.portfolio.repository;

import com.CapitalGuard.finance.portfolio.entity.PortfolioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PortfolioRepository extends JpaRepository<PortfolioEntity, UUID> {
}
