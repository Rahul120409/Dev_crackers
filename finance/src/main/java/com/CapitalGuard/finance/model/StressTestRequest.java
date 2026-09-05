package com.CapitalGuard.finance.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request payload for POST /api/scenarios/stress-test (LLD Section 15).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StressTestRequest {
    private String scenario; // e.g. "EQUITY_CRASH", "INTEREST_RATE_UP", "LIQUIDITY_DROP"
    private BigDecimal shock; // e.g. -0.20 (-20%)
}
