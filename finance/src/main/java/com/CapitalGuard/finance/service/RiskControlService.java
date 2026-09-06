package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Portfolio;
import com.CapitalGuard.finance.market.model.MarketEvent;
import com.CapitalGuard.finance.market.model.MarketOverview;
import com.CapitalGuard.finance.market.service.MarketMonitoringEngine;
import com.CapitalGuard.finance.model.Alert;
import com.CapitalGuard.finance.model.BreachReport;
import com.CapitalGuard.finance.model.ControlAction;
import com.CapitalGuard.finance.model.RiskLimit;
import com.CapitalGuard.finance.repository.RiskLimitRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * High-level orchestration for Risk Control with Failsafe Fallback:
 * Evaluates limits, triggers breach detector, and creates alerts.
 * Automatically fails over to Market Intelligence Engine if primary RiskEngine fails.
 */
@Service
public class RiskControlService {

    private static final Logger log = LoggerFactory.getLogger(RiskControlService.class);

    private final RiskEngine riskEngine;
    private final BreachDetectorService breachDetectorService;
    private final AlertService alertService;
    private final MockPortfolioProvider mockPortfolioProvider;
    private final MarketMonitoringEngine marketMonitoringEngine;

    private final RiskLimitRepository riskLimitRepository;

    private RiskLimit currentLimits = new RiskLimit(); // Default limits
    private boolean forceFailureSimulation = false; // Demo toggle for simulating engine failure

    public RiskControlService(
            RiskEngine riskEngine,
            BreachDetectorService breachDetectorService,
            AlertService alertService,
            MockPortfolioProvider mockPortfolioProvider) {
        this(riskEngine, breachDetectorService, alertService, mockPortfolioProvider, null, null);
    }

    @Autowired
    public RiskControlService(
            RiskEngine riskEngine,
            BreachDetectorService breachDetectorService,
            AlertService alertService,
            MockPortfolioProvider mockPortfolioProvider,
            @Autowired(required = false) MarketMonitoringEngine marketMonitoringEngine,
            @Autowired(required = false) RiskLimitRepository riskLimitRepository) {
        this.riskEngine = riskEngine;
        this.breachDetectorService = breachDetectorService;
        this.alertService = alertService;
        this.mockPortfolioProvider = mockPortfolioProvider;
        this.marketMonitoringEngine = marketMonitoringEngine;
        this.riskLimitRepository = riskLimitRepository;
    }

    public BreachDetectorService.BreachEvaluation evaluateCurrentPortfolio() {
        if (forceFailureSimulation) {
            log.warn("SIMULATED RISK ENGINE FAILURE: Force failover engaged!");
            return evaluateWithMarketIntelligenceFallback("Simulated Primary RiskEngine Failure");
        }

        try {
            Portfolio portfolio = mockPortfolioProvider.getMockPortfolio();
            RiskEngine.RiskOutput metrics = riskEngine.evaluatePortfolio(portfolio);
            BreachDetectorService.BreachEvaluation evaluation = breachDetectorService.detectBreaches(metrics, currentLimits);

            if (evaluation.hasBreach()) {
                alertService.generateAlertsFromBreaches(evaluation.breaches());
            }

            return evaluation;
        } catch (Exception e) {
            log.error("Primary RiskEngine failed during evaluation: {}. Engaging Market Intelligence Fallback System!", e.getMessage());
            return evaluateWithMarketIntelligenceFallback(e.getMessage());
        }
    }

    public BreachDetectorService.BreachEvaluation evaluateWithMarketIntelligenceFallback(String failureReason) {
        MarketOverview marketState = marketMonitoringEngine != null ? marketMonitoringEngine.getMarketOverview() : null;
        List<BreachReport> fallbackBreaches = new ArrayList<>();
        ControlAction action = ControlAction.NO_ACTION;

        double volScore = marketState != null ? marketState.getOverallVolatilityScore() : 85.0;
        boolean isMarketCrash = marketState != null ? "CRITICAL_EVENT".equalsIgnoreCase(marketState.getOverallMarketStatus()) : true;
        boolean isHighVol = marketState != null ? "HIGH_VOLATILITY".equalsIgnoreCase(marketState.getOverallMarketStatus()) : true;
        String statusMsg = marketState != null ? marketState.getStatusMessage() : "Real-time Market Intelligence Failsafe Active";

        if (isMarketCrash || isHighVol || volScore >= 75.0) {
            action = isMarketCrash ? ControlAction.EMERGENCY_REBALANCE : ControlAction.REDUCE_RISKY_ASSET;

            fallbackBreaches.add(BreachReport.builder()
                    .breach(true)
                    .type("FAILSAFE_MARKET_EVENT")
                    .severity(isMarketCrash ? "CRITICAL" : "HIGH")
                    .metric("MARKET_INTELLIGENCE_VOLATILITY_SCORE")
                    .currentValue(BigDecimal.valueOf(volScore).setScale(2, RoundingMode.HALF_UP))
                    .threshold(BigDecimal.valueOf(70.00))
                    .recommendedAction(action)
                    .details("Primary Risk Engine failed (" + failureReason + "). Failsafe system engaged live Market Intelligence feed: " + statusMsg)
                    .build());

            alertService.generateAlertsFromBreaches(fallbackBreaches);
        }

        return new BreachDetectorService.BreachEvaluation(
                !fallbackBreaches.isEmpty(),
                fallbackBreaches.isEmpty() ? "SAFE" : "FAILSAFE_BREACH",
                action,
                fallbackBreaches
        );
    }

