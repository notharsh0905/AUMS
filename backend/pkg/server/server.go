package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func New() *gin.Engine {

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":      "ok",
			"service":     "AUMS",
			"environment": "development",
			"version":     "v1",
		})
	})

	return router
}
