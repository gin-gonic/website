---
title: "API 설계 패턴"
sidebar:
  order: 10
---

Gin으로 RESTful API를 구축하는 것은 단순히 라우트를 정의하는 것 이상입니다. 잘 설계된 API는 일관된 응답 형식, 예측 가능한 페이지네이션, 명확한 버전 관리, 구조화된 오류 처리를 사용합니다. 이 가이드에서는 프로덕션 Gin 애플리케이션에 적용할 수 있는 실용적인 패턴을 다룹니다.

## 일관된 응답 형식

모든 응답을 표준 엔벨로프로 감싸면 API 사용자의 작업이 쉬워집니다. 데이터, 오류, 메타데이터를 어디서 찾을 수 있는지 항상 알 수 있습니다.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response는 표준 API 엔벨로프입니다.
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorInfo  `json:"error,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
}

type ErrorInfo struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type Meta struct {
	Page       int `json:"page,omitempty"`
	PerPage    int `json:"per_page,omitempty"`
	Total      int `json:"total,omitempty"`
	TotalPages int `json:"total_pages,omitempty"`
}

// OK는 성공 응답을 보냅니다.
func OK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    data,
	})
}

// Fail은 오류 응답을 보냅니다.
func Fail(c *gin.Context, status int, code, message string) {
	c.JSON(status, Response{
		Success: false,
		Error:   &ErrorInfo{Code: code, Message: message},
	})
}

func main() {
	r := gin.Default()

	r.GET("/api/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		// 조회 시뮬레이션
		if id == "0" {
			Fail(c, http.StatusNotFound, "USER_NOT_FOUND", "no user with that ID")
			return
		}
		OK(c, gin.H{"id": id, "name": "Alice"})
	})

	r.Run(":8080")
}
```

## 페이지네이션

### Limit/offset 페이지네이션

Limit/offset은 가장 간단한 접근 방식입니다. 총 행 수를 계산하는 비용이 감당 가능한 소규모에서 중규모 데이터셋에 적합합니다.

```go
package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/articles", func(c *gin.Context) {
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
		offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

		if limit > 100 {
			limit = 100 // 페이지 크기 제한
		}

		// articles, total := db.ListArticles(limit, offset)

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    []gin.H{}, // articles
			"meta": gin.H{
				"limit":  limit,
				"offset": offset,
				"total":  0, // total
			},
		})
	})

	r.Run(":8080")
}
```

### 커서 기반 페이지네이션

커서 기반 페이지네이션은 큰 offset의 성능 문제를 방지합니다. 마지막 항목의 ID(또는 다른 고유하고 정렬 가능한 필드)를 커서로 전달합니다.

```go
package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/events", func(c *gin.Context) {
		cursor := c.Query("cursor") // 예: 마지막 이벤트 ID
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

		if limit > 100 {
			limit = 100
		}

		// events, nextCursor := db.ListEvents(cursor, limit)
		_ = cursor

		c.JSON(http.StatusOK, gin.H{
			"success":     true,
			"data":        []gin.H{}, // events
			"next_cursor": "",        // nextCursor (빈 문자열은 더 이상 페이지가 없음을 의미)
		})
	})

	r.Run(":8080")
}
```

## 필터링 및 정렬

쿼리 매개변수를 통해 필터링과 정렬을 수용합니다. 일관된 매개변수 이름을 사용하여 인터페이스를 예측 가능하게 유지합니다.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// GET /api/products?category=electronics&min_price=10&sort=price&order=asc
	r.GET("/api/products", func(c *gin.Context) {
		category := c.Query("category")
		minPrice := c.Query("min_price")
		maxPrice := c.Query("max_price")
		sortBy := c.DefaultQuery("sort", "created_at")
		order := c.DefaultQuery("order", "desc")

		// 인젝션을 방지하기 위해 허용 목록에 대해 정렬 필드를 검증합니다.
		allowed := map[string]bool{"created_at": true, "price": true, "name": true}
		if !allowed[sortBy] {
			sortBy = "created_at"
		}
		if order != "asc" && order != "desc" {
			order = "desc"
		}

		// 이 필터를 사용하여 쿼리를 빌드하고 실행합니다...
		_ = category
		_ = minPrice
		_ = maxPrice

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    []gin.H{},
			"filters": gin.H{
				"category":  category,
				"min_price": minPrice,
				"max_price": maxPrice,
				"sort":      sortBy,
				"order":     order,
			},
		})
	})

	r.Run(":8080")
}
```

## API 버전 관리

### URL 경로 버전 관리

URL 경로 버전 관리는 가장 일반적인 전략입니다. 명시적이고, 라우팅이 쉬우며, `curl`로 테스트하기 간단합니다.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	v1 := r.Group("/api/v1")
	{
		v1.GET("/users", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"version": "v1", "users": []string{}})
		})
	}

	v2 := r.Group("/api/v2")
	{
		v2.GET("/users", func(c *gin.Context) {
			// v2는 다른 형태를 반환합니다
			c.JSON(http.StatusOK, gin.H{
				"version": "v2",
				"data":    []gin.H{},
				"meta":    gin.H{"total": 0},
			})
		})
	}

	r.Run(":8080")
}
```

