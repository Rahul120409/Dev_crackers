package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.dto.AiAnalysisResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FinanceAiServiceTest {

    private final MockPortfolioProvider mockPortfolioProvider = new MockPortfolioProvider();
    private final VolatilityService volatilityService = new VolatilityService();
    private final ConcentrationService concentrationService = new ConcentrationService();
    private final LiquidityService liquidityService = new LiquidityService();
    private final VaRService vaRService = new VaRService();
    private final RiskScoreService riskScoreService = new RiskScoreService();
    private final RiskEngine riskEngine = new RiskEngine(volatilityService, concentrationService, liquidityService, vaRService, riskScoreService);
    private final BreachDetectorService breachDetectorService = new BreachDetectorService();
    private final AlertService alertService = new AlertService();
    private final RiskControlService riskControlService = new RiskControlService(riskEngine, breachDetectorService, alertService, mockPortfolioProvider);

    private final FinanceAiService financeAiService = new FinanceAiService(
            riskEngine,
            mockPortfolioProvider,
            riskControlService
    );

    @Test
    void testRejectsCricketAndNonFinanceQuestions() {
        AiAnalysisResponse response = financeAiService.answerQuery("Who is the captain of team India cricket team?");

        assertNotNull(response);
        assertFalse(response.isFinanceQuery(), "Should reject non-financial query");
        assertTrue(response.getRawExplanation().contains("Capital Shield AI"), "Should clarify its financial role");
        assertTrue(response.getRawExplanation().contains("cricket"), "Should explain that cricket/sports questions are rejected");
    }

    @Test
    void testAnswersPortfolioRiskQuestionWithRealContext() {
        AiAnalysisResponse response = financeAiService.answerQuery("What is our current portfolio risk score and volatility?");

        assertNotNull(response);
        assertTrue(response.isFinanceQuery(), "Should accept financial query");
        assertEquals("Chief Risk Officer (Capital Shield AI)", response.getRole());
        assertNotNull(response.getExecutiveSummary());
        assertTrue(response.getRootCause().contains("volatility"), "Should include volatility in root cause");
        assertFalse(response.getStrategicRecommendations().isEmpty(), "Should provide actionable recommendations");
    }
}
