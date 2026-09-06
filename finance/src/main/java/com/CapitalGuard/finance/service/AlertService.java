package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.AlertEntity;
import com.CapitalGuard.finance.model.Alert;
import com.CapitalGuard.finance.model.BreachReport;
import com.CapitalGuard.finance.model.ControlAction;
import com.CapitalGuard.finance.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Manages alert generation and alert history with PostgreSQL DB persistence (LLD Section 16).
 */
@Service
public class AlertService {

    private final AtomicInteger alertCounter = new AtomicInteger(100);
    private final List<Alert> inMemoryAlertHistory = Collections.synchronizedList(new ArrayList<>());
    private final AlertRepository alertRepository;

    public AlertService() {
        this(null);
    }

    @Autowired
    public AlertService(@Autowired(required = false) AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<Alert> generateAlertsFromBreaches(List<BreachReport> breaches) {
        List<Alert> newAlerts = new ArrayList<>();

        for (BreachReport breach : breaches) {
            String alertId = "ALT-" + alertCounter.incrementAndGet();
            Alert alert = Alert.builder()
                    .id(alertId)
                    .severity(breach.getSeverity())
                    .type(breach.getType())
                    .title("Risk Limit Breach: " + breach.getMetric())
                    .message(breach.getDetails())
                    .metric(breach.getMetric())
                    .currentValue(breach.getCurrentValue())
                    .threshold(breach.getThreshold())
                    .recommendedAction(breach.getRecommendedAction())
                    .createdAt(LocalDateTime.now())
                    .build();

            newAlerts.add(alert);
            inMemoryAlertHistory.add(alert);

            if (alertRepository != null) {
                try {
                    AlertEntity entity = AlertEntity.builder()
                            .id(alert.getId())
                            .severity(alert.getSeverity())
                            .type(alert.getType())
                            .title(alert.getTitle())
                            .message(alert.getMessage())
                            .metric(alert.getMetric())
                            .currentValue(alert.getCurrentValue())
                            .threshold(alert.getThreshold())
                            .recommendedAction(alert.getRecommendedAction() != null ? alert.getRecommendedAction().name() : "NO_ACTION")
                            .createdAt(alert.getCreatedAt())
                            .build();

                    alertRepository.save(entity);
                } catch (Exception ignored) {
                    // Fallback to in-memory during offline DB testing
                }
            }
        }

        return newAlerts;
    }

    public List<Alert> getAllAlerts() {
        if (alertRepository != null) {
            try {
                List<AlertEntity> entities = alertRepository.findAllByOrderByCreatedAtDesc();
                if (!entities.isEmpty()) {
                    return entities.stream().map(e -> Alert.builder()
                            .id(e.getId())
                            .severity(e.getSeverity())
                            .type(e.getType())
                            .title(e.getTitle())
                            .message(e.getMessage())
                            .metric(e.getMetric())
                            .currentValue(e.getCurrentValue())
                            .threshold(e.getThreshold())
                            .recommendedAction(e.getRecommendedAction() != null ? parseControlAction(e.getRecommendedAction()) : ControlAction.NO_ACTION)
                            .createdAt(e.getCreatedAt())
                            .build()
                    ).toList();
                }
            } catch (Exception ignored) {
            }
        }
        return new ArrayList<>(inMemoryAlertHistory);
    }

    private ControlAction parseControlAction(String actionStr) {
        try {
            return ControlAction.valueOf(actionStr);
        } catch (Exception e) {
            return ControlAction.NO_ACTION;
        }
    }
}