### 헤더 기반 버전 관리

헤더 버전 관리는 URL을 깔끔하게 유지하지만 클라이언트가 커스텀 헤더를 설정해야 합니다. 미들웨어가 헤더를 읽고 컨텍스트에 버전을 저장할 수 있습니다.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// VersionMiddleware는 Accept-Version 헤더에서 API 버전을 읽습니다.
func VersionMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		version := c.GetHeader("Accept-Version")
		if version == "" {
			version = "v1" // 기본값
		}
		c.Set("api_version", version)
		c.Next()
	}
}

func main() {
	r := gin.Default()
	r.Use(VersionMiddleware())

	r.GET("/api/users", func(c *gin.Context) {
		version := c.GetString("api_version")

		switch version {
		case "v2":
			c.JSON(http.StatusOK, gin.H{"version": "v2", "data": []gin.H{}})
		default:
			c.JSON(http.StatusOK, gin.H{"version": "v1", "users": []string{}})
		}
	})

	r.Run(":8080")
}
```

## 오류 처리 패턴

### 커스텀 오류 타입

애플리케이션 수준의 오류 타입을 정의하여 핸들러가 의미 있고 구조화된 오류를 반환할 수 있도록 합니다.

```go
package main

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

// AppError는 구조화된 API 오류를 나타냅니다.
type AppError struct {
	Status  int    `json:"-"`
	Code    string `json:"code"`
	Message string `json:"message"`
}

func (e *AppError) Error() string {
	return e.Message
}

var (
	ErrNotFound     = &AppError{Status: 404, Code: "NOT_FOUND", Message: "resource not found"}
	ErrUnauthorized = &AppError{Status: 401, Code: "UNAUTHORIZED", Message: "authentication required"}
	ErrBadRequest   = &AppError{Status: 400, Code: "BAD_REQUEST", Message: "invalid request"}
)

// ErrorHandler는 c.Error()를 통해 설정된 오류를 포착하는 미들웨어입니다.
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) == 0 {
			return
		}

		err := c.Errors.Last().Err
		var appErr *AppError
		if errors.As(err, &appErr) {
			c.JSON(appErr.Status, gin.H{
				"success": false,
				"error":   gin.H{"code": appErr.Code, "message": appErr.Message},
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   gin.H{"code": "INTERNAL", "message": "an unexpected error occurred"},
			})
		}
	}
}

func main() {
	r := gin.Default()
	r.Use(ErrorHandler())

	r.GET("/api/items/:id", func(c *gin.Context) {
		id := c.Param("id")
		if id == "0" {
			_ = c.Error(ErrNotFound)
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{"id": id}})
	})

	r.Run(":8080")
}
```

## 리소스 기반 라우트 구성

API가 커지면 리소스별로 라우트를 구성합니다. 각 리소스는 `gin.RouterGroup`에 라우트를 등록하는 함수가 있는 자체 파일을 가집니다.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RegisterUserRoutes는 모든 /users 엔드포인트를 설정합니다.
func RegisterUserRoutes(rg *gin.RouterGroup) {
	users := rg.Group("/users")
	{
		users.GET("/", listUsers)
		users.POST("/", createUser)
		users.GET("/:id", getUser)
		users.PUT("/:id", updateUser)
		users.DELETE("/:id", deleteUser)
	}
}

// RegisterOrderRoutes는 모든 /orders 엔드포인트를 설정합니다.
func RegisterOrderRoutes(rg *gin.RouterGroup) {
	orders := rg.Group("/orders")
	{
		orders.GET("/", listOrders)
		orders.POST("/", createOrder)
		orders.GET("/:id", getOrder)
	}
}

func listUsers(c *gin.Context)  { c.JSON(http.StatusOK, gin.H{"action": "list_users"}) }
func createUser(c *gin.Context) { c.JSON(http.StatusCreated, gin.H{"action": "create_user"}) }
func getUser(c *gin.Context)    { c.JSON(http.StatusOK, gin.H{"action": "get_user"}) }
func updateUser(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"action": "update_user"}) }
func deleteUser(c *gin.Context) { c.Status(http.StatusNoContent) }

func listOrders(c *gin.Context)  { c.JSON(http.StatusOK, gin.H{"action": "list_orders"}) }
func createOrder(c *gin.Context) { c.JSON(http.StatusCreated, gin.H{"action": "create_order"}) }
func getOrder(c *gin.Context)    { c.JSON(http.StatusOK, gin.H{"action": "get_order"}) }

func main() {
	r := gin.Default()

	api := r.Group("/api/v1")
	RegisterUserRoutes(api)
	RegisterOrderRoutes(api)

	r.Run(":8080")
}
```

실제 프로젝트에서는 `RegisterUserRoutes`를 `routes/users.go` 파일에, `RegisterOrderRoutes`를 `routes/orders.go`에 넣고, `main.go`에서 둘 다 호출합니다. 이렇게 하면 각 리소스가 독립적으로 유지되고 관련 없는 코드를 건드리지 않고도 리소스를 쉽게 추가하거나 제거할 수 있습니다.
