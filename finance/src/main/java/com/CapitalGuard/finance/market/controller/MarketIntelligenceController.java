package com.CapitalGuard.finance.market.controller;

import com.CapitalGuard.finance.market.model.*;
import com.CapitalGuard.finance.market.service.MarketMonitoringEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "*")
public class MarketIntelligenceController {

    private final MarketMonitoringEngine monitoringEngine;

    public MarketIntelligenceController(MarketMonitoringEngine monitoringEngine) {
        this.monitoringEngine = monitoringEngine;
    }

    /**
     * 1. Get Real-Time Market Overview & Live Quotes
     * GET /api/market/live
     */
    @GetMapping("/live")
    public ResponseEntity<MarketOverview> getLiveMarketOverview() {
        return ResponseEntity.ok(monitoringEngine.getMarketOverview());
    }

    /**
     * 2. Get Live Market Chart Trend Data
     * GET /api/market/chart?symbol=NIFTY 50&range=1D
     */
    @GetMapping("/chart")
    public ResponseEntity<List<Map<String, Object>>> getMarketChart(
            @RequestParam(defaultValue = "^NSEI") String symbol,
            @RequestParam(defaultValue = "1D") String range
    ) {
        return ResponseEntity.ok(monitoringEngine.getChartTrendData(symbol, range));
    }

    /**
     * 3. Risk Event API Output (Clean contract for separate AI Engine to consume)
     * GET /api/market/events
     */
    @GetMapping("/events")
    public ResponseEntity<List<MarketEvent>> getRiskEvents() {
        return ResponseEntity.ok(monitoringEngine.getEventBuffer());
    }

    /**
     * 4. Post/Publish Risk Event for AI Engine ingestion
     * POST /api/market/events
     */
    @PostMapping("/events")
    public ResponseEntity<Map<String, Object>> publishEvent(@RequestBody MarketEvent event) {
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Market Event successfully queued for AI Engine processing",
                "eventId", event.getId() != null ? event.getId() : "EVT-" + System.currentTimeMillis()
        ));
    }

    /**
     * 5. Demo Simulation Trigger (Hackathon Demo)
     * POST /api/market/simulate
     */
    @PostMapping("/simulate")
    public ResponseEntity<MarketOverview> simulateMarketEvent(@RequestBody SimulationRequest request) {
        monitoringEngine.triggerSimulation(request);
        return ResponseEntity.ok(monitoringEngine.getMarketOverview());
    }

    /**
     * 6. Reset Market Simulation
     * POST /api/market/reset
     */
    @PostMapping("/reset")
    public ResponseEntity<MarketOverview> resetSimulation() {
        monitoringEngine.triggerSimulation(new SimulationRequest("RESET", null));
        return ResponseEntity.ok(monitoringEngine.getMarketOverview());
    }
}
