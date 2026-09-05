package com.CapitalGuard.finance.portfolio.service;

import com.CapitalGuard.finance.optimization.enums.AssetType;
import com.CapitalGuard.finance.portfolio.dto.AllocationDto;
import com.CapitalGuard.finance.portfolio.dto.PortfolioResponseDto;
import com.CapitalGuard.finance.portfolio.entity.AllocationEntity;
import com.CapitalGuard.finance.portfolio.entity.AssetEntity;
import com.CapitalGuard.finance.portfolio.entity.PortfolioEntity;
import com.CapitalGuard.finance.portfolio.repository.AssetRepository;
import com.CapitalGuard.finance.portfolio.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service managing portfolio structure, asset allocation details, and PostgreSQL database persistence.
 */
@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final AssetRepository assetRepository;

    @Autowired(required = false)
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Autowired(required = false)
    public PortfolioService(PortfolioRepository portfolioRepository, AssetRepository assetRepository) {
        this.portfolioRepository = portfolioRepository;
        this.assetRepository = assetRepository;
    }

    public PortfolioService() {
        this.portfolioRepository = null;
        this.assetRepository = null;
    }

    @Transactional
    public PortfolioResponseDto getDefaultPortfolio() {
        BigDecimal totalCapital = BigDecimal.valueOf(100_000_000); // Rs. 100 Cr default baseline

        if (jdbcTemplate != null) {
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS allocations (" +
                        "id UUID PRIMARY KEY, " +
                        "portfolio_id UUID, " +
                        "asset_id UUID, " +
                        "amount NUMERIC(19, 2), " +
                        "percentage DOUBLE PRECISION, " +
                        "created_at TIMESTAMP, " +
                        "updated_at TIMESTAMP" +
                        ")");
            } catch (Exception ignored) {
            }
        }

        // If repository is injected and database is available, persist & sync with PostgreSQL
        if (portfolioRepository != null && assetRepository != null) {
            try {
                Optional<PortfolioEntity> existing = portfolioRepository.findAll().stream().findFirst();
                if (existing.isPresent()) {
                    PortfolioEntity p = existing.get();
                    List<AllocationDto> assetDtos = p.getAllocations().stream().map(alloc -> AllocationDto.builder()
                            .name(alloc.getAsset().getName())
                            .assetType(alloc.getAsset().getAssetType())
                            .weight(alloc.getPercentage())
                            .value(alloc.getAmount())
                            .volatility(alloc.getAsset().getVolatility())
                            .liquidityScore(alloc.getAsset().getLiquidityScore())
                            .expectedReturn(alloc.getAsset().getExpectedReturn())
                            .riskLevel(alloc.getAsset().getRiskLevel())
                            .build()).toList();

                    return PortfolioResponseDto.builder()
                            .id(p.getId() != null ? p.getId().toString() : "PORT-101")
                            .name(p.getName())
                            .totalCapital(p.getTotalCapital())
                            .assets(assetDtos)
                            .build();
                }

                // Seed baseline portfolio into PostgreSQL database
                PortfolioEntity portfolioEntity = PortfolioEntity.builder()
                        .name("Capital Guard Master Portfolio")
                        .totalCapital(totalCapital)
                        .allocations(new ArrayList<>())
                        .build();

                List<AllocationDto> seedAssets = getSeedAssetDtos(totalCapital);
                for (AllocationDto dto : seedAssets) {
                    AssetEntity assetEntity = assetRepository.findByName(dto.getName())
                            .orElseGet(() -> assetRepository.save(AssetEntity.builder()
                                    .name(dto.getName())
                                    .assetType(dto.getAssetType())
                                    .assetClass(dto.getAssetType() != null ? dto.getAssetType().name() : dto.getName())
                                    .currentValue(dto.getValue() != null ? dto.getValue() : BigDecimal.ZERO)
                                    .currentWeight(dto.getWeight() != null ? dto.getWeight() : 0.0)
                                    .expectedReturn(dto.getExpectedReturn())
                                    .volatility(dto.getVolatility())
                                    .liquidityScore(dto.getLiquidityScore())
                                    .riskLevel(dto.getRiskLevel())
                                    .build()));

                    AllocationEntity allocEntity = AllocationEntity.builder()
                            .portfolio(portfolioEntity)
                            .asset(assetEntity)
                            .amount(dto.getValue())
                            .percentage(dto.getWeight())
                            .build();

                    portfolioEntity.getAllocations().add(allocEntity);
                }

                PortfolioEntity saved = portfolioRepository.save(portfolioEntity);
                return PortfolioResponseDto.builder()
                        .id(saved.getId() != null ? saved.getId().toString() : "PORT-101")
                        .name(saved.getName())
                        .totalCapital(saved.getTotalCapital())
                        .assets(seedAssets)
                        .build();
            } catch (Exception ignored) {
                // Fallback to in-memory DTO if database is un-initialized or offline
            }
        }

        return PortfolioResponseDto.builder()
                .id("PORT-101")
                .name("Capital Guard Master Portfolio")
                .totalCapital(totalCapital)
                .assets(getSeedAssetDtos(totalCapital))
                .build();
    }

    private List<AllocationDto> getSeedAssetDtos(BigDecimal totalCapital) {
        return List.of(
                AllocationDto.builder().name("EQUITY").assetType(AssetType.EQUITY).weight(0.30).value(totalCapital.multiply(BigDecimal.valueOf(0.30))).volatility(0.22).liquidityScore(0.80).expectedReturn(0.12).riskLevel("HIGH").build(),
                AllocationDto.builder().name("GOVERNMENT_BOND").assetType(AssetType.GOVERNMENT_BOND).weight(0.30).value(totalCapital.multiply(BigDecimal.valueOf(0.30))).volatility(0.05).liquidityScore(0.95).expectedReturn(0.05).riskLevel("LOW").build(),
                AllocationDto.builder().name("CORPORATE_BOND").assetType(AssetType.CORPORATE_BOND).weight(0.20).value(totalCapital.multiply(BigDecimal.valueOf(0.20))).volatility(0.10).liquidityScore(0.70).expectedReturn(0.08).riskLevel("MODERATE").build(),
                AllocationDto.builder().name("GOLD").assetType(AssetType.GOLD).weight(0.10).value(totalCapital.multiply(BigDecimal.valueOf(0.10))).volatility(0.15).liquidityScore(0.60).expectedReturn(0.07).riskLevel("MODERATE").build(),
                AllocationDto.builder().name("CASH").assetType(AssetType.CASH).weight(0.10).value(totalCapital.multiply(BigDecimal.valueOf(0.10))).volatility(0.01).liquidityScore(1.00).expectedReturn(0.03).riskLevel("LOW").build()
        );
    }
}
