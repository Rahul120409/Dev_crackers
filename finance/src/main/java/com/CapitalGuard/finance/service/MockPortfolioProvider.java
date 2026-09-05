package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Asset;
import com.CapitalGuard.finance.entity.Portfolio;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Provides a static mock Portfolio used for early development and testing of the risk engine.
 * This class is deliberately simple – it does not hit a database. It just builds an in‑memory
 * Portfolio object with a handful of representative assets.
 */
@Component
public class MockPortfolioProvider {

    /**
     * Returns a Portfolio populated with sample assets.
     *
     * @return a Portfolio instance ready for risk calculations
     */
    public Portfolio getMockPortfolio() {
        Portfolio portfolio = new Portfolio();
        portfolio.setName("Demo Portfolio");
        portfolio.setTotalCapital(new BigDecimal("1000000")); // 1 M total capital

        List<Asset> assets = new ArrayList<>();

        Asset equity = new Asset();
        equity.setSymbol("AAPL");
        equity.setName("Apple Inc.");
        equity.setAssetClass("Equity");
        equity.setCurrentValue(new BigDecimal("250000"));
        equity.setWeight(new BigDecimal("0.25")); // 25 % of portfolio
        equity.setVolatility(new BigDecimal("0.30")); // 30 % annualized volatility
        equity.setLiquidityScore(new BigDecimal("0.95")); // very liquid
        equity.setRiskWeight(BigDecimal.ONE);
        assets.add(equity);

        Asset bond = new Asset();
        bond.setSymbol("US10Y");
        bond.setName("US 10‑Year Treasury");
        bond.setAssetClass("FixedIncome");
        bond.setCurrentValue(new BigDecimal("400000"));
        bond.setWeight(new BigDecimal("0.40")); // 40 %
        bond.setVolatility(new BigDecimal("0.05")); // low volatility
        bond.setLiquidityScore(new BigDecimal("0.99"));
        bond.setRiskWeight(BigDecimal.ONE);
        assets.add(bond);

        Asset gold = new Asset();
        gold.setSymbol("XAU");
        gold.setName("Gold Spot");
        gold.setAssetClass("Commodity");
        gold.setCurrentValue(new BigDecimal("150000"));
        gold.setWeight(new BigDecimal("0.15")); // 15 %
        gold.setVolatility(new BigDecimal("0.20"));
        gold.setLiquidityScore(new BigDecimal("0.85"));
        gold.setRiskWeight(BigDecimal.ONE);
        assets.add(gold);

        Asset cash = new Asset();
        cash.setSymbol("USD");
        cash.setName("Cash USD");
        cash.setAssetClass("Cash");
        cash.setCurrentValue(new BigDecimal("200000"));
        cash.setWeight(new BigDecimal("0.20")); // 20 %
        cash.setVolatility(new BigDecimal("0.00"));
        cash.setLiquidityScore(new BigDecimal("1.00"));
        cash.setRiskWeight(BigDecimal.ONE);
        assets.add(cash);

        portfolio.setAssets(assets);
        return portfolio;
    }
}
