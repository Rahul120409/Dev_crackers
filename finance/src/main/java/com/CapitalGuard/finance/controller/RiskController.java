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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * REST controller exposing risk and control engine calculations.
 * Matches LLD Section 18 & 20 REST API contract.
 */
@RestController
@RequestMapping("/api")
public class RiskController {

    private final MockPortfolioProvider mockProvider;
    private final RiskEngine riskEngine;
    private final VolatilityService volatilityService;
    private final ConcentrationService concentrationService;
    private final LiquidityService liquidityService;
    private final RiskControlService riskControlService;

    @Autowired
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
     * GET /api/risk - Returns full risk metrics overview (LLD Section 9, 18, 20).
     */
    @GetMapping("/risk")
    public RiskEngine.RiskOutput getRiskMetrics() {
        Portfolio portfolio = mockProvider.getMockPortfolio();
        return riskEngine.evaluatePortfolio(portfolio);
    }

    /**
     * GET /api/risk/breaches - Evaluates limits and returns active breaches & control actions (LLD Section 18, 20).
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
     * GET /api/alerts - Returns active system alerts (LLD Section 18, 20).
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
        Portfolio portfolio = mockProvider.getMockPortfolio();
        BigDecimal vol = volatilityService.calculate(portfolio);
        return Collections.singletonMap("volatility", vol);
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
}
