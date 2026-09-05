package com.CapitalGuard.finance.portfolio.repository;

import com.CapitalGuard.finance.portfolio.entity.AllocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AllocationRepository extends JpaRepository<AllocationEntity, java.util.UUID> {
}
