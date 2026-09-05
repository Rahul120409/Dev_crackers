package com.CapitalGuard.finance.controller;

import com.CapitalGuard.finance.model.DecisionLog;
import com.CapitalGuard.finance.model.StressTestRequest;
import com.CapitalGuard.finance.model.StressTestResult;
import com.CapitalGuard.finance.service.DecisionLogService;
import com.CapitalGuard.finance.service.StressTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller exposing Stress Testing and Decision Logs matching LLD Sections 18, 20 & 25.
 */
@RestController
@RequestMapping("/api")
public class ScenarioController {

    private final StressTestService stressTestService;
    private final DecisionLogService decisionLogService;

    @Autowired
    public ScenarioController(StressTestService stressTestService, DecisionLogService decisionLogService) {
        this.stressTestService = stressTestService;
        this.decisionLogService = decisionLogService;
    }

    /**
     * POST /api/scenarios/stress-test - Run market shock simulation (LLD Section 15, 18, 20).
     */
    @PostMapping("/scenarios/stress-test")
    public StressTestResult runStressTest(@RequestBody StressTestRequest request) {
        return stressTestService.executeStressTest(request);
    }

    /**
     * GET /api/decisions - Retrieve explainable decision timeline (LLD Section 17, 18, 20).
     */
    @GetMapping("/decisions")
    public List<DecisionLog> getDecisions() {
        return decisionLogService.getAllDecisions();
    }
}
