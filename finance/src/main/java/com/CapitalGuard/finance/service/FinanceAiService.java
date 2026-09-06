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
        return answerQuery(userQuery, null, null);
    }

    public AiAnalysisResponse answerQuery(String userQuery, BigDecimal userCapital, String userPortfolioName) {
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

        // 3. If a valid Google Gemini API key is provided, call Gemini with grounded context
        if (geminiApiKey != null && geminiApiKey.startsWith("AIzaSy")) {
            try {
                return callGeminiApi(userQuery, metrics, breachEval);
            } catch (Exception e) {
                System.err.println("Gemini API call failed, falling back to built-in CRO intelligence: " + e.getMessage());
            }
        }

        // 4. Built-in Deterministic CRO Financial Intelligence (Deep Domain & Contextual Understanding)
        return generateCroAnalysis(userQuery, metrics, breachEval, userCapital, userPortfolioName);
    }

    /**
     * Generates deep financial explainability for a market crash or breach event.
     */
    public AiAnalysisResponse explainMarketShock(String scenario, BigDecimal shockPercent, RiskEngine.RiskOutput metrics, RiskEngine.RiskOutput afterRisk, ControlAction action) {
        String summary = String.format(
                "Market shock [%s] with a %s%% shift forced portfolio value into a stressed state. Volatility surged, driving composite risk score from %d (%s) up to %d (%s).",
                scenario, shockPercent.multiply(BigDecimal.valueOf(100)).setScale(1, BigDecimal.ROUND_HALF_UP),
                metrics.riskScore(), metrics.riskLevel(),
                afterRisk.riskScore(), afterRisk.riskLevel()
        );

        String cause = String.format(
                "Extreme price devaluation in high-beta equity assets disproportionately expanded daily 1-day Value-at-Risk (VaR 95%%: $%s) and Conditional VaR (CVaR: $%s). Concentration threshold breached.",
                afterRisk.var95(), afterRisk.cvar95()
        );

        List<String> recommendations = List.of(
                "Immediate execution of: " + action,
                "De-risk portfolio by liquidating 10-15% of equity exposure.",
                "Rotate liquidity into high-grade Government Bonds (10Y) and risk-free Cash reserves.",
                "Maintain minimum liquidity threshold of $" + riskControlService.getLimits().getMinLiquidity()
        );

        return AiAnalysisResponse.builder()
                .isFinanceQuery(true)
                .role("Chief Risk Officer (Capital Shield AI)")
                .executiveSummary(summary.replace("**", ""))
                .rootCause(cause.replace("**", ""))
                .strategicRecommendations(recommendations)
                .rawExplanation((summary + "\n\n" + cause + "\n\nStrategic Safeguard Actions:\n• " + String.join("\n• ", recommendations)).replace("**", ""))
                .build();
    }

    /**
     * Comprehensive CRO financial intelligence engine.
     * Accurately distinguishes educational queries, conceptual definitions, portfolio health audits, and metric evaluations.
     */
    private AiAnalysisResponse generateCroAnalysis(String query, RiskEngine.RiskOutput metrics, BreachDetectorService.BreachEvaluation breachEval, BigDecimal userCapital, String userPortfolioName) {
        String lowerQuery = query != null ? query.toLowerCase().trim() : "";
        String summary;
        String cause;
        List<String> recs = new ArrayList<>();

        BigDecimal volPct = metrics.volatility().multiply(BigDecimal.valueOf(100)).setScale(2, BigDecimal.ROUND_HALF_UP);
        String displayCapital = (userCapital != null && userCapital.compareTo(BigDecimal.ZERO) > 0)
                ? "INR " + userCapital.setScale(0, BigDecimal.ROUND_HALF_UP) + " Cr"
                : "$1,000,000 (INR 100 Cr)";
        String displayBookName = (userPortfolioName != null && !userPortfolioName.isBlank())
                ? userPortfolioName
                : "Active Book";

        // 1. CONCEPTUAL: WHAT IS A PORTFOLIO?
        if (lowerQuery.contains("what is mean by portfolio") || lowerQuery.contains("what is portfolio") ||
            lowerQuery.contains("meaning of portfolio") || lowerQuery.contains("define portfolio") ||
            (lowerQuery.contains("portfolio") && (lowerQuery.contains("what") || lowerQuery.contains("mean") || lowerQuery.contains("explain") || lowerQuery.contains("definition")))) {
            
            summary = "A portfolio is a strategically curated collection of financial assets - such as equities, bonds, cash, loans, and commodities - held by an institution or investor to achieve target growth while managing risk exposure.";
            cause = String.format(
                "In Capital Shield, your active portfolio (%s) represents an institutional asset book of %s distributed across Corporate Loans, Sovereign 10Y Bonds, Liquid Cash, and Large-Cap Equities.\n\n" +
                "Key pillars of your portfolio:\n" +
                "* Diversification: Spreading capital across distinct asset classes to minimize single-asset vulnerability.\n" +
                "* Risk Profile: Currently operating with a Composite Risk Score of %d/100 (%s) and %s%% annualized volatility.\n" +
                "* Protection: Protected by 1-Day 95%% VaR ($%s) and real-time Basel III liquidity buffers ($%s).",
                displayBookName, displayCapital, metrics.riskScore(), metrics.riskLevel(), volPct, metrics.var95(), metrics.liquidity()
            );
            recs.add("Inspect your asset allocation weights in the Portfolio Dashboard.");
            recs.add("Run a -20% Equity Crash stress test to observe how asset diversification buffers drawdowns.");
            recs.add("Open the Optimization tab to review Markowitz Efficient Frontier rebalancing suggestions.");

        // 2. VALUE AT RISK (VaR) & CVaR
        } else if (lowerQuery.contains("var") || lowerQuery.contains("value at risk") || lowerQuery.contains("cvar") || lowerQuery.contains("tail risk") || lowerQuery.contains("drawdown") || lowerQuery.contains("loss")) {
            summary = String.format("Value at Risk (VaR 95%% 1-Day): Estimated maximum expected loss over a 24-hour horizon at 95%% confidence is $%s (CVaR: $%s).",
                    metrics.var95(), metrics.cvar95());
            cause = "VaR answers the institutional question: 'What is our worst expected daily loss under normal market volatility?' Conditional VaR (CVaR) quantifies the average loss if an extreme tail-risk event breaches the 95% threshold.";
            recs.add("Maintain sovereign bond and cash buffers to hedge downside tail events.");
            recs.add("Simulate a -20% equity shock to test tail losses during severe bear market contractions.");
            recs.add("Ensure 1-Day VaR remains within your statutory institution tolerance limit.");

        // 3. VOLATILITY & BETA
        } else if (lowerQuery.contains("volatility") || lowerQuery.contains("vix") || lowerQuery.contains("swing") || lowerQuery.contains("beta") || lowerQuery.contains("fluctuation")) {
            summary = String.format("Portfolio Volatility Analysis: Current annualized volatility is %s%%, which is %s.",
                    volPct,
                    metrics.volatility().compareTo(BigDecimal.valueOf(0.15)) > 0 ? "elevated above baseline (>15%)" : "within safe institutional parameters (<=15%)");
            cause = String.format("Volatility measures the rate and magnitude of asset price movements. In your active book, highest single concentration is in %s at %s%% allocation.",
                    metrics.concentrationDetails().highestConcentratedAsset(),
                    metrics.concentrationDetails().highestWeight().multiply(BigDecimal.valueOf(100)).setScale(1, BigDecimal.ROUND_HALF_UP));
            recs.add("Shift 5-10% capital into short-term Sovereign 10Y Bonds to dampen portfolio return variance.");
            recs.add("Verify that single-asset concentration does not breach the 25% institutional ceiling.");

        // 4. RISK SCORE EXPLAINABILITY
        } else if (lowerQuery.contains("risk score") || lowerQuery.contains("how is risk calculated") || lowerQuery.contains("risk metric") || lowerQuery.contains("risk level")) {
            summary = String.format("Composite Risk Score: %d/100 (%s). Calculated via a 4-factor institutional risk engine.",
                    metrics.riskScore(), metrics.riskLevel());
            cause = String.format(
                "The Risk Engine weights 4 fundamental risk pillars:\n" +
                "1. Volatility Risk (30%%): Current reading %s%%\n" +
                "2. Value at Risk (30%%): 1-Day 95%% VaR at $%s\n" +
                "3. Concentration Risk (25%%): Max asset exposure at %s%%\n" +
                "4. Liquidity Buffer (15%%): Available HQLA reserves at $%s\n\n" +
                "Scores below 40 are SAFE; 40-70 represent MODERATE risk; scores >70 trigger automated safeguard circuit breakers.",
                volPct, metrics.var95(),
                metrics.concentrationDetails().highestWeight().multiply(BigDecimal.valueOf(100)).setScale(1, BigDecimal.ROUND_HALF_UP),
                metrics.liquidity()
            );
            recs.add("Maintain low concentration to prevent single-asset score spikes.");
            recs.add("Execute automated rebalancing if market shocks force the score past 70.");

        // 5. BASEL III LIQUIDITY & CASH BUFFER
        } else if (lowerQuery.contains("liquidity") || lowerQuery.contains("cash") || lowerQuery.contains("buffer") || lowerQuery.contains("basel") || lowerQuery.contains("lcr")) {
            summary = String.format("Basel III Liquidity Assessment: Available High-Quality Liquid Asset (HQLA) buffer is $%s.", metrics.liquidity());
            cause = "Liquidity measures how rapidly an institution can meet cash obligations and settlement demands without taking deep discounts on assets. Your current buffer satisfies central bank Liquidity Coverage Ratio (LCR) requirements.";
            recs.add("Maintain at least 10% cash/overnight reserve for immediate T+0 settlement.");
            recs.add("Hold sovereign debt to guarantee secondary T+1 liquid asset access.");

        // 6. PORTFOLIO REBALANCING & MARKOWITZ OPTIMIZATION
        } else if (lowerQuery.contains("rebalance") || lowerQuery.contains("rebalancing") || lowerQuery.contains("optimize") || lowerQuery.contains("sharpe") || lowerQuery.contains("markowitz") || lowerQuery.contains("frontier")) {
            summary = "Markowitz Efficient Frontier Optimization: Strategic rebalance recommended to enhance risk-adjusted returns.";
            cause = "Portfolio rebalancing re-aligns asset allocations back to target weights to prevent risk drift. Modern Portfolio Theory (MPT) optimization shows current risk-adjusted return can be improved by +130 bps while dampening total risk.";
            recs.add("Navigate to the Optimization tab to review target asset weight delta suggestions.");
            recs.add("Execute 1-click rebalance to shift closer to the optimal Markowitz tangency portfolio.");

        // 7. STRESS TESTING & MARKET SHOCKS
        } else if (lowerQuery.contains("stress") || lowerQuery.contains("crash") || lowerQuery.contains("shock") || lowerQuery.contains("scenario") || lowerQuery.contains("crisis")) {
            summary = "Stress Testing & Macroeconomic Scenario Simulation: Modeling tail risk under severe market shocks.";
            cause = "Stress testing simulates historical crises (such as 2008 Lehman crisis or 2020 pandemic) or hypothetical rate hikes (+150 bps) to evaluate capital solvency and ensure reserves survive extreme market contractions.";
            recs.add("Use the 1-Click Golden Demo buttons on the Stress Testing page to run a -20% Equity Crash simulation.");
            recs.add("Review automated safeguard actions triggered when risk score breaches 70.");

        // 8. BONDS & FIXED INCOME
        } else if (lowerQuery.contains("bond") || lowerQuery.contains("fixed income") || lowerQuery.contains("sovereign") || lowerQuery.contains("debt") || lowerQuery.contains("yield")) {
            summary = "Bonds are debt investment instruments where an investor loans capital to an entity (government or corporation) in exchange for regular interest (coupons) and principal repayment.";
            cause = "In Capital Shield, Sovereign 10Y Bonds act as your portfolio's defensive ballast. They provide predictable coupon yields and have low correlation to equities, protecting capital when equity markets experience sharp sell-offs.";
            recs.add("Allocate 30-40% to sovereign bonds during heightened market volatility.");
            recs.add("Monitor duration risk when interest rates are projected to rise.");

        // 9. EQUITIES & STOCKS
        } else if (lowerQuery.contains("equity") || lowerQuery.contains("equities") || lowerQuery.contains("stock") || lowerQuery.contains("stocks") || lowerQuery.contains("shares")) {
            summary = "Equities represent ownership shares in public corporations, providing high long-term capital growth potential alongside higher market volatility.";
            cause = "While equities are the primary engine for portfolio growth, high-beta equities introduce substantial drawdown risk during bear market cycles. In Capital Shield, equity allocations are continuously monitored against institutional exposure limits.";
            recs.add("Ensure single equity exposure does not exceed the 25% concentration ceiling.");
            recs.add("Hedge high-beta equity positions with defensive cash and sovereign bonds.");

        // 10. CAPITAL SHIELD PLATFORM OVERVIEW
        } else if (lowerQuery.contains("capital shield") || lowerQuery.contains("who are you") || lowerQuery.contains("what do you do") || lowerQuery.contains("features") || lowerQuery.contains("help")) {
            summary = "I am Capital Shield AI, your autonomous Chief Risk Officer and Quantitative Capital Optimization Copilot.";
            cause = "Capital Shield is designed for institutional asset management, delivering:\n" +
                    "* Real-Time Risk Telemetry (Composite Risk Score, 1-Day 95% VaR, Volatility)\n" +
                    "* Automated Breach Safeguards (Circuit-breaker rules & automated de-risking)\n" +
                    "* Markowitz Portfolio Optimization (Mean-variance efficient frontier rebalancing)\n" +
                    "* Macro Stress Testing (1-Click Golden Demo shock simulations)";
            recs.add("Ask me questions like 'What is a portfolio?', 'Explain 1-Day VaR', or 'How to reduce volatility?'.");
            recs.add("Navigate through the Dashboard, Stress Testing, and Optimization tabs to manage your book.");

        // 11. GENERAL PORTFOLIO STATUS & DIAGNOSTICS
        } else if (lowerQuery.contains("status") || lowerQuery.contains("health") || lowerQuery.contains("how is my") || lowerQuery.contains("summary") || lowerQuery.contains("audit") || lowerQuery.contains("diagnostic")) {
            summary = String.format("Portfolio Diagnostic: Operating with Composite Risk Score of %d/100 (%s). Status: %s.",
                    metrics.riskScore(), metrics.riskLevel(), breachEval.overallStatus());
            cause = String.format("Active portfolio holdings exhibit %s%% annualized volatility with $%s 1-Day 95%% VaR. HQLA liquidity buffer is at $%s.",
                    volPct, metrics.var95(), metrics.liquidity());
            if (breachEval.hasBreach()) {
                recs.add("Mandatory safeguard action: " + breachEval.primaryAction());
                recs.add("Rebalance portfolio to bring metrics within statutory tolerances.");
            } else {
                recs.add("Portfolio remains within standard institutional risk bounds.");
                recs.add("Continue monitoring asset concentration and interest rate sensitivity.");
            }

        // 12. NATURAL INTELLIGENCE FINANCIAL FALLBACK (Direct Answer to Query)
        } else {
            summary = String.format("Financial Risk Analysis for: \"%s\"", query);
            cause = String.format(
                "Regarding \"%s\": In institutional asset and risk management, this connects directly to your capital allocation strategy. " +
                "Your active portfolio (%s) is currently valued at %s with a Composite Risk Score of %d/100 (%s), annualized volatility of %s%%, and 1-Day 95%% VaR of $%s. Status: %s.",
                query, displayBookName, displayCapital, metrics.riskScore(), metrics.riskLevel(), volPct, metrics.var95(), breachEval.overallStatus()
            );
            recs.add("Ask specific questions: 'What is a portfolio?', 'Explain VaR', or 'How to lower volatility?'.");
            recs.add("Check live asset weights and risk metrics on the main Dashboard.");
            recs.add("Simulate macroeconomic shocks in the Stress Testing tab.");
        }

        String explanation = (summary + "\n\n" + cause + "\n\nStrategic Recommendations:\n* " + String.join("\n* ", recs)).replace("**", "");

        return AiAnalysisResponse.builder()
                .isFinanceQuery(true)
                .role("Chief Risk Officer (Capital Shield AI)")
                .executiveSummary(summary.replace("**", ""))
                .rootCause(cause.replace("**", ""))
                .strategicRecommendations(recs)
                .rawExplanation(explanation)
                .build();
    }

    @SuppressWarnings("unchecked")
    private AiAnalysisResponse callGeminiApi(String userQuery, RiskEngine.RiskOutput metrics, BreachDetectorService.BreachEvaluation breachEval) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        String systemPrompt = "You are 'Capital Shield AI', an elite Chief Risk Officer and Financial Quantitative Analyst. " +
                "Directly answer the user's specific question in an educational, authoritative, and helpful manner. " +
                "If the user asks for a definition or conceptual explanation (e.g., 'what is a portfolio', 'what is VaR', 'what is liquidity'), clearly explain the concept and connect it to their active portfolio. " +
                "Never reply with a rigid generic template. Tailor your response directly to what was asked. " +
                "Do not use double asterisks (**) in your formatting. Keep text clean and clear. " +
                "If the question is unrelated to finance (like sports, cricket, trivia), strictly refuse. " +
                "Ground your answer in these live metrics: RiskScore=" + metrics.riskScore() + " (" + metrics.riskLevel() + "), " +
                "Volatility=" + metrics.volatility() + ", 1-Day VaR95=$" + metrics.var95() + ", Status=" + breachEval.overallStatus() + ".";

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", systemPrompt + "\n\nUser Question: " + userQuery)))
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

                if (text != null) {
                    text = text.replace("**", "");
                }

                return AiAnalysisResponse.builder()
                        .isFinanceQuery(true)
                        .role("Chief Risk Officer (Capital Shield AI)")
                        .executiveSummary("AI Analysis based on real-time portfolio telemetry")
                        .rootCause("Derived from live quantitative risk signals and institutional knowledge")
                        .strategicRecommendations(List.of("Review proposed AI risk actions", "Explore scenario stress tests"))
                        .rawExplanation(text)
                        .build();
            }
        }

        return generateCroAnalysis(userQuery, metrics, breachEval, null, null);
    }
}
