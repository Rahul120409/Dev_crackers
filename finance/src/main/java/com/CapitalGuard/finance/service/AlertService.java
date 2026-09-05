package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.model.Alert;
import com.CapitalGuard.finance.model.BreachReport;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Manages alert generation and alert history (LLD Section 16).
 */
@Service
public class AlertService {

    private final AtomicInteger alertCounter = new AtomicInteger(100);
    private final List<Alert> alertHistory = Collections.synchronizedList(new ArrayList<>());

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
            alertHistory.add(alert);
        }

        return newAlerts;
    }

    public List<Alert> getAllAlerts() {
        return new ArrayList<>(alertHistory);
    }
}
