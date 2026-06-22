package roles

type RoleResponse struct {
	RoleID string `json:"role_id"`

	RoleCode string `json:"role_code"`

	RoleName string `json:"role_name"`

	Description string `json:"description"`
}
