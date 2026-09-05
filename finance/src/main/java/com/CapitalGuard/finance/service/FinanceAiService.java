package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.dto.AiAnalysisResponse;
import com.CapitalGuard.finance.entity.Portfolio;
import com.CapitalGuard.finance.model.ControlAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Pattern;

/**
 * Specialized Financial Risk & Capital Optimization AI Service.
 * Implements strict domain guardrails, context injection from live portfolio metrics,
 * and integration with Gemini / LLM APIs.
 */
@Service
public class FinanceAiService {

    private final RiskEngine riskEngine;
    private final MockPortfolioProvider mockPortfolioProvider;
    private final RiskControlService riskControlService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    // Pattern to catch clearly non-financial queries (e.g., sports, cricket, movies)
    private static final Pattern NON_FINANCE_TOPICS = Pattern.compile(
            "\\b(cricket|football|soccer|captain|actor|movie|film|weather|song|president|prime minister|celebrity|joke|game)\\b",
            Pattern.CASE_INSENSITIVE
    );

    @Autowired
    public FinanceAiService(
            RiskEngine riskEngine,
            MockPortfolioProvider mockPortfolioProvider,
            RiskControlService riskControlService) {
        this.riskEngine = riskEngine;
        this.mockPortfolioProvider = mockPortfolioProvider;
        this.riskControlService = riskControlService;
    }

