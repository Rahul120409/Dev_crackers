CREATE TABLE IF NOT EXISTS allocations (
    id UUID PRIMARY KEY,
    portfolio_id UUID,
    asset_id UUID,
    amount NUMERIC(19, 2),
    percentage DOUBLE PRECISION,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
