package com.CapitalGuard.finance.controller;

import com.CapitalGuard.finance.dto.AiAnalysisResponse;
import com.CapitalGuard.finance.dto.AiPromptRequest;
import com.CapitalGuard.finance.service.FinanceAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Controller exposing Financial AI & Explainability capabilities.
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final FinanceAiService financeAiService;

    @Autowired
    public AiController(FinanceAiService financeAiService) {
        this.financeAiService = financeAiService;
    }

    /**
     * POST /api/ai/ask - Interactive CRO Chatbot.
     * Answers portfolio risk questions, and rejects off-topic queries (e.g. cricket/sports).
     */
    @PostMapping("/ask")
    public AiAnalysisResponse askFinancialAi(@RequestBody AiPromptRequest request) {
        String question = request != null ? request.getQuestion() : "Explain current portfolio risk profile";
        return financeAiService.answerQuery(question);
    }

    /**
     * GET /api/ai/explain-portfolio - Direct CRO executive summary of the current live portfolio.
     */
    @GetMapping("/explain-portfolio")
    public AiAnalysisResponse explainPortfolio() {
        return financeAiService.answerQuery("Provide a comprehensive Chief Risk Officer executive evaluation of our current portfolio.");
    }
}
