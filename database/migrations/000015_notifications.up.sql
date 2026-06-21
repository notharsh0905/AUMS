-- ==========================================
-- AUMS NOTIFICATION DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE notification_channel AS ENUM (
    'IN_APP',
    'EMAIL',
    'SMS'
);

CREATE TYPE notification_delivery_status AS ENUM (
    'PENDING',
    'SENT',
    'DELIVERED',
    'FAILED'
);

-- ==========================================
-- NOTIFICATION TEMPLATES
-- ==========================================

CREATE TABLE notification_templates (

    notification_template_id UUID PRIMARY KEY,

    template_code VARCHAR(100) NOT NULL,

    template_name VARCHAR(255) NOT NULL,

    subject_template TEXT,

    body_template TEXT NOT NULL,

    channel notification_channel NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_notification_template_code
        UNIQUE(template_code)
);

-- ==========================================
-- NOTIFICATION EVENTS
-- ==========================================

CREATE TABLE notification_events (

    notification_event_id UUID PRIMARY KEY,

    event_code VARCHAR(100) NOT NULL,

    event_name VARCHAR(255) NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_notification_event_code
        UNIQUE(event_code)
);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================

CREATE TABLE notifications (

    notification_id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    notification_event_id UUID,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_notification_event
        FOREIGN KEY (notification_event_id)
        REFERENCES notification_events(notification_event_id)
        ON DELETE SET NULL
);

-- ==========================================
-- NOTIFICATION DELIVERIES
-- ==========================================

CREATE TABLE notification_deliveries (

    notification_delivery_id UUID PRIMARY KEY,

    notification_id UUID NOT NULL,

    channel notification_channel NOT NULL,

    delivery_status notification_delivery_status
        NOT NULL DEFAULT 'PENDING',

    delivered_at TIMESTAMPTZ,

    failure_reason TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_notification_delivery
        FOREIGN KEY (notification_id)
        REFERENCES notifications(notification_id)
        ON DELETE CASCADE
);

-- ==========================================
-- NOTIFICATION PREFERENCES
-- ==========================================

CREATE TABLE notification_preferences (

    notification_preference_id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,

    sms_enabled BOOLEAN NOT NULL DEFAULT TRUE,

    in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,

    push_enabled BOOLEAN NOT NULL DEFAULT FALSE,

    whatsapp_enabled BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_notification_preferences_user
        UNIQUE(user_id),

    CONSTRAINT fk_notification_preferences_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_notifications_user
ON notifications(user_id);

CREATE INDEX idx_notifications_read
ON notifications(is_read);

CREATE INDEX idx_notifications_event
ON notifications(notification_event_id);

CREATE INDEX idx_notification_deliveries_notification
ON notification_deliveries(notification_id);

CREATE INDEX idx_notification_deliveries_status
ON notification_deliveries(delivery_status);

CREATE INDEX idx_notification_preferences_user
ON notification_preferences(user_id);