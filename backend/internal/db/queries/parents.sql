-- name: GetParentProfileByUserID :one
SELECT *
FROM parent_profiles
WHERE user_id = $1;

-- name: ListParentWards :many
SELECT
    sp.student_profile_id,
    sp.user_id AS student_user_id,
    u.first_name,
    u.last_name,
    u.email,
    spr.relationship_type,
    spr.is_primary_contact,
    spr.can_view_attendance,
    spr.can_view_results
FROM parent_profiles pp
JOIN student_parent_relationships spr
    ON spr.parent_profile_id = pp.parent_profile_id
JOIN student_profiles sp
    ON sp.student_profile_id = spr.student_profile_id
JOIN users u
    ON u.user_id = sp.user_id
WHERE pp.user_id = $1;
