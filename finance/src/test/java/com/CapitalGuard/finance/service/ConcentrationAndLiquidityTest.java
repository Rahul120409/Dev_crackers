package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Portfolio;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ConcentrationAndLiquidityTest {

    private final MockPortfolioProvider provider = new MockPortfolioProvider();
    private final ConcentrationService concentrationService = new ConcentrationService();
    private final LiquidityService liquidityService = new LiquidityService();

    @Test
    void testConcentrationAnalysis() {
        Portfolio portfolio = provider.getMockPortfolio();
        ConcentrationService.ConcentrationReport report = concentrationService.analyze(portfolio);

        assertNotNull(report);
        // In our mock data: US10Y is 40% (0.4000), which is highest
        assertEquals("US10Y", report.highestConcentratedAsset());
        assertEquals(new BigDecimal("0.4000"), report.highestWeight());

        // HHI = 0.25^2 + 0.40^2 + 0.15^2 + 0.20^2 = 0.0625 + 0.1600 + 0.0225 + 0.0400 = 0.2850
        assertEquals(new BigDecimal("0.2850"), report.hhiIndex());

        // Asset class allocation check
        assertTrue(report.allocationByAssetClass().containsKey("Equity"));
        assertTrue(report.allocationByAssetClass().containsKey("FixedIncome"));
    }

    @Test
    void testLiquidityCalculation() {
        Portfolio portfolio = provider.getMockPortfolio();
        LiquidityService.LiquidityReport report = liquidityService.calculate(portfolio);

        assertNotNull(report);
        assertEquals(new BigDecimal("1000000"), report.totalCapital());

        // liquid value = 250k*0.95 + 400k*0.99 + 150k*0.85 + 200k*1.00
        // = 237500 + 396000 + 127500 + 200000 = 961000.00
        assertEquals(new BigDecimal("961000.00"), report.totalLiquidValue());

        // weighted score = 0.25*0.95 + 0.40*0.99 + 0.15*0.85 + 0.20*1.00
        // = 0.2375 + 0.3960 + 0.1275 + 0.2000 = 0.9610
        assertEquals(new BigDecimal("0.9610"), report.weightedLiquidityScore());
    }
}
