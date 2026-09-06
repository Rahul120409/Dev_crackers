package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.entity.Portfolio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Core Risk Engine uniting all individual risk calculators:
 * Volatility, VaR/CVaR, Drawdown, Concentration, and Liquidity.
 * Matches LLD Section 9 & Section 12 contract.
 */
@Service
public class RiskEngine {

    private final VolatilityService volatilityService;
    private final ConcentrationService concentrationService;
    private final LiquidityService liquidityService;
    private final VaRService vaRService;
    private final RiskScoreService riskScoreService;

    public record RiskOutput(
            int riskScore,
            String riskLevel,
            BigDecimal volatility,
            BigDecimal var95,
            BigDecimal cvar95,
            BigDecimal drawdown,
            BigDecimal liquidity,
            ConcentrationService.ConcentrationReport concentrationDetails,
            RiskScoreService.CompositeRiskAssessment breakdown
    ) {}

    public RiskEngine(
            VolatilityService volatilityService,
            ConcentrationService concentrationService,
            LiquidityService liquidityService,
            VaRService vaRService,
            RiskScoreService riskScoreService) {
        this.volatilityService = volatilityService;
        this.concentrationService = concentrationService;
        this.liquidityService = liquidityService;
        this.vaRService = vaRService;
        this.riskScoreService = riskScoreService;
    }

    /**
     * Evaluates full risk posture for the given portfolio.
     */
    public RiskOutput evaluatePortfolio(Portfolio portfolio) {
        BigDecimal vol = volatilityService.calculate(portfolio);
        ConcentrationService.ConcentrationReport concReport = concentrationService.analyze(portfolio);
        LiquidityService.LiquidityReport liqReport = liquidityService.calculate(portfolio);
        VaRService.VaRReport varReport = vaRService.calculate(portfolio, vol);

        RiskScoreService.CompositeRiskAssessment scoreAssessment = riskScoreService.evaluate(
                vol,
                varReport.var95Percentage(),
                concReport.hhiIndex(),
                varReport.drawdownPercentage(),
                liqReport.weightedLiquidityScore()
        );

        return new RiskOutput(
                scoreAssessment.riskScore(),
                scoreAssessment.riskLevel().name(),
                vol,
                varReport.var95Amount(),
                varReport.cvar95Amount(),
                varReport.drawdownPercentage(),
                liqReport.totalLiquidValue(),
                concReport,
                scoreAssessment
        );
    }
}
