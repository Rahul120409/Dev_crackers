package com.CapitalGuard.finance.repository;

import com.CapitalGuard.finance.entity.ExecutedTradeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeRepository extends JpaRepository<ExecutedTradeEntity, String> {
    List<ExecutedTradeEntity> findByPortfolioIdOrderByExecutedAtDesc(String portfolioId);
    List<ExecutedTradeEntity> findAllByOrderByExecutedAtDesc();
}
