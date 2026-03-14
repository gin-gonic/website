---
title: "أنماط تصميم الواجهة البرمجية"
sidebar:
  order: 10
---

بناء واجهة RESTful البرمجية مع Gin يتجاوز تعريف المسارات. تستخدم الواجهة البرمجية المصممة جيداً تنسيقات استجابة متسقة، وترقيم صفحات يمكن التنبؤ به، وإصدار واضح، ومعالجة أخطاء منظمة. يغطي هذا الدليل الأنماط العملية التي يمكنك تطبيقها على تطبيقات Gin في بيئة الإنتاج.

## تنسيق استجابة متسق

لف كل استجابة في غلاف قياسي يُسهّل الأمر على مستهلكي الواجهة البرمجية. فهم يعرفون دائماً أين يجدون البيانات والأخطاء والبيانات الوصفية.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response is the standard API envelope.
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

// OK sends a success response.
func OK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    data,
	})
}

// Fail sends an error response.
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
		// Simulate a lookup
		if id == "0" {
			Fail(c, http.StatusNotFound, "USER_NOT_FOUND", "no user with that ID")
			return
		}
		OK(c, gin.H{"id": id, "name": "Alice"})
	})

	r.Run(":8080")
}
```

## ترقيم الصفحات

### ترقيم الصفحات بالحد والإزاحة

ترقيم الصفحات بالحد والإزاحة هو أبسط نهج. يعمل بشكل جيد لمجموعات البيانات الصغيرة إلى المتوسطة حيث يكون حساب العدد الإجمالي للصفوف ميسور التكلفة.

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
			limit = 100 // cap the page size
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

### ترقيم الصفحات بالمؤشر

يتجنب ترقيم الصفحات بالمؤشر مشاكل الأداء المرتبطة بالإزاحات الكبيرة. مرر معرّف العنصر الأخير (أو حقل فريد وقابل للفرز آخر) كمؤشر.

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
		cursor := c.Query("cursor") // e.g. last event ID
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

		if limit > 100 {
			limit = 100
		}

		// events, nextCursor := db.ListEvents(cursor, limit)
		_ = cursor

		c.JSON(http.StatusOK, gin.H{
			"success":     true,
			"data":        []gin.H{}, // events
			"next_cursor": "",        // nextCursor (empty string means no more pages)
		})
	})

	r.Run(":8080")
}
```

## التصفية والفرز

اقبل التصفية والفرز من خلال معاملات الاستعلام. حافظ على الواجهة قابلة للتنبؤ باستخدام أسماء معاملات متسقة.

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

		// Validate the sort field against an allow-list to prevent injection.
		allowed := map[string]bool{"created_at": true, "price": true, "name": true}
		if !allowed[sortBy] {
			sortBy = "created_at"
		}
		if order != "asc" && order != "desc" {
			order = "desc"
		}

		// Build and execute your query using these filters...
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

## إصدار الواجهة البرمجية

### إصدار مسار URL

إصدار مسار URL هو الاستراتيجية الأكثر شيوعاً. إنه صريح وسهل التوجيه وبسيط للاختبار باستخدام `curl`.

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
			// v2 returns a different shape
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

### إصدار يعتمد على الترويسات

يحافظ الإصدار بالترويسات على نظافة عناوين URL لكنه يتطلب من العملاء تعيين ترويسة مخصصة. يمكن لوسيط قراءة الترويسة وتخزين الإصدار في السياق.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// VersionMiddleware reads the API version from the Accept-Version header.
func VersionMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		version := c.GetHeader("Accept-Version")
		if version == "" {
			version = "v1" // default
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

## أنماط معالجة الأخطاء

### أنواع أخطاء مخصصة

حدد أنواع أخطاء على مستوى التطبيق حتى تتمكن المعالجات من إرجاع أخطاء ذات معنى ومنظمة.

```go
package main

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

// AppError represents a structured API error.
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

// ErrorHandler is a middleware that catches errors set via c.Error().
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

## تنظيم المسارات حسب الموارد

مع نمو واجهتك البرمجية، نظّم المسارات حسب المورد. كل مورد يحصل على ملفه الخاص مع دالة تسجل المسارات على `gin.RouterGroup`.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RegisterUserRoutes sets up all /users endpoints.
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

// RegisterOrderRoutes sets up all /orders endpoints.
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

في مشروع حقيقي، ستضع `RegisterUserRoutes` في ملف `routes/users.go` و`RegisterOrderRoutes` في `routes/orders.go`، ثم تستدعي كليهما من `main.go`. هذا يبقي كل مورد مستقلاً بذاته ويسهل إضافة أو إزالة الموارد دون المساس بكود غير ذي صلة.
