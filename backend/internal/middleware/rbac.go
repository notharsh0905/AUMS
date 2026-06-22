package middleware

import (
	"net/http"

	"aums/backend/internal/userroles"

	"github.com/gin-gonic/gin"
)

func RequireRole(
	userRoleService *userroles.Service,
	roleCode string,
) gin.HandlerFunc {

	return func(c *gin.Context) {

		userIDString := GetUserID(c)
		println("USER ID FROM JWT:")
		println(userIDString)
		userID, err := ParseUUID(
			userIDString,
		)
		if err != nil {
			println("UUID PARSE ERROR:", err.Error())
		}

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

		hasRole, err := userRoleService.HasRole(
			c.Request.Context(),
			userID,
			roleCode,
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
