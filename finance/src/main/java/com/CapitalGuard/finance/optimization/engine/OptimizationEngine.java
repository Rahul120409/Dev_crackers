package com.CapitalGuard.finance.optimization.engine;

import com.CapitalGuard.finance.optimization.dto.request.AssetInputDto;
import com.CapitalGuard.finance.optimization.dto.request.RebalancingConstraintDto;
import com.CapitalGuard.finance.optimization.enums.RiskPreference;
import com.CapitalGuard.finance.optimization.strategy.ConstraintValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class OptimizationEngine {

    private final ConstraintValidator constraintValidator;

    public OptimizationEngine(ConstraintValidator constraintValidator) {
        this.constraintValidator = constraintValidator;
    }

    public double[] optimize(List<AssetInputDto> assets, RiskPreference riskPreference, RebalancingConstraintDto constraint) {
        if (assets == null || assets.isEmpty()) {
            return new double[0];
        }

        int n = assets.size();
        double[] currentWeights = new double[n];
        double[] expectedReturns = new double[n];
        double[] volatilities = new double[n];

        double sumCurrent = 0.0;
        for (int i = 0; i < n; i++) {
            AssetInputDto a = assets.get(i);
            currentWeights[i] = a.getCurrentWeight() != null ? a.getCurrentWeight() : (1.0 / n);
            expectedReturns[i] = a.getExpectedReturn() != null ? a.getExpectedReturn() : 0.08;
            volatilities[i] = a.getVolatility() != null ? a.getVolatility() : 0.15;
            sumCurrent += currentWeights[i];
        }

        if (sumCurrent > 0 && Math.abs(sumCurrent - 1.0) > 1e-4) {
            for (int i = 0; i < n; i++) {
                currentWeights[i] /= sumCurrent;
            }
        }

        double lambda = riskPreference != null ? riskPreference.getRiskAversionFactor() : 1.5;

        double[] bestWeights = Arrays.copyOf(currentWeights, n);
        double maxUtility = computeUtility(currentWeights, expectedReturns, volatilities, lambda);

        int maxIterations = 500;
        double stepSize = 0.02;

        double[] candidate = Arrays.copyOf(currentWeights, n);

        for (int iter = 0; iter < maxIterations; iter++) {
            boolean improved = false;

            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (i == j) continue;

                    double delta = Math.min(candidate[i], stepSize * (1.0 - (double) iter / maxIterations));
                    if (delta <= 1e-5) continue;

                    candidate[i] -= delta;
                    candidate[j] += delta;

                    if (constraintValidator.isValidAllocation(candidate, assets, constraint)) {
                        double utility = computeUtility(candidate, expectedReturns, volatilities, lambda);
                        if (utility > maxUtility) {
                            maxUtility = utility;
                            bestWeights = Arrays.copyOf(candidate, n);
                            improved = true;
                        } else {
                            candidate[i] += delta;
                            candidate[j] -= delta;
                        }
                    } else {
                        candidate[i] += delta;
                        candidate[j] -= delta;
                    }
                }
            }

            if (!improved) {
                stepSize *= 0.5;
                if (stepSize < 1e-4) break;
            }
        }

        return normalizeWeights(bestWeights);
    }

    public double computeUtility(double[] weights, double[] returns, double[] volatilities, double lambda) {
        double expReturn = 0.0;
        double portRisk = 0.0;

        for (int i = 0; i < weights.length; i++) {
            expReturn += weights[i] * returns[i];
            portRisk += weights[i] * volatilities[i];
        }

        return expReturn - (lambda * portRisk);
    }

    private double[] normalizeWeights(double[] weights) {
        double sum = 0.0;
        for (double w : weights) sum += w;

        double[] normalized = new double[weights.length];
        if (sum <= 0) {
            Arrays.fill(normalized, 1.0 / weights.length);
            return normalized;
        }

        double normSum = 0.0;
        int maxIndex = 0;
        double maxW = -1.0;

        for (int i = 0; i < weights.length; i++) {
            normalized[i] = Math.round((weights[i] / sum) * 1000.0) / 1000.0;
            normSum += normalized[i];
            if (normalized[i] > maxW) {
                maxW = normalized[i];
                maxIndex = i;
            }
        }

        // Adjust residual rounding difference to largest allocation weight
        double diff = Math.round((1.0 - normSum) * 1000.0) / 1000.0;
        if (Math.abs(diff) > 1e-6) {
            normalized[maxIndex] = Math.round((normalized[maxIndex] + diff) * 1000.0) / 1000.0;
        }

        return normalized;
    }
}
