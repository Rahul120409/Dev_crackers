package com.CapitalGuard.finance.portfolio.repository;

import com.CapitalGuard.finance.portfolio.entity.AssetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AssetRepository extends JpaRepository<AssetEntity, UUID> {
    Optional<AssetEntity> findByName(String name);
}

