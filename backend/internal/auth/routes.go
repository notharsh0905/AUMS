package auth

import "github.com/gin-gonic/gin"

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
	authMiddleware gin.HandlerFunc,
) {

	router.POST(
		"/login",
		handler.Login,
	)

	router.POST(
		"/refresh",
		handler.Refresh,
	)

	router.POST(
		"/logout",
		handler.Logout,
	)

	router.GET(
		"/me",
		authMiddleware,
		handler.GetMe,
	)
}
