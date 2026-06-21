-- ==========================================
-- AUMS ANALYTICS DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE metric_frequency AS ENUM (
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'SEMESTER',
    'YEARLY'
);

CREATE TYPE widget_type AS ENUM (
    'CARD',
    'TABLE',
    'LINE_CHART',
    'BAR_CHART',
    'PIE_CHART',
    'GAUGE'
);

-- ==========================================
-- ANALYTICS METRICS
-- ==========================================

CREATE TABLE analytics_metrics (

    analytics_metric_id UUID PRIMARY KEY,

    metric_code VARCHAR(100) NOT NULL,

    metric_name VARCHAR(255) NOT NULL,

    description TEXT,

    frequency metric_frequency NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_metric_code
        UNIQUE(metric_code)
);

-- ==========================================
-- ANALYTICS SNAPSHOTS
-- ==========================================

CREATE TABLE analytics_snapshots (

    analytics_snapshot_id UUID PRIMARY KEY,

    analytics_metric_id UUID NOT NULL,

    snapshot_date DATE NOT NULL,

    metric_value NUMERIC(18,4) NOT NULL,

    metadata JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_snapshot_metric
        FOREIGN KEY (analytics_metric_id)
        REFERENCES analytics_metrics(analytics_metric_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_metric_snapshot
        UNIQUE (
            analytics_metric_id,
            snapshot_date
        )
);

-- ==========================================
-- DASHBOARD WIDGETS
-- ==========================================

CREATE TABLE dashboard_widgets (

    dashboard_widget_id UUID PRIMARY KEY,

    widget_name VARCHAR(255) NOT NULL,

    widget_type widget_type NOT NULL,

    analytics_metric_id UUID,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_widget_metric
        FOREIGN KEY (analytics_metric_id)
        REFERENCES analytics_metrics(analytics_metric_id)
        ON DELETE SET NULL
);

-- ==========================================
-- DASHBOARD WIDGET CONFIGS
-- ==========================================

CREATE TABLE dashboard_widget_configs (

    dashboard_widget_config_id UUID PRIMARY KEY,

    dashboard_widget_id UUID NOT NULL,

    config_key VARCHAR(255) NOT NULL,

    config_value TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_widget_config
        UNIQUE (
            dashboard_widget_id,
            config_key
        ),

    CONSTRAINT fk_widget_config_widget
        FOREIGN KEY (dashboard_widget_id)
        REFERENCES dashboard_widgets(dashboard_widget_id)
        ON DELETE CASCADE
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_analytics_snapshots_metric
ON analytics_snapshots(analytics_metric_id);

CREATE INDEX idx_analytics_snapshots_date
ON analytics_snapshots(snapshot_date);

CREATE INDEX idx_dashboard_widgets_metric
ON dashboard_widgets(analytics_metric_id);

CREATE INDEX idx_dashboard_widget_configs_widget
ON dashboard_widget_configs(dashboard_widget_id);