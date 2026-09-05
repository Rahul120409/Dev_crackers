package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Asset;
import com.CapitalGuard.finance.entity.Portfolio;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Unit test for {@link VolatilityService}.
 * It builds a small portfolio with known weights and volatilities and verifies
 * that the calculated volatility matches the expected weighted‑average.
 */
class VolatilityServiceTest {

    @Test
    void calculatesWeightedAverageVolatilityCorrectly() {
        // Arrange – build mock portfolio
        Portfolio portfolio = new Portfolio();
        List<Asset> assets = new ArrayList<>();

        Asset a1 = new Asset();
        a1.setWeight(new BigDecimal("0.25")); // 25%
        a1.setVolatility(new BigDecimal("0.30")); // 30%
        assets.add(a1);

        Asset a2 = new Asset();
        a2.setWeight(new BigDecimal("0.40")); // 40%
        a2.setVolatility(new BigDecimal("0.05")); // 5%
        assets.add(a2);

        Asset a3 = new Asset();
        a3.setWeight(new BigDecimal("0.15")); // 15%
        a3.setVolatility(new BigDecimal("0.20")); // 20%
        assets.add(a3);

        Asset a4 = new Asset();
        a4.setWeight(new BigDecimal("0.20")); // 20%
        a4.setVolatility(new BigDecimal("0.00")); // 0%
        assets.add(a4);

        portfolio.setAssets(assets);

        // Act
        VolatilityService service = new VolatilityService();
        BigDecimal result = service.calculate(portfolio);

        // Expected = 0.25*0.30 + 0.40*0.05 + 0.15*0.20 + 0.20*0.00 = 0.0750 + 0.0200 + 0.0300 + 0.0000 = 0.1250
        BigDecimal expected = new BigDecimal("0.1250");

        // Assert
        assertEquals(0, expected.compareTo(result), "Volatility should be 0.1250");
    }
}
