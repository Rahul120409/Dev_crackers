package com.CapitalGuard.finance.repository;

import com.CapitalGuard.finance.entity.AlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<AlertEntity, String> {
    List<AlertEntity> findAllByOrderByCreatedAtDesc();
}
