package rolepermissions

// AssignPermissionRequest represents the request payload to assign a permission to a role.
type AssignPermissionRequest struct {
	PermissionID string `json:"permission_id" validate:"required,uuid"`
}
