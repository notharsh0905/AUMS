package response

import "github.com/gin-gonic/gin"

type ErrorResponse struct {
	Success bool              `json:"success"`
	Message string            `json:"message"`
	Errors  map[string]string `json:"errors,omitempty"`
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

func ValidationError(
	c *gin.Context,
	errors map[string]string,
) {

	c.JSON(
		400,
		ErrorResponse{
			Success: false,
			Message: "validation failed",
			Errors:  errors,
		},
	)
}
