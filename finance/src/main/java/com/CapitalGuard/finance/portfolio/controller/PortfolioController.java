package com.CapitalGuard.finance.portfolio.controller;

import com.CapitalGuard.finance.portfolio.dto.PortfolioResponseDto;
import com.CapitalGuard.finance.portfolio.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing portfolio details endpoint GET /api/portfolio.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/portfolio")
    public ResponseEntity<PortfolioResponseDto> getPortfolio() {
        PortfolioResponseDto portfolio = portfolioService.getDefaultPortfolio();
        return ResponseEntity.ok(portfolio);
    }

    @PostMapping("/portfolio")
    public ResponseEntity<PortfolioResponseDto> savePortfolio(@RequestBody PortfolioResponseDto request) {
        PortfolioResponseDto saved = portfolioService.saveCustomPortfolio(request);
        return ResponseEntity.ok(saved);
    }
}
