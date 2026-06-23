-- name: CreateAuditLog :exec
INSERT INTO audit_logs (
    audit_log_id,
    user_id,
    audit_event_id,
    entity_type,
    entity_id,
    action,
    old_values,
    new_values,
    ip_address,
    user_agent
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10
);

-- name: CreateLoginAuditLog :exec
INSERT INTO login_audit_logs (
    login_audit_log_id,
    user_id,
    login_time,
    logout_time,
    login_status,
    ip_address,
    user_agent
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7
);