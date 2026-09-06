package com.CapitalGuard.finance.market.service;

import com.CapitalGuard.finance.market.model.MarketData;
import com.CapitalGuard.finance.market.model.MarketEvent;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CrashAndVolatilityDetector {

    public List<MarketEvent> evaluateMarketData(List<MarketData> quotes, double simulatedVolatilityMultiplier) {
        List<MarketEvent> events = new ArrayList<>();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        for (MarketData quote : quotes) {
            double changePct = quote.getPercentageChange().doubleValue();

            // 1. Crash Detection Logic
            if (changePct <= -8.0) {
                events.add(MarketEvent.builder()
                        .id("EVT-" + UUID.randomUUID().toString().substring(0, 8))
                        .eventType("MARKET_CRASH")
                        .market(quote.getName())
                        .marketChange(BigDecimal.valueOf(changePct).setScale(2, RoundingMode.HALF_UP))
                        .volatilityScore(Math.min(98.5, 85.0 + Math.abs(changePct)))
                        .riskLevel("CRITICAL")
                        .timestamp(timestamp)
                        .details(quote.getName() + " experienced severe market crash of " + String.format("%.2f", changePct) + "%")
                        .build());
            } else if (changePct <= -5.0) {
                events.add(MarketEvent.builder()
                        .id("EVT-" + UUID.randomUUID().toString().substring(0, 8))
                        .eventType("HIGH_RISK_DROP")
                        .market(quote.getName())
                        .marketChange(BigDecimal.valueOf(changePct).setScale(2, RoundingMode.HALF_UP))
                        .volatilityScore(Math.min(85.0, 70.0 + Math.abs(changePct)))
                        .riskLevel("HIGH_RISK")
                        .timestamp(timestamp)
                        .details(quote.getName() + " dropped " + String.format("%.2f", changePct) + "%, crossing High Risk threshold")
                        .build());
            } else if (changePct <= -2.0) {
                events.add(MarketEvent.builder()
                        .id("EVT-" + UUID.randomUUID().toString().substring(0, 8))
                        .eventType("MARKET_WARNING")
                        .market(quote.getName())
                        .marketChange(BigDecimal.valueOf(changePct).setScale(2, RoundingMode.HALF_UP))
                        .volatilityScore(55.0)
                        .riskLevel("WARNING")
                        .timestamp(timestamp)
                        .details(quote.getName() + " experienced minor decline of " + String.format("%.2f", changePct) + "%")
                        .build());
            }

            // 2. Volatility Detection Logic
            double calculatedVolScore = Math.min(100.0, (Math.abs(changePct) * 10.0 + 15.0) * simulatedVolatilityMultiplier);
            if (calculatedVolScore >= 75.0 || simulatedVolatilityMultiplier >= 2.0) {
                String volLevel = calculatedVolScore >= 85.0 ? "EXTREME" : "HIGH";
                events.add(MarketEvent.builder()
                        .id("VOL-" + UUID.randomUUID().toString().substring(0, 8))
                        .eventType("VOLATILITY_SPIKE_DETECTED")
                        .market(quote.getName())
                        .marketChange(BigDecimal.valueOf(changePct).setScale(2, RoundingMode.HALF_UP))
                        .volatilityScore(Math.round(calculatedVolScore * 10.0) / 10.0)
                        .riskLevel(volLevel)
                        .timestamp(timestamp)
                        .details("Abnormal market volatility spike detected on " + quote.getName() + " (Vol Score: " + String.format("%.1f", calculatedVolScore) + ")")
                        .build());
            }
        }

        return events;
    }
}
