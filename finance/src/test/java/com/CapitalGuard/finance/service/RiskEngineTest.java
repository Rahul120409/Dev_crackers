package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Portfolio;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class RiskEngineTest {

    private final MockPortfolioProvider mockProvider = new MockPortfolioProvider();
    private final VolatilityService volatilityService = new VolatilityService();
    private final ConcentrationService concentrationService = new ConcentrationService();
    private final LiquidityService liquidityService = new LiquidityService();
    private final VaRService vaRService = new VaRService();
    private final RiskScoreService riskScoreService = new RiskScoreService();

    private final RiskEngine riskEngine = new RiskEngine(
            volatilityService,
            concentrationService,
            liquidityService,
            vaRService,
            riskScoreService
    );

    @Test
    void testFullRiskEvaluation() {
        Portfolio portfolio = mockProvider.getMockPortfolio();
        RiskEngine.RiskOutput output = riskEngine.evaluatePortfolio(portfolio);

        assertNotNull(output);
        assertTrue(output.riskScore() >= 0 && output.riskScore() <= 100, "Risk score should be 0-100");
        assertNotNull(output.riskLevel());
        assertEquals(new BigDecimal("0.1250"), output.volatility());
        assertTrue(output.var95().compareTo(BigDecimal.ZERO) > 0, "VaR95 should be positive");
        assertTrue(output.cvar95().compareTo(output.var95()) > 0, "CVaR95 should be greater than VaR95");
        assertEquals(new BigDecimal("961000.00"), output.liquidity());
    }
}
