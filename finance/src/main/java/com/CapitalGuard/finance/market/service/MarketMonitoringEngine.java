package com.CapitalGuard.finance.market.service;

import com.CapitalGuard.finance.market.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class MarketMonitoringEngine {

    private static final Logger log = LoggerFactory.getLogger(MarketMonitoringEngine.class);

    private final YahooFinanceService yahooFinanceService;
    private final CrashAndVolatilityDetector detector;

    private final List<MarketData> currentIndices = new CopyOnWriteArrayList<>();
    private final List<MarketData> currentKeyEquities = new CopyOnWriteArrayList<>();
    private final List<MarketEvent> eventBuffer = new CopyOnWriteArrayList<>();

    // Simulation State Override
    private String activeSimulationScenario = "NONE";
    private Double simulationPercentageOverride = null;
    private Double simulationVolMultiplier = 1.0;

    public MarketMonitoringEngine(YahooFinanceService yahooFinanceService, CrashAndVolatilityDetector detector) {
        this.yahooFinanceService = yahooFinanceService;
        this.detector = detector;
        refreshMarketData();
    }

    @Scheduled(fixedRate = 30000) // Runs every 30 seconds
    public void scheduledMonitoringPulse() {
        refreshMarketData();
    }

    public synchronized void refreshMarketData() {
        try {
            List<MarketData> allQuotes = yahooFinanceService.fetchAllTrackedQuotes();

            // Apply active simulation overrides if hackathon demo is active
            if (!"NONE".equalsIgnoreCase(activeSimulationScenario) && simulationPercentageOverride != null) {
                applySimulationOverride(allQuotes);
            }

            List<MarketData> indices = new ArrayList<>();
            List<MarketData> equities = new ArrayList<>();

            for (MarketData data : allQuotes) {
                if (data.getSymbol().startsWith("^")) {
                    indices.add(data);
                } else {
                    equities.add(data);
                }
            }

            currentIndices.clear();
            currentIndices.addAll(indices);

            currentKeyEquities.clear();
            currentKeyEquities.addAll(equities);

            // Run Crash & Volatility Detection
            List<MarketEvent> newEvents = detector.evaluateMarketData(allQuotes, simulationVolMultiplier);
            for (MarketEvent event : newEvents) {
                // Avoid duplicate events in quick succession
                boolean exists = eventBuffer.stream()
                        .anyMatch(e -> e.getMarket().equals(event.getMarket()) && e.getEventType().equals(event.getEventType()));
                if (!exists) {
                    eventBuffer.add(0, event);
                }
            }

            // Keep buffer capped at 30 recent events
            while (eventBuffer.size() > 30) {
                eventBuffer.remove(eventBuffer.size() - 1);
            }

            log.info("Market Monitoring Pulse completed. Indices tracked: {}, Events detected: {}", currentIndices.size(), newEvents.size());
        } catch (Exception e) {
            log.error("Error during Market Monitoring Pulse: {}", e.getMessage(), e);
        }
    }

    private void applySimulationOverride(List<MarketData> quotes) {
        double overridePct = simulationPercentageOverride;
        for (MarketData quote : quotes) {
            double base = quote.getPreviousClose().doubleValue();
            double newPrice = base * (1.0 + (overridePct / 100.0));
            quote.setCurrentPrice(BigDecimal.valueOf(newPrice).setScale(2, RoundingMode.HALF_UP));
            quote.setPercentageChange(BigDecimal.valueOf(overridePct).setScale(2, RoundingMode.HALF_UP));

            if (overridePct <= -8.0) quote.setRiskStatus("CRITICAL");
            else if (overridePct <= -5.0) quote.setRiskStatus("HIGH_RISK");
            else if (overridePct <= -2.0) quote.setRiskStatus("WARNING");
            else quote.setRiskStatus("NORMAL");
        }
    }

    public MarketOverview getMarketOverview() {
        String overallStatus = "STABLE";
        String message = "All key Indian indices and blue-chip equities operating within normal risk parameters.";
        double maxVol = 25.0;

        boolean hasCritical = currentIndices.stream().anyMatch(i -> "CRITICAL".equalsIgnoreCase(i.getRiskStatus())) ||
                currentKeyEquities.stream().anyMatch(e -> "CRITICAL".equalsIgnoreCase(e.getRiskStatus()));
        boolean hasHighRisk = currentIndices.stream().anyMatch(i -> "HIGH_RISK".equalsIgnoreCase(i.getRiskStatus()));
        boolean hasWarning = currentIndices.stream().anyMatch(i -> "WARNING".equalsIgnoreCase(i.getRiskStatus()));

        if (hasCritical || "MARKET_CRASH".equalsIgnoreCase(activeSimulationScenario)) {
            overallStatus = "CRITICAL_EVENT";
            message = "🚨 CRITICAL MARKET CRASH DETECTED! Significant index devaluation triggering risk safeguards.";
            maxVol = 92.5;
        } else if (hasHighRisk || "MAJOR_DROP".equalsIgnoreCase(activeSimulationScenario)) {
            overallStatus = "HIGH_VOLATILITY";
            message = "⚡ HIGH MARKET RISK: Major equity sell-off detected across tracked Indian assets.";
            maxVol = 78.0;
        } else if (hasWarning || "MINOR_DROP".equalsIgnoreCase(activeSimulationScenario)) {
            overallStatus = "WARNING";
            message = "⚠️ MARKET WARNING: Moderate downward pressure observed on benchmark indices.";
            maxVol = 55.0;
        } else if ("VOLATILITY_SPIKE".equalsIgnoreCase(activeSimulationScenario)) {
            overallStatus = "HIGH_VOLATILITY";
            message = "⚡ VOLATILITY SPIKE: Sudden intraday variance spike detected across NIFTY components.";
            maxVol = 88.0;
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        return MarketOverview.builder()
                .overallMarketStatus(overallStatus)
                .statusMessage(message)
                .overallVolatilityScore(maxVol)
                .indices(new ArrayList<>(currentIndices))
                .keyEquities(new ArrayList<>(currentKeyEquities))
                .recentEvents(new ArrayList<>(eventBuffer))
                .lastUpdated(timestamp)
                .isSimulated(!"NONE".equalsIgnoreCase(activeSimulationScenario))
                .build();
    }

    public synchronized void triggerSimulation(SimulationRequest req) {
        String scenario = req.getScenario() != null ? req.getScenario().toUpperCase() : "NONE";
        this.activeSimulationScenario = scenario;

        switch (scenario) {
            case "MINOR_DROP":
                this.simulationPercentageOverride = req.getCustomPercentage() != null ? req.getCustomPercentage() : -2.5;
                this.simulationVolMultiplier = 1.2;
                break;
            case "MAJOR_DROP":
                this.simulationPercentageOverride = req.getCustomPercentage() != null ? req.getCustomPercentage() : -5.5;
                this.simulationVolMultiplier = 1.6;
                break;
            case "MARKET_CRASH":
                this.simulationPercentageOverride = req.getCustomPercentage() != null ? req.getCustomPercentage() : -10.0;
                this.simulationVolMultiplier = 2.5;
                break;
            case "VOLATILITY_SPIKE":
                this.simulationPercentageOverride = -4.2;
                this.simulationVolMultiplier = 2.8;
                break;
            case "RESET":
            default:
                this.activeSimulationScenario = "NONE";
                this.simulationPercentageOverride = null;
                this.simulationVolMultiplier = 1.0;
                break;
        }

        refreshMarketData();
    }

    public List<Map<String, Object>> getChartTrendData(String symbol, String timeframe) {
        List<Map<String, Object>> points = new ArrayList<>();
        double basePrice = 23897.70;

        for (MarketData m : currentIndices) {
            if (m.getSymbol().equalsIgnoreCase(symbol) || m.getName().equalsIgnoreCase(symbol)) {
                basePrice = m.getCurrentPrice().doubleValue();
                break;
            }
        }

        int totalPoints = "1H".equalsIgnoreCase(timeframe) ? 12 : "1D".equalsIgnoreCase(timeframe) ? 24 : "1W".equalsIgnoreCase(timeframe) ? 28 : 30;
        double current = basePrice;
        double dropPct = simulationPercentageOverride != null ? simulationPercentageOverride : 0.2;

        for (int i = totalPoints; i >= 0; i--) {
            double noise = (Math.sin(i * 0.5) * 0.002);
            double trend = (i == 0) ? current : current * (1.0 + (dropPct / 100.0) * ((double) (totalPoints - i) / totalPoints) + noise);

            Map<String, Object> point = new HashMap<>();
            point.put("timestamp", "T-" + i + ("1H".equalsIgnoreCase(timeframe) ? "m" : "h"));
            point.put("price", Math.round(trend * 100.0) / 100.0);
            points.add(point);
        }

        return points;
    }

    public List<MarketEvent> getEventBuffer() {
        return new ArrayList<>(eventBuffer);
    }
}
