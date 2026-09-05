package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.model.StressTestRequest;
import com.CapitalGuard.finance.model.StressTestResult;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class StressTestServiceTest {

    private final MockPortfolioProvider mockPortfolioProvider = new MockPortfolioProvider();
    private final VolatilityService volatilityService = new VolatilityService();
    private final ConcentrationService concentrationService = new ConcentrationService();
    private final LiquidityService liquidityService = new LiquidityService();
    private final VaRService vaRService = new VaRService();
    private final RiskScoreService riskScoreService = new RiskScoreService();
    private final RiskEngine riskEngine = new RiskEngine(volatilityService, concentrationService, liquidityService, vaRService, riskScoreService);
    private final BreachDetectorService breachDetectorService = new BreachDetectorService();
    private final AlertService alertService = new AlertService();
    private final DecisionLogService decisionLogService = new DecisionLogService();
    private final RiskControlService riskControlService = new RiskControlService(riskEngine, breachDetectorService, alertService, mockPortfolioProvider);

    private final StressTestService stressTestService = new StressTestService(
            mockPortfolioProvider,
            riskEngine,
            riskControlService,
            breachDetectorService,
            alertService,
            decisionLogService
    );

    @Test
    void testGoldenDemoEquityCrashScenario() {
        StressTestRequest request = StressTestRequest.builder()
                .scenario("EQUITY_CRASH")
                .shock(new BigDecimal("-0.20")) // -20% equity crash
                .build();

        StressTestResult result = stressTestService.executeStressTest(request);

        assertNotNull(result);
        assertEquals(new BigDecimal("1000000"), result.getInitialPortfolioValue());
        // $250k equity drops by 20% = $50k loss -> $950k total
        assertEquals(new BigDecimal("950000.00"), result.getShockedPortfolioValue());
        assertEquals(new BigDecimal("50000.00"), result.getTotalLoss());

        // Verify risk increased after shock
        assertTrue(result.getShockedRisk().riskScore() > result.getInitialRisk().riskScore(),
                "Shocked risk score should be higher than initial risk score");

        // Verify decision history was recorded
        assertFalse(decisionLogService.getAllDecisions().isEmpty(), "Decision log must be generated");
    }
}
