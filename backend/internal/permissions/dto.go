package permissions

// PermissionResponse represents the response details of a permission.
type PermissionResponse struct {
	PermissionID   string `json:"permission_id"`
	PermissionCode string `json:"permission_code"`
	PermissionName string `json:"permission_name"`
	Description    string `json:"description"`
}
