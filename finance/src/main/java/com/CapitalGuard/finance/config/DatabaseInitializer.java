package com.CapitalGuard.finance.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        if (jdbcTemplate != null) {
            try {
                // Drop allocations table if legacy bigint asset_id column exists so Hibernate recreates it with UUID foreign keys
                jdbcTemplate.execute("DROP TABLE IF EXISTS allocations CASCADE;");
            } catch (Exception ignored) {
            }
        }
    }
}
