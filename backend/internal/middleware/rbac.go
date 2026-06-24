package middleware

import (
	"net/http"

	"aums/backend/internal/rolepermissions"
	"aums/backend/internal/userroles"
	uuidpkg "aums/backend/pkg/uuid"

	"github.com/gin-gonic/gin"
)

func RequireRole(
	userRoleService *userroles.Service,
	roleCode string,
) gin.HandlerFunc {

	return func(c *gin.Context) {
		println("CHECKING ROLE:", roleCode)
		userIDString := GetUserID(c)

		userID, err := uuidpkg.Parse(
			userIDString,
		)

		if err != nil {

			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error": "invalid user id",
				},
			)

			c.Abort()
			return
		}
		println("USER ID:", userIDString)
		hasRole, err := userRoleService.HasRole(
			c.Request.Context(),
			userID,
			roleCode,
		)
		println("HAS ROLE RESULT:", hasRole)

		if err != nil {

			c.JSON(
				http.StatusInternalServerError,
				gin.H{
					"error": err.Error(),
				},
			)

			c.Abort()
			return
		}

		if !hasRole {

			c.JSON(
				http.StatusForbidden,
				gin.H{
					"error": "insufficient permissions",
				},
			)

			c.Abort()
			return
		}

		c.Next()
	}
}

func RequirePermission(
	rolePermissionService *rolepermissions.Service,
	permissionCode string,
) gin.HandlerFunc {

	return func(c *gin.Context) {

		userIDString := GetUserID(c)

		userID, err := uuidpkg.Parse(
			userIDString,
		)

		if err != nil {

			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error": "invalid user id",
				},
			)

			c.Abort()
			return
		}

		hasPermission, err := rolePermissionService.HasPermission(
			c.Request.Context(),
			userID,
			permissionCode,
		)

		if err != nil {

			c.JSON(
				http.StatusInternalServerError,
				gin.H{
					"error": err.Error(),
				},
			)

			c.Abort()
			return
		}

		if !hasPermission {

			c.JSON(
				http.StatusForbidden,
				gin.H{
					"error": "insufficient permissions",
				},
			)

			c.Abort()
			return
		}

		c.Next()
	}
}
