package response

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetPage(
	c *gin.Context,
) int {

	page, err := strconv.Atoi(
		c.DefaultQuery("page", "1"),
	)

	if err != nil || page < 1 {
		return 1
	}

	return page
}

func GetLimit(
	c *gin.Context,
) int {

	limit, err := strconv.Atoi(
		c.DefaultQuery("limit", "20"),
	)

	if err != nil || limit < 1 {
		return 20
	}

	if limit > 100 {
		return 100
	}

	return limit
}
