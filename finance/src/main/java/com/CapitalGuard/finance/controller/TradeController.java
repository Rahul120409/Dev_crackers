package com.CapitalGuard.finance.controller;

import com.CapitalGuard.finance.dto.TradeExecutionRequestDto;
import com.CapitalGuard.finance.dto.TradeExecutionResponseDto;
import com.CapitalGuard.finance.entity.ExecutedTradeEntity;
import com.CapitalGuard.finance.service.TradeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing trade execution and order fulfillment endpoints.
 */
@RestController
@RequestMapping("/api/trades")
@CrossOrigin(origins = "*")
public class TradeController {

    private final TradeExecutionService tradeExecutionService;

    public TradeController(TradeExecutionService tradeExecutionService) {
        this.tradeExecutionService = tradeExecutionService;
    }

    /**
     * POST /api/trades/execute - Executes a list of rebalancing trade instructions.
     */
    @PostMapping("/execute")
    public ResponseEntity<TradeExecutionResponseDto> executeTrades(@RequestBody TradeExecutionRequestDto request) {
        TradeExecutionResponseDto response = tradeExecutionService.executeTrades(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/trades/history - Returns list of historic executed trades.
     */
    @GetMapping("/history")
    public ResponseEntity<List<ExecutedTradeEntity>> getTradeHistory(
            @RequestParam(required = false) String portfolioId
    ) {
        List<ExecutedTradeEntity> history = tradeExecutionService.getTradeHistory(portfolioId);
        return ResponseEntity.ok(history);
    }
}
