package com.CapitalGuard.finance.market.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimulationRequest {
    private String scenario; // "MINOR_DROP", "MAJOR_DROP", "MARKET_CRASH", "VOLATILITY_SPIKE", "RESET"
    private Double customPercentage; // Optional explicit % override e.g. -8.5
}
