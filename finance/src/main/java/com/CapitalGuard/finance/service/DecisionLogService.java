package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.model.ControlAction;
import com.CapitalGuard.finance.model.DecisionLog;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service managing explainable decision logs (LLD Section 17 & 19.8).
 */
@Service
public class DecisionLogService {

    private final AtomicInteger logCounter = new AtomicInteger(500);
    private final List<DecisionLog> decisionHistory = Collections.synchronizedList(new ArrayList<>());

    public DecisionLog logDecision(
            String event,
            String metric,
            BigDecimal oldValue,
            BigDecimal newValue,
            BigDecimal threshold,
            ControlAction action,
            String reason) {

        String logId = "DEC-" + logCounter.incrementAndGet();

        // Generate explainable decision message
        String aiExplanation = String.format(
                "Event: %s. Metric [%s] shifted from %s to %s against threshold %s. Triggered %s because %s.",
                event, metric, oldValue, newValue, threshold, action, reason
        );

        DecisionLog log = DecisionLog.builder()
                .id(logId)
                .event(event)
                .metric(metric)
                .oldValue(oldValue)
                .newValue(newValue)
                .threshold(threshold)
                .action(action)
                .reason(reason)
                .aiExplanation(aiExplanation)
                .timestamp(LocalDateTime.now())
                .build();

        decisionHistory.add(0, log); // Add newest first
        return log;
    }

    public List<DecisionLog> getAllDecisions() {
        return new ArrayList<>(decisionHistory);
    }
}
