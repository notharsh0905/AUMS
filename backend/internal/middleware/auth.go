package middleware

import (
	"net/http"
	"strings"

	"aums/backend/configs"
	aumsjwt "aums/backend/pkg/jwt"

	"github.com/gin-gonic/gin"
)

func Auth(
	config *configs.Config,
) gin.HandlerFunc {

	return func(c *gin.Context) {

		authHeader := c.GetHeader(
			"Authorization",
		)

		if authHeader == "" {

			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error": "missing authorization header",
				},
			)

			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(
			authHeader,
			"Bearer ",
		)

		claims, err := aumsjwt.ValidateToken(
			tokenString,
			config.JWT.Secret,
		)

		if err != nil {

			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error": "invalid token",
				},
			)

			c.Abort()
			return
		}

		c.Set(
			"user_id",
			claims.UserID,
		)

		c.Next()
	}
}
