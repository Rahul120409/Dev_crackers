package com.CapitalGuard.finance.controller;

import com.CapitalGuard.finance.entity.Portfolio;
import com.CapitalGuard.finance.model.Alert;
import com.CapitalGuard.finance.model.RiskLimit;
import com.CapitalGuard.finance.service.BreachDetectorService;
import com.CapitalGuard.finance.service.ConcentrationService;
import com.CapitalGuard.finance.service.LiquidityService;
import com.CapitalGuard.finance.service.MockPortfolioProvider;
import com.CapitalGuard.finance.service.RiskControlService;
import com.CapitalGuard.finance.service.RiskEngine;
import com.CapitalGuard.finance.service.VolatilityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * REST controller exposing risk and control engine calculations.
 * Equipped with Market Intelligence Failsafe Fallback protection.
 */
@RestController
@RequestMapping("/api")
public class RiskController {

    private static final Logger log = LoggerFactory.getLogger(RiskController.class);

    private final MockPortfolioProvider mockProvider;
    private final RiskEngine riskEngine;
    private final VolatilityService volatilityService;
    private final ConcentrationService concentrationService;
    private final LiquidityService liquidityService;
    private final RiskControlService riskControlService;

    public RiskController(
            MockPortfolioProvider mockProvider,
            RiskEngine riskEngine,
            VolatilityService volatilityService,
            ConcentrationService concentrationService,
            LiquidityService liquidityService,
            RiskControlService riskControlService) {
        this.mockProvider = mockProvider;
        this.riskEngine = riskEngine;
        this.volatilityService = volatilityService;
        this.concentrationService = concentrationService;
        this.liquidityService = liquidityService;
        this.riskControlService = riskControlService;
    }

    /**
     * GET /api/risk - Returns full risk metrics overview.
     * Automatically fails over to Market Intelligence Fallback if primary RiskEngine fails.
     */
    @GetMapping("/risk")
    public RiskEngine.RiskOutput getRiskMetrics() {
        if (riskControlService.isForceFailureSimulation()) {
            log.warn("GET /api/risk: Simulated failure mode active. Using Market Intelligence Fallback.");
            return riskControlService.getFallbackRiskOutput("Simulated Engine Failure");
        }

        try {
            Portfolio portfolio = mockProvider.getMockPortfolio();
            return riskEngine.evaluatePortfolio(portfolio);
        } catch (Exception e) {
            log.error("GET /api/risk failed on primary RiskEngine. Engaging Market Intelligence Fallback.", e);
            return riskControlService.getFallbackRiskOutput(e.getMessage());
        }
    }

    /**
     * GET /api/risk/breaches - Evaluates limits and returns active breaches.
     * Uses Market Intelligence fallback if primary evaluation fails.
     */
    @GetMapping("/risk/breaches")
    public BreachDetectorService.BreachEvaluation getBreaches() {
        return riskControlService.evaluateCurrentPortfolio();
    }

    /**
     * GET /api/risk/limits - Returns current active risk limits.
     */
    @GetMapping("/risk/limits")
    public RiskLimit getLimits() {
        return riskControlService.getLimits();
    }

    /**
     * PUT /api/risk/limits - Dynamically update risk limits.
     */
    @PutMapping("/risk/limits")
    public RiskLimit updateLimits(@RequestBody RiskLimit limits) {
        return riskControlService.updateLimits(limits);
    }

    /**
     * GET /api/alerts - Returns active system alerts.
     */
    @GetMapping("/alerts")
    public List<Alert> getAlerts() {
        return riskControlService.getAlerts();
    }

    /**
     * GET /api/risk/volatility
     */
    @GetMapping("/risk/volatility")
    public Map<String, BigDecimal> getVolatility() {
        try {
            Portfolio portfolio = mockProvider.getMockPortfolio();
            BigDecimal vol = volatilityService.calculate(portfolio);
            return Collections.singletonMap("volatility", vol);
        } catch (Exception e) {
            log.warn("GET /api/risk/volatility failed, returning fallback volatility.");
            return Collections.singletonMap("volatility", BigDecimal.valueOf(0.1850));
        }
    }

    /**
     * GET /api/risk/concentration
     */
    @GetMapping("/risk/concentration")
    public ConcentrationService.ConcentrationReport getConcentration() {
        Portfolio portfolio = mockProvider.getMockPortfolio();
        return concentrationService.analyze(portfolio);
    }

    /**
     * GET /api/risk/liquidity
     */
    @GetMapping("/risk/liquidity")
    public LiquidityService.LiquidityReport getLiquidity() {
        Portfolio portfolio = mockProvider.getMockPortfolio();
        return liquidityService.calculate(portfolio);
    }

    /**
     * Demo API to simulate primary RiskEngine failure and trigger Market Intelligence Fallback
     * POST /api/risk/simulate-engine-failure?fail=true
     */
    @PostMapping("/risk/simulate-engine-failure")
    public Map<String, Object> simulateEngineFailure(@RequestParam(defaultValue = "true") boolean fail) {
        riskControlService.setForceFailureSimulation(fail);
        log.warn("Risk Engine Failure Simulation state set to: {}", fail);
        return Map.of(
                "status", "SUCCESS",
                "failureSimulationActive", fail,
                "activeEngine", fail ? "MARKET_INTELLIGENCE_FALLBACK_SYSTEM" : "PRIMARY_RISK_ENGINE",
                "message", fail ? "🚨 Primary Risk Engine disabled. Market Intelligence Fallback System is now handling risk detection!" : "✅ Primary Risk Engine restored."
        );
    }

    /**
     * GET /api/risk/failsafe-status
     */
    @GetMapping("/risk/failsafe-status")
    public Map<String, Object> getFailsafeStatus() {
        boolean isFailedOver = riskControlService.isForceFailureSimulation();
        return Map.of(
                "primaryRiskEngineOnline", !isFailedOver,
                "marketIntelligenceFallbackActive", true,
                "activeMode", isFailedOver ? "FALLBACK_MARKET_INTELLIGENCE" : "PRIMARY_RISK_ENGINE"
        );
    }
}