    /**
     * Answers interactive queries strictly within the financial risk domain.
     */
    public AiAnalysisResponse answerQuery(String userQuery) {
        if (userQuery == null || userQuery.isBlank()) {
            userQuery = "Explain the current portfolio risk profile.";
        }

        // 1. Guardrail Check: Reject non-financial questions immediately
        if (NON_FINANCE_TOPICS.matcher(userQuery).find()) {
            return AiAnalysisResponse.builder()
                    .isFinanceQuery(false)
                    .role("Chief Risk Officer (Capital Shield AI)")
                    .executiveSummary("Out of Domain Query Rejected.")
                    .rootCause("Topic is unrelated to FinTech, asset optimization, or capital risk.")
                    .strategicRecommendations(List.of(
                            "Please ask questions related to portfolio allocation, risk scores, or stress testing.",
                            "Examples: 'Why is volatility at 12.5%?', 'Explain the impact of a -20% equity crash', 'What triggers an emergency rebalance?'"
                    ))
                    .rawExplanation("I am Capital Shield AI, dedicated exclusively to capital optimization, asset allocation, and financial risk controls. I do not answer general knowledge, sports (such as cricket), or entertainment questions.")
                    .build();
        }

        // 2. Extract active portfolio context for grounding
        Portfolio portfolio = mockPortfolioProvider.getMockPortfolio();
        RiskEngine.RiskOutput metrics = riskEngine.evaluatePortfolio(portfolio);
        BreachDetectorService.BreachEvaluation breachEval = riskControlService.evaluateCurrentPortfolio();

        // 3. If Gemini API key is configured, call Gemini with grounded context
        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                return callGeminiApi(userQuery, metrics, breachEval);
            } catch (Exception e) {
                // Fallback to built-in CRO analysis if API call fails
            }
        }

        // 4. Built-in Deterministic CRO Financial Intelligence
        return generateCroAnalysis(userQuery, metrics, breachEval);
    }

    /**
     * Generates deep financial explainability for a market crash or breach event.
     */
    public AiAnalysisResponse explainMarketShock(String scenario, BigDecimal shockPercent, RiskEngine.RiskOutput beforeRisk, RiskEngine.RiskOutput afterRisk, ControlAction action) {
        String summary = String.format(
                "Market shock [%s] with a %s%% shift forced portfolio value from $%s to a shocked state. Volatility surged, driving composite risk score from %d (%s) up to %d (%s).",
                scenario, shockPercent.multiply(BigDecimal.valueOf(100)), "$1,000,000",
                beforeRisk.riskScore(), beforeRisk.riskLevel(),
                afterRisk.riskScore(), afterRisk.riskLevel()
        );

        String cause = String.format(
                "Extreme price devaluation in high-beta equity assets disproportionately expanded daily 1-day Value-at-Risk (VaR 95%%: $%s) and Conditional VaR (CVaR: $%s). Concentration threshold breached.",
                afterRisk.var95(), afterRisk.cvar95()
        );

        List<String> recommendations = List.of(
                "Immediate execution of: " + action,
                "De-risk portfolio by liquidating 10-15% of equity exposure.",
                "Rotate liquidity into high-grade Government Bonds (US10Y) and risk-free Cash reserves.",
                "Maintain minimum liquidity threshold of $" + riskControlService.getLimits().getMinLiquidity()
        );

        return AiAnalysisResponse.builder()
                .isFinanceQuery(true)
                .role("Chief Risk Officer (Capital Shield AI)")
                .executiveSummary(summary)
                .rootCause(cause)
                .strategicRecommendations(recommendations)
                .rawExplanation(summary + " " + cause)
                .build();
    }

    private AiAnalysisResponse generateCroAnalysis(String query, RiskEngine.RiskOutput metrics, BreachDetectorService.BreachEvaluation breachEval) {
        String summary = String.format(
                "Capital Shield Portfolio Assessment: Total Capital is currently stabilized with Composite Risk Score of %d/100 (Classification: %s). Overall portfolio posture is %s.",
                metrics.riskScore(), metrics.riskLevel(), breachEval.overallStatus()
        );

        String cause = String.format(
                "Current portfolio volatility stands at %s%% with 95%% statistical 1-Day VaR capped at $%s. Asset class concentration is led by %s at %s%% weight (HHI index: %s).",
                metrics.volatility().multiply(BigDecimal.valueOf(100)),
                metrics.var95(),
                metrics.concentrationDetails().highestConcentratedAsset(),
                metrics.concentrationDetails().highestWeight().multiply(BigDecimal.valueOf(100)),
                metrics.concentrationDetails().hhiIndex()
        );

        List<String> recs = new ArrayList<>();
        if (breachEval.hasBreach()) {
            recs.add("Active safeguard required: " + breachEval.primaryAction());
            recs.add("Rebalance assets back inside configured risk bounds (Max Risk Score: " + riskControlService.getLimits().getMaxRiskScore() + ").");
        } else {
            recs.add("Maintain current optimal allocation across Equities, Fixed Income, Gold, and Cash.");
            recs.add("No safeguard breach detected. Portfolio operates within risk budget.");
        }

        return AiAnalysisResponse.builder()
                .isFinanceQuery(true)
                .role("Chief Risk Officer (Capital Shield AI)")
                .executiveSummary(summary)
                .rootCause(cause)
                .strategicRecommendations(recs)
                .rawExplanation(summary + " " + cause + " Recommended Action: " + breachEval.primaryAction())
                .build();
    }

    @SuppressWarnings("unchecked")
    private AiAnalysisResponse callGeminiApi(String userQuery, RiskEngine.RiskOutput metrics, BreachDetectorService.BreachEvaluation breachEval) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        String systemPrompt = "You are 'Capital Shield AI', an elite Chief Risk Officer and Financial Quantitative Analyst. " +
                "You only answer questions on capital allocation, portfolio risk, volatility, VaR, stress testing, and safeguard controls. " +
                "If the question is unrelated to finance (like sports, cricket, trivia), strictly refuse. " +
                "Ground your answer in these live metrics: RiskScore=" + metrics.riskScore() + " (" + metrics.riskLevel() + "), " +
                "Volatility=" + metrics.volatility() + ", 1-Day VaR95=$" + metrics.var95() + ", Status=" + breachEval.overallStatus() + ".";

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", systemPrompt + "\nUser Question: " + userQuery)))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        Map responseBody = response.getBody();

        if (responseBody != null && responseBody.containsKey("candidates")) {
            List candidates = (List) responseBody.get("candidates");
            if (!candidates.isEmpty()) {
                Map candidate = (Map) candidates.get(0);
                Map content = (Map) candidate.get("content");
                List parts = (List) content.get("parts");
                Map firstPart = (Map) parts.get(0);
                String text = (String) firstPart.get("text");

                return AiAnalysisResponse.builder()
                        .isFinanceQuery(true)
                        .role("Chief Risk Officer (Capital Shield AI)")
                        .executiveSummary("AI Analysis based on real-time portfolio metrics")
                        .rootCause("Derived from live quantitative risk signals")
                        .strategicRecommendations(List.of("Review proposed AI risk actions"))
                        .rawExplanation(text)
                        .build();
            }
        }

        return generateCroAnalysis(userQuery, metrics, breachEval);
    }
}
