package com.CapitalGuard.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisResponse {
    private boolean isFinanceQuery;
    private String role; // "Chief Risk Officer (Capital Shield AI)"
    private String executiveSummary;
    private String rootCause;
    private List<String> strategicRecommendations;
    private String rawExplanation;
}
