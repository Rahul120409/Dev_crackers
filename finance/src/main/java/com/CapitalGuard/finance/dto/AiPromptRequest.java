package com.CapitalGuard.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiPromptRequest {
    private String question; // User query to the Financial AI
    private java.math.BigDecimal totalCapital; // Active user capital in Cr or $
    private String portfolioName; // Active portfolio name
}
