package com.CapitalGuard.finance.optimization.enums;

import lombok.Getter;

@Getter
public enum RiskPreference {
    CONSERVATIVE(3.0),
    MODERATE(1.5),
    AGGRESSIVE(0.5),
    CUSTOM(1.0);

    private final double riskAversionFactor;

    RiskPreference(double riskAversionFactor) {
        this.riskAversionFactor = riskAversionFactor;
    }
}
