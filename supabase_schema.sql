-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    asset_class VARCHAR(50) NOT NULL, -- e.g., 'EQUITY', 'FIXED_INCOME', 'CASH', 'CRYPTO'
    current_value NUMERIC(15, 2) NOT NULL DEFAULT 0.0,
    risk_weight NUMERIC(5, 4) NOT NULL DEFAULT 1.0, -- Multiplier for risk calculations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    total_value NUMERIC(15, 2) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create portfolio_assets mapping table
CREATE TABLE IF NOT EXISTS portfolio_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,
    quantity NUMERIC(15, 4) NOT NULL DEFAULT 0.0,
    average_buy_price NUMERIC(15, 2) NOT NULL DEFAULT 0.0,
    UNIQUE(portfolio_id, asset_id)
);

-- Create risk_limits table
CREATE TABLE IF NOT EXISTS risk_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    metric_name VARCHAR(50) NOT NULL, -- e.g., 'MAX_EQUITY_EXPOSURE', 'MIN_LIQUIDITY'
    threshold_value NUMERIC(15, 4) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create system_logs table for tracking automated actions and alerts
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL, -- e.g., 'RISK_BREACH', 'AUTO_REBALANCE', 'SYSTEM_ERROR'
    message TEXT NOT NULL,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO', -- 'INFO', 'WARNING', 'CRITICAL'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_portfolio_assets_portfolio_id ON portfolio_assets(portfolio_id);
CREATE INDEX idx_system_logs_portfolio_id ON system_logs(portfolio_id);
CREATE INDEX idx_system_logs_event_type ON system_logs(event_type);
