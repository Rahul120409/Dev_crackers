package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Asset;
import com.CapitalGuard.finance.entity.Portfolio;
import com.CapitalGuard.finance.model.ControlAction;
import com.CapitalGuard.finance.model.RiskLimit;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class BreachDetectorTest {

    private final VolatilityService volatilityService = new VolatilityService();
    private final ConcentrationService concentrationService = new ConcentrationService();
    private final LiquidityService liquidityService = new LiquidityService();
    private final VaRService vaRService = new VaRService();
    private final RiskScoreService riskScoreService = new RiskScoreService();
    private final RiskEngine riskEngine = new RiskEngine(volatilityService, concentrationService, liquidityService, vaRService, riskScoreService);
    private final BreachDetectorService breachDetectorService = new BreachDetectorService();

    @Test
    void testSafePortfolioProducesNoBreach() {
        MockPortfolioProvider provider = new MockPortfolioProvider();
        Portfolio safePortfolio = provider.getMockPortfolio();

        RiskEngine.RiskOutput output = riskEngine.evaluatePortfolio(safePortfolio);
        RiskLimit limits = new RiskLimit(); // Default limits: maxRiskScore 70, maxEquity 35%

        BreachDetectorService.BreachEvaluation evaluation = breachDetectorService.detectBreaches(output, limits);

        assertFalse(evaluation.hasBreach());
        assertEquals("SAFE", evaluation.overallStatus());
        assertEquals(ControlAction.NO_ACTION, evaluation.primaryAction());
        assertTrue(evaluation.breaches().isEmpty());
    }

    @Test
    void testEquityConcentrationBreachTriggersReduceRiskyAsset() {
        // Create an over-concentrated portfolio: 45% Equity
        Portfolio portfolio = new Portfolio();
        portfolio.setName("Risky Portfolio");
        portfolio.setTotalCapital(new BigDecimal("1000000"));

        List<Asset> assets = new ArrayList<>();
        Asset techStock = new Asset();
        techStock.setSymbol("TECH");
        techStock.setAssetClass("Equity");
        techStock.setCurrentValue(new BigDecimal("450000"));
        techStock.setWeight(new BigDecimal("0.45")); // 45% > 35% limit
        techStock.setVolatility(new BigDecimal("0.35"));
        techStock.setLiquidityScore(new BigDecimal("0.90"));
        assets.add(techStock);

        Asset cash = new Asset();
        cash.setSymbol("CASH");
        cash.setAssetClass("Cash");
        cash.setCurrentValue(new BigDecimal("550000"));
        cash.setWeight(new BigDecimal("0.55"));
        cash.setVolatility(BigDecimal.ZERO);
        cash.setLiquidityScore(BigDecimal.ONE);
        assets.add(cash);

        portfolio.setAssets(assets);

        RiskEngine.RiskOutput output = riskEngine.evaluatePortfolio(portfolio);
        RiskLimit limits = new RiskLimit();

        BreachDetectorService.BreachEvaluation evaluation = breachDetectorService.detectBreaches(output, limits);

        assertTrue(evaluation.hasBreach());
        assertEquals("BREACH", evaluation.overallStatus());
        assertEquals(ControlAction.REDUCE_RISKY_ASSET, evaluation.primaryAction());
        assertEquals(1, evaluation.breaches().size());
        assertEquals("CONCENTRATION", evaluation.breaches().get(0).getType());
    }
}
