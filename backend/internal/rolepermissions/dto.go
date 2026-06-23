package rolepermissions

type AssignPermissionRequest struct {
	PermissionID string `json:"permission_id" binding:"required,uuid"`
}
