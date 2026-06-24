package response

import "github.com/gin-gonic/gin"

type SuccessResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

func Success(
	c *gin.Context,
	status int,
	message string,
	data interface{},
) {

	c.JSON(
		status,
		SuccessResponse{
			Success: true,
			Message: message,
			Data:    data,
		},
	)
}
