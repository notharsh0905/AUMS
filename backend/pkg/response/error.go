package response

import "github.com/gin-gonic/gin"

type ErrorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func Error(
	c *gin.Context,
	status int,
	message string,
) {

	c.JSON(
		status,
		ErrorResponse{
			Success: false,
			Message: message,
		},
	)
}