    public RiskEngine.RiskOutput getFallbackRiskOutput(String reason) {
        MarketOverview marketState = marketMonitoringEngine != null ? marketMonitoringEngine.getMarketOverview() : null;
        int score = marketState != null ? (int) Math.round(marketState.getOverallVolatilityScore()) : 82;
        String level = score >= 80 ? "CRITICAL" : score >= 60 ? "HIGH" : "MODERATE";

        BigDecimal vol = BigDecimal.valueOf(score / 100.0).setScale(4, RoundingMode.HALF_UP);
        BigDecimal var95 = BigDecimal.valueOf(score * 450.0).setScale(2, RoundingMode.HALF_UP);
        BigDecimal cvar95 = BigDecimal.valueOf(score * 600.0).setScale(2, RoundingMode.HALF_UP);
        BigDecimal drawdown = BigDecimal.valueOf(score / 500.0).setScale(4, RoundingMode.HALF_UP);
        BigDecimal liquidity = BigDecimal.valueOf(850000.00);

        Map<String, BigDecimal> classMap = new HashMap<>();
        classMap.put("Equity", BigDecimal.valueOf(0.35));
        classMap.put("FixedIncome", BigDecimal.valueOf(0.40));
        classMap.put("Cash", BigDecimal.valueOf(0.25));

        ConcentrationService.ConcentrationReport concReport = new ConcentrationService.ConcentrationReport(
                "NIFTY 50",
                BigDecimal.valueOf(0.35),
                BigDecimal.valueOf(0.2450),
                classMap
        );

        RiskScoreService.CompositeRiskAssessment breakdown = new RiskScoreService.CompositeRiskAssessment(
                score,
                RiskScoreService.RiskLevel.valueOf(level),
                BigDecimal.valueOf(30.0),
                BigDecimal.valueOf(25.0),
                BigDecimal.valueOf(40.0),
                BigDecimal.valueOf(20.0),
                BigDecimal.valueOf(15.0)
        );

        return new RiskEngine.RiskOutput(
                score,
                level,
                vol,
                var95,
                cvar95,
                drawdown,
                liquidity,
                concReport,
                breakdown
        );
    }

    public RiskLimit getLimits() {
        if (riskLimitRepository != null) {
            try {
                Optional<com.CapitalGuard.finance.entity.RiskLimitEntity> entityOpt = riskLimitRepository.findById("DEFAULT_LIMITS");
                if (entityOpt.isPresent()) {
                    com.CapitalGuard.finance.entity.RiskLimitEntity entity = entityOpt.get();
                    this.currentLimits = RiskLimit.builder()
                            .maxEquityAllocation(entity.getMaxEquityAllocation())
                            .maxRiskScore(entity.getMaxRiskScore())
                            .maxDrawdown(entity.getMaxDrawdown())
                            .minLiquidity(entity.getMinLiquidity())
                            .maxVaR(entity.getMaxVaR())
                            .maxCVaR(entity.getMaxCVaR())
                            .build();
                }
            } catch (Exception ignored) {
            }
        }
        return currentLimits;
    }

    public RiskLimit updateLimits(RiskLimit newLimits) {
        this.currentLimits = newLimits;
        if (riskLimitRepository != null) {
            try {
                com.CapitalGuard.finance.entity.RiskLimitEntity entity = com.CapitalGuard.finance.entity.RiskLimitEntity.builder()
                        .id("DEFAULT_LIMITS")
                        .maxEquityAllocation(newLimits.getMaxEquityAllocation())
                        .maxRiskScore(newLimits.getMaxRiskScore())
                        .maxDrawdown(newLimits.getMaxDrawdown())
                        .minLiquidity(newLimits.getMinLiquidity())
                        .maxVaR(newLimits.getMaxVaR())
                        .maxCVaR(newLimits.getMaxCVaR())
                        .updatedAt(LocalDateTime.now())
                        .build();

                riskLimitRepository.save(entity);
            } catch (Exception ignored) {
            }
        }
        return this.currentLimits;
    }

    public List<Alert> getAlerts() {
        return alertService.getAllAlerts();
    }

    public boolean isForceFailureSimulation() {
        return forceFailureSimulation;
    }

    public void setForceFailureSimulation(boolean forceFailureSimulation) {
        this.forceFailureSimulation = forceFailureSimulation;
    }
}
