package utils

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

type PaginationParams struct {
	Page     int
	PageSize int
}

type PaginationMeta struct {
	Page     int   `json:"page"`
	PageSize int   `json:"page_size"`
	Total    int64 `json:"total"`
}

type PaginatedResponse[T any] struct {
	Data []T            `json:"data"`
	Meta PaginationMeta `json:"meta"`
}

func ParsePagination(c *gin.Context) PaginationParams {
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		page = 1
	}
	pageSize, err := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if err != nil || pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	return PaginationParams{Page: page, PageSize: pageSize}
}
